import {Component, Input, Output, Injector, AfterViewInit, AfterViewChecked, ViewChild, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Location } from '@angular/common';
import {HttpClient} from "rp-dynamic-form/components/form/shared/http-client";
import {ProcessHttpClient} from 'process/process.httpclient';

import {ValidatorErrors} from "rp-dynamic-form/components/form/validator/validator.errors";

import { SellingService } from 'business/selling/selling-data.service';
import { ProcessService } from 'process/process.service';
import { PopupService } from 'core/services/popup.service';


import { FormAttribute } from  'business/selling/model/formAttribute.model';
import { Customer } from 'business/selling/model/customer.model';
import { PlanItem } from 'business/selling/model/planItem.model';
import { OrderItem } from 'business/selling/model/orderItem.model';
import { SaleOrder } from 'business/selling/model/saleOrder.model';

import { Query } from 'business/selling/model/query.model';
import { BASE_URL } from 'core/constants/global-setting';
import { AddressType } from 'business/selling/model/address-type.model';




@Component({
	selector:'selling-create',
    templateUrl:'./selling-create.component.html',
    styleUrls:['./selling-create.component.css'],
    providers:[
        {  provide: HttpClient, useClass: ProcessHttpClient },
    ]
})

export class SellingCreateComponent implements OnInit {

    constructor(private router   : Router,
                private location : Location,
                private route    : ActivatedRoute,
                private service  : SellingService,
                private popupService:PopupService,
                private processService :ProcessService,
                ){
        this.saleOrder.items = [];
    }

    private en            : any;

    private saleOrder     : SaleOrder         = new SaleOrder();
    private orderItems    : Array<OrderItem>  = [];
    private attachments   : Array<any>        = [];
    private options       : Array<string>     = [];
    private decision      : string            = '';
    private taskId        : string            = '';
    private importErrorUrl: string            = '';
    private formReadonly  : boolean           = false;
    private processStatus : string            = '';

    private selectedOrderItems: Array<OrderItem> = [];
    private currentFocusOrderItem : OrderItem;

    private orderItemsAmountTotal : number = 0;
    private orderItemsQtyTotal    : number = 0;
    private innerCtnTotal         : number = 0;
    private outerCtnTotal         : number = 0;

    //下拉框数据源
    private userList :Array<any> = [];
    private roleList :Array<any> = [];
    private orgList  :Array<any> = [];
    private currencyList : Array<any> = [];

    //选择器数据源
    private customerList        : Object = {};
    private customerAddrList    : Object = {};
    private addrContactList     : Object = {};
    private itemList            : Object = {};
    private innerBoxList        : Object = {};
    private outerBoxList        : Object = {};

    //选择器选中数据
    private selectedCustomer    : Object = {};
    private selectedCustomerAddr: Object = {};
    private selectedAddrContact : Object = {};
    private selectedItems       : Array<OrderItem> = [];
    private selectedInnerBox    : Object = {};
    private selectedOuterBox    : Object = {};

    //选择器显示控制
    private customerSelectorVisible     : boolean     = false;
    private customerAddrSelectorVisible : boolean     = false;
    private addrContactSelectorVisible  : boolean     = false;  
    private itemListSelectorVisible     : boolean     = false;
    private importErrorModalVisible     : boolean     = false;
    private innerBoxListSelectorVisible : boolean     = false;
    private outerBoxListSelectorVisible : boolean     = false;


    //选择器工具栏配置
    private customerSelectorToolbarConfig     : any;
    private customerAddrSelectorToolbarConfig : any;
    private addrContactSelectorToolbarConfig  : any;
    private ItemSelectorToolbarConfig         : any;
    private innerBoxSelectorToolbarConfig     : any;
    private outerBoxSelectorToolbarConfig     : any;

    //选择器列表总记录数
    private customerListTotalRecords     : number = 0;
    private customerAddrListTotalRecords : number = 0;
    private addrContactListTotalRecords  : number = 0;
    private itemListTotalRecords         : number = 0;
    private innerBoxListTotalRecords     : number = 0;
    private outerBoxListTotalRecords     : number = 0;

    //选择器列表fist
    private customerListFirst            : number = 0;
    private customerAddrListFirst        : number = 0;
    private addrContactListFirst         : number = 0;
    private itemListFirst                : number = 0;
    private innerBoxListFirst            : number = 0;
    private outerBoxListFirst            : number = 0;

    //选择器查询过滤信息
    private customerListQuery      : Query  = new Query();
    private customerAddrListQuery  : Query  = new Query();
    private addrContactListQuery   : Query  = new Query();
    private itemListQuery          : Query  = new Query();
    private innerBoxListQuery      : Query  = new Query();
    private outerBoxListQuery      : Query  = new Query();

    private emptyMessage           : string = '暂无记录';




