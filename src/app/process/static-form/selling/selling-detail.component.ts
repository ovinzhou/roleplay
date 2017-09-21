import {Component, Input, Output, Injector, AfterViewInit, AfterViewChecked, ViewChild, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Location } from '@angular/common';
import { DynamicFormSupport,DynamicFormDataSupport } from 'rp-dynamic-form/components/form/core/dynamic-form.support'
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Component({
	selector:'selling-detail',
    templateUrl:'./selling-detail.component.html',
    styleUrls:['./selling-detail.component.css'],
    providers:[
        {  provide: HttpClient, useClass: ProcessHttpClient },
    ]
})

export class SellingDetailComponent implements OnInit {

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
    @Input() 
    processCode : string = '';

    
    @Input() 
    processInfo : BehaviorSubject<any>;

    private saleOrder     : SaleOrder         = new SaleOrder();
    private orderItems    : Array<OrderItem>  = [];
    private attachments   : Array<any>        = [];
    private formReadonly  : boolean           = true;
    //下拉框数据源
    private userList :Array<any> = [];
    private roleList :Array<any> = [];
    private orgList  :Array<any> = [];
    private currencyList : Array<any> = [];

    private orderItemsAmountTotal : number = 0;
    private orderItemsQtyTotal    : number = 0;
    private innerCtnTotal         : number = 0;
    private outerCtnTotal         : number = 0;





    ngOnInit(): void {

        this.attachments.push({});
        //初始化经办人
        this.inItUser();


        //设置币种数据
        this.setCurrency();

        this.processInfo.subscribe(p=>{
            this.setSaleOrer();
        })

        
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
     * [setCurrency 设置币种数据]
     */
    private setCurrency():void{
        this.processService.getCurrency()
            .then(currencies=>{
                currencies.map(c =>{
                    this.currencyList.push({value:c.id,label:c.value});
                });
            })
            .catch(res =>this.popupService.showError(res));
    };




    /**
     * 设置表单数据
     */
    private setSaleOrer():void{

        this.processService.getFormByProcessCode(window.localStorage.processCode).then(data =>{

        //表单数据
        this.saleOrder = JSON.parse(data.formData);

        //设置订单明细数据
        this.orderItems = this.saleOrder.items;

        //明细金额汇总
        this.orderItemsAmountTotal = 0;
        //明细数量汇总
        this.orderItemsQtyTotal = 0;
        //内箱数汇总
        this.innerCtnTotal = 0;
        //外箱数汇总
        this.outerCtnTotal = 0;

        this.orderItems.map(i =>{
            if(i.originalCurrencyAmount){
                this.orderItemsAmountTotal += i.originalCurrencyAmount;
            }

            if(i.qty){
                this.orderItemsQtyTotal += i.qty;
            }

            if(i.innerCtn){
                this.innerCtnTotal += i.innerCtn;
            }

            if(i.outerCtn){
                this.outerCtnTotal += i.outerCtn;
            }
        })

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
    })
    .catch(res =>this.popupService.showError(res));
    };

}