import { Component,OnInit,ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PurchaseDataService } from  '../purchase-data.service'; 
import { PopupService } from 'core/services/popup.service';
// import { TraceStatus } from '../model/trace-status.model';

@Component({
    selector:'purchase-following',
    templateUrl:'./following.component.html',
    styleUrls:['./following.component.scss'],
})

export class FollowingComponent implements OnInit {

  private progressInfo      : Object = {};
  private activeConfig      : Object = {};
  private emptyMessage      : string = '没有数据';
  private collectionList    : any = [];
  private collection_balance: any;
  private sellout_balance   : any;
  private data              : any;
 	private id                : any;
  private wip_total         : any;
  private order_total       : any;
  private printer           : boolean = false;

	constructor(
		private el           : ElementRef,
		private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private service      : PurchaseDataService){}

	ngOnInit(){

    this.activeConfig = {
      collectionActive:true,
      wipActive:false,
      selloutActive:false,
      invoiceActive:false,
      returnoutActive:false
    }

    this.progressInfo = {
      collectionProgress:10,
      wipProgress:0,
      selloutProgress:0,
      invoiceProgress:0,
      returnoutProgress:0
    }

    this.data = {};

    this.route.params.subscribe(params => {
      // this.setOrderTrace(params);
    })
	}

  public onActive(key:string){
    for(var k in this.activeConfig){
      this.activeConfig[k] = false;
    }
    this.activeConfig[key] = true;
  };

  //初始化收款list
  public onCollection():void{

    var collectionAmount = 0;
    this.collectionList  = [];

    this.data.proceeds.forEach(item => {
      this.collectionList.push({
        transCode:item.transCode,
        // processInstanceState:TraceStatus[item.processInstanceState],
        items:[item]
      });
      collectionAmount += item.amount;
    })

    //计算收款余额
    this.collection_balance = this.data.amount - collectionAmount;

    //计算进度
    this.progressInfo['collectionProgress'] = collectionAmount / this.data['amount'] * 100;
    this.progressInfo['collectionProgress'] = this.progressInfo['collectionProgress'] <= 100 ? parseInt(this.progressInfo['collectionProgress']) : 100;
  }

  //初始化完工入库list  
  public onWip():void{

    this.wip_total = 0;
    this.order_total = 0;

    this.data.acceptances.forEach(item => {
      this.wip_total   += item.finishedQty;
      this.order_total += item.qty;
    })
    if(this.order_total === 0){
      this.progressInfo['wipProgress'] = 0;
    }else{
      this.progressInfo['wipProgress'] = this.wip_total / this.order_total * 100;
    }
  }

  // 销售出库
  public onSellout():void{

    var collectionAmount = 0;
    var totalamount = 0;

    this.data.solds.forEach(item => {  

      item.totalQty = 0; 
      item.totalCartonQty = 0;
      item.totalWeight = 0;
      item.totalAmount = 0;

      // item.status =  TraceStatus[item.processInstanceState];

      item.items.map(i =>{
        item.totalQty += i.qty;
        item.totalCartonQty += i.cartonQty;
        item.totalWeight   += i.weight;
        item.totalAmount += i.amount;
        if(item.status === '已生效'){
          totalamount += i.amount;
        }
      });   
      collectionAmount += item.totalAmount;
    })
    this.progressInfo['selloutProgress'] = totalamount / this.data['amount'] * 100;
    this.progressInfo['selloutProgress'] = parseInt(this.progressInfo['selloutProgress']);
    this.sellout_balance = this.data.amount - collectionAmount; 
  }

  // 发票
  public onInvoice():void{
  }

  // 退货入库
  public onReturnout():void{
  }

  // public setOrderTrace(params){

  //   this.id = params['id'];
  //   this.service.getOrderTrace(this.id).then(data => {

  //     data.deliveryDate = data.deliveryDate.substring(0,10);
  //     data.createDate  = data.createDate.substring(0,10);
  //     this.data = data;
  //     this.setCashFlow();
  //     this.onCollection();
  //     this.onWip();
  //     this.onSellout();

  //   }).catch(oError => this.popupService.showError(oError))    
  // }


  // public setCashFlow(){
  //   this.service.getCashFlow()
  //     .then(cashFlowList =>{
  //       this.data.proceeds.map(i=>{
  //         cashFlowList.map(c =>{
  //           if(i.type === c.id){
  //             i.cashFlowName = c.name;
  //             return;
  //           }
  //         })
  //       });
  //     })
  //   .catch(res =>this.popupService.showError(res));
  // }
  public print(){
    this.printer = true;
  }
}