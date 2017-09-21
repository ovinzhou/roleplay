import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { SellingService } from  '../selling-data.service'; 
import { PopupService } from 'core/services/popup.service';
import { TraceStatus } from '../model/trace-status.model';

@Component({
    selector:'order-following',
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
  private wip_total_num     : any;
  private order_total       : any;
  private printer           : boolean = false;
  private numberlist        : any;

  private curOutStoragePritData : any;

	constructor(
		private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private service      : SellingService){}

	ngOnInit(){
    this.activeConfig = {
      collectionActive:true,
      wipActive:false,
      selloutActive:false,
      invoiceActive:false,
      returnoutActive:false
    }

    this.progressInfo = {
      collectionProgress:0,
      wipProgress:0,
      selloutProgress:0,
      invoiceProgress:0,
      returnoutProgress:0
    }

    this.data = {};

    this.route.params.subscribe(params => {
      this.setOrderTrace(params);
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

    var effectTotalAmount = 0;
    var collectionAmount = 0;
    this.collectionList  = [];

    this.data.proceeds.forEach(item => {
      this.collectionList.push({
        transCode:item.transCode,
        processInstanceState:TraceStatus[item.processInstanceState],
        items:[item]
      });
      collectionAmount += item.amount;
      if(item.processInstanceState === 'FINISHED'){
        effectTotalAmount += item.amount;
      }
    })

    //计算收款余额
    this.collection_balance = this.data.originalCurrencyAmount - collectionAmount;
    this.collection_balance = this.collection_balance.toFixed(2);

    this.data.effectTotalAmount = effectTotalAmount;


    //计算进度
    this.progressInfo['collectionProgress'] = effectTotalAmount / this.data['amount'] * 100;
    this.progressInfo['collectionProgress'] = this.progressInfo['collectionProgress'] <= 100 ? parseInt(this.progressInfo['collectionProgress']) : 100;
  }

  //初始化完工入库list  
  public onWip():void{



    this.wip_total = 0;
    this.order_total = 0;
    this.wip_total_num= 0;




    this.data.acceptances.forEach(item => {
      this.order_total += item.orderQty;
      this.wip_total_num += item.finishedQty;


      if(item.finishedQty>item.orderQty){

        this.wip_total += item.orderQty;
      }else{
        this.wip_total +=item.finishedQty;
      }

    })
    
    if(this.order_total === 0){
      this.progressInfo['wipProgress'] = 0;
    }else{
      this.progressInfo['wipProgress'] = (this.wip_total/this.order_total)*100;
      this.progressInfo['wipProgress'] = parseInt(this.progressInfo['wipProgress']);
      this.progressInfo['wipProgress'] = this.progressInfo['wipProgress'] <= 100 ? parseInt(this.progressInfo['wipProgress']) : 100;
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

      item.status =  TraceStatus[item.processInstanceState];

      item.items.map(i =>{
        item.totalQty += i.qty;
        item.totalCartonQty += i.cartonQty;
        item.totalWeight   += i.weight;
        item.totalAmount += i.amount;

        if(item.status === '已生效'){
          totalamount += i.amount;
        }
      });   
      //保留两位小数
      item.totalQty       = item.totalQty       ? item.totalQty.toFixed(2)       : 0 ;
      item.totalCartonQty = item.totalCartonQty ? item.totalCartonQty.toFixed(2) : 0 ;
      item.totalWeight    = item.totalWeight    ? item.totalWeight.toFixed(2)    : 0 ;
      item.totalAmount    = item.totalAmount    ? item.totalAmount.toFixed(2)    : 0 ;
      collectionAmount   += item.totalAmount;//合计金额
    })
    this.progressInfo['selloutProgress'] = totalamount / this.data['amount'] * 100;
    this.progressInfo['selloutProgress'] = parseInt(this.progressInfo['selloutProgress']);
    this.progressInfo['selloutProgress'] = this.progressInfo['selloutProgress'] <= 100 ? parseInt(this.progressInfo['selloutProgress']) : 100;
    // 保留两位小数
    this.sellout_balance = (this.data.originalCurrencyAmount - collectionAmount).toFixed(2);
  }

  // 发票
  public onInvoice():void{
  }

  // 退货入库
  public onReturnout():void{
  }

  public setOrderTrace(params){

    this.id = params['id'];
    this.service.getOrderTrace(this.id).then(data => {

      data.deliveryDate = data.deliveryDate.substring(0,10);
      data.createDate  = data.createDate.substring(0,10);
      this.data = data;
      this.setCashFlow();
      this.onCollection();
      this.onWip();
      this.onSellout();

    }).catch(oError => this.popupService.showError(oError))    
  }


  public setCashFlow(){
    this.service.getCashFlow()
      .then(cashFlowList =>{
        this.data.proceeds.map(i=>{
          cashFlowList.map(c =>{
            if(i.type === c.id){
              i.cashFlowName = c.name;
              return;
            }
          })
        });
      })
    .catch(res =>this.popupService.showError(res));
  }
  public print(sold){
    this.printer = true;
    this.curOutStoragePritData = sold.items;

    this.curOutStoragePritData.map(i =>{
      i.boxItems = [{qty:'',num:''}];
      i.transCode = this.data.transCode;
    });
  }

  public printes(printData){

    var boxInputs = document.getElementsByName('boxInputs');
    var boxLabels = document.getElementsByName('boxLabel');

    for(var i = 0;i< boxInputs.length; i++){
      boxInputs[i].style['display'] ='none';
      boxLabels[i].style['display'] ='block';
    }
    
    var f = document.createElement('iframe');
    document.body.appendChild(f);

  
    window.frames[0].document.body.innerHTML =  document.getElementById("printData").innerHTML;
    window.frames[0].print();

    for(var i = 0;i< boxInputs.length; i++){
      boxInputs[i].style['display'] ='block';
      boxLabels[i].style['display'] ='none';
    }

    f.remove();
  }


  public calcPackingTotal(){
    this.data.packingTotal = 0;
    this.curOutStoragePritData.map(a =>{
      if(!a.boxItems){
        return;
      }

      a.boxItems.map(b =>{
        if(b.num && b.qty){
          this.data.packingTotal += b.num;
        }
      });
    });
  };

  public onBox(order){
    
    if(!order['boxItems']){
      order['boxItems'] = [{qty:'',num:''}];
    }else{
      order['boxItems'].push({qty:'',num:''});
    }
  }

  public onCancel(){
    this.printer = false;
  }

  public onClose(order,i){
    order['boxItems'].splice(i,1);
    this.calcPackingTotal();
  }


  /**
   * 去收款
   */
  private goCollect(){

    let dynaParams:any = {};


    dynaParams.context = JSON.stringify({
        transCode:this.data.transCode
    });

    this.router.navigate(['main/process/start/tsmgcspd'],{
        queryParams: dynaParams,
    });
  }

  /**
   * 去出库
   */
  private checkOut(){


    let dynaParams:any = {};


        dynaParams.context = JSON.stringify({
            transCode:this.data.transCode
        });

        this.router.navigate(['main/process/start/tssalsin'],{
            queryParams: dynaParams,
        });
  }
}