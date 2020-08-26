 # NSR

## 创建NSR

 ```python
 nsr_descriptor = {
                "name": ns_request["nsName"],
                "name-ref": ns_request["nsName"],
                "short-name": ns_request["nsName"],
                "admin-status": "ENABLED",
                "nsState": "NOT_INSTANTIATED",
                "currentOperation": "IDLE",
                "currentOperationID": None,
                "errorDescription": None,
                "errorDetail": None,
                "deploymentStatus": None,
                "configurationStatus": None,
                "vcaStatus": None,
                "nsd": {k: v for k, v in nsd.items() if k in ("vld", "_id", "id", "constituent-vnfd", "name")},
                "datacenter": ns_request["vimAccountId"],
                "resource-orchestrator": "osmopenmano",
                "description": ns_request.get("nsDescription", ""),
                "constituent-vnfr-ref": [],

                "operational-status": "init",    # typedef ns-operational-
                "config-status": "init",         # typedef config-states
                "detailed-status": "scheduled",

                "orchestration-progress": {},
                # {"networks": {"active": 0, "total": 0}, "vms": {"active": 0, "total": 0}},

                "create-time": now,
                "nsd-name-ref": nsd["name"],
                "operational-events": [],   # "id", "timestamp", "description", "event",
                "nsd-ref": nsd["id"],
                "nsd-id": nsd["_id"],
                "vnfd-id": [],
                "instantiate_params": self._format_ns_request(ns_request),
                "additionalParamsForNs": additional_params,
                "ns-instance-config-ref": nsr_id,
                "id": nsr_id,
                "_id": nsr_id,
                # "input-parameter": xpath, value,
                "ssh-authorized-key": ns_request.get("ssh_keys"),  # TODO remove
            }
```

### 创建VNFR

在数据库中创建好NSR后，根据NSD中的VNFD，创建对应的VNFR

```python
vnfr_descriptor = {
                    "id": vnfr_id,
                    "_id": vnfr_id,
                    "nsr-id-ref": nsr_id,
                    "member-vnf-index-ref": member_vnf["member-vnf-index"],
                    "additionalParamsForVnf": additional_params,
                    "created-time": now,
                    # "vnfd": vnfd,        # at OSM model.but removed to avoid data duplication TODO: revise
                    "vnfd-ref": vnfd_id,
                    "vnfd-id": vnfd["_id"],    # not at OSM model, but useful
                    "vim-account-id": None,
                    "vdur": [],
                    "connection-point": [],
                    "ip-address": None,  # mgmt-interface filled by LCM
                }

for vnfd_vld in vnfd.get("internal-vld"):
    vnfr_descriptor["vld"].append({key: vnfd_vld[key] for key in ("id", "vim-network-name", "vim-network-id") if key in vnfd_vld})

vnfd_mgmt_cp = vnfd["mgmt-interface"].get("cp")

for cp in vnfd.get("connection-point", ()):
    vnf_cp = {
            "name": cp["name"],
            "connection-point-id": cp.get("id"),
            "id": cp.get("id"),
                        # "ip-address", "mac-address" # filled by LCM
                        # vim-id  # TODO it would be nice having a vim port id
            }
    vnfr_descriptor["connection-point"].append(vnf_cp)


for vdu in vnfd.get("vdu", ()):
    additional_params, _ = self._format_additional_params(ns_request, member_vnf["member-vnf-index"],
                                                                          vdu_id=vdu["id"], descriptor=vnfd)
    vdur = {
        "vdu-id-ref": vdu["id"],
        # TODO      "name": ""     Name of the VDU in the VIM
        "ip-address": None,  # mgmt-interface filled by LCM
        # "vim-id", "flavor-id", "image-id", "management-ip" # filled by LCM
        "internal-connection-point": [],
        "interfaces": [],
        "additionalParams": additional_params
    }
    if vdu.get("pdu-type"):
        vdur["pdu-type"] = vdu["pdu-type"]
    # TODO volumes: name, volume-id
    for icp in vdu.get("internal-connection-point", ()):
        vdu_icp = {
            "id": icp["id"],
            "connection-point-id": icp["id"],
            "name": icp.get("name"),
            # "ip-address", "mac-address" # filled by LCM
            # vim-id  # TODO it would be nice having a vim port id
        }
        vdur["internal-connection-point"].append(vdu_icp)
        for iface in vdu.get("interface", ()):
            vdu_iface = {
                "name": iface.get("name"),
                # "ip-address", "mac-address" # filled by LCM
                # vim-id  # TODO it would be nice having a vim port id
            }
            if vnfd_mgmt_cp and iface.get("external-connection-point-ref") == vnfd_mgmt_cp:
                vdu_iface["mgmt-vnf"] = True
            if iface.get("mgmt-interface"):
                vdu_iface["mgmt-interface"] = True  # TODO change to mgmt-vdu

            # look for network where this interface is connected
            if iface.get("external-connection-point-ref"):
                for nsd_vld in get_iterable(nsd.get("vld")):
                    for nsd_vld_cp in get_iterable(nsd_vld.get("vnfd-connection-point-ref")):
                        if nsd_vld_cp.get("vnfd-connection-point-ref") == iface["external-connection-point-ref"] and \
                            nsd_vld_cp.get("member-vnf-index-ref") == member_vnf["member-vnf-index"]:
                                vdu_iface["ns-vld-id"] = nsd_vld["id"]
                                break
                        else:
                            continue
                break
            elif iface.get("internal-connection-point-ref"):
                for vnfd_ivld in get_iterable(vnfd.get("internal-vld")):
                    for vnfd_ivld_icp in get_iterable(vnfd_ivld.get("internal-connection-point")):
                        if vnfd_ivld_icp.get("id-ref") == iface["internal-connection-point-ref"]:
                            vdu_iface["vnf-vld-id"] = vnfd_ivld["id"]
                            break
                        else:
                            continue
                break

            vdur["interfaces"].append(vdu_iface)
            count = vdu.get("count", 1)
            if count is None:
                count = 1
            count = int(count)    # TODO remove when descriptor serialized with payngbind
            for index in range(0, count):
                if index:
                    vdur = deepcopy(vdur)
                vdur["_id"] = str(uuid4())
                vdur["count-index"] = index
                vnfr_descriptor["vdur"].append(vdur)
```

## 创建新的lcm操作



