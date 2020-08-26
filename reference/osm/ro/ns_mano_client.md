> Mano Client 解读



# 基础API

基础API解读

## 实例化Client

> RO.osm_ro.openmanoclient.openmanoclient.__init__

构造函数，实例化时调用，入参为**kwargs，键值对参数即可

### 参数说明

|     参数名      | 类型 | 说明                                         |
| :-------------: | ---- | -------------------------------------------- |
|    username     |      |                                              |
|    password     |      |                                              |
|  endpoint_url   |      | 操作终端地址                                 |
|    tenant_id    |      | 看起来是面向VIM的租户ID                      |
|   tenant_name   |      |                                              |
|  datacenter_id  |      |                                              |
| datacenter_name |      |                                              |
|     logger      |      | 查找指定的logger实例，没指定则使用manoclient |
|      debug      |      | 如果存在，logger开启debug                    |

### 关键流程

无

## 解析响应内容

> RO.osm_ro.openmanoclient.openmanoclient._parse
>
> RO.osm_ro.openmanoclient.openmanoclient._parse_yaml（类似，但指定使用yaml）

用来解析传入的字符串，并验证字符串合法性

### 参数说明

| 参数名            | 类型 | 说明                  |
| ----------------- | ---- | --------------------- |
| descriptor        |      | 2                     |
| descriptor_format |      | 支持json,yaml两种类型 |

### 关键流程

+ 校验descriptor_format
+ 根据descriptor_format选择解析器
+ 异常处理

## 获取对象ID（具体信息）

> RO.osm_ro.openmanoclient.openmanoclient._get_item_uuid
>
> RO.osm_ro.openmanoclient.openmanoclient._get_item
>
> （本条解释_get_item_uuid，_get_item只是在此基础上获取了完整的对象信息）

通过name或uuid来获取资源或资源ID，同时校验了uuid的正确性



### 参数说明

| 参数名      | 类型 | 说明           |
| ----------- | ---- | -------------- |
| item        |      | 应该是资源类型 |
| item_id     |      | uuid           |
| item_name   |      |                |
| all_tenants |      | 是否过滤租户   |

### 关键流程

+ 根据all_tenants判断查看全部（True），或者默认权限（None）或者是自动填充当前使用者的租户权限(False)
+ 获取该类型的资源列表
+ 校验id和name，如果都为空则异常**（此校验应该提前完成）**
+ 优先根据ID查找，匹配成功，返回id
+ 次选根据name查找，匹配成功且唯一，返回ID
+ 其他情况的异常处理

# 基础CURD

较底层的抽象API操作

## 增

> RO.osm_ro.openmanoclient.openmanoclient._create_item

### 参数说明

| 参数名      | 类型 | 说明                 |
| ----------- | ---- | -------------------- |
| item        |      | 应该是资源类型       |
| descriptor  |      | 应该是模板参数的填充 |
| all_tenants |      | 是否过滤租户         |
| api_version |      |                      |

### 关键流程

+ 解析租户
+ 解析API版本
+ 调用新增服务
+ 异常处理

## 删

> RO.osm_ro.openmanoclient.openmanoclient._del_item

### 参数说明

| 参数名      | 类型 | 说明           |
| ----------- | ---- | -------------- |
| item        |      | 应该是资源类型 |
| uuid        |      | 资源ID         |
| name        |      | 资源名称       |
| all_tenants |      | 是否过滤租户   |

### 关键流程

+ 解析租户
+ 获取资源ID（没有uuid，则通过name尝获取uuid）
+ 调用删除服务
+ 异常处理

## 改

> RO.osm_ro.openmanoclient.openmanoclient._edit_item

### 参数说明

| 参数名      | 类型 | 说明                 |
| ----------- | ---- | -------------------- |
| item        |      | 应该是资源类型       |
| descriptor  |      | 应该是模板参数的填充 |
| uuid        |      | 资源ID               |
| name        |      | 资源名称             |
| all_tenants |      | 是否过滤租户         |

### 关键流程

+ 解析租户
+ 获取资源ID（没有uuid，则通过name尝获取uuid），**此处存疑，他固定获取了租户资源？为什么**
+ 调用编辑服务
+ 异常处理

```
        if not uuid:
            #check that exist
            uuid = self._get_item_uuid("tenants", uuid, name,all_tenants)
```



## 查

> RO.osm_ro.openmanoclient.openmanoclient._list_item

### 参数说明

| 参数名      | 类型 | 说明           |
| ----------- | ---- | -------------- |
| item        |      | 应该是资源类型 |
| all_tenants |      | 是否过滤租户   |
| filter_dict |      | 指定过滤       |

