# Network Service Instantiation

## 变量列表

### instance_dict

开通请求传递的参数。

#### instance_dict.networks

请求包含的network列表

| 变量名 | 描述 |
| ---- | ---- |
| sites | network部署的站点。每个site指向一个vim(`site.datacenter=dc.ID`) |
| use-network | 所使用的其他实例的网络|
| vim-network-name ||
| vim-network-id ||
| name ||
| ip-profile ||
| provider-network ||

#### instance_dict.vnfs

请求包含的vnf列表

| 变量名 | 描述 |
| ---- | ---- |
| datacenter ||

### scenarioDict

开通使用的模版。从数据库读出来后， 在处理过程中，会将`instanceDict`中对应的参数拷贝到本对象中。

#### scenanrioDict.nets

模版定义的network列表，每个network(`sce_net`)包含：

| 变量名 | 描述 |
| ---- | ---- |
| name ||
| wim_account ||
| ip_profile||
| provider_network ||
| external |是否使用外部已有的网络|
| vim_id |指定的已有网络在vim中的id|

#### scenarioDict.vnfs

| 变量名 | 描述 |
| ---- | ---- |
| interfaces |vnf内部用于连接其他vnf的网卡,其network指向sce_net|

### 租户相关

| 变量名 | 描述 |
| ---- | ---- |
| tenant_id |用户传入的`tenant.ID`，即:`nfvoTenant.id`|
| tenant |根据teant_id从`nfvo_tenants`查询到的tenant对象|
| datacenter |用户传入的dc名称或者id|
| default_wim_account | 用户传入的wim账号|
| default_datacenter_id | 根据`datacenter`从`datacenters`查询得到到dc Id|
| vim | 根据`datacenter`从`datacenters`查询得到到dc对象 |
| myvims |dc.ID --> dc|
| myvim_threads_id |dc.ID --> vimTenant.id|

### instance相关

| 变量名 | 描述 |
| ---- | ---- |
| cloud_config |开通ns/vnf实例时使用的cloud_config对象|
| db_instance_scenario| 网络服务实例对象|
| uuid_list |所有新建instance的uuid|
| db_instarnce_nets |所有被创建的network|
| db_ip_profiles ||

### action/task相关

| 变量名 | 描述 |
| ---- | ---- |
| rollbackList | ???? |
| db_instance_action | action对象，通过`instance_id`关联到网络服务实例|
| db_vim_actions |所有创建过程中新建的任务|

## 过程

### 获取开通使用的缺省DC及Tenant

### 从数据库获取开通指定的descriptor---`scenarioDict`

根据传入的`scenario`从数据库中获取到对应的数据：`scenarioDict`。

### 创建`db_instance_scenario`和`db_instance_action`对象

### 校验开通传入的网络参数

校验开通需要的网络(`instance_dict.networks`)是否在模版中有定义(`scenarioDict.nets`)；
然后把对应的参数复制到模版中；

### 校验开通传入的vnf参数

校验vnf需要的网络、vdu是否在模版中有对应描述；
然后把对应的参数复制到模版中。

### 在vim中创建sce_net

#### sce_net::变量

| 变量名 | 描述 |
| ---- | ---- |
| number_mgmt_networks |网络服务的管理网络个数。如果`sce_net.external`不为空，则认为该网络是管理网络|
| sce_net |网络模版：`scenarioDict.nets`|
| descriptor_net |网络开通请求：`instance_dict.networks`|
| use_network |`descriptor_net`依赖的已有网络实例|
| involved_datacenters|网络依赖的vnf所在的DC列表|
| target_wim_account |开通网络所要的wim账号|
| sce_net2instance |sce_net.uuid --> (dc.uuid --> instance_net.uuid) |
| sce_net2wiminstance |sce_net.uuid --> (dc.uuid --> )|
| net2task_id |sce_net.uuid --> |
| wim_usage | sce_net.uuid --> bool/wimAccount.uuid, 网络开通使用的wim|
| wim_account | 当前网络开通需要的wim |
| netmap_use |`descriptor_net.site`的属性，如果设置，表示在该站点使用已有网络，属性的值指向已有网络的ID或者名称|
| netmap_create `descriptor_net.site`的属性，如果设置，表示在该站点创建网络，属性的值表示网络的底层名称|
| net_type|要创建的网络的类型|
| net_vim_name |网络在vim中的名称|
| lookfor_filter |用于查找已有网络的条件，包括：`id`,`name`,`status`等|
| net_name |要创建的网络的名称|
| create_network |是否要创建新的网络|
| lookfor_network |是否要查找已有网络|
| task_extra |任务的额外信息，包括：params|
| related_network |当前网络依赖另一个网络时，指向该网络的uuid；否则指向当前网络的uuid|
| db_instance_wim_nets ||

### 在vim中创建VNF

| 变量名 | 描述 |
| ---- | ---- |
| sce_vnf |vnf开通对象，合并了对应vnf的模版和实例属性|
| sce_vnf.mgmt_access |vnf模板中定义的管理访问方式|
| RO_pub_key |`nfvoTenant`的属性，表示相应tenant的公钥，用于开通后osm对vnf的管理|
| vim | dc |
| datacenter_id ||
| myvim_thread_id | dc.Tenant.id |

#### 创建vnf内部网络

