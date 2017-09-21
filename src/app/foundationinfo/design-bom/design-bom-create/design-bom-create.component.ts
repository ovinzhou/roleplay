import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CacheService} from 'core/services/cache.service';
import {FoundationinfoService} from '../../foundationinfo-data.service';
import {PopupService} from '../../../core/services/popup.service';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'design-bom-create',
    templateUrl: './design-bom-create.component.html',
    styleUrls: ['./design-bom-create.component.css']
})
export class DesignBomCreateComponent implements OnInit {

    private data: any;
    private spus: any;
    private display: boolean;
    private spuList: any;
    private spusIdList: any;
    private selectSpuList: any;
    private list: any[];    //存储结构数据
    private bomName: ""
    private isUpdate: boolean = false
    private id: string = ''
    private spuAttrs: any[];
    private bomId: string = "";
    //当前选择的是bom还是spu,默认spu
    private currentSelectType: string = "spu"
    //当前文本输入框的内容(属性设置)
    private currentInput: any = {}
    //当前节点可选的code、name
    private attrList: any[]
    //存储父节点的信息
    private spuerNameAndCodeList: any[]

    //spu弹出层相关
    private page: any;
    private query: any = [];
    private filter: any;
    private searchKeyWord: string = '';
    private totalRecords: string = '';
    private first: number = 0;
    private toolbarConfigspu: any

    //选择BOM弹出层相关
    private bomPage: any;
    private bomQuery: any;
    private bomFilter: any;
    private bomSearchKeyWord: string = '';
    private bomfirst: number = 0;
    private isShowBomList: boolean = false;
    private toolbarConfigs: any;
    private bomList: any[];
    private selectBomList: any[];
    private bomTotalRecords: string = '';
    private rowData: any;
    private isSpu: boolean = true

    //产品属性相关
    private isShowSetProductAttribute: boolean = false;
    private SpuName: string = ''
    private color: string = ''
    private specification: string = ''  //规格
    private model: string = ''  //型号

    //数量
    private isShowQuantitySetting: boolean = false;
    private quantityNum: string = ''
    //名称规则
    private isShowNameSetting: boolean = false;
    private tempNameInfo: string = ''

    //编码规则
    private isShowCodeSetting: boolean = false;
    private tempCodeInfo: string = ''