    ngOnInit(): void {

         this.en = {
            firstDayOfWeek: 0,
            dayNames: ["日", "一", "二", "三", "四", "五", "六"],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月" ],
            monthNamesShort: [ "一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月" ]
        };

        this.customerSelectorToolbarConfig = [
            {type: "search",handler: this.onQueryCustomerList.bind(this),align: "right"}
        ];

        this.customerAddrSelectorToolbarConfig = [
            {type: "search",handler: this.onQueryCustomerAddrList.bind(this),align: "right"}
        ];

        this.addrContactSelectorToolbarConfig = [
            {type: "search",handler: this.onQueryAddrContactList.bind(this),align: "right"}
        ];

        this.ItemSelectorToolbarConfig = [
            {type: "search",handler: this.onQueryItemList.bind(this),align: "right"}
        ];

        this.innerBoxSelectorToolbarConfig = [
            {type: "search",handler: this.onQueryInnerBoxList.bind(this),align: "right"}
        ];

        this.outerBoxSelectorToolbarConfig = [
            {type: "search",handler: this.onQueryOuterBoxList.bind(this),align: "right"}
        ];

        this.saleOrder.items = [];
        this.attachments.push({});


        //初始化经办人
        this.inItUser();

        this.route.params.subscribe(params => {
            if(params['id']){
                this.formReadonly = true;
                this.taskId = params['id'];
                this.setSaleOrer(this.taskId);
                this.processStatus = this.route.snapshot.queryParams['processStatus'];

            }else{

                this.saleOrder.currency ='CNY';
                this.saleOrder.exchangeRate =1;
                this.saleOrder.taxRate = 0;
                this.saleOrder.taxAmount =0;
                this.setOptions();
            }

            var tempOrderId = this.route.snapshot.queryParams['tempOrderId'];

            if(tempOrderId){
                
                this.processService.getTempOrderForm('tsgdslod',tempOrderId)
                    .then(data =>{
                        var itemBridges = JSON.parse(data.formData).itemBridges;
                        console.log(itemBridges);
                        itemBridges.map(i =>{

                            var orderItem = new OrderItem();

                            orderItem.name = i.item.name;
                            orderItem.code = i.item.code;
                            orderItem.qty  = i.qty;
                            orderItem.spuCode = i.item.spuName;
                            orderItem.measuringUnit = i.item.measureunitCode;
                            orderItem.measuringUnitName = i.item.measureName;

                            orderItem.outerCarton = i.carton.outerCarton;
                            orderItem.outerCode = i.carton.outerCode;
                            orderItem.outerCtn = i.carton.outerCtn;
                            orderItem.outerQty = i.carton.outerQty;
                            orderItem.outerSize = i.carton.outerSize;

                            if(i.item.skuFiles){
                                if(i.item.skuFiles.length>0){
                                    orderItem.img = BASE_URL+ i.item.skuFiles[0];
                                }
                            }

                            if(i.item.attrs){
                                i.item.attrs.map(a =>{
                                    switch (a.name) {
                                        case "外盒颜色":
                                            orderItem.boxColor = a.value;
                                            break;
                                        
                                        case "内顶颜色":
                                            orderItem.topColor = a.value;
                                            break;
                                        case "内芯颜色":
                                            orderItem.coreColor = a.value;
                                            break;
                                    }
                                });
                            };

                            this.orderItems.push(orderItem);
                        });

                        this.bizNumberCalc();
                    }).catch(res =>this.popupService.showError(res));
            }
        });

        
    }



    /**
     * 初始化经办人数据
     */
    private inItUser():void{
        var curUserId = window.localStorage.getItem('userId');
        this.service.getUsers()
            .then(users =>{
                users.map(u =>this.userList.push({value:u.id,label:u.nickName}))
                this.saleOrder.handler = curUserId;
                this.userChange();
            })
            .catch(res => this.popupService.showError(res));
    };

    /**
     *  选择经办人
     */
    private userChange():void{

        //组织
        this.service.getUserOrgByUserId(this.saleOrder.handler)
            .then(orgs => {
                this.orgList = [];
                orgs.map(o =>this.orgList.push({value:o.id,label:o.name}));
            })
            .catch(res => this.popupService.showError(res));

        //角色
        this.service.getUserRelesByUserId(this.saleOrder.handler)
            .then(roles =>{
                this.roleList = [];
               roles.map(r =>this.roleList.push({value:r.id,label:r.name}));
            })
            .catch(res => this.popupService.showError(res));


        //如果选择后的用户不属于任何组织
        if(this.orgList.length === 0){
            this.saleOrder.handlerOrg = '';
        }else{
            this.saleOrder.handlerOrg= this.orgList[0].id;
        }


        //如果选择后的用户没有任何角色
        if(this.roleList.length === 0){
            this.saleOrder.handlerRole = '';
        }else{
            this.saleOrder.handlerRole = this.roleList[0].id;
        }
    };