### 关键流程

+ 解析租户
+ 拼接filter_dict参数，指定过滤/**获取？**
+ 调用server
+ 异常处理

# 业务API

面向各类资源的增删改查操作，基本提供五种操作。

资源类：

+ tenant
+ datacenter
+ wim
+ vnf
+ scenario（这对应什么实体，nsd和scenario是相同的东西吗？用于设计服务链的顶层构造，NFV使用NSD来实例化网络服务）
+ instance
+ vim（比较特殊，实际上是操作VIM拥有的资源）

操作类：

+ get
+ list
+ delete
+ create
+ edit（vnf和instance无该操作，好像原先有，被放弃了）
+ attach（只有datacenter、wim有）
+ detach（只有datacenter、wim有）

以下相同的会放在一起完成说明，只用datacenter做说明。

## 删除、查询

以下删改查都是直接调用基础操作API

> RO.osm_ro.openmanoclient.openmanoclient.list_tenants
>
> RO.osm_ro.openmanoclient.openmanoclient.get_tenant
>
> RO.osm_ro.openmanoclient.openmanoclient.delete_tenant



### 参数说明

其中list方法不需要任何参数，直接列出所有

| 参数名      | 类型 | 说明           |
| :---------- | ---- | -------------- |
| uuid        |      | 应该是资源类型 |
| name        |      |                |
| all_tenants |      |                |

### 关键流程

无，直接调用基础操作API

## 新增、编辑

以下删改查都是直接调用基础操作API

> RO.osm_ro.openmanoclient.openmanoclient.create_datacenter
>
> RO.osm_ro.openmanoclient.openmanoclient.edit_datacenter



### 参数说明

| 参数名            | 类型 | 说明               |
| :---------------- | ---- | ------------------ |
| descriptor        |      | 模板参数           |
| descriptor_format |      | 参数类型           |
| name              |      |                    |
| vim_url           |      | datacenter操作独有 |
| wim_url           |      | wim操作独有        |
| **kwargs          |      |                    |

### 关键流程

+ 解析模板参数，descriptor为字符串则调用解析，如果为对象则直接使用
+ 校验参数非空（name和vim_url）
+ 校验descriptor对象合法性（必须为datacenter的描述对象，且只有一个）
+ 将descriptor外的属性赋值进descriptor，name、vim_url、kwargs中的参数，其中edit，*因为name有查询的作用，修改的时候采用new_name左右属性名*
+ 调用底层操作API

## create_scenario



### 关键流程

+ 兼容新老API，新API关键参数[nsd:nsd-catalog]、[nsd-catalog]，老API关键参数为[scenario]
+ 参数校验
+ 调用基础操作API

## create_vnf

### 参数说明

| 参数名            | 类型 | 说明     |
| :---------------- | ---- | -------- |
| descriptor        |      | 模板参数 |
| descriptor_format |      | 参数类型 |
| **kwargs          |      |          |

| descriptor&kwargs说明 |                        |
| --------------------- | ---------------------- |
| name                  |                        |
| image_path            | 镜像地址，可变参字符串 |
| description           |                        |
| public                | 是否公开               |
| class                 | 等级                   |
| tenant_id             |                        |
| ……                    |                        |



### 关键流程

+ 解析模板参数，descriptor为字符串则调用解析，如果为对象则直接使用
+ 兼容新老API（实际上是三种处理方式），获取token、vnfd_catalog、vnfds、vnfd、vdu_list
+ 填充覆写kwargs中的参数，处理镜像地址

## attach/detach——datacenter、wim

> 当前存疑，看起来调用的接口和create/delete是同一个接口
>
> 目前也不知道这两个操作的实际含义是什么

好像是用来关联租户等等的？

## vim_action

用于管理在datacenter中的tenant、network、image资源的管理

### 参数说明

| 参数名      | 类型 | 说明                                                         |
| :---------- | ---- | ------------------------------------------------------------ |
| action      |      | 操作枚举，'list','get','show','delete','create',其中image不支持create |
| item        |      | 操作资源类型，"tenants", "networks", "images"                |
| uuid        |      | 资源标识符                                                   |
| all_tenants |      |                                                              |
| **kwargs    |      |                                                              |

| kwargs说明                     |      |
| ------------------------------ | ---- |
| datacenter_name、datacenter_id |      |
| descriptor、descriptor_format  |      |
| description                    |      |
| name                           |      |
| description                    |      |



### 关键流程



+ 校验action和item是否合法
+ 填充本次操作的datacenter（优先使用参数中的、默认使用client的）
+ 调用API





