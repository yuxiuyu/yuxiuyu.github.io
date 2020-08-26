# new_nsd_v3方法解析

## 参数说明

new_nsd_v3方法接受三个参数，分别

| 参数名         | 类型 | 说明 |
| -------------- | ---- | ---- |
| mydb           |      |      |
| tenant_id      |      |      |
| nsd_descriptor |      |      |

## return

返回创建的NSD的ids列表

## 创建流程

首先通过nsd_catalog.nsd()创建了一个nsd模型

```python
mynsd = nsd_catalog.nsd()
```

通过pyangbind将传过来的nsd_descriptor解析成json格式并赋值给mynsd

然后定义了一系列的数组，来存放相关对象

| 数组名                    | 描述                                |
| ------------------------- | ----------------------------------- |
| db_scenarios              | scenario对象数组,相当于实例化一个NS |
| db_sce_vnfs               | vnf对象数组                         |
| db_ip_profiles            | ip_profile对象数组                  |
| db_sce_nets               | vld对象数组                         |
| db_sce_interfaces         | iface对象数组                       |
| db_sce_vnffgs             | vnffg对象数组                       |
| db_sce_rsps               | rsp对象数组                         |
| db_sce_rsp_hops           | rsp_hop对象数组                     |
| db_sce_classifiers        | classifier对象数组                  |
| db_sce_classifier_matches | matche对象数组                      |

### scenario

通过mynsd.nsd_catalog.nsd.values()循环获取nsd_yang

定义一个nsd = nsd_yang.get()

| 变量名      | 描述                 |
| ----------- | -------------------- |
| uuid        | uuid4()随机数        |
| osm_id      | nsd.id               |
| name        | nsd.name             |
| description | nsd.description      |
| tenant_id   | 传入的tenant_id      |
| vendor      | nsd.vendor           |
| short_name  | nsd.short_name       |
| descriptor  | 传入的nsd_descriptor |

```
nsd_uuid_list.append(uuid) 这就是最后返回的uuid列表
uuid_list.append(uuid)
```

#### vnf

1. 通过nsd.get("constituent-vnfd")循环获取`vnf`
2. 根据`vnf.osm_id和vnf.tenant_id`查找数据库`nfs`中对应的记录：`existing_vnf`;
3. 如果`existing_vnf`不存在，则返回

| 字段             | 描述                                        |
| ---------------- | ------------------------------------------- |
| uuid             | uuid4()随机数                               |
| scenario_id      | 关联scenario.uuid                           |
| name             | `existing_vnf[0].name`+vnf.member-vnf-index |
| vnf_id           | `existing_vnf[0].uuid`                      |
| member_vnf_index | vnf.member-vnf-index                        |

```
uuid_list.append(uuid)
vnf_index2scevnf_uuid[str(vnf['member-vnf-index'])] = uuid
vnf_index2vnf_uuid[str(vnf['member-vnf-index'])] = existing_vnf[0]["uuid"]
```

#### ip_profile

1. 通过nsd.get("ip-profiles")循环获取`ip_profile`
2. 定义params = ip_profile.ip-profile-params

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

```
ip_profile_name2db_table_index[str(ip_profile["name"])] = db_ip_profiles_index
db_ip_profiles_index += 1
```

#### vld

1. 通过nsd.get("vld")循环获取`vld`

| 字段             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| uuid             | uuid4()随机数                                                |
| name             | vld.name                                                     |
| scenario_id      | 关联scenario.uuid                                            |
| multipoint       | vld.type!="ELINE"                                            |
| osm_id           | vld.id                                                       |
| description      | vld.description                                              |
| type             | 1、默认none 2、存在vld.mgmt-network时为bridge 3、vld.provider-network.overlay-type为VLAN时为data |
| external         | 存在vld.mgmt-network时为true                                 |
| sce_net_id       | 见下方`sce_net_id`                                           |
| vim_network_name | 如果存在则赋值vld.vim-network-name？（已经赋值后创建？）     |

```
uuid_list.append(uuid)
```

1. 如果vld中存在`ip-profile-ref`：`ip_profile_name`

   如果在ip_profile_name2db_table_index没发现`ip_profile_name`则返回

   如果发现的话`sce_net_id`

   ```
   db_ip_profiles[ip_profile_name2db_table_index[ip_profile_name]]["sce_net_id"] = uuid
   ```

##### iface

1. 通过vld.get("vnfd-connection-point-ref")循环获取`iface`
2. 根据`iface.vnf_id`查找`vms`中对应的记录：`existing_vdus`;
3. 如果存在`existing_vdus`，则查找vnf_index2vnf_uuid里是否有iface.member-vnf-index-ref
4. 如果没有的话，则返回
5. 有的话根据`iface.vnf_id`查找`vms`中对应的记录：`existing_ifaces`;未写完

| 字段         | 描述                                                |
| ------------ | --------------------------------------------------- |
| uuid         | uuid4()随机数                                       |
| sce_vnf_id   | 关联vnf.uuid                                        |
| sce_net_id   | 关联vld.uuid                                        |
| interface_id | 数据库查出来的uuid？                                |
| ip_address   | 1、默认none 2、存在iface.ip-address为ip-address的值 |

```
uuid_list.append(uuid)
```



#### vnffg

通过nsd.get("vnffgd")循环获取vnffg

| 字段        | 描述                   |
| ----------- | ---------------------- |
| uuid        | uuid4()随机数          |
| name        | vnffg.name             |
| scenario_id | 关联db_scenarios的uuid |
| vendor      | vnffg.vendor           |
| description | vnffg.description      |

```
uuid_list.append(uuid)
```



##### rsp

通过vnffgd.get("rsp")循环获取vnffg

| 字段         | 描述           |
| ------------ | -------------- |
| uuid         | uuid4()随机数  |
| name         | rsp.name       |
| sce_vnffg_id | 关联vnffg.uuid |
| id           | rsp.id         |

```
uuid_list.append(uuid)
```



##### rsp_hop

通过rsp.get("vnfd-connection-point-ref")循环获取hop

| 字段                 | 描述           |
| -------------------- | -------------- |
| uuid                 | uuid4()随机数  |
| if_order             | int(hop.order) |
| ingress_interface_id |                |
| egress_interface_id  |                |
| sce_vnf_id           |                |
| sce_rsp_id           | 关联rsp.uuid   |

```
uuid_list.append(uuid)
```



#####  classifier

通过vnffgd.get("classifier")循环获取classifier

| 字段         | 描述            |
| ------------ | --------------- |
| uuid         | uuid4()随机数   |
| name         | classifier.name |
| sce_vnffg_id | 关联vnffg.uuid  |
| sce_vnf_id   | rsp.id          |
| interface_id |                 |

```
uuid_list.append(uuid)
```



##### classifier_matches

通过classifier.get("match-attributes")循环获取matche

| 字段              | 描述           |
| ----------------- | -------------- |
| uuid              | uuid4()随机数  |
| ip_proto          | rsp.name       |
| source_ip         | 关联vnffg.uuid |
| destination_ip    | rsp.id         |
| source_port       |                |
| destination_port  |                |
| sce_classifier_id |                |

```
uuid_list.append(uuid)
```

## 最后

```
mydb.new_rows(db_tables, uuid_list)
```