    /**
     * 客户选择器
     */
    private showCustomerSelector(event):void{
        if(this.formReadonly){
            return;
        }
        this.customerListQuery = new Query();
        this.customerListFirst = 0;
        this.setCustomerList();
    };


    /**
     * 客户选择器-->确定
     */
    private onSelectedCustomer():void{

        //给客户信息赋值
        this.saleOrder.customerId = this.selectedCustomer['id'];
        this.saleOrder.customerName = this.selectedCustomer['name'];
        this.customerSelectorVisible = false;

        //级联信息变更
        //客户地址相关
        this.saleOrder.customerAddrId = '';
        this.saleOrder.customerAddrName = '';
        this.selectedCustomerAddr = undefined;

        //地址联系人相关
        this.saleOrder.contactId = '';
        this.saleOrder.contactName = '';
        this.saleOrder.mobile = '';
        this.selectedAddrContact = undefined;
    };

    /**
     * 客户选择器-->双击行
     * @param {type} event 
     */
    private onCustomerRowDblclick(event):void{
        this.saleOrder.customerId = this.selectedCustomer['id'];
        this.saleOrder.customerName = this.selectedCustomer['name'];
        this.customerSelectorVisible = false;

        //级联信息变更
        //客户地址相关
        this.saleOrder.customerAddrId = '';
        this.saleOrder.customerAddrName = '';
        this.selectedCustomerAddr = undefined;

        //地址联系人相关
        this.saleOrder.contactId = '';
        this.saleOrder.contactName = '';
        this.saleOrder.mobile = '';
        this.selectedAddrContact = undefined;
    };

    
    /**
     * 客户数据分页
     * @param {type} event 分页信息
     */
    private onCustomerListPage(event):void{

        this.customerListFirst = event.first;
        this.customerListQuery.pageNum  = (event.first/event.rows)+1;
        this.customerListQuery.pageSize = event.rows;

        this.setCustomerList();
    };

    /**
     *  过滤客户信息
     * @param {string} searchKeyWord
     */
    private onQueryCustomerList(searchKeyWord:string):void{

        this.customerListQuery.searchKeyWord = searchKeyWord === undefined?'':searchKeyWord;
        this.setCustomerList();
    };


    /**
     * 客户地址选择器
     */
    private showCustomerAddrSelector():void{

        if(this.formReadonly){
            return;
        }

        if(!this.saleOrder.customerId){
            this.popupService.alert('您好,请先选择客户!');
            return;
        }

        this.customerAddrListQuery = new Query();
        this.customerListFirst = 0;
        this.setCustomerAddrList();
    };


    /**
     * 客户地址选择器-->确定
     */
    private onSelectedCustomerAddr():void{
        
        if(!this.selectedCustomerAddr){
            this.popupService.alert('您好!请选择客户地址!');
            return;
        }

        this.saleOrder.customerAddrId = this.selectedCustomerAddr['id'];
        this.saleOrder.customerAddrName = this.selectedCustomerAddr['content'];

        this.saleOrder.contactId ='';
        this.saleOrder.contactName = '';
        this.saleOrder.mobile ='';
        this.customerAddrSelectorVisible = false;
    };

    /**
     * [onCustomerAddrRowDblclick 客户地址选择器 -->双击行数据]
     */
    private onCustomerAddrRowDblclick():void{
        this.saleOrder.customerAddrId = this.selectedCustomerAddr['id'];
        this.saleOrder.customerAddrName = this.selectedCustomerAddr['content'];

        this.saleOrder.contactId ='';
        this.saleOrder.contactName = '';
        this.saleOrder.mobile ='';
        this.customerAddrSelectorVisible = false;
    };

    /**
     * 过滤地址信息
     * @param {string} searchKeyWord 
     */
    private onQueryCustomerAddrList(searchKeyWord:string):void{
        this.customerAddrListQuery.searchKeyWord = searchKeyWord===undefined?'':searchKeyWord;
        this.setCustomerAddrList();
    };

    /**
     *  客户地址数据分页
     * @param {any} event 分页信息
     */
    private onCustomerAddrListPage(event):void{

        this.customerAddrListFirst = event.first;
        this.customerAddrListQuery.pageNum  = (event.first/event.rows)+1;
        this.customerAddrListQuery.pageSize = event.rows;

        this.setCustomerAddrList();
    };

    /**
     *  地址联系人选择器
     */
    private showAddrContactSelector():void{

        if(this.formReadonly){
            return;
        }

        if(!this.saleOrder.customerAddrId){
            this.popupService.alert('您好,请先选择客户地址!');
            return;
        }

        this.setAddrContactList();
    };


    /**
     * 联系人选择器 -->确定
     */
    private onSelectedAddrContact():void{

        if(!this.selectedAddrContact){
            this.popupService.alert('您好!请选择联系人!');
            return;
        }

        this.saleOrder.contactId = this.selectedAddrContact['id'];
        this.saleOrder.contactName = this.selectedAddrContact['name'];
        this.saleOrder.mobile = this.selectedAddrContact['mobile'];
        this.addrContactSelectorVisible = false;
    };

