> 从零新增实例流程解读

>  准备工作，开启 Mano Client，所有操作通过client调用RO server
>
> 
>
> 类似于每一个用户的会话都对应一个client，
>
> 主要是初始化租户信息、datacenter和RO server的连接end-point。
>
> 
>
> 从零开始，大多数资源为新增，后续使用应该优先尝试获取已有资源。

> + 新增租户
> + 新增操作的云
> + 申请WIM资源
> + 创建vnf（并关联WIM？）
> + 创建scenario，并关联vnf
> + 创建instance，并关联vnf



# 准备租户信息

获取当前操作身份

## client层

```python
## 调用方法
client.create_tenant(name = test_tenant)

## 关键参数
descriptor={"tenant": {"name": name}}
```



## server层

>  @bottle.route(url_base + '/tenants', method='POST')

+ 验证schema&移除多余参数
+ 调用nfvo.new_tenant,返回新增的租户ID
+ 生成一个新的租户信息（id、ak、sk）
+ 完成数据入库
+ 根据ID从数据库获取tenant详细信息

schema说明

```
tenant_schema = {
    "title":"tenant information schema",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type":"object",
    "properties":{
        "tenant":{
            "type":"object",
            "properties":{
                "name": nameshort_schema,
                "description": description_schema,
            },
            "required": ["name"],
            "additionalProperties": True
        }
    },
    "required": ["tenant"],
    "additionalProperties": False
}
```



>  看起来好像只是生成了某个租户和对应的公私钥,并存入RO自己的数据库中

# 准备datacenter

获取操作的云资源平台信息

## client层

```python
## 调用方法
client.create_datacenter(name=test_datacenter,vim_url="http://127.0.0.1:9080/openvim")

## 关键参数
 descriptor={"datacenter": {"name": name, "vim_url": vim_url}}
```



## server

> @bottle.route(url_base + '/datacenters', method='POST')

+ 校验参数
+ nfvo.new_datacenter
+ 解析参数中的配置信息（vimType、url、admin等）
+ 尝试加载对应的vim模块（plugins的加载具体过程没有看明白，py不太熟悉，没找到对应的实现类，好像是实现了某个抽象类即可。plugins具体是k:type,v:module）
+ 异常的处理（先插入、后删除，好像没有事物的说法）



schema说明

```
datacenter_schema = {
    "title":"datacenter information schema",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type":"object",
    "properties":{
        "datacenter":{
            "type":"object",
            "properties":datacenter_schema_properties,
            "required": ["name", "vim_url"],
            "additionalProperties": True
        }
    },
    "required": ["datacenter"],
    "additionalProperties": False
}

datacenter_schema_properties={
    "name": name_schema,
    "description": description_schema,
    "type": nameshort_schema, #currently "openvim" or "openstack", can be enlarged with plugins
    "vim_url": description_schema,
    "vim_url_admin": description_schema,
    "config": { "type":"object" }
}

```





# 创建vim-tenant、datacenter attach

+ 创建vim-tenant，并添加到datacenter。
+ 然后datacenter attach？不理解这个操作是干嘛的，后续细看

>  datacenter attach：貌似就是连接上这个云- -，单纯的建立连接的意思，看这样子好像不需要鉴权也应该能连上
>
>  
>
>  20-08-13：不是不需要鉴权，鉴权信息已经保存到数据库中，如果不传，会从数据库中获取，如果传了，会顺便更新了数据库中的信息

> 不太理解为什么还要另外建立一个租户，好像是专门为了某个VIM建立的，并将该租户信息添加进datacenter中

## client层

```python
## 调用方法
client.vim_action("create", "tenants", datacenter_name=test_datacenter, all_tenants=True, name=test_vim_tenant)
## 关键参数
descriptor={'tenants': {"name": kwargs["name"]}}

## 调用方法
client.attach_datacenter(name=test_datacenter, vim_tenant_name=test_vim_tenant)
## 关键参数
descriptor['datacenter']['vim_user'] = vim_user
descriptor['datacenter']['vim_password'] = vim_password
descriptor['datacenter']['vim_tenant_name'] = vim_tenant_name
descriptor['datacenter']['vim_tenant'] = vim_tenant_id
   
```



## server

> 
>
> ```
> @bottle.route(url_base + '/<tenant_id>/vim/<datacenter_id>/<item>', method='POST')
> ```
>
> 



+ 校验参数
+ nfvo.vim_action_create(mydb, tenant_id, datacenter_id, item, http_content)，开始新增vim-tenant
  + get_datacenter_by_name_uuid，获取vim云连接
  + get_vim(mydb, tenant_id, datacenter_id, datacenter_name, **extra_filter)，
    + 从数据库获取指定的云连接参数
    + 使用plugins开始对应的链接，定义为一个线程
+ 使用vim_content新增租户myvim.new_tenant(tenant["name"], tenant.get("description"))
+ ==new_tenant解读，此处以openstack为例==
  + _reload_connection，连接数据库，优先从上下文中获取
    + 兼容V2/V3
    + 填充连接信息
    + 再次打开链接（auth)
  + 调用keystone.projects.create / keystone.tenants.create（不知道这两个方法里面的具体实现，看起来像是SDK的调用）
+ 使用上一步获取到的id，获取完整的vim-租户信息



> @bottle.route(url_base + '/<tenant_id>/datacenters/<datacenter_id>', method='POST')