    //查看bom结构相关
    private bomOrganizationList: any;  //查看bom结构的list
    private isShowBomOranizationDetail: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: FoundationinfoService,
                private popupService: PopupService,
                private cacheService: CacheService,
                private location: Location,
                private titleService: Title) {
    }

    ngOnInit() {

        this.toolbarConfigs = [
            {
                type: "search",
                handler: this.onQuery.bind(this),
                align: "right"
            },
            {
                label: "SPU",
                default: true,
                handler: this.spu.bind(this),
                icon: 'glyphicon glyphicon-plus'
            }, {
                label: "设计BOM",
                handler: this.bom.bind(this),
                icon: 'glyphicon glyphicon-trash'
            }
        ]

        this.toolbarConfigspu = [
            {
                type: "search",
                handler: this.SearchSPU.bind(this),
                align: "right"
            }
        ]

        this.titleService.setTitle("新增BOM")
        this.data = {"bomName": ""}
        this.spus = [];
        this.list = [];
        this.spuList = [];
        this.spusIdList = [];
        this.display = false;
        this.page = {
            pageNum: 1,
            pageSize: 10,
        }

        this.filter = {
            'pageSize': this.page.pageSize,
            'pageNum': this.page.pageNum,
            'searchKeyWord': this.searchKeyWord,
            'types': ["原料", "商品", "备品"],
            'ids': "",
            'attrs': true,
            'design': true,
            'filter': true,
            "details": true
        }

        this.bomPage = {
            pageNum: 1,
            pageSize: 10,
        }

        this.bomFilter = {
            'pageSize': this.page.pageSize,
            'pageNum': this.page.pageNum,
            'searchKeyWord': this.searchKeyWord,
        }

        this.route.params.subscribe(params => {
            var operation = params['operation'];
            if ('edit' === operation) {
                this.titleService.setTitle("修改BOM")
                this.isUpdate = true;
                this.service.getBomInfo(params['id']).then(data => {
                    var spu = {
                        "id": "",
                        "name": ""
                    }
                    data.spuResponses.map(spuData => {
                        this.spus.push(spuData);
                    })
                    this.bomId = data.id
                    this.data.bomName = data.name
                    this.list.push(data)
                    var recursion = function (tempData, nameAndCodeList) {
                        tempData.map(item => {
                            item["data"] = {}
                            item['expanded'] = true
                            var firstSpu: any = {}
                            if (item.spuResponses) {
                                firstSpu = item.spuResponses[0]
                                item.data["measureName"] = firstSpu.measureName;
                                item["spuId"] = firstSpu.id;
                            } 

                            item['edit'] = true
                            item['nameAndCodeList'] = nameAndCodeList;
                            item.data["name"] = firstSpu.name

                            if (item.subTmpl) {
                                item.data["type"] = "BOM";
                                item.data["name"] = item.subTmpl.name
                                item.data["id"] = item.subTmpl.id
                                item.data["isBom"] = true
                                item.data["userGroupName"] = ""
                                let obj = {'name': item.subTmpl.spuResponses[0].name, 'code': item.subTmpl.spuResponses[0].code}
                                item.nameAndCodeList.push(obj)
                            } else {
                                item.data["type"] = firstSpu.firstLevel + '>' + firstSpu.secondLevel + '>' + firstSpu.thirdLevel;
                                item.data["isBom"] = false
                                item.data["userGroupName"] = firstSpu.userGroupName
                                let obj = {'name': item.spuResponses[0].name, 'code': item.spuResponses[0].code}
                                item.nameAndCodeList.push(obj)
                            }


                            if (item.child) {
                                 item['children'] = item.child
                                 recursion(item.children, item.nameAndCodeList)
                            }

                        })
                    }
                    recursion(this.list, [])
                    this.list[0]['edit'] = false
                    console.log(this.list[0])
                }).catch(res => this.popupService.showError(res))
            }
        })

    }

    //添加SPU
    addSPU() {
        this.query['operation'] = 'open';
        if (this.spus.length == 0) {
            this.filter.filter = false
            this.filter.attrs = false
        } else {
            this.filter.filter = true
            this.filter.attrs = true
        }
        this.spusIdList = []
        this.spus.map(item => {
            this.spusIdList.push(item.id)
        })
        var spuIdString: string;

        this.filter.ids = this.spusIdList.join(",")

        this.service.getSpuList(encodeURIComponent(JSON.stringify(this.filter)), spuIdString)
            .then(data => {
                this.display = true;
                this.selectSpuList = [];
                this.spuList = [];
                this.spuList = data.content;
                this.totalRecords = data.totalElements
            })
            .catch(res => {
                this.popupService.alert(res)
            })

    }

    //移除已选的spu
    removeSeletedSpu(index, spu) {
        this.spus.splice(index, 1);
        var arr = {};
        if (this.spus.length == 0) {
            this.list = []
        }
        arr['data'] = this.spus[0] ? this.spus[0] : []
        if (this.list.length != 0) {
            this.list[0].data.name = this.spus[0].name
            this.list[0].data.measureName = this.spus[0].measureName
            this.list[0].data.type = this.spus[0].firstLevel + '>' + this.spus[0].secondLevel + '>' + this.spus[0].thirdLevel;
            this.list[0].data.userGroupName = this.spus[0].userGroupName
            let that = this
            var recursion = function (tempData) {
                tempData.map(item => {
                    let obj = {'name': that.spus[0].name, 'code': that.spus[0].code}
                    item.nameAndCodeList[0] = obj
                    if (item.children) {
                        recursion(item.children)
                    }
                })
            }
            recursion(this.list)
        }

    }

    selectSpu() {
        this.query['operation'] = 'select';
        this.filter.searchKeyWord = ''
        this.filter.pageNum = 1
        if (this.spus.length == 0) {
            if (this.selectSpuList.length == 0) {
                this.filter.filter = false
                this.filter.attrs = false
            } else {
                this.filter.filter = false
                this.filter.attrs = true
            }
            this.spusIdList = []
            this.spus.map(item => {
                this.spusIdList.push(item.id)
            })
            var spuIdString: string;
            this.filter.ids = ""
            if (this.selectSpuList.length) {
                let idList = [];
                this.selectSpuList.map(list => {
                    idList.push(list.id)
                })
                this.filter.ids = idList.join(",")
            }

            this.service.getSpuList(encodeURIComponent(JSON.stringify(this.filter)), spuIdString)
                .then(data => {
                    this.display = true;
                    this.spuList = [];
                    this.spuList = data.content;
                    this.totalRecords = data.totalElements
                })
                .catch(res => {
                    this.popupService.alert(res)
                })
        } else {

        }
    }

    initBomFilter() {
        this.bomFilter = {
            'pageSize': this.bomPage.pageSize,
            'pageNum': this.bomPage.pageNum,
            'searchKeyWord': this.bomSearchKeyWord,
            'types': ["产成品", "半成品", "商品", "备品"],
            'ids': '',
            'details': true
        }
    }

    //添加spu或者bom
    addBomOrSpu(rowData) {
        this.initBomFilter()
        if (this.currentSelectType == 'spu') {

            this.service.getSpuList(encodeURIComponent(JSON.stringify(this.bomFilter)), '')
                .then(data => {
                    this.bomTotalRecords = data.totalElements;
                    this.bomList = data.content;
                    this.isShowBomList = true
                })
                .catch(res => {
                    this.popupService.alert(res)
                })
        } else {
            this.bomfirst = 1;
            this.bomFilter = {
                'pageSize': this.bomPage.pageSize,
                'pageNum': this.bomPage.pageNum,
                'searchKeyWord': this.bomSearchKeyWord,
                'detail': true,
                'id': this.bomId
            }

            this.service.getBomList(this.bomFilter)
                .then(data => {
                    this.isSpu = false
                    this.bomTotalRecords = data.totalElements;
                    this.bomList = data.content;
                    this.isShowBomList = true
                })
                .catch(res => {
                    this.popupService.alert(res)
                })
        }
        this.rowData = rowData;
    }

    //删除spu或者bom
    delBomOrSpu(rowData) {
        let index = 0
        rowData.parent.children.every(item => {
            if (item.data.id == rowData.data.id) {
                return false;
            }
            index++;
            return true
        })
        rowData.parent.children.splice(index, 1)
    }

    setTextOverFlowStyle() {
        let style = {
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'white-space': 'nowrap'
        };
        return style;
    }

    //取消
    close() {
        this.display = false;
        this.isShowBomList = false;
        this.isShowQuantitySetting = false;
        this.isShowSetProductAttribute = false;
        this.isShowNameSetting = false;
        this.isShowCodeSetting = false;
    }

    //spu选择列表的删除
    removeSeletedItem(index, type) {
        if (type == 'spu') {
            this.selectSpuList.splice(index, 1)
        } else {
            this.selectBomList.splice(index, 1)
        }
    }

    //确定
    chooseConfirm(type) {
        if (type == 'spu') {
            this.selectSpuList.map(rowData => {
                this.spus.push(rowData)
            })
            this.display = false;
            var arr = {};
            var tempInfo = {
                "skuName": "spu.name",
                "skuCode": "spu.code",
                "attrs": null,
                "bom": {
                    "qty": "",
                    "measureUnitCode": "",
                    "subId": ""
                },
            }
            var spuAtrr = []
            spuAtrr = this.spus[0].spuAttrs,
                spuAtrr.map(item => {
                    if (item.forSkuEncode) {
                        tempInfo.skuName += " + '_' + self." + item.attrName + ".value"
                        tempInfo.skuCode += " + '_' + self." + item.attrName + ".code"
                    }
                })
            
            arr['data'] = this.spus[0] ? this.spus[0] : []
            arr['tmplInfo'] = tempInfo
            arr['spuId'] = this.spus[0].id
            arr['edit'] = false
            if (!this.list[0]) {
                this.list.push(arr)
                this.list[0].data.type = this.spus[0].firstLevel + '>' + this.spus[0].secondLevel + '>' + this.spus[0].thirdLevel;
                this.list[0].expanded = true
                this.list[0].data.isBom = false
                //用于拿到当前层可选取的属性值
                let attrs = {
                    'name': this.spus[0].name,
                    'code': this.spus[0].code
                }
                let nameAndCodeList = []
                nameAndCodeList.push(attrs)
                arr["nameAndCodeList"] = nameAndCodeList
            }

        } else {
            this.isShowBomList = false;
            if (!this.rowData['children']) {
                this.rowData['children'] = [];
            }
            this.selectBomList.map(data => {
                if (data.code) {
                    var arr = {};
                    var tempInfo = {
                        "skuName": "spu.name",
                        "skuCode": "spu.code",
                        "attrs": null,
                        "bom": {
                            "qty": "",
                            "measureUnitCode": "",
                            "subId": ""
                        },
                        "quantityNum": ""
                    }
                    data.type = data.firstLevel + '>' + data.secondLevel + '>' + data.thirdLevel;
                    data.isBom = false
                    arr['data'] = data
                    arr['expanded'] = true
                    arr['edit'] = true
                    arr['spuId'] = data.id

                    let attr = {
                        'name': data.name,
                        'code': data.code
                    }

                    let nameAndCodeList = []
                    this.rowData.nameAndCodeList.map(item => {
                        nameAndCodeList.push(item)
                    })
                    nameAndCodeList.push(attr)
                    arr["nameAndCodeList"] = nameAndCodeList

                    data.spuAttrs.map(item => {
                        if (item.forSkuEncode) {
                            tempInfo.skuName += " + '_' + self." + item.attrName + ".value"
                            tempInfo.skuCode += " + '_' + self." + item.attrName + ".code"
                        }
                    })
                    arr['tmplInfo'] = tempInfo
                    this.rowData.children.push(arr);
                } else {
                    data.isBom = true
                    var arr = {};
                    var tempInfo = {
                        "skuName": "spu.name",
                        "skuCode": "spu.code",
                        "attrs": null,
                        "bom": {
                            "qty": "",
                            "measureUnitCode": "",
                            "subId": ""
                        },
                        "quantityNum": ""
                    }
                    data.type = "BOM";
                    arr['tmplInfo'] = tempInfo
                    arr['data'] = data
                    arr['expanded'] = true
                    arr['edit'] = true

                    let nameAndCodeList = []
                    this.rowData.nameAndCodeList.map(item => {
                        nameAndCodeList.push(item)
                    })
                    arr["nameAndCodeList"] = nameAndCodeList

                    data.spuResponses[0].spuAttrs.map(item => {
                        if (item.forSkuEncode) {
                            tempInfo.skuName += " + '_' + self." + item.attrName + ".value"
                            tempInfo.skuCode += " + '_' + self." + item.attrName + ".code"
                        }
                    })
                    this.rowData.children.push(arr);
                }
            })
            this.selectBomList = [];
        }
    }

    private initFilter(): void {
        this.filter = {
            searchKeyWord: this.searchKeyWord.trim(),
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
            types: ['原料', "商品", "备品"],
            ids: ''
        };
        this.filter.ids = ''
        if (this.spusIdList[0]) {
            this.filter.ids = this.spusIdList[0]
        }
        if (this.selectSpuList[0]) {
            this.filter.ids = this.selectSpuList[0].id
        }
    }

    //监听键盘操作
    onKeydown(configItem) {
        if (event["key"] == "Enter") {
            this.search();
        }
    }

    //选取属性
    rowClick(event) {
        this.currentInput.value += event.data.code;
        this.currentInput.tempValue += event.data.code;
        this.attrList.map(item => {
            let code = item.code
            this.currentInput.tempValue = this.currentInput.tempValue.replace(new RegExp(item.code, 'g'), item.name)
        })
    }

    //正在编辑
    OnInput(data) {
        this.currentInput = data;
        data.tempValue = data.value
        this.attrList.map(item => {
            data.tempValue = data.tempValue.replace(new RegExp(item.code, 'g'), item.name)
        })
    }

    //获得焦点
    OnEdit(data) {
        this.currentInput = data;

    }

    //搜索
    SearchSPU(searchValue) {
        this.searchKeyWord = searchValue
        this.search()
    }

    search() {
        this.filter.pageNum = 1;
        this.first = 1
        this.filter.searchKeyWord = this.searchKeyWord.trim()
        this.getNoMaterialsSpuList();
    }

    //分页
    paginate(event, type) {
        if (type == 'selectSpuList') {
            this.filter.filter = false
            if (this.spus.length != 0) {
                this.filter.filter = true;
            }
            this.first = event.first;
            this.filter.pageNum = event.page + 1;
            this.filter.pageSize = event.rows;

            this.getNoMaterialsSpuList();
        } else {
            this.bomfirst = event.first;
            this.bomPage.pageNum = event.page + 1;
            this.bomPage.pageSize = event.rows;
            this.initBomFilter()
            if (this.isSpu) {
                this.service.getSpuList(encodeURIComponent(JSON.stringify(this.bomFilter)), '')
                    .then(data => {
                        this.isSpu = true
                        this.bomTotalRecords = data.totalElements;
                        this.bomList = data.content;
                    })
                    .catch(res => {
                        this.popupService.alert(res)
                    })
            } else {
                this.bomFilter['id'] = this.bomId;
                this.bomFilter['detail'] = true;
                this.service.getBomList(this.bomFilter)
                    .then(data => {
                        this.isSpu = false
                        this.bomTotalRecords = data.totalElements;
                        this.bomList = data.content;
                    })
                    .catch(res => {
                        this.popupService.alert(res)
                    })
            }

        }
    }

    //获取过滤原料spu列表
    getNoMaterialsSpuList() {

        this.spus.map(item => {
            this.spusIdList.push(item.id)
        })
        var spuIdString: string;

        this.service.getSpuList(JSON.stringify(this.filter), spuIdString)
            .then(data => {
                //this.selectSpuList = [];
                this.spuList = [];
                this.spuList = data.content;
                this.totalRecords = data.totalElements
            })
            .catch(res => {
                this.popupService.alert(res)
            })
    }

    //添加弹出层搜索
    onQuery(searchValue) {
        this.bomPage.pageNum = 1;
        this.bomfirst = 1;
        this.bomSearchKeyWord = searchValue.trim()
        if (this.isSpu) {
            this.initBomFilter()
            this.spu();
        } else {
            this.bom()
        }

    }

    //添加弹出层bom
    bom() {
        this.bomfirst = 1;
        this.currentSelectType = "bom"
        this.bomPage = {
            pageNum: 1,
            pageSize: 10,
        }
        this.bomFilter = {
            'pageSize': this.bomPage.pageSize,
            'pageNum': this.bomPage.pageNum,
            'searchKeyWord': this.bomSearchKeyWord,
            'detail': true,
            'id': this.bomId
        }
        this.service.getBomList(this.bomFilter)
            .then(data => {
                this.isSpu = false
                this.bomTotalRecords = data.totalElements;
                this.bomList = data.content;
            })
            .catch(res => {
                this.popupService.alert(res)
            })
    }

    //添加弹出层spu
    spu() {
        this.bomfirst = 1;
        this.currentSelectType = "spu"
        this.initBomFilter()

        this.service.getSpuList(encodeURIComponent(JSON.stringify(this.bomFilter)), '')
            .then(data => {
                this.isSpu = true
                this.bomTotalRecords = data.totalElements;
                this.bomList = data.content;
            })
            .catch(res => {
                this.popupService.alert(res)
            })
    }

    //数量
    quantity(rowData) {
        this.isShowQuantitySetting = true
        this.quantityNum = rowData.tmplInfo.bom.qty
        this.rowData = rowData
    }

    //设置产品属性
    setProductAttribute(rowData) {
        this.attrList = rowData.nameAndCodeList
        this.isShowSetProductAttribute = true
        this.SpuName = rowData.data.name
        this.rowData = rowData
        if (this.rowData.tmplInfo.attrs) {
            let key = ""
            this.spuAttrs = []
            for (key in this.rowData.tmplInfo.attrs) {
                let attr = {
                    'attrName': key,
                    'value': this.rowData.tmplInfo.attrs[key],
                    'tempValue': this.rowData.tmplInfo.attrs[key]
                }
                this.attrList.map(item => {
                    attr.tempValue = attr.tempValue.replace(new RegExp(item.code, 'g'), item.name)
                })
                this.spuAttrs.push(attr)
            }
        } else {
            if (!rowData.data.isBom) {
                rowData.data.spuAttrs.map(item => {
                    item["value"] = ""
                    item["tempValue"] = ""
                })
                this.spuAttrs = rowData.data.spuAttrs
            } else {
                rowData.data.spuResponses[0].spuAttrs.map(item => {
                    item["value"] = ""
                    item["tempValue"] = ""
                })
                this.spuAttrs = rowData.data.spuResponses[0].spuAttrs
            }

        }
    }

    //名称规则
    nameRule(rowData) {

        this.popupService.confirm({
            header: '修改名称规则',
            message: '修改可能会造成BOM不可用，你确定要修改吗',
            accept: () => {
                this.rowData = rowData
                this.tempNameInfo = rowData.tmplInfo.skuName
                this.isShowNameSetting = true
            }
        })

    }

    //编码规则
    codeRule(rowData) {
        this.popupService.confirm({
            header: '修改编码规则',
            message: '修改可能会造成BOM不可用，你确定要修改吗',
            accept: () => {
                this.rowData = rowData
                this.tempCodeInfo = rowData.tmplInfo.skuCode
                this.isShowCodeSetting = true
            }
        })

    }

    //数量、名称规则、编码规则确定
    setConfirm(type) {
        if (type == 'name') {
            if (this.tempNameInfo == "") {
                this.popupService.alert("名称规则不能为空")
                return
            }
            if (!this.rowData["tmplInfo"]) {
                this.rowData["tmplInfo"] = {}
            }
            this.rowData.tmplInfo['skuName'] = this.tempNameInfo
            this.isShowNameSetting = false
        } else if (type == 'code') {
            if (this.tempCodeInfo == "") {
                this.popupService.alert("编码规则不能为空")
                return
            }
            if (!this.rowData["tmplInfo"]) {
                this.rowData["tmplInfo"] = {}
            }
            this.rowData.tmplInfo['skuCode'] = this.tempCodeInfo
            this.isShowCodeSetting = false
        } else if (type == 'quantity') {
            this.isShowQuantitySetting = false
            if (!this.rowData["tmplInfo"]) {
                this.rowData["tmplInfo"] = {}
            }

            this.rowData.tmplInfo.bom.qty = this.quantityNum
        } else {
            let isSubmit = false;
            this.spuAttrs.every(item => {
                if (item.value == "") {
                    var errorString = ""
                    errorString = item.attrName + "为必填项"
                    this.popupService.alert(errorString)
                    isSubmit = true
                    return false
                } else {
                    isSubmit = false
                    return true
                }
            })
            if (isSubmit) {
                return;
            }

            this.isShowSetProductAttribute = false
            if (!this.rowData["tmplInfo"]) {
                this.rowData["tmplInfo"] = {}
            }
            if (!this.rowData.tmplInfo["attrs"]) {
                this.rowData.tmplInfo["attrs"] = {}
            }
            if (this.rowData.edit) {
                this.rowData.tmplInfo["attrs"] = {}

                this.spuAttrs.map(tempData => {
                    this.rowData.tmplInfo.attrs[tempData.attrName] = tempData.value
                })
            }
        }
    }

    //查看BOM结构
    lookBom(rowData) {
        this.service.checkSpuBomOrganization(rowData.data.id)
            .then(data => {
                this.bomOrganizationList = [];

                var recursion = function (data) {
                    data.map(item => {
                        if (item.subTmpl) {
                            if (item.subTmpl.spuResponses) {
                                item['data'] = item.subTmpl.spuResponses[0];
                                //item.tmplInfo.bom.qty = item.tmplInfo.bom.qty.substring(1,item.tmplInfo.bom.qty.length-1)
                                item.data['num'] = item.tmplInfo.bom.qty
                                item["expanded"] = true
                                item.data['type'] = item.data.firstLevel + '>' + item.data.secondLevel + '>' + item.data.thirdLevel;

                            }
                            if (item.subTmpl.child) {
                                item['children'] = item.subTmpl.child
                                recursion(item.subTmpl.child)
                            }
                        } else {
                            if (item.spuResponses) {
                                item['data'] = item.spuResponses[0];
                                //selectSpuitem.tmplInfo.bom.qty = item.tmplInfo.bom.qty.substring(1,item.tmplInfo.bom.qty.length-1)
                                item.data['num'] = item.tmplInfo.bom.qty
                                item["expanded"] = true
                                item.data['type'] = item.data.firstLevel + '>' + item.data.secondLevel + '>' + item.data.thirdLevel;
                            }
                            if (item.child) {
                                item['children'] = item.child
                                recursion(item.child)
                            }
                        }

                    })
                }
                if (!data.child) {
                    data['data'] = data.spuResponses[0];
                    data.data['type'] = data.data.firstLevel + '>' + data.data.secondLevel + '>' + data.data.thirdLevel;
                    data['children'] = []
                    data.tmplInfo.bom.qty = data.tmplInfo.bom.qty.substring(1, data.tmplInfo.bom.qty.length - 1)
                    data.data['num'] = data.tmplInfo.bom.qty
                    var tempData = []
                    tempData.push(data)
                    this.bomOrganizationList = tempData;
                } else {
                    var tempData = []
                    tempData.push(data)
                    recursion(tempData)
                    this.bomOrganizationList = tempData;
                }

                this.isShowBomOranizationDetail = true;
            })

    }

    /**
     * [onSubmit 提交]
     */
    public onSubmit(chargeCreateForm: any): void {


        if (!chargeCreateForm.form.valid) {
            return;
        }

        if (this.spus.length == 0) {
            this.popupService.alert("请至少选择一个spu")
            return
        }
        this.spusIdList = []
        this.spus.map(item => {
            this.spusIdList.push(item.id)
        })

        this.list[0].spuId = this.spusIdList.join(',');

        let clonedDataList = [];

        let that = this;
        let recursion = function (tempData, clonedList) {
            let isError = false;
            tempData.every(item => {
                let clonedItem = {...item};
                clonedList.push(clonedItem);
                if (clonedItem.data) {
                    clonedItem['comment'] = clonedItem.nameAndCodeList;
                    clonedItem['name'] = that.data.bomName;
                    clonedItem.tmplInfo.bom.measureName = clonedItem.data.measureName
                    if (clonedItem.data.isBom) {
                        clonedItem["subId"] = clonedItem.data.id
                    }
                    delete clonedItem.parent;
                }

                if (clonedItem.tmplInfo.bom.qty == "" && clonedItem.edit) {
                    that.popupService.alert("数量设置不能为空");
                    isError = true;
                    return false;
                } else if (!clonedItem.tmplInfo.attrs && clonedItem.edit) {
                    that.popupService.alert("属性设置为必填项")
                    isError = true;
                    return false;
                }

                if (clonedItem.children) {
                    clonedItem.child = [];
                    delete clonedItem.children;
                    if (recursion(item.children, clonedItem.child)) {
                        isError = true;
                        return false;
                    }
                } else {
                    clonedItem.child = null;
                }

                return true;
            });

            if (isError) {
                return true;
            } else {
                return false;
            }
        }
        if (recursion(this.list, clonedDataList)) {
            return;
        }

        if (this.isUpdate) {
            this.service.updateBom(clonedDataList[0])
                .then(() => {
                    this.location.back()
                })
                .catch(res => {
                    this.popupService.showError(res)
                })
        } else {
            let string = '';
            string = JSON.stringify(clonedDataList[0]);
            this.service.addSpuBom(clonedDataList[0])
                .then(() => {
                    this.location.back()
                })
                .catch(res => {
                    this.popupService.showError(res)
                })
        }
    }

    onCancel() {
        this.location.back()
    }
}
