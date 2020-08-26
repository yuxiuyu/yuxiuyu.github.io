# new_vnfd_v3方法解析

## 参数说明

new_vnfd_v3方法接受三个参数，分别

| 参数名         | 类型 | 说明 |
| -------------- | ---- | ---- |
| mydb           |      |      |
| tenant_id      |      |      |
| vnf_descriptor |      |      |

## return

返回创建的VNFD的ids列表(即vnfd_uuid_list)

## 创建流程

首先通过vnfd_catalog.vnfd()创建了一个vnfd模型

```python
myvnfd = vnfd_catalog.vnfd()
```

通过pyangbind将传过来的vnf_descriptor解析成json格式并赋值给myvnfd

然后定义了一系列的数组，来存放相关对象

| 数组名         | 描述        |
| -------------- | ----------- |
| db_vnfs        | vnf对象数组 |
| db_ip_profiles | ip_profiles |
| db_nets        | net         |
| db_vms         | vdu         |
| db_interfaces  | interface   |
| db_images      | image       |
| db_flavors     | flavor      |

###  vnf

通过myvnfd.vnfd_catalog.vnfd.values()循环获取vnfd_yang

定义一个数组`vnfd_descriptor_list` 来存放从vnfd_catalog_descriptor.get("vnfd:vnfd")获取到的list

定义一个`vnfd` = vnfd_yang.get()

| 变量名      | 描述                  |
| ----------- | --------------------- |
| uuid        | uuid4()随机数         |
| osm_id      | vnfd.id               |
| name        | vnfd.name             |
| description | vnfd.description      |
| tenant_id   | 传入的tenant_id       |
| vendor      | vnfd.vendor           |
| short_name  | vnfd.short_name       |
| descriptor  | 传入的vnfd_descriptor |
| mgmt_access |                       |

```
vnfd_uuid_list.append(uuid) 这就是最后返回的uuid列表
uuid_list.append(uuid)
```

####  ip_profile

   可以设置一些子网的细节

1. 在`vnfd_descriptor_list`列表里寻找id与vnfd.id相等的`vnfd_descriptor`
2. 通过vnfd.get("ip-profiles")循环获取`ip_profile`
3. 定义params = ip_profile.ip-profile-params

| 字段               | 描述                                      |
| ------------------ | ----------------------------------------- |
| ip_version         | params.ip-version+params.ipv4             |
| subnet_address     | params.subnet-address                     |
| gateway_address    | params.gateway-address                    |
| dhcp_enabled       | params.dhcp-params.enabled                |
| dhcp_start_address | params.dhcp-params.start-address          |
| dhcp_count         | params.dhcp-params.count                  |
| dns_address        | params.dns-server数组通过“；”连接的字符串 |
| security_group     | 有params.security-group话                 |
| net_id             | net_uuid                                  |

```
ip_profile_name2db_table_index[str(ip_profile["name"])] = db_ip_profiles_index
db_ip_profiles_index += 1
```

#### net

1. 通过vnfd.get("internal-vld")循环获取`vld`

| 字段        | 描述                                          |
| ----------- | --------------------------------------------- |
| name        | vld.name                                      |
| vnf_id      | 关联vnf.uuid                                  |
| uuid        | uuid4()随机数                                 |
| description | vld.description                               |
| osm_id      | vld.id                                        |
| type        | "bridge"  #depending on connection point type |

```
uuid_list.append(uuid)
```

   

   关联 db_ip_profile with db_sce_net

1. 如果vld中存在`ip-profile-ref`：`ip_profile_name`

   如果在ip_profile_name2db_table_index没发现`ip_profile_name`则返回

   如果发现的话则更新ip_profile.net_id = net.uuid

2. 如果vld中不存在`ip-profile-ref`，则去检查没有定义ip-address

   ```
   for icp in vld.get("internal-connection-point").values():
   ```

   如果icp中存在ip-address，则返回

   

####  vdu

通过vnfd.get("vdu")循环获取vdu

在vnfd_descriptor.vdu列表里寻找id与vdu.id相等的`vdu_descriptor`

| 字段        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| uuid        | uuid4()随机数                                                |
| osm.id      | vdu.id                                                       |
| name        | vdu.name                                                     |
| description | vdu.description                                              |
| pdu_type    | vdu.pdu_type                                                 |
| vnf_id      | 关联vnf.uuid                                                 |
| count       | 如果有vdu.count                                              |
| flavor_id   |                                                              |
| image_id    | 如果有vdu.image则去查找image_uuid，没找到image_uuid，就新建image_uuid，过程见下方 |
| image_list  | 数组里面放的对象，见下方                                     |
| boot_data   | 见cloud-init                                                 |

```
uuid_list.append(uuid)
```



#####  image

1、如果存在vdu.get("image")则去查找？获取image_uuid

如果没有获取到image_uuid

```
image_uuid = db_image["uuid"]
db_images.append(db_image)
```

最后vdu.image_id=image_uuid

2、如果存在vdu.get("alternative-images")，与上方image过程相同

```
最后vdu.image_list = [{
                        "image_id": image_uuid,
                        "vim_type": str(alt_image["vim-type"]),
                  }]
```



| 字段           | 描述                                   |
| -------------- | -------------------------------------- |
| name           | descriptor.image                       |
| checksum       | descriptor.image-checksum              |
| location       |                                        |
| universal_name |                                        |
| uuid           | uuid4()随机数(当数据库没找到这个image) |

3、volumes

如果存在vdu.get("volumes")，通过vdu.get("volumes")循环获取volume

如果不存在vdu.get("image")，则和步骤一一样

如果不存在vdu.get("image")，则Add Openmano devices

##### cloud-init

Cloud-init通常用于Day-0操作，例如：

- 设置默认语言环境
- 设置实例主机名
- 生成实例SSH私钥或定义密码
- 将SSH密钥添加到用户的.ssh / authorized_keys中，以便他们可以登录
- 设置临时挂载点
- 配置网络设备
- 添加用户和组
- 添加文件

```
boot_data = {}
```

对于内部cloud-init定义cloud-init

boot_data.user-data = vdu.cloud-init

对于外部cloud-init定义cloud-init-file

boot_data.user-data = vdu.cloud-init-file

支持配置驱动器

如果存在vdu.supplemental-boot-data.boot-data-drive

boot_data.boot-data-drive = true

boot_data.config-files?



#####  interface

通过vdu.get("interface")循环获取iface

| 字段          | 描述                                         |
| ------------- | -------------------------------------------- |
| uuid          | uuid4()随机数                                |
| internal_name | iface.name                                   |
| vm_id         | vdu.id                                       |
| vpci          | 判iface.get("virtual-interface").get("vpci") |
| bw            |                                              |
| type          | mgmt/bridge/data                             |
| model         |                                              |
| external_name |                                              |
| port_security |                                              |
| net_id        |                                              |
| ip_address    |                                              |
| created_at    | 判int(interface.get("position")) * 50        |
| mac           | 判interface.get("mac-address")               |
|               |                                              |

```
uuid_list.append(uuid)
```



#####  flavor

通过vdu.vm-flavor获取flavor

| 字段     | 描述              |
| -------- | ----------------- |
| name     | vdu.name+"-flv"   |
| vcpus    | flavor.vcpu-count |
| ram      | flavor.memory-mb  |
| disk     | flavor.storage-gb |
| extended |                   |
| uuid     |                   |

```
uuid_list.append(uuid)
```

## 	最后

```
mydb.new_rows(db_tables, uuid_list)
```

