import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { PurchaseDataService } from "../purchase-data.service"

import { dataList } from './mock'
import { UtilsService } from 'core/services/utils.service'

@Component({
  selector   : 'purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls  : ['./purchase-order-list.component.scss'],
  providers : [ PurchaseDataService ]
})

export class PurchaseOrderListComponent implements OnInit {

  private filter          : any;
  private page            : any;  
  private orderList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private totalRecords    : number = 0;
  private first : number;

	constructor(
    private service : PurchaseDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilsService : UtilsService
  ){};

  ngOnInit(){
    this.titleService.setTitle('采购订单列表');
    this.toolbarConfigs = [
      {
          handler: this.onQuery.bind(this),
          type:'all'
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      },
      {   
          label:'删除',
          handler:this.deleteOrder.bind(this),
          align: "right",
          icon:'glyphicon glyphicon-minus'
      },
      {   
          label:'备品采购',
          handler:this.purchaseForStore.bind(this),
          align: "right",
          icon:'glyphicon glyphicon-plus'
      },  
      {   
          label:'按单采购',
          handler:this.purchaseForOrder.bind(this),
          align: "right",
          icon:'glyphicon glyphicon-plus'
      }
    ]
    this.query = {
      pageNum:1,
      pageSize:10
    }
    this.first = 0 ;
    this.orderList = [];

    this.initFilter();
    this.route.params.subscribe(() => {
       this.getPurchaseOrderList();
    });

  };

  // 备品采购
  public purchaseForStore(){
    this.router.navigate(['main/process/start/tsgdpsst']);
  }

  // 按单采购 
  public purchaseForOrder(){
    this.router.navigate(['main/process/start/tsgdpsod']);
  }

  public deleteOrder(){

  }

  /**
   * [onQuery 过滤查询]
   * @param {[type]} searchKeyWord [description]
   */
  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter();
    this.getPurchaseOrderList();
  }



  /**
   * [initFilter 初始化查询数据]
   */
  public initFilter(){
    this.filter = {
      searchKeyWord : this.searchKeyWord,
      pageNum : this.query.pageNum,
      pageSize : this.query.pageSize,
    };

    if(this.query['orderItem']){
      this.filter['orderItem'] = this.query['orderItem'];
    }
  }


  /**
   * [getPurchaseOrderList 获取列表数据]
   */
  public getPurchaseOrderList(){
    this.service.getOrderList(this.filter).then(data => {
      this.formatData(data);
    },error => {
      this.popupService.showError(error);
    });
  }

  /**
   * [formatData 格式化数据]
   * @param {[type]} data [description]
   */
  public formatData(data){
    this.totalRecords = data.totalElements;
    data.content = data.content === null?[]:data.content;
    // let orderList = [];
    data.content.forEach(item => {
      item.amount = this.utilsService.formatNumber(item.amount);
      item.hadPayAmount = this.utilsService.formatNumber(item.hadPayAmount);

    })
    this.orderList = data.content;
  }

  public onTsmgcspdDynamic(rowData){
    let dynaParams:any = {};

    dynaParams.context = JSON.stringify({
      customerId:rowData.customerId,
    });

    dynaParams.initData = JSON.stringify({
      'fgouty.fgenty003':rowData.name,
      'fgouty.fgenty002':rowData.customerId,
      'fgouty.fgenty001':rowData.customerId
    });

    this.router.navigate(['main/process/start/tsmgcspd'],{
      queryParams: dynaParams,
    });

  }
  
  /**
   * [onTsmgcspd 发起收款]
   * @param {[type]} rowData [description]
   */
  public onTsmgcspd(rowData){

    /**
     * [setItem 缓存数据]
     * @param {[Object]}'extra' [用于动态表单获取全局参数]
     * @param {[string]} rowData.customerId[业务数据,客户ID] 
     */
    window.localStorage.setItem('extra',JSON.stringify({
      customerId:rowData.customerId,
    }));
    
      window.localStorage.setItem('stuff',JSON.stringify({
      'fgouty.fgenty003':rowData.name,
      'fgouty.fgenty002':rowData.customerId,
      'fgouty.fgenty001':rowData.customerId
      }));
    
    this.router.navigateByUrl('main/process/launch/tsmgcspd');
  }

  /**
   * [onTsmgcspy 发起付款]
   * @param {[type]} rowData [description]
   */
  public onTsmgcspy(rowData){
   
    /**
     * [setItem 缓存数据]
     * @param {[Object]}'extra' [用于动态表单获取全局参数]
     * @param {[string]} rowData.customerId[业务数据,客户ID] 
     */
    window.localStorage.setItem('extra',JSON.stringify({
      customerId:rowData.customerId,
    }));
    
    this.router.navigateByUrl('main/process/launch/tsmgcspy');
  }

  
  /**
   * [paginate 分页]
   * @param {[type]} event [description]
   */
  public paginate(event,type){
    this.first = event.first;
    this.query.pageNum = event.page + 1;
    this.query.pageSize = event.rows;
    this.initFilter()
    this.getPurchaseOrderList();
  }

  /**
   * [onSort sort action]
   * @param {[object]} event [sorting info]
   */
  public onSort(event,type):void{
    this.query['orderItem'] = {
      columnName : event.field,
      asc : event.order == '1' ? true : false
    }
    this.initFilter();
    this.getPurchaseOrderList();
  }

  public showOrderDetail () {

  }

  public trackOrder(rowData) {
    this.router.navigateByUrl('main/business/purchase/following');
  }

  public inStore(rowData) {
    //tspcchin 、 purchaseOrderId
    let dynaParams:any = {};
    dynaParams.context = JSON.stringify({
      purchaseOrderId:rowData['transCode'],
    });
    // this.router.navigateByUrl('main/process/start/tspcchin');
    this.router.navigate(['main/process/start/tspcchin'],{
      queryParams: dynaParams
    });
  }

  public pay(rowData) {
    let dynaParams:any = {};

    dynaParams.context = JSON.stringify({
      purchaseOrderId:rowData['transCode']
    });

    this.router.navigate(['main/process/start/tspvdpmt'],{
      queryParams: dynaParams,
    });
  }
  //收款
  public receivables(rowData) {
    let dynaParams:any = {};

    dynaParams.context = JSON.stringify({
      purchaseOrderId:rowData['transCode']
    });

    this.router.navigate(['main/process/start/tspvdpcd'],{
      queryParams: dynaParams,
    });
  }

}
