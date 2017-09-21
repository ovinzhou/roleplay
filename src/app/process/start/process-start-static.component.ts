import {Component, Input, Output, Injector, AfterViewInit, AfterViewChecked, ViewChild, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ProcessService} from '../process.service';
import { DynamicFormSupport,DynamicFormDataSupport } from 'rp-dynamic-form/components/form/core/dynamic-form.support'
import {HttpClient} from "rp-dynamic-form/components/form/shared/http-client";
import {ProcessHttpClient} from '../process.httpclient';

import {ValidatorErrors} from "rp-dynamic-form/components/form/validator/validator.errors";


@Component(
    {
        selector:'process-start',
        templateUrl:'./process-start-static.component.html',
        providers:[
            {  provide: HttpClient, useClass: ProcessHttpClient },
        ]
    }
)
export class ProcessStartStaticComponent implements OnInit {
    constructor(private router : Router,
                private processService : ProcessService,
                private route:ActivatedRoute){
        this.bindedCellPhoneValidator = this.cellPhoneValidator.bind(this);
    }

    // 表单属性
    private formAttribute: any = {};

    // 外部主体
    private customerInfo: any = {};
    private userList: any[] = [];
    private customerSelectorVisible: boolean = false;
    private customerList: any;
    private customerAddrSelectorVisible: boolean = false;
    private customerAddrList: any;
    private bindedCellPhoneValidator : Function;
    // 交易明细
    private transDetails: any[] = [];
    private goodsListSelectorVisible: boolean =  false;

    // 综合
    private misc: any = {}; 

    processTypeId:string;

    ngOnInit(): void {
    	// 动态表单的初始化器的工作在这里完成：
    	this.userList = []; // TODO: 应从后台获取系统的用户列表
    }

    

    private onFormAction = (action) => {
        if (action.name == 'cancel') {
            //do nothing
            alert('user canceled');
            return;
        }

        //build the post body
        let dataToSave = {
            "transType": "trasnsold",
            "formData": {
            	"formAttribute" : this.formAttribute,
            	"customerInfo" : this.customerInfo,
            	"transDetails" : this.transDetails,
            	"misc" : this.misc
            }
        };

        let { url } = action;

        url = '/H_roleplay-si' + url;

        if (action.name == 'saveDraft') {
            console.log('final url', url);
            console.log('dataToSave', dataToSave);
            return;
        }

        if (action.name == 'submitForm') {
            console.log('final url', url);
            console.log('dataToSave', dataToSave);
            return;
        }
    }

    // 获取客户列表
    private showCustomerSelector($event) {
    	// this.customerSelectorVisible = true;
    	// this.customerList = {};
    }

    // 获取客户地址列表
    private showCustomerAddrSelector($event) {
    	// this.customerAddrSelectorVisible = true;
    	// this.customerAddrList = {} 
    }

    // 打开存货选择对话框
    private onOpenGridGoodsSelector(rowIndex) {

    }

    // 选中存货信息的某一行
    private onSelectGridGoods(rowIndex){
    	// 根据rowIndex设置cell的值
    }

    // 增加商品明细
    private addGoodsDetail() {
        this.transDetails.push({});
    }

    // 删除商品明细
    private removeGoodsDetail() {

    }

    // 校验手机号码，如果校验不通过，返回错误描述，如果校验通过，返回null
    private cellPhoneValidator(controller) {
        if(!controller || !controller.value){
            return null;
        }

        let pattern = /^0?(13|15|18|14|17)[0-9]{9}$/;
        if(pattern.test(controller.value)){
            return null;
        }else{
            return "请输入正确的手机号";
        }
    }

}