(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{379:function(_,t,v){"use strict";v.r(t);var d=v(42),e=Object(d.a)({},(function(){var _=this,t=_.$createElement,v=_._self._c||t;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("h1",{attrs:{id:"new-nsd-v3方法解析"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#new-nsd-v3方法解析"}},[_._v("#")]),_._v(" new_nsd_v3方法解析")]),_._v(" "),v("h2",{attrs:{id:"参数说明"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#参数说明"}},[_._v("#")]),_._v(" 参数说明")]),_._v(" "),v("p",[_._v("new_nsd_v3方法接受三个参数，分别")]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("参数名")]),_._v(" "),v("th",[_._v("类型")]),_._v(" "),v("th",[_._v("说明")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("mydb")]),_._v(" "),v("td"),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("tenant_id")]),_._v(" "),v("td"),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("nsd_descriptor")]),_._v(" "),v("td"),_._v(" "),v("td")])])]),_._v(" "),v("h2",{attrs:{id:"return"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#return"}},[_._v("#")]),_._v(" return")]),_._v(" "),v("p",[_._v("返回创建的NSD的ids列表")]),_._v(" "),v("h2",{attrs:{id:"创建流程"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#创建流程"}},[_._v("#")]),_._v(" 创建流程")]),_._v(" "),v("p",[_._v("首先通过nsd_catalog.nsd()创建了一个nsd模型")]),_._v(" "),v("div",{staticClass:"language-python extra-class"},[v("pre",{pre:!0,attrs:{class:"language-python"}},[v("code",[_._v("mynsd "),v("span",{pre:!0,attrs:{class:"token operator"}},[_._v("=")]),_._v(" nsd_catalog"),v("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v(".")]),_._v("nsd"),v("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("(")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v(")")]),_._v("\n")])])]),v("p",[_._v("通过pyangbind将传过来的nsd_descriptor解析成json格式并赋值给mynsd")]),_._v(" "),v("p",[_._v("然后定义了一系列的数组，来存放相关对象")]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("数组名")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("db_scenarios")]),_._v(" "),v("td",[_._v("scenario对象数组,相当于实例化一个NS")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_vnfs")]),_._v(" "),v("td",[_._v("vnf对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_ip_profiles")]),_._v(" "),v("td",[_._v("ip_profile对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_nets")]),_._v(" "),v("td",[_._v("vld对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_interfaces")]),_._v(" "),v("td",[_._v("iface对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_vnffgs")]),_._v(" "),v("td",[_._v("vnffg对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_rsps")]),_._v(" "),v("td",[_._v("rsp对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_rsp_hops")]),_._v(" "),v("td",[_._v("rsp_hop对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_classifiers")]),_._v(" "),v("td",[_._v("classifier对象数组")])]),_._v(" "),v("tr",[v("td",[_._v("db_sce_classifier_matches")]),_._v(" "),v("td",[_._v("matche对象数组")])])])]),_._v(" "),v("h3",{attrs:{id:"scenario"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#scenario"}},[_._v("#")]),_._v(" scenario")]),_._v(" "),v("p",[_._v("通过mynsd.nsd_catalog.nsd.values()循环获取nsd_yang")]),_._v(" "),v("p",[_._v("定义一个nsd = nsd_yang.get()")]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("变量名")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("osm_id")]),_._v(" "),v("td",[_._v("nsd.id")])]),_._v(" "),v("tr",[v("td",[_._v("name")]),_._v(" "),v("td",[_._v("nsd.name")])]),_._v(" "),v("tr",[v("td",[_._v("description")]),_._v(" "),v("td",[_._v("nsd.description")])]),_._v(" "),v("tr",[v("td",[_._v("tenant_id")]),_._v(" "),v("td",[_._v("传入的tenant_id")])]),_._v(" "),v("tr",[v("td",[_._v("vendor")]),_._v(" "),v("td",[_._v("nsd.vendor")])]),_._v(" "),v("tr",[v("td",[_._v("short_name")]),_._v(" "),v("td",[_._v("nsd.short_name")])]),_._v(" "),v("tr",[v("td",[_._v("descriptor")]),_._v(" "),v("td",[_._v("传入的nsd_descriptor")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("nsd_uuid_list.append(uuid) 这就是最后返回的uuid列表\nuuid_list.append(uuid)\n")])])]),v("h4",{attrs:{id:"vnf"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#vnf"}},[_._v("#")]),_._v(" vnf")]),_._v(" "),v("ol",[v("li",[_._v('通过nsd.get("constituent-vnfd")循环获取'),v("code",[_._v("vnf")])]),_._v(" "),v("li",[_._v("根据"),v("code",[_._v("vnf.osm_id和vnf.tenant_id")]),_._v("查找数据库"),v("code",[_._v("nfs")]),_._v("中对应的记录："),v("code",[_._v("existing_vnf")]),_._v(";")]),_._v(" "),v("li",[_._v("如果"),v("code",[_._v("existing_vnf")]),_._v("不存在，则返回")])]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("scenario_id")]),_._v(" "),v("td",[_._v("关联scenario.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("name")]),_._v(" "),v("td",[v("code",[_._v("existing_vnf[0].name")]),_._v("+vnf.member-vnf-index")])]),_._v(" "),v("tr",[v("td",[_._v("vnf_id")]),_._v(" "),v("td",[v("code",[_._v("existing_vnf[0].uuid")])])]),_._v(" "),v("tr",[v("td",[_._v("member_vnf_index")]),_._v(" "),v("td",[_._v("vnf.member-vnf-index")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\nvnf_index2scevnf_uuid[str(vnf['member-vnf-index'])] = uuid\nvnf_index2vnf_uuid[str(vnf['member-vnf-index'])] = existing_vnf[0][\"uuid\"]\n")])])]),v("h4",{attrs:{id:"ip-profile"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ip-profile"}},[_._v("#")]),_._v(" ip_profile")]),_._v(" "),v("ol",[v("li",[_._v('通过nsd.get("ip-profiles")循环获取'),v("code",[_._v("ip_profile")])]),_._v(" "),v("li",[_._v("定义params = ip_profile.ip-profile-params")])]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("ip_version")]),_._v(" "),v("td",[_._v("params.ip-version+params.ipv4")])]),_._v(" "),v("tr",[v("td",[_._v("subnet_address")]),_._v(" "),v("td",[_._v("params.subnet-address")])]),_._v(" "),v("tr",[v("td",[_._v("gateway_address")]),_._v(" "),v("td",[_._v("params.gateway-address")])]),_._v(" "),v("tr",[v("td",[_._v("dhcp_enabled")]),_._v(" "),v("td",[_._v("params.dhcp-params.enabled")])]),_._v(" "),v("tr",[v("td",[_._v("dhcp_start_address")]),_._v(" "),v("td",[_._v("params.dhcp-params.start-address")])]),_._v(" "),v("tr",[v("td",[_._v("dhcp_count")]),_._v(" "),v("td",[_._v("params.dhcp-params.count")])]),_._v(" "),v("tr",[v("td",[_._v("dns_address")]),_._v(" "),v("td",[_._v("params.dns-server数组通过“；”连接的字符串")])]),_._v(" "),v("tr",[v("td",[_._v("security_group")]),_._v(" "),v("td",[_._v("有params.security-group话")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v('ip_profile_name2db_table_index[str(ip_profile["name"])] = db_ip_profiles_index\ndb_ip_profiles_index += 1\n')])])]),v("h4",{attrs:{id:"vld"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#vld"}},[_._v("#")]),_._v(" vld")]),_._v(" "),v("ol",[v("li",[_._v('通过nsd.get("vld")循环获取'),v("code",[_._v("vld")])])]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("name")]),_._v(" "),v("td",[_._v("vld.name")])]),_._v(" "),v("tr",[v("td",[_._v("scenario_id")]),_._v(" "),v("td",[_._v("关联scenario.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("multipoint")]),_._v(" "),v("td",[_._v('vld.type!="ELINE"')])]),_._v(" "),v("tr",[v("td",[_._v("osm_id")]),_._v(" "),v("td",[_._v("vld.id")])]),_._v(" "),v("tr",[v("td",[_._v("description")]),_._v(" "),v("td",[_._v("vld.description")])]),_._v(" "),v("tr",[v("td",[_._v("type")]),_._v(" "),v("td",[_._v("1、默认none 2、存在vld.mgmt-network时为bridge 3、vld.provider-network.overlay-type为VLAN时为data")])]),_._v(" "),v("tr",[v("td",[_._v("external")]),_._v(" "),v("td",[_._v("存在vld.mgmt-network时为true")])]),_._v(" "),v("tr",[v("td",[_._v("sce_net_id")]),_._v(" "),v("td",[_._v("见下方"),v("code",[_._v("sce_net_id")])])]),_._v(" "),v("tr",[v("td",[_._v("vim_network_name")]),_._v(" "),v("td",[_._v("如果存在则赋值vld.vim-network-name？（已经赋值后创建？）")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("ol",[v("li",[v("p",[_._v("如果vld中存在"),v("code",[_._v("ip-profile-ref")]),_._v("："),v("code",[_._v("ip_profile_name")])]),_._v(" "),v("p",[_._v("如果在ip_profile_name2db_table_index没发现"),v("code",[_._v("ip_profile_name")]),_._v("则返回")]),_._v(" "),v("p",[_._v("如果发现的话"),v("code",[_._v("sce_net_id")])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v('db_ip_profiles[ip_profile_name2db_table_index[ip_profile_name]]["sce_net_id"] = uuid\n')])])])])]),_._v(" "),v("h5",{attrs:{id:"iface"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#iface"}},[_._v("#")]),_._v(" iface")]),_._v(" "),v("ol",[v("li",[_._v('通过vld.get("vnfd-connection-point-ref")循环获取'),v("code",[_._v("iface")])]),_._v(" "),v("li",[_._v("根据"),v("code",[_._v("iface.vnf_id")]),_._v("查找"),v("code",[_._v("vms")]),_._v("中对应的记录："),v("code",[_._v("existing_vdus")]),_._v(";")]),_._v(" "),v("li",[_._v("如果存在"),v("code",[_._v("existing_vdus")]),_._v("，则查找vnf_index2vnf_uuid里是否有iface.member-vnf-index-ref")]),_._v(" "),v("li",[_._v("如果没有的话，则返回")]),_._v(" "),v("li",[_._v("有的话根据"),v("code",[_._v("iface.vnf_id")]),_._v("查找"),v("code",[_._v("vms")]),_._v("中对应的记录："),v("code",[_._v("existing_ifaces")]),_._v(";未写完")])]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("sce_vnf_id")]),_._v(" "),v("td",[_._v("关联vnf.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("sce_net_id")]),_._v(" "),v("td",[_._v("关联vld.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("interface_id")]),_._v(" "),v("td",[_._v("数据库查出来的uuid？")])]),_._v(" "),v("tr",[v("td",[_._v("ip_address")]),_._v(" "),v("td",[_._v("1、默认none 2、存在iface.ip-address为ip-address的值")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("h4",{attrs:{id:"vnffg"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#vnffg"}},[_._v("#")]),_._v(" vnffg")]),_._v(" "),v("p",[_._v('通过nsd.get("vnffgd")循环获取vnffg')]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("name")]),_._v(" "),v("td",[_._v("vnffg.name")])]),_._v(" "),v("tr",[v("td",[_._v("scenario_id")]),_._v(" "),v("td",[_._v("关联db_scenarios的uuid")])]),_._v(" "),v("tr",[v("td",[_._v("vendor")]),_._v(" "),v("td",[_._v("vnffg.vendor")])]),_._v(" "),v("tr",[v("td",[_._v("description")]),_._v(" "),v("td",[_._v("vnffg.description")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("h5",{attrs:{id:"rsp"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#rsp"}},[_._v("#")]),_._v(" rsp")]),_._v(" "),v("p",[_._v('通过vnffgd.get("rsp")循环获取vnffg')]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("name")]),_._v(" "),v("td",[_._v("rsp.name")])]),_._v(" "),v("tr",[v("td",[_._v("sce_vnffg_id")]),_._v(" "),v("td",[_._v("关联vnffg.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("id")]),_._v(" "),v("td",[_._v("rsp.id")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("h5",{attrs:{id:"rsp-hop"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#rsp-hop"}},[_._v("#")]),_._v(" rsp_hop")]),_._v(" "),v("p",[_._v('通过rsp.get("vnfd-connection-point-ref")循环获取hop')]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("if_order")]),_._v(" "),v("td",[_._v("int(hop.order)")])]),_._v(" "),v("tr",[v("td",[_._v("ingress_interface_id")]),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("egress_interface_id")]),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("sce_vnf_id")]),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("sce_rsp_id")]),_._v(" "),v("td",[_._v("关联rsp.uuid")])])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("h5",{attrs:{id:"classifier"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#classifier"}},[_._v("#")]),_._v(" classifier")]),_._v(" "),v("p",[_._v('通过vnffgd.get("classifier")循环获取classifier')]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("name")]),_._v(" "),v("td",[_._v("classifier.name")])]),_._v(" "),v("tr",[v("td",[_._v("sce_vnffg_id")]),_._v(" "),v("td",[_._v("关联vnffg.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("sce_vnf_id")]),_._v(" "),v("td",[_._v("rsp.id")])]),_._v(" "),v("tr",[v("td",[_._v("interface_id")]),_._v(" "),v("td")])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("h5",{attrs:{id:"classifier-matches"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#classifier-matches"}},[_._v("#")]),_._v(" classifier_matches")]),_._v(" "),v("p",[_._v('通过classifier.get("match-attributes")循环获取matche')]),_._v(" "),v("table",[v("thead",[v("tr",[v("th",[_._v("字段")]),_._v(" "),v("th",[_._v("描述")])])]),_._v(" "),v("tbody",[v("tr",[v("td",[_._v("uuid")]),_._v(" "),v("td",[_._v("uuid4()随机数")])]),_._v(" "),v("tr",[v("td",[_._v("ip_proto")]),_._v(" "),v("td",[_._v("rsp.name")])]),_._v(" "),v("tr",[v("td",[_._v("source_ip")]),_._v(" "),v("td",[_._v("关联vnffg.uuid")])]),_._v(" "),v("tr",[v("td",[_._v("destination_ip")]),_._v(" "),v("td",[_._v("rsp.id")])]),_._v(" "),v("tr",[v("td",[_._v("source_port")]),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("destination_port")]),_._v(" "),v("td")]),_._v(" "),v("tr",[v("td",[_._v("sce_classifier_id")]),_._v(" "),v("td")])])]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("uuid_list.append(uuid)\n")])])]),v("h2",{attrs:{id:"最后"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#最后"}},[_._v("#")]),_._v(" 最后")]),_._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[_._v("mydb.new_rows(db_tables, uuid_list)\n")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);