+ 校验参数
+ 编辑vim中账号信息
  + 根据datacenter-id获取对应的账号信息
  + 获取数据库中保存连接信息，将接口传递的连接信息更新到数据库
  + 开启和vim云的连接，开始线程
  + 返回云的租户ID
+ 根据云租户ID获取详情



schema

```
datacenter_associate_schema={
    "title":"datacenter associate information schema",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type":"object",
    "properties":{
        "datacenter":{
            "type": "object",
            "properties": {
                "name": name_schema,
                "vim_id": id_schema,
                "vim_tenant": name_schema,
                "vim_tenant_name": name_schema,
                "vim_username": nameshort_schema,
                "vim_password": nameshort_schema,
                "config": {"type": "object"}
            },
            # "required": ["vim_tenant"],
            "additionalProperties": True
        }
    },
    "required": ["datacenter"],
    "additionalProperties": False
}
```

# 准备 wim 信息、租户、连接

+ 获取操作的WIM资源平台信息
+ 建立一个新的wim专用租户，用该租户与wim平台建立连接
+ 然后又创了一个新的租户信息添加到datacenter平台？

> 此处没有vim action或者什么，好像没有将该租户添加到wim平台的操作，即开即用？反而将他添加到了datacenter平台？

## client层

```python
## 调用方法
client.create_wim(name=test_wim, vim_url="http://127.0.0.1:9080/odl")
## 关键参数
 descriptor = {"wim": {"name": name, "wim_url": wim_url}}
    
## 调用方法
client.attach_wim(name=test_wim, wim_tenant_name=test_wim_tenant)
## 关键参数
descriptor['wim']['wim_user'] = wim_user
descriptor['wim']['wim_password'] = wim_password
descriptor['wim']['wim_tenant_name'] = wim_tenant_name
descriptor['wim']['wim_tenant'] = wim_tenant_id
    
## 调用方法
tenant = client.vim_action("create", "tenants", name=long_name)
## 关键参数
descriptor={'tenants': {"name": kwargs["name"]}}
```



## server层

>  该REST API位于RO.osm_ro.wim.http_handler.WimHandler
>
>  该类中维护engine的资源池，用于处理wim的相关操作，也是从plugins中获取对应的，plugin类型为sdn（默认类型为vim）



> wim_port_mappings是个什么东西？



>   @route('POST', '/wims')

+ 验证参数
+ 调用self.==engine==.create_wim(http_content['wim'])
  + 获取对应plugin（sdn类型）
  + 存入数据库中
  + 返回uuid
+ 通过id获取详细信息

```
wim_schema = {
    "title": "wim information schema",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "wim": {
            "type": "object",
            "properties": wim_schema_properties,
            "required": ["name", "type", "wim_url"],
        }
    },
    "required": ["wim"],
}
```



> @route('POST', '/<tenant_id>/wims/<wim_id>')



+ 验证
+ 保存一个wim中的账户信息（入库）
+ 开启一个WIM的连接（WIM-THREAD）

```
wim_account_schema = {
    "title": "wim account information schema",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "wim_account": {
            "type": "object",
            "properties": {
                "name": name_schema,
                "user": nameshort_schema,
                "password": nameshort_schema,
                "config": {"type": "object"}
            },
        }
    },
    "required": ["wim_account"],
}
```

# 创建networks

建立新的网络资源，获取该资源的uuid

> 在哪里使用=  =？暂时没有看到

## client层

```python
## 调用方法
client.vim_action("create", "networks", name=long_name)

## 关键参数

```



# 创建vnf



## client层

```python
## 调用方法
client.create_vnf(descriptor=vnf_descriptor)

## 关键参数
descriptor=
{
    'vnf': {
        'name': test_vnf_name, 
     	'VNFC': [
            {
                'description': '测试vnf',
                'name': 'linux-VM',
                'VNFC image': '/fake/path/',
                'ram': 1024,
                'vcpus': 1,
                'bridge-ifaces': [{'name': 'eth0'}]
            }
        ],
        'description': _get_random_name(255),
        'nets': [], 
        'external-connections': [
            {
                'name': 'eth0', 
                'local_iface_name': 'eth0',
                'VNFC': 'linux-VM',
                'type': 'bridge'
            }
        ], 
        'public': False
    }
}
```



# 创建scenario



## client层

```python
## 调用方法
client.create_scenario(descriptor=scenario_descriptor)

## 关键参数
descriptor={   
    'schema_version': 2,
    'scenario': {
        'name': test_scenario_name, 
        'description': _get_random_name(255),
        'public': True,
        'vnfs':{
            'vnf1': {
                'vnf_name': test_vnf_name
            }
        },
        'networks':{
            'net1':{
                'external': True,
                'interfaces': [
                    {'vnf1': 'eth0'}
                ]
            }
        }
    }
}
```



# 创建instance

最终创建instance

## client层

```python
## 调用方法
client.create_instance(scenario_name=test_scenario_name, name=test_instance_name )

## 关键参数
descriptor={ 
    'schema_version': 2,
    'instance': {
        'name': test_instance_name, 
        'description': _get_random_name(255),
        'public': True,
        'vnfs':{
            'vnf1': {
                'vnf_name': test_vnf_name
            }
        },
        'networks':{
            'net1':{
                'external': True,
                'interfaces': [
                    {'vnf1': 'eth0'}
                ]
            }
        }
    }
}
```



# 删除流程约等于回退

细节逐步补充