| 变量名 | 描述 |
| ---- | ---- |
| vnf_net2instance |`sce_vnf.uuid` --> `sce_vnf.net.uuid` --> `net.uuid`// |
| vnf_net2wim_instance ||
| net2task_id |`sce_vnf.uuid` --> `sce_vnf.net.uuid` -> `task_index`|
| net |待开通的网络|
| net_name ||
| net_type ||
| lookfor_filter |查找已有网络的条件|
| task_action |`find`(如果`net`中指定了要使用的网络，比如：`vim_network_name`) or `create`（如果没有指定网络）|
| task_extra |`lookfor_filter`(如果`task_action=find`)或者`net_name + net_type + net.ip_profile`(如果`task_action=create`)|

#### 创建虚拟机

| 变量名 | 描述 |
| ---- | ---- |
| ssh_access |`sce_vnf['mgmt_access'].get('config-access', {}).get('ssh-access')`|
| vnf_availability_zones ||
| vm | 初始设置为vm模版(sce_vnf.vms)，创建过程中会添加一些辅助属性 |
| myVMDict |传递到vim的虚拟机创建参数|
| image_dict | 从数据库(`images`)根据`vm.image_id`得到的image对象(说明image已经存在于系统中) |
| image_id | image在vim对应的id|
| flavor_dict | 从数据库(`flavors`)根据`vm.flavlor_id`得到的flavor对象 |
| myVMDict.networks | 虚拟机的网卡参数|
| myVMDict.imageRef ||
| myVMDict.flavorRef ||
| is_management_vm |当前vm是否为vnf的管理节点|
| cloud_config_vm ||
| av_index ||

##### 创建/使用镜像

| 变量名 | 描述 |
| ---- | ---- |
| image_mano_id ||
| datacenter_vim_id |dc.tenantId|
| image_db |`datacenter_images`中的记录，是ro的image记录在dc中对应的对象|
| image_vim_id ||

1. 根据`image_dict.location`或者`image_dict.universal_name`去vim查找对应的image；
2. 如果没有查到，则根据`image_dict`在vim创建一个image，成功后，在`datacenter_images`中创建一条对应记录；
3. 返回查找到/或新创建的image的vim_id

##### 创建/使用flavor

1. 根据`flavor_dict.uuid`查找`datacenters_flavors`中对应的记录：`flavor_db`;
2. 如果`flavlor_db`存在并且能够根据`flavor_db.vim_id`在vim中找到对应的flavor，则返回；
3. 否则，首先查找`flavor_dict`在vim的对应记录，如果没有，则在vim中创建一个对应记录；
4. 查找成功或者创建成功，则修改`datacenter_flvor`的vim_id或者创建一条新的对应记录；
5. 返回查找到/或新创建的flavor的vim_id

##### 创建通用网卡对象

一个vm可能对应若干个具体的虚拟机，在创建具体的虚拟机前，我们可以网卡模版的属性，创建通用网卡对象。
只有在创建虚拟机时，每个通用网卡对象都会被实例化成一个具体的网卡。

| 变量名 | 描述 |
| ---- | ---- |
| iface | 待创建的网卡的模版. `vm.interfaces`|
| netDict |待创建的网卡|
| netDict.type |PF(passthrough), VF(siov), VFNotShared(), Virtual |
| netDict.use | 用途 (data/mgmt)|
| netDict.mac_address/floating_ip/port_security ||
| netDict.net_id |仅仅是个标识，等于该网卡关联网络的对应任务|

对vdu定义的每一块网卡：

1. 设置属性；
2. 根据网卡关联网络，找到该网络对应的任务，把该任务作为创建虚拟机依赖的任务；
3. 创建对应记录添加到`db_vm_ifaces`

##### 设置clooud-config

##### 创建vm

根据`vm.count`，创建对应数量的虚拟机实例。

1. 确定对应的任务的参数(`task_params`)：

```python
task_params = (vm_name, myVMDict['description'], myVMDict.get('start', None),
                           myVMDict['imageRef'], myVMDict['flavorRef'], myVMDict['networks'], cloud_config_vm,
                           myVMDict['disks'], av_index, vnf_availability_zones)
```

2. 根据`db_vm_ifaces`创建该虚拟机的网卡，网卡会被添加到`db_instance_interfaces`

3. 创建对应的任务


## 参考

### OSM Usage

这个[页面](https://osm.etsi.org/docs/user-guide/05-osm-usage.html)介绍了创建/管理网络服务的一些场景，可以帮助我们理解`cloud-config`，`instantiation-parameter`的实际使用。

### VNF Onboarding guide (day-0)

[VNF OnBoarding Day-0](https://osm.etsi.org/docs/vnf-onboarding-guidelines/02-day0.html)介绍了如何创建/修改/测试vnfd package

Remember the objectives of this phase(day-0):
>
> * Instantiating the VNF with all the required VDUs, images, initial (unconfigured) state and NFVI requirements.
>
> * Making the VNF manageable from OSM (OSM should have SSH access to the management interfaces, for example)

### VNF Onboarding guide (day-1)

[VNF OnBoarding Day-1](https://osm.etsi.org/docs/vnf-onboarding-guidelines/03-day1.html)介绍了如何修改vnfd，使得vnf可以在被创建后被自动初始化。

OSM中实现这个目标的方式是构建osm proxy charm，然后把它包含在descriptor中。

### Cloud-init

Cloud-init是一个工业标准，它使用一种通用的方式描述配置，https://cloudinit.readthedocs.io/en/latest/。
通过cloud-init，我们可以在day-0完成vnf的初始化。

> Cloud-init is normally used for Day-0 operations like:
>  
> * Setting a default locale
> * Setting an instance hostname
> * Generating instance SSH private keys or defining passwords
> * Adding SSH keys to a user’s .ssh/authorized_keys so they can log in
> * Setting up ephemeral mount points
> * Configuring network devices
> * Adding users and groups
> * Adding files