    /**
     * 联系人选择器 --->双击行
     */
    private onAddrContactRowDblClick():void{

        this.saleOrder.contactId = this.selectedAddrContact['id'];
        this.saleOrder.contactName = this.selectedAddrContact['name'];
        this.saleOrder.mobile = this.selectedAddrContact['mobile'];
        this.addrContactSelectorVisible = false;
    };

    /**
     * 过滤联系人信息
     * @param {string} searchKeyWord
     */
    private onQueryAddrContactList(searchKeyWord:string):void{
        this.addrContactListQuery.searchKeyWord = searchKeyWord===undefined?'':searchKeyWord;
        this.setAddrContactList();
    };


    /**
     * 客户地址数据分页
     * @param {any} event 分页信息
     */
    private onAddrContactListPage(event):void{

        this.addrContactListFirst = event.first;
        this.addrContactListQuery.pageNum  = (event.first/event.rows)+1;
        this.addrContactListQuery.pageSize = event.rows;

        this.setAddrContactList();
    };

    /**
     * 添加明细
     */
    private addOrderItem() {
        this.setItemList();
    };

    /**
     * 删除明细
     */
    private removeOrderItem():void{

        this.selectedOrderItems.map(s =>{
            //明细项列表数据过滤
            this.orderItems = this.orderItems.filter(o =>{return o.code != s.code});
            //明细项选中数据过滤
            this.selectedOrderItems = this.selectedOrderItems.filter(o => {return o.code != s.code});
            //明细项选择器数据过滤
            this.selectedItems = this.selectedItems.filter(o =>  {return o.code != s.code});
        });

        this.bizNumberCalc();
    };

    /**
     * 导入按钮单击
     * @param {any} event 当前点击元素
     */
    private importButtonClick(event):void{
        event.target.value = '';
    };

    /**
     * 导入明细
     * @param {any} event 
     */
    private importOrderItem(event):void{

        var isExit = function (o,orderItems) {
            var exit = false;
            orderItems.map(i =>{
                if(i.code === o.code){
                    exit = true;
                    return;
                }
            });
            return exit;
        };

        if(event.target.files.length === 0){
            return;
        }

        let formData   = new FormData();
        formData.append('file', event.target.files[0]);

        this.service.importOrderItem(formData)
            .then(data =>{
                if(data.taskId){
                    this.importErrorUrl = BASE_URL+'/foundation/import/order/'+data.taskId;
                    this.importErrorModalVisible = true;
                }else{

                    if(!data.result){
                        return;
                    }

                    data.result.map(i =>{

                        i.addingmode = 'import';
                        i.code = i.skuDto.code;
                        i.name = i.skuDto.name;
                        i.innerCode = i.inner;
                        i.innerCarton =i.innerName;

                        i.outerCode = i.outer;
                        i.outerCarton = i.outerName;
                        i.outerCtn = i.packageNum;

                        if(i.skuDto.skuFiles){
                            if(i.skuDto.skuFiles.length>0){
                                i.img = BASE_URL + i.skuDto.skuFiles[0];
                            }
                        }


                        if(!isExit(i,this.orderItems)){
                            this.orderItems.push(i);
                        }
                    });

                    this.bizNumberCalc();
                }
            })
            .catch(res => this.popupService.showError(res));
    };



    /**
     * 物料选择器
     * @param {any} event 
     */
    private showItemSelector(event):void{

        if(this.formReadonly){
            return;
        }

        this.setItemList();
    };


    /**
     * 物料选择器 -->确定
     */
    private onSelectedItems():void{

        var isExit = function (o,orderItems) {
            var exit = false;
            orderItems.map(i =>{
                if(i.code === o.code){
                    exit = true;
                    return;
                }
            });
            return exit;
        };

        this.selectedItems.map(o =>{
           if(!isExit(o,this.orderItems)){

                o.addingmode = 'selector';
                
                o['skuAttrs'].map(a =>{
                    switch (a.name) {
                        case "外盒颜色":
                        o.boxColor = a.value.value;
                            break;
                        case "内顶颜色":
                        o.topColor = a.value.value;
                            break;
                        case "内芯颜色":
                        o.coreColor = a.value.value;
                            break;
                    }
                });

                if(o['files']){
                    if(o['files'].length>0){
                        o.img = BASE_URL +o['files'][0]['path'];
                    }
                }

                this.orderItems.push(o);
           }
        });

        this.itemListSelectorVisible = false;
    };

    /**
     * 查询sku
     * @param {string} searchKeyWord 
     */
    private onQueryItemList(searchKeyWord:string):void{
        this.itemListQuery.searchKeyWord = searchKeyWord===undefined?'':searchKeyWord;
        this.setItemList();
    };

