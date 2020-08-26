# OSM (OpenSource MANO)

`OSM`是由ETSI领导的开源项目，它是根据`MANO`架构规范设计实现的网络虚拟服务(`NFVO`)编排系统。

## 学习路线

### 1. QuickStart

参考[OSM QuickStart](https://osm.etsi.org/docs/user-guide/01-quickstart.html)，了解OSM的目的和基本使用场景。
> 如果有时间和资源，按照文档的指导，在本地安装一套OSM，然后通过OSM的命令行或者界面，执行`OnBoarding`、`instantiate`操作。

对于OSM中涉及的背景知识和基本概念，可以参考[OSM介绍](https://osm.etsi.org/wikipub/images/1/1b/Introduction_to_OSM_SDN_NFV_WC_2018-FJ.pdf)。

### 2. DESCRIPTOR模型

`DESCRIPTOR`模型描述了网络服务、切片和VNF的模版模型。系统的核心功能：`OnBoarding`和`Instantiate`都依赖该模型。

1. 阅读[模型文档](https://osm.etsi.org/wikipub/images/2/26/OSM_R2_Information_Model.pdf)；

2. 阅读使用YANG定义的模型 : `git clone https://osm.etsi.org/gerrit/osm/IM`

### 3. RO代码

`RO`是OSM的子项目，负责在云环境中实现服务的编排(创建/删除等），它是OSM其它项目的基础。

为了了解这个项目，首先参考[RO开发指南](https://osm.etsi.org/docs/developer-guide/03-developer-how-to-for-modules.html#package-dependency-osm-im)下载代码、搭建本地RO环境。

阅读代码前，我们可以先了解RO的信息模型：`MANO_DB_STRUCTURE.sql`；之后重点阅读：`nfvo.py`。更多学习细节后续再补充了。
