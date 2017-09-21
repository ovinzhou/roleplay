import { Component, OnInit,OnDestroy} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { inventoryList } from  '../mock/inventory-list';
import { BusinessDataService } from 'business/business-data.service'
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { UtilsService } from 'core/services/utils.service';
import { InventoryComponent } from "../inventory.component"

@Component({
  selector: 'financial-list',
  templateUrl: 'financial-list.component.html',
  styleUrls: ['financial-list.component.scss'],
})
export class FinancialListComponent implements OnInit, OnDestroy{

private emptyMessage   : string   = '没有记录';
  private inventoryList  : Array<any> = [];
  private totalRecords    : any;
  private query            : any;  
  private filter          : any;
  private data            : any;
  private balancenumber   : any;
  private balancemoney    : any;
  private occupancy       : any;
  private first           : number = 0;
  private searchKeyWord   : string = '';
  private toolbarConfigs  : any;
  //原币余额弹出层相关
  private isShowOrigAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number = 0;
  private detailFilter : any;
  private detailQuery : any;
  private moneyDetailList : any;
  private selectedDetailDatas : any [];
  private name : string = '';

  //账龄弹出层相关
  private isShowInvnAgingeDetail: boolean = false;
  private invnAgingeDetailList: any[];

  private searchSubscriber: any = null;
  
  //成本借方贷方弹出层相关
  private isShowAmoutDetail = false
  private amoutDetailList : any[]

  //账龄加权平均
  private qtyTbMatched : any;
  private sumAgingDays : any;
  private amntTbMatched : any;

  constructor(
    private router       : Router,
    private service      : BusinessDataService,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private inventoryComponent: InventoryComponent,
    private utilsService : UtilsService
    ){
        this.searchSubscriber = inventoryComponent.searchEventEmitter.subscribe((searchValue) => {
          if (this.router.isActive('main/business/inventory/financial',false)) {
            
             this.onQuery(searchValue);
          }
    })
  }

  ngOnInit(){
    this.titleService.setTitle('财务库存列表');
    this.inventoryList = []
    this.moneyDetailList = [];
    this.query = {
      pageNum:1,
      pageSize:10
    }
    this.detailQuery = {
      pageNum:1,
      pageSize:10
    }
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
    // data.content = data.content===null?[]:data.content;
    // let inventoryData = [];
    // data.content.forEach(item => {
    //   inventoryData.push({
    //     calcName          : item.calcName,
    //     containerName     : item.containerName,
    //     transObjName      : item.transObjName,
    //     skuClassify       : item.firstLevel+">"+item.secondLevel+">"+item.thirdLevel,
    //     measureunit       : item.measureunit,
    //     qtyTbMatched      : item.qtyTbMatched,
    //     qtyLocked         : item.qtyLocked,
    //     qtyAvailable      : item.qtyTbMatched-item.qtyLocked,
    //     amquantity        : item.amntLocked-item.amntTbMatched,
    //     invnAgingDays     : item.invnAgingDays
    //   })
    // })
    // this.inventoryList = inventoryData;

    data.content = data.content === null ? [] : data.content;
    let inventoryData = [];
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
        // amquantity        : item.amntLocked - item.amntTbMatched,
        amntTbMatched        : this.utilsService.formatNumber(item.amntTbMatched),
        invnAgingDays     : item.invnAgingDays
      })
    })
    this.inventoryList = inventoryData;
  }

  private initFilter(type):void{
    if(type == ''){
      this.filter = {
        pageNum : this.query.pageNum,
        pageSize : this.query.pageSize,
        searchKeyWord : this.searchKeyWord
      };
      if(this.query['orderItem']){
        this.filter['orderItem'] = this.query['orderItem'];
      }
    }else{
        this.detailFilter = {
        searchKeyWord : '',
        pageNum : this.detailQuery.pageNum,
        pageSize : this.detailQuery.pageSize,
        calcId : this.detailQuery['calcId'],
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailQuery['orderItem'];
      }
    }
  };

  public onSort(event,type):void{
    if(!type){
      this.query['orderItem'] = {
          columnName : event.field == 'skuClassify' ? 'firstLevel' : event.field,
          asc : event.order == '1' ? true : false
      }
      this.initFilter('');
      this.setInventory();
    }else{
      this.detailQuery['orderItem'] = {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initFilter('detail')
      this.getBalancemoneyDetailList();
    }
    
  };

  private paginate(event,type):void{
    if (!type) {
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('');
      this.setInventory();
    }else{
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.getBalancemoneyDetailList();
    }
  }

  //成本借方贷方详情
  amoutDetail(data){
    this.isShowAmoutDetail = true
  }

  private onBalancenumber(attr){
    this.balancenumber = true;
  }

  private onOccupancy(attr){
    this.occupancy = true;
  }

  //金额余额详情
  private onBalancemoneyDetail(rowData){

    this.detailFirst = 0;
    this.name = rowData.name;
    this.detailQuery['calcId'] = rowData['calcId'] ? rowData['calcId'] : '';
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.detailFirst = 0 ;
    this.initFilter('detail');
    this.getBalancemoneyDetailList();

  }

  //
  public getBalancemoneyDetailList(){
       
        this.service.getBalanceSconedList(this.detailFilter).then(data => {
        this.isShowOrigAmountDetail = true;
        data.content.forEach((dataItem) => {
          dataItem.name = this.name;  
          dataItem.qtyAugment = this.utilsService.formatNumber(dataItem.qtyAugment);
          dataItem.qtyReduce = this.utilsService.formatNumber(dataItem.qtyReduce);
          dataItem.qtyRemainder = this.utilsService.formatNumber(dataItem.qtyRemainder);
          dataItem.amountAugment = this.utilsService.formatNumber(dataItem.amountAugment);
          dataItem.amountReduce = this.utilsService.formatNumber(dataItem.amountReduce);
          dataItem.amountRemainder = this.utilsService.formatNumber(dataItem.amountRemainder);
        });
        this.detailTotalRecords = data.totalElements;
  
        this.moneyDetailList = data.content;

      }).catch(oError => {
        this.popupService.showError(oError);
      })
  }

  // 库龄明细
  private onInvnAgingeDetail(rowData){ 

    let params = {
      calcId : rowData.calcId,
      transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
      containerCode : rowData['containerCode'] ? rowData['containerCode'] : '',
      dealerCode : rowData['dealerCode'] ? rowData['dealerCode'] : ''
    };
    this.qtyTbMatched = rowData.qtyTbMatched
    this.sumAgingDays = rowData.invnAgingDays
    this.amntTbMatched = rowData.amntTbMatched

    this.service.getInvnAgingeDetailForStore(params).then(data => {
      this.isShowInvnAgingeDetail = true;
      data.forEach((dataItem) => {
        dataItem.containerName = rowData.containerName;
        dataItem.transObjName = rowData.transObjName;
        dataItem.measureunit = rowData.measureunit;
        dataItem.qtyTbMatched = dataItem.qtyTbMatched ? this.utilsService.formatNumber(dataItem.qtyTbMatched) : '';
        dataItem.amntTbMatched = dataItem.amntTbMatched ? this.utilsService.formatNumber(dataItem.amntTbMatched) : '';
      });
      this.invnAgingeDetailList = data;
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }  

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setInventory();
  }
}
