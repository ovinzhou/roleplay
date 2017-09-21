import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { inventoryList } from  '../mock/inventory-list';
import { BusinessDataService } from 'business/business-data.service'
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { UtilsService } from 'core/services/utils.service';
import { InventoryComponent } from "../inventory.component"

@Component({
  selector: 'balance-ages',
  templateUrl: 'balance-ages.component.html',
  styleUrls: ['balance-ages.component.scss'],
})
export class BalanceAgesComponent implements OnInit,OnDestroy {

  private emptyMessage   : string   = '没有记录';
  private dataList  : Array<any> = [];
  private totalRecords    : any;
  private query           : any;  
  private filter          : any;
  private data            : any;
  private balancenumber   : any;
  private balancemoney    : any;
  private occupancy       : any;
  private transObjCode    : string;
  private transCode       : string;
  private first           : number = 0;
  private toolbarConfigs  : any;
  private searchKeyWord   : string = '';
  //账龄弹出层相关
  private agingDaysList      : any;
  private agingDaysDetailList      : any;
  private isShowAgingDays: boolean = false;
  private isShowAgingDaysDetail: boolean = false;

  //数量详情弹出层相关
  private isShowNumMoneyDetail: boolean = false;
  private numMoneyDetailList : any;

  private searchSubscriber: any = null;

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
    private utilsService : UtilsService){
      this.searchSubscriber = inventoryComponent.searchEventEmitter.subscribe((searchValue) => {
        if (this.router.isActive('main/business/inventory/balanceages',false)) {
          this.onQuery(searchValue);
        }
    })
  }

  ngOnInit(){
    this.titleService.setTitle('物料账龄');
    this.dataList = [];
    this.numMoneyDetailList = [];
    this.query = {
      pageNum:1,
      pageSize:10
    };
    this.initFilter('');
    this.route.params.subscribe(()=>{
      this.getBalanceAges();
    })
  }

  ngOnDestroy(){
    if(this.searchSubscriber){
      this.searchSubscriber.unsubscribe();
    }
  }

  private getBalanceAges(){
    this.service.getBalanceAgesInStore(this.filter)
    .then(data=>{
      this.formatData(data);
      this.totalRecords = data.totalElements;
    })
  }

  private formatData(data){
    // let tempList = [];

    // data.content = data.content === null ? [] : data.content;
    // data.content.forEach(item => {
    //   tempList.push({
    //     transObjCode      : item.transObjCode,
    //     transObjName      : item.transObjName,
    //     skuClassify       : item.firstLevel+">"+item.secondLevel+">"+item.thirdLevel,
    //     measureunit       : item.measureunit,
    //     qtyTbMatched      : item.qtyTbMatched,
    //     amntTbMatched     : item.amntTbMatched,
    //     agingDays        : item.agingDays
    //   })
    // });

    if(data.content){
      data.content.forEach( item => {
        item.skuClassify = item.firstLevel+">"+item.secondLevel+">"+item.thirdLevel;
        item.qtyTbMatched = item.qtyTbMatched ? this.utilsService.formatNumber(item.qtyTbMatched) : '';
        item.amntTbMatched = item.amntTbMatched ? this.utilsService.formatNumber(item.amntTbMatched) : '';

      });
    }

    this.dataList = data.content;
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
    }
  };

  public onSort(event,type):void{

    if(!type){
        this.query['orderItem'] = {
        columnName : event.field == 'skuClassify' ? 'firstLevel' : event.field,
        asc : event.order == '1' ? true : false
    }
      this.initFilter('');
      this.getBalanceAges();
    }
  };

  private paginate(event,type):void{
    if(!type ){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('');
      this.getBalanceAges();    
    }
  }

  //账龄
  private onInvnAgingeDetail(rowData){
    this.isShowAgingDays = true;
    let params = {
      transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
    };
    this.transObjCode = rowData['transObjCode'] ? rowData['transObjCode'] : '',
    
    this.qtyTbMatched = rowData.qtyTbMatched;
    this.sumAgingDays = rowData.agingDays;
    this.amntTbMatched = rowData.amntTbMatched;

    this.service.getBalanceAgesList(params).then(data => {
      this.transCode = data.transCode,
      data.forEach((dataItem) => {
        dataItem.measurement = rowData.measurement;
        dataItem.transObjName = rowData.transObjName;
        dataItem.qtyTbMatched = dataItem.qtyTbMatched ? this.utilsService.formatNumber(dataItem.qtyTbMatched) : '';
        dataItem.qty = dataItem.qty ? this.utilsService.formatNumber(dataItem.qty) : '';
        dataItem.amount = dataItem.amount ? this.utilsService.formatNumber(dataItem.amount) : '';
      });
      this.agingDaysList = data;
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }
  
  //账龄追溯
  private onInvnAgingeSecondDetail(rowData){
    console.log(rowData['transCode'])
    this.isShowAgingDaysDetail = true;
    let params = {
      transObjCode : this.transObjCode,
      transCode : rowData['transCode'] ? rowData['transCode'] : '',
    };

    this.service.getBalanceAgesSconedList(params).then(data => {

      data.forEach((dataItem) => {
        dataItem.measurement = rowData.measurement;
        dataItem.transObjName = rowData.transObjName;
        dataItem.qty = dataItem.qty ? this.utilsService.formatNumber(dataItem.qty) : '';
        dataItem.qtyTbMatched = dataItem.qtyTbMatched ? this.utilsService.formatNumber(dataItem.qtyTbMatched) : '';
        dataItem.amntTbMatched = dataItem.amntTbMatched ? this.utilsService.formatNumber(dataItem.amntTbMatched) : '';
      });
      this.agingDaysDetailList = data;
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

  //数量余额
  private onNumMoneyDetail(rowData){
    this.isShowNumMoneyDetail = true;
  }
  
  private onQtyTbMatched(attr){
    this.balancenumber = true;
  }

  private onOccupancy(attr){
    this.occupancy = true;
  }

  private onBalancemoney(attr){
    this.balancemoney = true;
  }

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.getBalanceAges();
  }
}