    /**
     * 物料数据分页
     * @param {any} event 分页信息
     */
    private onItemListPage(event):void{

        this.itemListFirst = event.first;
        this.itemListQuery.pageNum  = (event.first/event.rows)+1;
        this.itemListQuery.pageSize = event.rows;

        this.setItemList();
    };


    /**
     * 内箱选择器
     * @param {OrderItem} item 当前焦点数据
     */
    private onShowInnerBoxListSelector(item:OrderItem):void{
        this.currentFocusOrderItem = item;

        if(this.currentFocusOrderItem.addingmode ==='import' || this.formReadonly){
            return;
        }

        this.setInnerBoxList();
    };

    /**
     * 内箱选择器 --->确定
     */
    private onSelectedInnerBox():void{
        this.currentFocusOrderItem.innerCode = this.selectedInnerBox['code'];
        this.currentFocusOrderItem.innerCarton = this.selectedInnerBox['name'];

        this.innerBoxListSelectorVisible = false;

        if(this.selectedInnerBox['skuAttrs']){
            this.selectedInnerBox['skuAttrs'].map(a =>{
                if(a.name === '尺寸'){
                    this.currentFocusOrderItem.innerSize = a.value.value;
                }

                if(a.name === '装箱量'){
                    this.currentFocusOrderItem.innerQty = a.value.value;
                }

            });
        }
    };

    /**
     * 内箱选择器 双击行
     * @param {any} event 行数据信息
     */
    private onInnerBoxRowDblclick(event):void{
        this.currentFocusOrderItem.innerCode = this.selectedInnerBox['code'];
        this.currentFocusOrderItem.innerCarton = this.selectedInnerBox['name'];
        this.innerBoxListSelectorVisible = false;

        if(this.selectedInnerBox['skuAttrs']){
            this.selectedInnerBox['skuAttrs'].map(a =>{
                if(a.name === '尺寸'){
                    this.currentFocusOrderItem.innerSize = a.value.value;
                }

                if(a.name === '装箱量'){
                    this.currentFocusOrderItem.innerQty = a.value.value;
                }
            });
        }
    };


    /**
     * 过滤内箱选择器数据
     * @param {string} searchKeyWord 过滤信息
     */
    private onQueryInnerBoxList(searchKeyWord:string):void{
        this.innerBoxListQuery.searchKeyWord = searchKeyWord===undefined?'':searchKeyWord;
        this.setInnerBoxList();
    };

    /**
     * 内箱选择器分页
     * @param {any} event 分页信息
     */
    private onInnerBoxListPage(event):void{
        this.innerBoxListFirst = event.first;
        this.innerBoxListQuery.pageNum  = (event.first/event.rows)+1;
        this.innerBoxListQuery.pageSize = event.rows;

        this.setInnerBoxList();
    };



    /**
     * 外箱选择器
     * @param {OrderItem} item 明细项当前焦点数据
     */
    private onShowOuterBoxListSelector(item:OrderItem):void{
        this.currentFocusOrderItem = item;

        if(this.currentFocusOrderItem.addingmode ==='import' || this.formReadonly){
            return;
        }

        this.setOuterBoxList();
    };

    /**
     * 外箱选择器 --->确定
     */
    private onSelectedOuterBox():void{
        this.currentFocusOrderItem.outerCode = this.selectedOuterBox['code'];
        this.currentFocusOrderItem.outerCarton = this.selectedOuterBox['name'];
        this.outerBoxListSelectorVisible = false;

         if(this.selectedOuterBox['skuAttrs']){
            this.selectedOuterBox['skuAttrs'].map(a =>{
                if(a.name === '尺寸'){
                    this.currentFocusOrderItem.outerSize = a.value.value;
                }

                if(a.name === '装箱量'){
                    this.currentFocusOrderItem.outerQty = a.value.value;
                }
            });
        }
    };

    /**
     * 外箱选择器 双击行
     * @param {any} event 行数据信息
     */
    private onOuterBoxRowDblclick(event):void{
        this.currentFocusOrderItem.outerCode = this.selectedOuterBox['code'];
        this.currentFocusOrderItem.outerCarton = this.selectedOuterBox['name'];
        this.outerBoxListSelectorVisible = false;

        if(this.selectedOuterBox['skuAttrs']){
            this.selectedOuterBox['skuAttrs'].map(a =>{
                if(a.name === '尺寸'){
                    this.currentFocusOrderItem.outerSize = a.value.value;
                }

                if(a.name === '装箱量'){
                    this.currentFocusOrderItem.outerQty = a.value.value;
                }
            });
        }
    };


    /**
     * 过滤外箱选择器数据
     * @param {string} searchKeyWord 过滤信息
     */
    private onQueryOuterBoxList(searchKeyWord:string):void{
        this.outerBoxListQuery.searchKeyWord = searchKeyWord===undefined?'':searchKeyWord;
        this.setOuterBoxList();
    };

