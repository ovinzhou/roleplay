"use strict";
export const tsgdslodForm  ={
    "transType": "tsgdslod",
    "name": "货物销售订单",
    "id": "00000010160728FOTE000005",
    "sections": [
        {
            "layout": {
                "multiple": false,
                "type": "flow"
            },
            "config_tool_display": true,
            "fgCode": "fgattr",
            "name": "表单属性",
            "checked": "always",
            "id": "7633e9d0-386d-499d-af86-f049ad2eb70a",
            "fields": [
                {
                    "init": {
                        "pathVar": {
                            "taskId": "global-parameter"
                        },
                        "url2": "../H_roleplay-si/form/view/getViewInit/{taskId}",
                        "name": "webservice-init",
                        "render": {
                            "name": "default-init"
                        },
                        "key": "process.formTempName",
                        "url": "data/processInstance.json"
                    },
                    "fieldCode": "fgattr.fgattr000",
                    "label": "流程类型",
                    "type": "text",
                    "$$hashKey": "object:42",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "4ABB199672E44A66BAA302BF2",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "seq": 1
                },
                {
                    "init": {
                        "pathVar": {
                            "taskId": "global-parameter"
                        },
                        "url2": "../H_roleplay-si/form/view/getViewInit/{taskId}",
                        "name": "webservice-init",
                        "render": {
                            "name": "default-init"
                        },
                        "key": "process.tranType",
                        "url": "data/processInstance.json"
                    },
                    "fieldCode": "fgattr.fgattr001",
                    "label": "流程类型名称",
                    "type": "text",
                    "$$hashKey": "object:43",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": true,
                    "id": "3848ECD0C75A4C2697D0ABF3F",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 2
                },
                {
                    "fieldCode": "fgattr.fgattr002",
                    "label": "流程实例编码",
                    "type": "text",
                    "$$hashKey": "object:44",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "F2FF7FF70A2A4714A9B2F3D64",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 3
                },
                {
                    "fieldCode": "fgattr.fgattr003",
                    "format": "Y-m-d H:i:s",
                    "label": "流程生效时间",
                    "type": "datetime",
                    "$$hashKey": "object:45",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "3AB307FF1A8F4BC4B36341548",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "name": ""
                        }
                    ],
                    "seq": 4
                },
                {
                    "fieldCode": "fgattr.fgattr004",
                    "label": "状态",
                    "type": "text",
                    "$$hashKey": "object:46",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "CD9269D9DA0F4EBEBAE119A7C",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 5
                },
                {
                    "fieldCode": "fgattr.fgattr005",
                    "label": "经办主体",
                    "type": "selectsingle",
                    "$$hashKey": "object:47",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "558A65DB44C44823998746785",
                    "correlators": [
                        {
                            "field": "fgattr.fgattr001",
                            "name": "depend-field-object",
                            "eventType": "rfd.done,change",
                            "render": {
                                "v": "entityName",
                                "name": "combobox-init",
                                "k": "entityId"
                            },
                            "key": "tradeEntities"
                        }
                    ],
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "seq": 6
                },
                {
                    "fieldCode": "fgattr.fgattr006",
                    "label": "经办人",
                    "type": "selectsingle",
                    "$$hashKey": "object:48",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "A3D3542E9C2141A4AABD2838D",
                    "correlators": [
                        {
                            "pathVar": {
                                "entityId": "field-value"
                            },
                            "field": "fgattr.fgattr005",
                            "url2": "../H_roleplay-si/ds/list/listUsers?entityId={entityId}&para1=&pageSize=500&pagenum=1",
                            "name": "depend-field-remote",
                            "eventType": "change,rfd.done",
                            "render": {
                                "v": "nickname",
                                "name": "combobox-init",
                                "k": "userId"
                            },
                            "url": "data/jingbanren.json"
                        }
                    ],
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "seq": 7
                },
                {
                    "fieldCode": "fgattr.fgattr007",
                    "label": "经办组织",
                    "type": "selectsingle",
                    "$$hashKey": "object:49",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "8938E809D1D340C680A83A9D8",
                    "correlators": [
                        {
                            "pathVar": {
                                "entityId": "other-field:fgattr.fgattr005",
                                "userId": "field-value"
                            },
                            "field": "fgattr.fgattr006",
                            "url2": "../H_roleplay-si/entities/{entityId}/users/{userId}/units",
                            "name": "depend-field-remote",
                            "eventType": "change,rfd.done",
                            "render": {
                                "v": "name",
                                "name": "combobox-init",
                                "k": "id"
                            },
                            "url": "data/group.json"
                        }
                    ],
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 8
                },
                {
                    "fieldCode": "fgattr.fgattr008",
                    "label": "经办角色",
                    "type": "selectsingle",
                    "$$hashKey": "object:50",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "F362BE4D58674FEE89F1034B0",
                    "correlators": [
                        {
                            "pathVar": {
                                "entityId": "other-field:fgattr.fgattr005",
                                "userId": "field-value"
                            },
                            "field": "fgattr.fgattr006",
                            "url2": "../H_roleplay-si/entities/{entityId}/users/{userId}/roles",
                            "name": "depend-field-remote",
                            "eventType": "change,rfd.done",
                            "render": {
                                "v": "name",
                                "name": "combobox-init",
                                "k": "id"
                            },
                            "url": "data/role.json"
                        }
                    ],
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 9
                },
                {
                    "fieldCode": "fgattr.fgattr009",
                    "label": "创建人",
                    "type": "text",
                    "$$hashKey": "object:51",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "FC75263262F44F8EADC714078",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 10
                },
                {
                    "init": {
                        "name": "datetime-init",
                        "value": "current"
                    },
                    "fieldCode": "fgattr.fgattr010",
                    "format": "Y-m-d H:i:s",
                    "label": "创建时间",
                    "type": "datetime",
                    "$$hashKey": "object:52",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "3012BB0A8881421CAE04C5F16",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 11
                },
                {
                    "fieldCode": "fgattr.fgattr011",
                    "label": "修改人",
                    "type": "text",
                    "$$hashKey": "object:53",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "C244ECF3795A4601B3DBCD19E",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 12
                },
                {
                    "fieldCode": "fgattr.fgattr012",
                    "format": "Y-m-d H:i:s",
                    "label": "修改时间",
                    "type": "datetime",
                    "$$hashKey": "object:54",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "表单属性",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "182DCA11780145C08595AB31E",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 13
                }
            ],
            "$$hashKey": "object:13",
            "seq": 1
        },
        {
            "layout": {
                "multiple": false,
                "type": "flow"
            },
            "config_tool_display": true,
            "fgCode": "fgouty",
            "name": "客户",
            "checked": "always",
            "id": "92f35bc6-b577-40f0-8c3e-7597fefcdaa4",
            "fields": [
                {
                    "fieldCode": "fgouty.fgenty001",
                    "label": "客户ID",
                    "type": "text",
                    "$$hashKey": "object:98",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": "always",
                    "id": "7C1BF200BC714D55ABD0BE7F9",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fgenty003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "refEntityId"
                        }
                    ],
                    "seq": 1
                },
                {
                    "fieldCode": "fgouty.fgenty002",
                    "label": "客户编码",
                    "type": "text",
                    "$$hashKey": "object:99",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": "always",
                    "id": "B26DC056BF5345BEA414B22F0",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fgenty003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "refEntityId"
                        }
                    ],
                    "seq": 2
                },
                {
                    "fieldCode": "fgouty.fgenty003",
                    "label": "客户名称",
                    "type": "selector",
                    "$$hashKey": "object:100",
                    "fieldClass": "col-md-4",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "33%",
                    "checked": true,
                    "id": "D0FD2FF57D6A44AA9BCB4C361",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "pathVar": {
                                "entityId": "field-value"
                            },
                            "field": "fgattr.fgattr005",
                            "url2": "../H_roleplay-si/ds/bizRel?entityId={entityId}&type=Customer&para1=&pageNum=1&pageSize=10&title=EntitiesCustomer",
                            "name": "depend-field-remote",
                            "eventType": "change,rfd.done",
                            "render": {
                                "k": "refEntityName"
                            }
                        }
                    ],
                    "seq": 3
                },
                {
                    "fieldCode": "fgouty.fgadrs001",
                    "label": "主体地址ID",
                    "type": "text",
                    "$$hashKey": "object:101",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": "always",
                    "id": "404F406791BF443CAECC78F52",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fgadrs003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "id"
                        }
                    ],
                    "seq": 4
                },
                {
                    "fieldCode": "fgouty.fgadrs002",
                    "label": "主体地址编码",
                    "type": "text",
                    "$$hashKey": "object:102",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": "always",
                    "id": "C5D749ED4ECE4077A12EC9FF7",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fgadrs003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "addressCode"
                        }
                    ],
                    "seq": 5
                },
                {
                    "fieldCode": "fgouty.fgadrs003",
                    "label": "办公地址",
                    "type": "selector",
                    "$$hashKey": "object:103",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "60C1104618874A83A99626679",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "pathVar": {
                                "entityId": "field-value"
                            },
                            "field": "fgouty.fgenty001",
                            "url2": "../H_roleplay-si/entities/{entityId}/addrs?type=Office",
                            "name": "depend-field-remote",
                            "eventType": "rfd.done,change",
                            "render": {
                                "k": "addressName"
                            }
                        }
                    ],
                    "seq": 6
                },
                {
                    "fieldCode": "fgouty.fgadrs005",
                    "label": "详细地址",
                    "type": "text",
                    "$$hashKey": "object:104",
                    "fieldClass": "col-md-6",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "50%",
                    "checked": true,
                    "id": "974C16D739D745588B2F351B8",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fgadrs003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "address"
                        }
                    ],
                    "seq": 7
                },
                {
                    "fieldCode": "fgouty.fgadrs006",
                    "label": "办公电话",
                    "type": "text",
                    "$$hashKey": "object:105",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "DA1AA0813CE4481D8291FFBD3",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fgadrs003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "contactTel"
                        }
                    ],
                    "seq": 8
                },
                {
                    "fieldCode": "fgouty.fgadrs007",
                    "label": "主体类型",
                    "type": "text",
                    "$$hashKey": "object:106",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": true,
                    "id": "09B40089844549D7B4AD40503",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "name": ""
                        }
                    ],
                    "seq": 9
                },
                {
                    "fieldCode": "fgouty.fguser001",
                    "label": "联系人ID",
                    "type": "text",
                    "$$hashKey": "object:107",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": "always",
                    "id": "E02ECC962E50483795A845186",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fguser003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "userId"
                        }
                    ],
                    "seq": 10
                },
                {
                    "fieldCode": "fgouty.fguser002",
                    "label": "联系人编码",
                    "type": "text",
                    "$$hashKey": "object:108",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": "16%",
                    "checked": "always",
                    "id": "5CC9DA3E791C46569D5B57721",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fguser003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "userCode"
                        }
                    ],
                    "seq": 11
                },
                {
                    "fieldCode": "fgouty.fguser003",
                    "label": "联系人",
                    "type": "selector",
                    "$$hashKey": "object:109",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "9EA1989B823346DF88A1F28D5",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "pathVar": {
                                "resourceId": "field-value",
                                "entityId": "other-field:fgouty.fgenty001"
                            },
                            "field": "fgouty.fgadrs001",
                            "url2": "../H_roleplay-si/entities/{entityId}/resources/{resourceId}/contacts",
                            "name": "depend-field-remote",
                            "eventType": "rfd.done,change",
                            "render": {
                                "k": "nickname"
                            }
                        }
                    ],
                    "seq": 12
                },
                {
                    "fieldCode": "fgouty.fguser007",
                    "label": "手机号",
                    "type": "text",
                    "$$hashKey": "object:110",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "90ED999FE588429699585945F",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fguser003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "mobile"
                        }
                    ],
                    "seq": 13
                },
                {
                    "fieldCode": "fgouty.fguser008",
                    "label": "邮箱",
                    "type": "text",
                    "$$hashKey": "object:111",
                    "fieldClass": "col-md-4",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "客户",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": "33%",
                    "checked": true,
                    "id": "B2041AE44E1E4F47842723E78",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgouty.fguser003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "email"
                        }
                    ],
                    "seq": 14
                }
            ],
            "$$hashKey": "object:14",
            "seq": 2
        },
        {
            "layout": {
                "summary": [
                    "fgordr.fgtrns006",
                    "fgordr.fgtrns010",
                    "fgordr.fgtrns003",
                    "fgordr.fgtrns008"
                ],
                "multiple": true,
                "type": "grid",
                "configSets": {
                    "showOptions": true
                }
            },
            "config_tool_display": true,
            "fgCode": "fgordr",
            "name": "销售订单明细",
            "checked": "always",
            "id": "d74a90c5-4847-4b21-9a88-1d72fe9240d3",
            "fields": [
                {
                    "fieldCode": "fgordr.fggods001",
                    "label": "商品ID",
                    "type": "text",
                    "$$hashKey": "object:162",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": true,
                    "config_tool_display": false,
                    "width": 150,
                    "checked": "always",
                    "id": "A7CDCB7357ED47358F17C767F",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "skuCode"
                        }
                    ],
                    "seq": 1
                },
                {
                    "fieldCode": "fgordr.fggods002",
                    "label": "商品编码",
                    "type": "text",
                    "$$hashKey": "object:163",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": true,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": true,
                    "config_tool_display": false,
                    "width": 150,
                    "checked": "always",
                    "id": "E92CE53BDE59475AB4CFF8858",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "skuCode"
                        }
                    ],
                    "seq": 2
                },
                {
                    "fieldCode": "fgordr.fggods003",
                    "multiple": true,
                    "label": "物料名称",
                    "type": "selector",
                    "$$hashKey": "object:164",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 250,
                    "checked": true,
                    "id": "A686A6EB33E94F0BA6022F7EE",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "pathVar": {
                                "objCate": "finished",
                                "verify": "true"
                            },
                            "field": "fgattr.fgattr005",
                            "url2": "../H_roleplay-si/entitydatasource/sku?objCate={objCate}&verify={verify}&pagination.pageNum=1&pagination.pageSize=10&dataSourceCode=EntitiesInventoriesByObjCate",
                            "name": "depend-field-remote",
                            "eventType": "change,rfd.done",
                            "render": {
                                "k": "name"
                            }
                        }
                    ],
                    "seq": 3
                },
                {
                    "fieldCode": "fgordr.fggods004",
                    "label": "图片",
                    "type": "attachment",
                    "$$hashKey": "object:165",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 150,
                    "checked": false,
                    "id": "5C8C19BBCDD04DC984798D9CC",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 4
                },
                {
                    "fieldCode": "fgordr.fggods006",
                    "label": "物料类型",
                    "type": "text",
                    "$$hashKey": "object:166",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 90,
                    "checked": true,
                    "id": "C275D375FAE04D14A31F6F20E",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "level3CatName"
                        }
                    ],
                    "seq": 5
                },
                {
                    "fieldCode": "fgordr.fgtrns012",
                    "format": "Y-m-d",
                    "label": "交付日期",
                    "type": "datetime",
                    "$$hashKey": "object:167",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 120,
                    "checked": true,
                    "id": "2E64074A75044496AFF24593C",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "seq": 6
                },
                {
                    "fieldCode": "fgordr.fggods008",
                    "label": "型号",
                    "type": "text",
                    "$$hashKey": "object:168",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": 90,
                    "checked": true,
                    "id": "082FC4C4876A4F0CAEBDD5C67",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "fggods008"
                        }
                    ],
                    "seq": 7
                },
                {
                    "fieldCode": "fgordr.fggods007",
                    "label": "规格",
                    "type": "text",
                    "$$hashKey": "object:169",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": 90,
                    "checked": true,
                    "id": "8C4735F9B6B447CFBAFA55CEC",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "fggods007"
                        }
                    ],
                    "seq": 8
                },
                {
                    "fieldCode": "fgordr.fggods009",
                    "label": "颜色",
                    "type": "text",
                    "$$hashKey": "object:170",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": false,
                    "width": 70,
                    "checked": true,
                    "id": "7784B94893F148278F5E1DFB3",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "fggods009"
                        }
                    ],
                    "seq": 9
                },
                {
                    "fieldCode": "fgordr.fggods012",
                    "label": "每箱数量",
                    "type": "text",
                    "$$hashKey": "object:171",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 60,
                    "checked": true,
                    "id": "8172C4C00B474DDFA7708851E",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "fggods012"
                        }
                    ],
                    "seq": 10
                },
                {
                    "fieldCode": "fgordr.fggods013",
                    "label": "外箱尺寸",
                    "type": "text",
                    "$$hashKey": "object:172",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 120,
                    "checked": true,
                    "id": "35C26247F4FC4BD39A8E26BB5",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "field": "fgordr.fggods003",
                            "name": "depend-field-object",
                            "eventType": "rfd.selected",
                            "key": "fggods013"
                        }
                    ],
                    "seq": 11
                },
                {
                    "fieldCode": "fgordr.fggods010",
                    "label": "纹底",
                    "type": "text",
                    "$$hashKey": "object:173",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 150,
                    "checked": false,
                    "id": "B9AC11E61BE2497EACAA64A5F",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "name": ""
                        }
                    ],
                    "seq": 12
                },
                {
                    "fieldCode": "fgordr.fggods011",
                    "label": "纹路",
                    "type": "text",
                    "$$hashKey": "object:174",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 150,
                    "checked": false,
                    "id": "22AA2E8B6B8B4E89B8B57324C",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "name": ""
                        }
                    ],
                    "seq": 13
                },
                {
                    "summary": true,
                    "fieldCode": "fgordr.fgtrns003",
                    "label": "数量",
                    "type": "number",
                    "$$hashKey": "object:175",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "min": 0,
                            "min_symbol": ">",
                            "name": "number-range-validater",
                            "max_symbol": "<"
                        },
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 90,
                    "checked": "always",
                    "id": "4952BBAAC26B4A7D8AFBC8372",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "decimal": "2",
                    "seq": 14
                },
                {
                    "fieldCode": "fgordr.fggods005",
                    "label": "计量单位",
                    "type": "selectsingle",
                    "$$hashKey": "object:176",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 90,
                    "checked": true,
                    "id": "535B150C43C04822935F76EBA",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [
                        {
                            "pathVar": {
                                "goodstypeId": "field-object:cateCode"
                            },
                            "field": "fgordr.fggods003",
                            "url2": "../roleplay-localize-provider/form/pGoodsType/{goodstypeId}/measureUnits",
                            "name": "depend-field-remote",
                            "eventType": "rfd.selected",
                            "render": {
                                "v": "measureunitName",
                                "k": "measureunitCode"
                            }
                        }
                    ],
                    "seq": 15
                },
                {
                    "summary": false,
                    "fieldCode": "fgordr.fgtrns004",
                    "label": "单价",
                    "type": "number",
                    "$$hashKey": "object:177",
                    "fieldClass": "col-md-2",
                    "required": true,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "min": 0,
                            "min_symbol": ">=",
                            "name": "number-range-validater",
                            "max_symbol": "<"
                        },
                        {
                            "name": "required-validater"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 70,
                    "checked": "always",
                    "id": "4952BBAAC26B4A7D8AFBC8372",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "decimal": "6",
                    "correlators": [],
                    "seq": 16
                },
                {
                    "init": {
                        "pathVar": {},
                        "default": "18C41B54ECD9427AB3F36F413",
                        "url2": "../roleplay-localize-provider/dicts/currency",
                        "v": "label",
                        "name": "combobox-init",
                        "k": "id"
                    },
                    "fieldCode": "fgordr.fgtrns005",
                    "label": "币种",
                    "type": "selectsingle",
                    "bindSource": [
                        {
                            "isParent": false,
                            "remark": "人民币",
                            "id": "18C41B54ECD9427AB3F36F413",
                            "label": "RMB",
                            "$$hashKey": "object:496",
                            "value": "RMB",
                            "parentId": "5D4B521BC79B408E937185776"
                        },
                        {
                            "isParent": false,
                            "remark": "美元",
                            "id": "6F1BB7DB872441C7B14C2F1D8",
                            "label": "US",
                            "$$hashKey": "object:497",
                            "value": "dollar",
                            "parentId": "5D4B521BC79B408E937185776"
                        },
                        {
                            "isParent": false,
                            "remark": "港币",
                            "id": "FA778236672A4BEEA6DB7EFDD",
                            "label": "HK",
                            "$$hashKey": "object:498",
                            "value": "HK",
                            "parentId": "5D4B521BC79B408E937185776"
                        }
                    ],
                    "$$hashKey": "object:178",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 90,
                    "checked": true,
                    "id": "1FC5EBF4EE1E4B1295713D3F6",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": false,
                        "config_tool_readonly": true
                    },
                    "correlators": [],
                    "seq": 17
                },
                {
                    "summary": true,
                    "fieldCode": "fgordr.fgtrns006",
                    "label": "原币金额",
                    "type": "number",
                    "$$hashKey": "object:179",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [],
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 120,
                    "checked": true,
                    "id": "20BB171D61A1443EA5FFF7EC2",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "decimal": "2",
                    "correlators": [
                        {
                            "name": "multiplication",
                            "eventType": "change,rfd.done",
                            "fields": [
                                "fgordr.fgtrns003",
                                "fgordr.fgtrns004"
                            ]
                        }
                    ],
                    "seq": 18
                },
                {
                    "init": {
                        "name": "number-init",
                        "value": 1
                    },
                    "fieldCode": "fgordr.fgtrns007",
                    "label": "汇率",
                    "type": "number",
                    "$$hashKey": "object:180",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "min": 0,
                            "min_symbol": ">",
                            "max": 100,
                            "name": "number-range-validater",
                            "max_symbol": "<"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 70,
                    "checked": true,
                    "id": "C42D3F8E1A39459CBAD0A7EA0",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "decimal": "2",
                    "seq": 19
                },
                {
                    "summary": true,
                    "fieldCode": "fgordr.fgtrns008",
                    "label": "人民币金额",
                    "type": "number",
                    "$$hashKey": "object:181",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [],
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 120,
                    "checked": "always",
                    "id": "E1A21EA728B14001B94D6E6BE",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "decimal": "2",
                    "correlators": [
                        {
                            "name": "multiplication",
                            "eventType": "change,rfd.done",
                            "fields": [
                                "fgordr.fgtrns006",
                                "fgordr.fgtrns007"
                            ]
                        }
                    ],
                    "seq": 20
                },
                {
                    "init": {
                        "name": "number-init",
                        "value": 0.17
                    },
                    "fieldCode": "fgordr.fgtrns009",
                    "label": "税率",
                    "type": "number",
                    "$$hashKey": "object:182",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "validaters": [
                        {
                            "min": 0,
                            "min_symbol": ">=",
                            "max": 1,
                            "name": "number-range-validater",
                            "max_symbol": "<"
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 70,
                    "checked": true,
                    "id": "3038656588A94846806230218",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "decimal": "2",
                    "seq": 21
                },
                {
                    "summary": true,
                    "fieldCode": "fgordr.fgtrns010",
                    "label": "税金",
                    "type": "number",
                    "$$hashKey": "object:183",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": true,
                    "config_tool_display": true,
                    "width": 120,
                    "checked": true,
                    "id": "E7B5569869DE4101AB25E96CD",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "decimal": "2",
                    "correlators": [
                        {
                            "money": "fgordr.fgtrns008",
                            "rate": "fgordr.fgtrns009",
                            "name": "taxation",
                            "eventType": "change,spinstop,rfd.done"
                        }
                    ],
                    "seq": 22
                },
                {
                    "fieldCode": "fgordr.fgtrns013",
                    "label": "说明",
                    "type": "text",
                    "$$hashKey": "object:184",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "销售订单明细",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": 150,
                    "checked": true,
                    "id": "D4F8F8562E724ABE9C08C45DA",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 23
                }
            ],
            "$$hashKey": "object:15",
            "seq": 3,
            "verification": {
                "calcRelCode": "crnows",
                "dealerCode": "",
                "matchType": "",
                "matchDirection": 1,
                "name": "",
                "isDefaultComponent": 0,
                "transObjCode": "",
                "containerCode": ""
            }
        },
        {
            "layout": {
                "multiple": false,
                "type": "flow"
            },
            "config_tool_display": true,
            "fgCode": "fgcmpr",
            "name": "综合",
            "checked": true,
            "id": "c106cf2a-cf51-4462-8a81-26c52a7ab15f",
            "fields": [
                {
                    "fieldCode": "fgcmpr.fgcmpr001",
                    "label": "附件",
                    "type": "attachment",
                    "$$hashKey": "object:334",
                    "fieldClass": "col-md-2",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "综合",
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "16%",
                    "checked": true,
                    "id": "C08A6CE565A24E838CCACF2C4",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 1
                },
                {
                    "fieldCode": "fgcmpr.fgcmpr002",
                    "label": "备注",
                    "type": "textarea",
                    "$$hashKey": "object:335",
                    "fieldClass": "col-md-12",
                    "required": false,
                    "setConfig": false,
                    "isSystem": false,
                    "sectionName": "综合",
                    "validaters": [
                        {
                            "name": "string-length-validater",
                            "length": 500
                        }
                    ],
                    "readonly": false,
                    "config_tool_display": true,
                    "width": "100%",
                    "checked": true,
                    "id": "6006D8EAD1224205B126AC8A8",
                    "configSets": {
                        "config_tool_display": true,
                        "config_tool_required": true,
                        "config_tool_readonly": true
                    },
                    "seq": 2
                }
            ],
            "$$hashKey": "object:16",
            "seq": 4
        }
    ]
}