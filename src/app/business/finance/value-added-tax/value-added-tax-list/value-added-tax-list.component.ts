import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector   : 'value-added-tax-list',
  templateUrl: './value-added-tax-list.component.html',
  styleUrls  : ['./value-added-tax-list.component.scss']
})

export class ValueAddedTaxListComponent implements OnInit {
  
  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private valueAddedTaxList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private first : number;

  //余额详情相关
  private isShowAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private name : string = '';
  private type : string = '';

  private headerName : string = '增值税流水';

  constructor(
    private service : FinanceDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilsService : UtilsService
  ){};

  ngOnInit(){
    this.titleService.setTitle('制造费用列表');
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
        label: "进项转出",
        // handler: this.onTsvatpmt.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
      {
        label: "退税",
        // handler: this.onTsvatpmt.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
      {
        label: "缴税",
        handler: this.onTsvatpmt.bind(this),
        align: "right",
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
       this.setValueAddedTaxData();
    });

  };

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setValueAddedTaxData();
  }

  //查看余额详情
  public onDetail(rowData){
    // this.isShowAmountDetail = true;
    this.headerName = rowData.name + '流水';
    this.name = rowData.name;
    this.type = rowData.type;
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.initFilter('detail');
    this.setValueAddedTaxDetailList();
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
        calcId:'crtaxx',
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailQuery['orderItem'];
      }
    }
  }

  public setValueAddedTaxData(){
    this.service.getValueAddedTaxList(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }

  public formatData(data,type){
    if(type == ''){

      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.valueAddedTaxList = data.content;
      this.valueAddedTaxList.map(item => {
        item.amntTbMatched = item.amntTbMatched == 0 ? '-' : this.utilsService.formatNumber(item.amntTbMatched);
      })
    }else{
      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.name = this.name;
        item.type = this.type;
        item.amountAugment = this.utilsService.formatNumber(item.amountAugment);
        item.amountReduce = this.utilsService.formatNumber(item.amountReduce);
        item.amountRemainder = this.utilsService.formatNumber(item.amountRemainder);
      })
      this.isShowAmountDetail = true;
    }
  }


  //付款/进项转出
  public onTsvatpmt(){
    this.router.navigateByUrl('main/process/launch/tsvatpmt');
  }

  //分页
  public paginate(event,type){
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      this.setValueAddedTaxData();
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setValueAddedTaxDetailList();
    }
  }

  /**
   * [onSort sort action]
   * @param {[object]} event [sorting info]
   */
  public onSort(event,type):void{
      if(!type){
        this.query['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('');
        this.setValueAddedTaxData();
      }else{
        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setValueAddedTaxDetailList();
      }
  };

  //余额详情列表获取
  public setValueAddedTaxDetailList(){
    this.service.getFinanceDetailPopupList(this.detailFilter).then(data => {
      this.formatData(data,'detail');
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

}