    /**
     * 内箱选择器分页
     * @param {any} event 分页信息
     */
    private onOuterBoxListPage(event):void{
        this.outerBoxListFirst = event.first;
        this.outerBoxListQuery.pageNum  = (event.first/event.rows)+1;
        this.outerBoxListQuery.pageSize = event.rows;

        this.setOuterBoxList();
    };


    /**
     * 业务数据计算
     */
    private bizNumberCalc():void{

        if(this.saleOrder.exchangeRate<=0){
            this.saleOrder.exchangeRate =1;
            this.popupService.alert('您好,汇率必须大于0哦!');
        }

        if(this.saleOrder.taxRate >=1 || this.saleOrder.taxRate<0){
            this.saleOrder.taxRate = 0;
            this.popupService.alert('您好,税率必须大于等于0小于1哦!');
        }

        this.saleOrder.taxAmount = 0;

        //明细金额汇总
        this.orderItemsAmountTotal = 0;
        //明细数量汇总
        this.orderItemsQtyTotal = 0;
        //内箱数汇总
        this.innerCtnTotal = 0;
        //外箱数汇总
        this.outerCtnTotal = 0;

        this.orderItems.map(item =>{


            item.taxRate      = this.saleOrder.taxRate;
            item.exchangeRate = this.saleOrder.exchangeRate;
            item.currency     = this.saleOrder.currency;

            if(item.qty){
                this.orderItemsQtyTotal += item.qty;
            }

            if(item.innerCtn){
                this.innerCtnTotal += item.innerCtn;
            }

            if(item.outerCtn){
                this.outerCtnTotal += item.outerCtn;
            }

            if(item.qty === undefined || item.price === undefined){
                return;
            }

            if(item.price.toString().split('.').length>=2){
                if(item.price.toString().split('.')[1].length>6){
                    item.price = parseFloat(item.price.toFixed(6));
                }
            }

            item.originalCurrencyAmount = parseFloat((item.qty * item.price).toFixed(2));
            item.amount =  parseFloat((item.originalCurrencyAmount * item.exchangeRate).toFixed(2));
            item.taxAmount = item.amount * item.taxRate/(1+item.taxRate);

            this.saleOrder.taxAmount += item.taxAmount;

            this.orderItemsAmountTotal += item.originalCurrencyAmount;

        });

        this.saleOrder.taxAmount = parseFloat(this.saleOrder.taxAmount.toFixed(2));
    };

    /**
     * 添加附件
     */
    private addAttachment():void{
        this.attachments.push({});
    };

    /**
     * [removeAttachment 删除附件]
     * @param {[type]} index [索引]
     */
    private removeAttachment(index):void{
        
        if(this.attachments.length === 1){
            return;
        }
        
        this.attachments.splice(index,1);
    };


    /**
     * 表单操作
     * @param {string} option 操作类型
     * submit 提交
     * draft 保存草稿
     * cancel 取消
     * approve 同意
     * disapprove 不同意
     */
    private formAction(option:string):void{



        this.orderItems.map(o =>{
            o.exchangeRate = this.saleOrder.exchangeRate;
            o.currency = this.saleOrder.currency;
        });

        if(this.saleOrder.transCode){
            this.saleOrder.transCode = this.saleOrder.transCode.trim();
        }

       if(this.saleOrder.deliveryDate){
           this.saleOrder.deliveryDate = new Date(this.saleOrder.deliveryDate);
           var year= '',month='',day = '';
           year = this.saleOrder.deliveryDate.getFullYear();
           month = this.saleOrder.deliveryDate.getMonth()+1;
           day = this.saleOrder.deliveryDate.getDate();


           this.saleOrder.deliveryDate  = year+'-'+(month.toString().length==1?'0'+month:month)+'-'+(day.toString().length==1?'0'+day:day);
       }

        //订单明细
        this.saleOrder.items = this.orderItems;

        switch (option) {
            case "submit":

                if(!this.formValidator()){return;}

                this.service.uniqueTransCode(this.saleOrder.transCode)
                    .then(data =>{
                        if(data !=null && this.processStatus ==''){
                            this.popupService.alert('您好!订单号重复了!');
                        }else{
                            this.processService.submit('tsgdslod',this.taskId,this.saleOrder)
                                .then(data =>this.location.back())
                                .catch(res => this.popupService.showError(res));
                        }
                    })
                    .catch(res => this.popupService.showError(res));
                break;
            case "draft":
                this.processService.draft('tsgdslod',this.taskId,this.saleOrder)
                    .then(data =>this.location.back())
                    .catch(res => this.popupService.showError(res));
                break;
            case "approve":
                var that =this;
                this.popupService.prompt({
                    header:'审批意见',
                    accept:function (value) {
                        that.approve(value);
                    }
                });
                break;
            case "disapprove":
                var that =this;
                this.popupService.prompt({
                    header:'审批意见',
                    accept:function (value) {
                        that.disapprove(value);
                    }
                });
                break;
            default:
                this.location.back();
                break;
        }
    };

