import {Component,OnInit} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import {OrderSummary} from '../model/order-summary.model';

import { SellingService } from  '../selling-data.service'; 
import { PopupService } from 'core/services/popup.service';

import {OrderStatus} from '../model/order-status.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

@Component({
    selector:'selling-list',
    templateUrl:'./selling-list.component.html',
    styleUrls:['./selling-list.component.css']
})
export class SellingListComponent implements OnInit {

    private totalRecords : number  = 0;
    private query        : any  = {};
    private display      : boolean = false;
    private emptyMessage : string  = '没有记录';
    private orders     : Array<any> = [];
    private orderItems : Array<any> = [];
    private toolbarConfigs : Array<any> = [];
    private first : number = 0;
    private processDetail : BehaviorSubject<any> = new BehaviorSubject(null);
    /**
     * [view 视图]
     * all -->全部
     * producing    --> 生产中
     * stayDelivery --> 待出库
     * @type {string}
     */
    private view :string ='all';

    constructor(
        private router : Router,
        private route : ActivatedRoute,
        private popupService:PopupService,
        private service:SellingService){}

    ngOnInit(): void {
        this.toolbarConfigs = [
            {
                handler: this.getOrders.bind(this),
                type:'all'
            },
            {
                label:'生产中',
                handler: this.getProducingOrders.bind(this),
            },
            {
                label:'待出库',
                handler: this.getStayDelivery.bind(this),
            },
            {
                type: "search",
                handler: this.onQuery.bind(this),
                align: "right"
            },
            // {   
            //     label:'新建',
            //     handler:this.launch.bind(this),
            //     align: "right",
            //     icon:'glyphicon glyphicon-plus'
            // }, 
            {   
                label:'新建',
                handler:this.launchV3.bind(this),
                align: "right",
                icon:'glyphicon glyphicon-plus'
            },
        ];

        this.query = {
            searchKeyWord:'',
            pageNum:1,
            pageSize:10
        };

        this.setOrders();
    }

    /**
     * [start 新建销售订单2.0]
     */
    private start():void{
        this.router.navigateByUrl("main/process/start/tsgdslod");
    };


    /**
     * [launch 新增销售订单1.0]
     */
    private launch():void{
        this.router.navigateByUrl("main/process/launch/tsgdslod");
    };

    private launchV2():void{
        this.router.navigateByUrl("main/process/start2/tsgdslod");
    };

    private launchV3():void{
        this.router.navigateByUrl("main/business/selling/create");
    };

    /**
     * [proceed 按单收款]
     */
    private proceed(rowData):void{
        if(rowData.payStatus=='FINALPAYMENT' || rowData._status =='CANCEL' )return;
        //  window.localStorage.setItem('extra',JSON.stringify({
        //     transCode:rowData.transCode
        // }));
        

        // this.router.navigateByUrl("main/process/launch/tsmgcspd");



        let dynaParams:any = {};


        dynaParams.context = JSON.stringify({
            transCode:rowData.transCode
        });

        this.router.navigate(['main/process/start/tsmgcspd'],{
            queryParams: dynaParams,
        });
    }

    /**
     * [tracking 跟踪订单]
     * @param {any} row [行数据]
     */
    private tracking(row:any):void{
        this.router.navigate(['../following',row['transCode']],{relativeTo:this.route});
    };

    /**
     * [stockout 订单出库]
     * @param {any} row [行数据]
     */
    private stockout(row:any):void{

        if(row.status !='待出库'){
            return;
        }

    //     window.localStorage.setItem('extra',JSON.stringify({
    //         transCode:row.transCode
    //     }));

	//   this.router.navigateByUrl("main/process/launch/tssalsin");


        let dynaParams:any = {};


        dynaParams.context = JSON.stringify({
            transCode:row.transCode
        });

        this.router.navigate(['main/process/start/tssalsin'],{
            queryParams: dynaParams,
        });
    }

    /**
     * [onPage 列表分页]
     * @param {[type]} event [分页信息]
     */
    private onPage(event):void{

        this.first = event.first;
        this.query['pageNum']  = (event.first/event.rows)+1,
        this.query['pageSize'] = event.rows;

        this.setOrders();
    };


    /**
     * [onQuery 过滤查询]
     * @param {[sting]} event [查询关键字]
     */
    private onQuery(event):void{
        this.view = 'all';
        this.first = 0;
        this.query['searchKeyWord'] = event;
        this.setOrders();

    };


    /**
     * [setOrders 设置列表数据]
     */
    private setOrders():void{

        var funcName = '';

        switch (this.view) {
            case "stayDelivery ":
                funcName ='getStayDeliveryOders';
                break;
            case "producing":
                funcName = 'getProducingOrders';
                break;
            default:
                funcName = 'getOrders';
                break;
        }
        
        this.service[funcName](this.query)
            .then(data =>{
                this.totalRecords = data['totalElements'];
                this.orders = [...data['content']];
                for(let o of this.orders){
                    o._status = o.status;
                    o.status = OrderStatus[o.status];
                    o.createDate = o.createDate.substr(0,10);
                    o.deliveryDate = o.deliveryDate.substr(0,10);
                }
            }).catch(res => this.popupService.showError(res));

    };


    /**
     * [getProducingOrders 获取生产中的订单，点击工具栏【生产中】触发]
     */
    private getProducingOrders():void{
        this.view = 'producing';
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.setOrders();
    };

    /**
     * [getStayDelivery 获取待出库的订单，点击工具栏【待出库】触发]
     */
    private getStayDelivery():void{
        this.view = 'stayDelivery ';
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.setOrders();
    }; 

    /*
     * [getOrders 获取全部的订单，点击工具栏【全部】触发]
     */
    private getOrders(){
        this.view = 'Orders ';
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.setOrders();      
    }

    private toDetail(transCode:string){
        this.processDetail.next({"processCode":transCode,"transType":'tsgdslod'});
    }
}