import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { BusinessDataService } from 'business/business-data.service'
import { PopupService } from 'core/services/popup.service';
//primeng
import { SortMeta,DialogModule } from 'primeng/primeng';
import { Title } from '@angular/platform-browser';
import { dataList } from 'business/inventory/mock/data-list'
import { UtilsService } from 'core/services/utils.service';
import { InventoryComponent } from "../inventory.component"

@Component({
  selector: 'inventory-list',
  templateUrl: 'inventory-list.component.html',
  styleUrls: ['inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit,OnDestroy {

  private emptyMessage    : string   = '没有记录';
  private inventoryList   : Array<any> = [];
  private totalRecords    : any;
  private query           : any;  
  private filter          : any;
  private data            : any;
  private qtyTbMatched    : any;
  private occupied        : any;
  private numbalance      : any;
  private orderItems      : any;
  private display         : boolean = false;
  private toolbarConfigs  : any;
  private first           : number = 0;
  private isShowInvnAgingeDetail: boolean = false;
  private invnAgingeDetailList: any[];
  private searchKeyWord : string = '';

  private isShowInvnQtyFlow:boolean  = false;
  private qtyflowList : any[];
  private invnQtyFlowTotalRecords: number;
  private invnQtyFlowQuery: any;

  //数量余额弹出层相关
  private isShowNumAmountDetail : boolean = false;
  private numAmountDetailTotalRecords : number = 0;
  private numAmountDetailFirst : number = 0;
  private numAmountDetailFilter : any;
  private numAmountDetailQuery : any;
  private numAmountDetailList : any;
  private numAmountSelectedDetailDatas : any [];
  private name : string = '';

  private searchSubscriber: any = null;

  //数量增加较少弹出层相关
  private isShowNumDetail : boolean = false
  private numDetailList : any[]

  //库龄弹出层相关
  private sumOrigAmount : number = 0
  private sumAgingDays : string = ""

	constructor(
		private router       : Router,
    private service      : BusinessDataService,
		private route        : ActivatedRoute,
    private popupService : PopupService,
    private inventoryComponent: InventoryComponent,
    private titleService : Title,
    private utilsService : UtilsService)
  {
    this.searchSubscriber = inventoryComponent.searchEventEmitter.subscribe((searchValue) => {
      if (this.router.isActive('main/business/inventory/list',false)) {
        this.onQuery(searchValue);
      }
    })
  }

  ngOnInit(){
    this.titleService.setTitle('仓库库存列表');
    this.inventoryList = []
    this.query = {
      pageNum:1,
      pageSize:10
    };
    this.numAmountDetailQuery = {
      pageNum:1,
      pageSize:10,
      orderItem:{
        columnName : 'effectiveTime',
        asc : true 
      }
    }
    this.invnQtyFlowQuery = {
      pageNum:1,
      pageSize:10
    };
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
    ]
    this.initFilter('');
    this.route.params.subscribe(()=>{
      this.orderItems = dataList.data;
      this.setInventory();
    })
  }

  ngOnDestroy(){
    if(this.searchSubscriber){
      this.searchSubscriber.unsubscribe();
    }
  }

  private setInventory(){
    this.service.getInventory(this.filter)
    .then(data=>{
      this.formatData(data);
      this.totalRecords = data.totalElements;
    })
  }

  private formatData(data){
    data.content = data.content === null ? [] : data.content;
    let inventoryData = [];
    this.totalRecords = data.totalElements;
    data.content.forEach(item => {
      inventoryData.push({
        calcName          : item.calcName,
        containerName     : item.containerName,
        transObjName      : item.transObjName,
        transObjCode      : item.transObjCode,
        containerCode     : item.containerCode,
        dealerCode        : item.dealerCode,
        calcId            : item.calcId,
        skuClassify       : item.firstLevel+">"+item.secondLevel+">"+item.thirdLevel,
        measureunit       : item.measureunit,
        // 容量
        // capacity          : item.volume, 
        qtyTbMatched      : this.utilsService.formatNumber(item.qtyTbMatched),
        qtyLocked         : this.utilsService.formatNumber(item.qtyLocked),
        qtyAvailable      : this.utilsService.formatNumber(item.qtyTbMatched - item.qtyLocked),
        oldLibrary        : item.oldLibrary,
        invnAgingDays     : item.invnAgingDays
      })
    })
    this.inventoryList = inventoryData;
  }

  private initFilter(type):void{
    if (type == '') {
      this.filter = {
      pageNum : this.query.pageNum,
      pageSize : this.query.pageSize,
      searchKeyWord : this.searchKeyWord,
    };
      if(this.query['orderItem']){
        this.filter['orderItem'] = this.query['orderItem'];
      }
    }else{
      this.numAmountDetailFilter = {
        searchKeyWord : '',
        pageNum : this.numAmountDetailQuery.pageNum,
        pageSize : this.numAmountDetailQuery.pageSize,
        calcId : this.numAmountDetailQuery['calcId'],
        transObjCode : this.numAmountDetailQuery['transObjCode'],
        containerCode : this.numAmountDetailQuery['containerCode'],
        dealerCode : this.numAmountDetailQuery['dealerCode'],
      };

      if(this.numAmountDetailQuery['orderItem']){
        this.numAmountDetailFilter['orderItem'] = this.numAmountDetailQuery['orderItem'];
      }
    }
    
  };


  numDetail(data){
    this.isShowNumDetail = true
  }

  public onSort(event,type):void{
    if(!type){
       this.query['orderItem'] = {
        columnName : event.field == 'skuClassify' ? 'firstLevel' : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initFilter('');
      this.setInventory();
    }else{
      this.numAmountDetailQuery['orderItem'] = {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initFilter('detail');
      this.getnumAmountDetailList();
    }
  };

  private paginate(event,type):void{
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('');
      this.setInventory();    
    }else{
      this.numAmountDetailQuery.pageNum = event.page + 1;
      this.numAmountDetailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.getnumAmountDetailList();
    }
  }

  // 库龄明细
  private onInvnAgingeDetail(rowData){
    console.log(rowData) 
    this.sumAgingDays = rowData.invnAgingDays
    
    let params = {
      calcId : rowData.calcId,
      transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
      containerCode : rowData['containerCode'] ? rowData['containerCode'] : '',
      dealerCode : rowData['dealerCode'] ? rowData['dealerCode'] : ''
    };

    this.service.getInvnAgingeDetailForStore(params).then(data => {
      this.isShowInvnAgingeDetail = true;
      this.sumOrigAmount = 0;
      this.sumOrigAmount = rowData.qtyTbMatched;
      data.forEach((dataItem) => {
        dataItem.containerName = rowData.containerName;
        dataItem.transObjName = rowData.transObjName;
        dataItem.measureunit = rowData.measureunit;
        dataItem.qtyTbMatched = this.utilsService.formatNumber(dataItem.qtyTbMatched);
      });
      this.invnAgingeDetailList = data;
    }).catch(oError => {
      this.popupService.showError(oError);
    })
    
  }

  // 占用数量
  private onOccupy(data){
    this.occupied = true;
  }


  // 获取数量流水余额
  private onShowQtyflow(rowData) {

    this.numAmountDetailFirst = 0;
    this.name = rowData.employeeName;
    this.numAmountDetailQuery['calcId'] = rowData['calcId'] ? rowData['calcId'] : '';
    this.numAmountDetailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.numAmountDetailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.numAmountDetailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    
     this.initFilter('detail');
     this.getnumAmountDetailList();
  }

  public getnumAmountDetailList(){
    console.log(this.numAmountDetailFilter)
    this.service.getBalanceSconedList(this.numAmountDetailFilter).then(data => {
        this.isShowNumAmountDetail = true;
        data.content.forEach((dataItem) => {
          dataItem.name = this.name;
          dataItem.qtyAugment = this.utilsService.formatNumber(dataItem.qtyAugment);
          dataItem.qtyReduce = this.utilsService.formatNumber(dataItem.qtyReduce);
          dataItem.qtyRemainder = this.utilsService.formatNumber(dataItem.qtyRemainder);
        });
        this.numAmountDetailTotalRecords = data.totalElements;
        this.numAmountDetailList = data.content;

      }).catch(oError => {
        this.popupService.showError(oError);
      })
  }

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    this.initFilter('');
    this.setInventory();
  }

}