    /**
     * 同意
     */
    private approve(decision:string):void{
        this.processService.approve(this.taskId,{"decision": decision})
            .then(data =>{
                this.location.back();    
            })
            .catch(res => this.popupService.showError(res));
    };

    /**
     * 不同意
     */
    private disapprove(decision:string):void{
        this.processService.disapprove(this.taskId,{"decision": this.decision})
        .then(data =>{
            this.location.back();
        })
        .catch(res => this.popupService.showError(res));
    };

    /**
     * 设置客户选择器列表数据
     */
    private setCustomerList():void{
        this.service.getCustomers(this.customerListQuery)
            .then(customers =>{
                this.customerList = customers;
                this.customerListTotalRecords = customers.totalElements;
                this.customerSelectorVisible = true;
            })
            .catch(res => this.popupService.showError(res)); 
    };


    /**
     * 设置客户地址选择器数据
     */
    private setCustomerAddrList():void{
        this.service.getCustomerAddrsByCustomerId(this.saleOrder.customerId,this.customerAddrListQuery)
            .then(addrs=>{
                this.customerAddrList = addrs;
                this.customerAddrListTotalRecords = addrs.totalElements;
                this.customerAddrSelectorVisible  = true;
                this.customerAddrList['content'].map(a =>{
                    if(a.type){
                        a.type = AddressType[a.type];
                    }
                   
                });
            })
            .catch(res =>this.popupService.showError(res));
    };

    /**
     * 设置联系人地址选择器数据
     */
    private setAddrContactList():void{
        this.service.getCustomerContactsByAddrId(this.saleOrder.customerAddrId,this.addrContactListQuery)
            .then(contacts =>{
                this.addrContactList = contacts;
                this.addrContactListTotalRecords = contacts.totalElements;
                this.addrContactSelectorVisible = true;
            })
            .catch(res => this.popupService.showError(res));
    };


    /**
     * 设置物料选择器数据
     */
    private setItemList():void{
        this.service.getSkus(this.itemListQuery)
            .then(items =>{
                this.itemList = items;
                this.itemListTotalRecords = items.totalElements;
                this.itemListSelectorVisible = true;

                //回显数据
                this.selectedItems = [];
                this.itemList['content'].map(i =>{

                    i.measuringUnitName = i.measureName;
                    i.measuringUnit = i.measureCode;
                    this.orderItems.map(o =>{
                        if(i.code === o.code)
                            this.selectedItems.push(i);
                    });


                       
                });


            })
            .catch(res => this.popupService.showError(res));
    };

    /**
     * 设置内箱选择器数据
     */
    public setInnerBoxList():void{
        this.service.getSkusByType('内箱',this.innerBoxListQuery)
            .then(skus =>{
                this.innerBoxList = skus;
                this.innerBoxListTotalRecords = skus.totalElements;
                this.innerBoxListSelectorVisible = true;

                this.innerBoxList['content'].map(i =>{
                    if(this.currentFocusOrderItem.innerCode === i.code){
                        this.selectedInnerBox = i;
                    }else{
                        this.selectedInnerBox = {};
                    }
                });
            })
            .catch(res =>this.popupService.showError(res));
    };

    /**
     * 设置外箱选择器数据
     */
    public setOuterBoxList():void{
        this.service.getSkusByType('外箱',this.outerBoxListQuery)
            .then(skus =>{
                this.outerBoxList = skus;
                this.outerBoxListTotalRecords = skus.totalElements;
                this.outerBoxListSelectorVisible = true;

                this.outerBoxList['content'].map(i =>{
                    if(this.currentFocusOrderItem.outerCode === i.code){
                        this.selectedOuterBox = i;
                    }else{
                        this.selectedOuterBox = {};
                    }
                })
            })
            .catch(res =>this.popupService.showError(res));
    };


    /**
     * [setOptions 设置表单操作按钮]
     */
    private setOptions():void{
        this.processService.start('tsgdslod','')
            .then(data =>{
                this.options = JSON.parse(data.formConfiguration).optionType.split(',');

            })
            .catch(res => this.popupService.showError(res));
    };


