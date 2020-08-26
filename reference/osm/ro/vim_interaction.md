# RO同VIM的交互

在创建或者销毁NS实例(Network Service Instance)过程中，RO需要同VIM进行多次交互，以查找、创建或者销毁NS实例依赖的资源。
资源之间存在的依赖关系，会导致相应的交互动作之间也存在同样的依赖关系， 比如：创建虚拟机前，就需要创建镜像、网络等交互已经成功完成。

这里详细说明RO内部如何实现同VIM的交互。

## 基本概念

### `instance_actions`

编排动作（创建或者删除）一般都涉及到同VIM的多次交互，为了跟踪编排动作中多个交互的执行情况，我们为每个编排动作都创建一个对应的
`instance_actoins`对象。

这个对象在接收到客户端的请求时创建，并会返回对象的Id给客户端。客户端则可以根据对象的Id，查询对应编排动作的执行进度和结果。

### `vim_wim_actions`

RO和VIM的交互在系统内部对应一个任务对象，称之为`vim_wim_actions`。它包含以下重要属性。

| 属性 | 说明 |
| ---- | ---- |
| instance_action_id |任务所属的Action|
| task_index |任务在Action中的序号|
| vim_id |任务对应的资源对象在VIM中的Id|
| item |任务对应的资源对象类型|
| item_id |任务对应的资源对象在RO中的Id|
| status |任务的状态|
| extra |任务的参数以及本任务所依赖的其他任务|
| error_msg |任务执行中捕获的错误|

任务状态主要包括：

* `SCHEDULED`
> 任务的初始状态

* `BUILT`
> 任务已完成
  
* `FAILED`
> 任务失败

## 任务的创建、分发和执行

RO在接收到编排请求后，创建该请求中所有涉及的任务并保存到数据库中，此时，任务尚未开始执行。

每个任务都会被设置一个租户属性(`tenants_datacenters`），表示该任务将同对应租户所在的Site交互。

由于不同site的任务之间不存在依赖关系，为了提高效率，RO为每个site都创建一个独立线程(`vim_thread`）。
该线程定期从数据库轮询需要执行的任务，根据任务类型、参数同vim交互。

任务执行成功后，一般会从vim得到一个资源的id，`vim_thread`负责将该id回填到系统对应的资源对象中。
任务执行失败，`vim_thread`仅仅是记录了相关错误，并未执行其他处理（比如：回滚).

### related

在`vim_thread`的代码中，我们看到task有`related`字段，根据代码，可以看出该字段记录了task所关联的资源。
为了防止同时执行对同一个资源的多个操作，`vim_thread`每次在轮询得到一个任务后，把所有相关的任务(`related`字段相同)都锁定，
执行完后再释放锁。

```python
 # lock ...
self.db.update_rows("vim_wim_actions", UPDATE={"worker": self.my_id}, modified_time=0,
    WHERE={self.target_k: self.target_v,
    "status": ['SCHEDULED', 'BUILD', 'DONE', 'FAILED'],
    "worker": [None, self.my_id],
    "related": task_related,
    "item": task["item"],
})
```

> **但是task中已经有`item_id`记录Task对应的资源，两者之间什么关系？**

## VIM Connection

RO为了和不同类型的VIM交互，定义了一套统一的交互模型，详细接口可以参见`vimconn.py`。