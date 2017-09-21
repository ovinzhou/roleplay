import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector   : 'period-cost-list',
  templateUrl: './period-cost-list.component.html',
  styleUrls  : ['./period-cost-list.component.scss']
})

export class PeriodCostListComponent implements OnInit {

  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private periodCostList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private first : number;

  //余额弹出相关
  private isShowAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number = 0;
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private feeObj : string = '';
  private feeType : string = '';
  private feeSubject : string = '';

  constructor(
    private service : FinanceDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilsService : UtilsService
  ){};

  ngOnInit(){
    this.titleService.setTitle('期间费用列表');
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
        label: "计提",
        handler: this.onTsprctca.bind(this),
        align:'right',
        icon:'glyphicon glyphicon-plus'
      },
      {
        label: "报销",
        handler: this.onTsexpsrb.bind(this),
        align:'right',
        icon:'glyphicon glyphicon-plus'
      }
    ]
    this.query = {
      pageNum:1,
      pageSize:10
    }
    this.detailQuery = {
      pageNum:1,
      pageSize:10
    }
    this.first = 0 ;
    
    this.initFilter('');
    this.route.params.subscribe(() => {
       this.setPeriodCostData();
    });

  };

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setPeriodCostData();
  }

  //查看余额详情
  public onDetail(rowData){
    // this.isShowAmountDetail = true;
    this.feeObj = rowData.feeObj;
    this.feeType = rowData.feeType;
    this.feeSubject = rowData.feeSubject;
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.initFilter('detail');
    this.setPeriodCostDetailList();
  }

  public initFilter(type){
    if(type == ''){
      this.filter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : this.query.pageNum,
        pageSize : this.query.pageSize,
      };

      if(this.query['orderItem']){
        this.filter['orderItem'] = this.query['orderItem'];
      }
    }else{
      this.detailFilter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : this.detailQuery.pageNum,
        pageSize : this.detailQuery.pageSize,
        calcId:'crperd',
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailQuery['orderItem'];
      }
    }
  }

  public setPeriodCostData(){
    this.service.getPeriodCostList(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }

  public formatData(data,type){
    if(type == ''){
      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.periodCostList = data.content;
      this.periodCostList.map(item => {
        item.amount = item.amount == 0 ? '-' : this.utilsService.formatNumber(item.amount);
      })
    }else{
      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.feeObj = this.feeObj;
        item.feeType = this.feeType;
        item.feeSubject = this.feeSubject;
        item.amountAugment = this.utilsService.formatNumber(item.amountAugment);
        item.amountReduce = this.utilsService.formatNumber(item.amountReduce);
        item.amountRemainder = this.utilsService.formatNumber(item.amountRemainder);
      })
      this.isShowAmountDetail = true;
    }
  }

  //计提
  public onTsprctca(){
    this.router.navigateByUrl('main/process/launch/tsprctca');
  }

  //报销
  public onTsexpsrb(){
    this.router.navigateByUrl('main/process/launch/tsexpsrb');
  }

  //分页
  public paginate(event,type){
    // this.first = event.first;
    // this.query.pageNum = event.page + 1;
    // this.query.pageSize = event.rows;
    // this.initFilter()
    // this.setPeriodCostData();
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      this.setPeriodCostData();
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setPeriodCostDetailList();
    }
  }

  /**
   * [onSort sort action]
   * @param {[object]} event [sorting info]
   */
  public onSort(event,type):void{
      // this.query['orderItem'] = {
      //   columnName : event.field,
      //   asc : event.order == '1' ? true : false
      // }
      // this.initFilter();
      // this.setPeriodCostData();
      if(!type){
        this.query['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('');
        this.setPeriodCostData();
      }else{
        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setPeriodCostDetailList();
      }
  };

  public setPeriodCostDetailList(){
    this.service.getFinanceDetailPopupList(this.detailFilter).then(data => {
      this.formatData(data,'detail');
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

}