    /**
     * [setSaleOrer 设置表单数据]
     * @param {string} taskId [description]
     */
    private setSaleOrer(taskId:string):void{
        this.processService.doTask(taskId).then(data =>{

        //表单数据
        this.saleOrder = JSON.parse(data.formData);

        //操作按钮配置
        this.options   = JSON.parse(data.formConfiguration).optionType.split(',');


        for(var i = 0;i<this.options.length; i++){
            if(this.options[i] === "submit"){
                this.formReadonly = false;
            }
        }

        //设置订单明细数据
        this.orderItems = this.saleOrder.items;

        //交付时间转换
        //因为JSON.parse转换之后的时间是个字符串,再渲染到控件的时候,会出现问题
        //所以在此处作了处理
        if(this.saleOrder.deliveryDate){
            this.saleOrder.deliveryDate = new Date(this.saleOrder.deliveryDate);
        }

        if(this.saleOrder.effectTime){

            this.saleOrder.effectTime = new Date(this.saleOrder.effectTime);
        }

        //通过经办人加载经办组织，经办角色数据，并且复制
        if(this.saleOrder.handler){
            this.userChange();
        }

        this.bizNumberCalc();
    })
    .catch(res =>this.popupService.showError(res));
    };


    /**
     * 表单校验
     * @return {boolean} 校验通过或者不通过
     */
    private formValidator():boolean{

        var orderItemPriceValidator = true,orderItemQtyValidator=true;


        if(!this.saleOrder.transCode){
            this.popupService.alert("您好,请填写订单号!");
            return false;
        }

        if(!this.saleOrder.handler){
            this.popupService.alert("您好,请选择经办人!");
            return false;
        }

        if(!this.saleOrder.customerName){
            this.popupService.alert("您好,请选择客户!");
            return false;
        }

        if(!this.saleOrder.deliveryDate){
            this.popupService.alert("您好,请选择交付日期!");
            return false;
        }

        this.orderItems.map(i =>{
            if(!i.price){
                orderItemPriceValidator = false;
            }

            if(!i.qty){
                orderItemQtyValidator = false;
            }
        });

        if(!orderItemPriceValidator){
            this.popupService.alert("您好,订单明细单价必须填写哦!");
            return false;
        }

        if(!orderItemQtyValidator){
            this.popupService.alert("您好,订单明细数量必须填写哦!");
            return false;
        }

        return true;

    };

    private exportPdf(language:string):void{
        this.orderItems.map(o =>{
            o.exchangeRate = this.saleOrder.exchangeRate;
            o.currency = this.saleOrder.currency;
        });

        if(this.saleOrder.transCode){
            this.saleOrder.transCode = this.saleOrder.transCode.trim();
        }

       if(this.saleOrder.deliveryDate){
           this.saleOrder.deliveryDate = new Date(this.saleOrder.deliveryDate);
           var year= '',month='',day = '';
           year = this.saleOrder.deliveryDate.getFullYear();
           month = this.saleOrder.deliveryDate.getMonth()+1;
           day = this.saleOrder.deliveryDate.getDate();


           this.saleOrder.deliveryDate  = year+'-'+(month.toString().length==1?'0'+month:month)+'-'+(day.toString().length==1?'0'+day:day);
       }

        //订单明细
        this.saleOrder.items = this.orderItems;
        this.service.exportPdf(this.saleOrder,language)
            .then(data => {
                var element = document.createElement("a");
                element.href = window.localStorage.getItem("baseUrl")+data.resultUrl;
                element.download = "orders";
                element.click();
                element.remove();
                document.getElementById("sale_order_dropdown-menu").style['display'] ='none';
            })
            .catch(error => this.popupService.showError(error));
    }

    private exportExcel(language:string):void{
        this.orderItems.map(o =>{
            o.exchangeRate = this.saleOrder.exchangeRate;
            o.currency = this.saleOrder.currency;
        });

        if(this.saleOrder.transCode){
            this.saleOrder.transCode = this.saleOrder.transCode.trim();
        }

       if(this.saleOrder.deliveryDate){
           this.saleOrder.deliveryDate = new Date(this.saleOrder.deliveryDate);
           var year= '',month='',day = '';
           year = this.saleOrder.deliveryDate.getFullYear();
           month = this.saleOrder.deliveryDate.getMonth()+1;
           day = this.saleOrder.deliveryDate.getDate();


           this.saleOrder.deliveryDate  = year+'-'+(month.toString().length==1?'0'+month:month)+'-'+(day.toString().length==1?'0'+day:day);
       }

        //订单明细
        this.saleOrder.items = this.orderItems;
        this.service.exportExcel(this.saleOrder,language)
            .then(data => {
                var element = document.createElement("a");
                element.href = window.localStorage.getItem("baseUrl")+data.resultUrl;
                element.download = "orders";
                element.click();
                element.remove();
                document.getElementById("sale_order_dropdown-menu").style['display'] ='none';
            })
            .catch(error => this.popupService.showError(error));
    };



    private exporting():void{
        var buttonStatus = document.getElementById("sale_order_dropdown-menu").style['display'];
        if(buttonStatus==='none' || buttonStatus===''){
            document.getElementById("sale_order_dropdown-menu").style['display'] ='block';
        }else{
            document.getElementById("sale_order_dropdown-menu").style['display'] ='none';
        }
    };
}