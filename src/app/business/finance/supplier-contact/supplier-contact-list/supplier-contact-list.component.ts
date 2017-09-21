import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector   : 'supplier-contact-list',
  templateUrl: './supplier-contact-list.component.html',
  styleUrls  : ['./supplier-contact-list.component.scss']
})

export class SupplierContactListComponent implements OnInit {


  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private supplierContactList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private first : number;

  //余额弹出层相关
  private isShowAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number = 0;
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private supplier : string = '';

  //账龄弹出层相关
  private providerName : string = '';
  private agingDaysDetailList: any[];
  private isShowAgingDaysDetail: boolean = false;
   //小计或加权平均
  //原币
  private sumOrigAmount : number = 0;
  //本币
  private sumAmount : number = 0;
  //账龄
  private sumAgingDays : number = 0;

  constructor(
    private service : FinanceDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilsService : UtilsService
  ){};

  ngOnInit(){
    this.titleService.setTitle('供应商往来列表');
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
    this.query = {
      pageNum:1,
      pageSize:10,
      orderItem:{
        columnName : 'agingDays',
        asc :false
      }
    }
    this.detailQuery = {
      pageNum:1,
      pageSize:10
    }

    this.first = 0 ;
    
    this.initFilter('');
    this.route.params.subscribe(() => {
       this.setSupplierContactData();
    });

  };

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setSupplierContactData();
  }

  //查看余额详情
  public onDetail(rowData){
    // this.isShowAmountDetail = true;
    this.providerName = rowData.providerName
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.supplier = rowData['providerName'];
    this.initFilter('detail');
    this.setSupplierDetailList();
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
        calcId:'crsppl',
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailQuery['orderItem'];
      }
    }
  }

  public setSupplierContactData(){
    this.service.getSupplierContactList(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }

  public formatData(data,type){
    if(type == ''){
      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.supplierContactList = data.content;
      this.supplierContactList.map(item => {
        item.origAmount = item.origAmount == 0 ? '-' : this.utilsService.formatNumber(item.origAmount);
        item.amount = item.amount == 0 ? '-' : this.utilsService.formatNumber(item.amount);
        item.agingDays = item.agingDays == 0 ? '-' : item.agingDays;
      })
    }else{
      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.supplier = this.supplier
        item.name = this.providerName,
        
        item.qtyAugment = this.utilsService.formatNumber(item.qtyAugment);
        item.qtyReduce = this.utilsService.formatNumber(item.qtyReduce);
        item.qtyRemainder = this.utilsService.formatNumber(item.qtyRemainder);

        item.amountAugment = this.utilsService.formatNumber(item.amountAugment);
        item.amountReduce = this.utilsService.formatNumber(item.amountReduce);
        item.amountRemainder = this.utilsService.formatNumber(item.amountRemainder);
      })
      this.isShowAmountDetail = true;
    }
  }

  //收款(动态表单V2)
  public onTspvdpcdDynamic(rowData){
    let dynaParams:any = {};

    dynaParams.context = JSON.stringify({
      providerId:rowData.id
    });

    this.router.navigate(['main/process/start/tspvdpcd'],{
      queryParams: dynaParams,
    });
  }

  //付款(动态表单V2)
  public onTspvdpmtDynamic(rowData){
    let dynaParams:any = {};

    dynaParams.context = JSON.stringify({
      providerId:rowData.id
    });

    this.router.navigate(['main/process/start/tspvdpmt'],{
      queryParams: dynaParams,
    });
  }

  //收款
  public onTspvdpcd(rowData){
     window.localStorage.setItem('extra',JSON.stringify({
      providerId:rowData.id,
    }));
    this.router.navigateByUrl('main/process/launch/tspvdpcd');
  }

  //付款
  public onTspvdpmt(rowData){
     window.localStorage.setItem('extra',JSON.stringify({
      providerId:rowData.id,
    }));
    this.router.navigateByUrl('main/process/launch/tspvdpmt');
  }

  //分页
  public paginate(event,type){
    // this.first = event.first;
    // this.query.pageNum = event.page + 1;
    // this.query.pageSize = event.rows;
    // this.initFilter()
    // this.setSupplierContactData();
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      this.setSupplierContactData();
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setSupplierDetailList();
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
      // this.setSupplierContactData();
      if(!type){
        this.query['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('');
        this.setSupplierContactData();
      }else{
        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setSupplierDetailList();
      }
  };

  public setSupplierDetailList(){
    this.service.getFinanceDetailPopupList(this.detailFilter).then(data => {
      this.formatData(data,'detail');
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

  //查看账龄详情
  public onAgingDaysDetail(rowData){
  let params = {
    calcId:'crsppl',
    transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
    containerCode : rowData['containerCode'] ? rowData['containerCode'] : '',
    dealerCode : rowData['dealerCode'] ? rowData['dealerCode'] : ''
  };

  this.sumAmount = rowData.amount;
  this.sumAgingDays = rowData.agingDays;
  this.sumOrigAmount = rowData.origAmount;

  this.service.getAgingDaysDetail(params).then(data => {
    data.forEach((dataItem) => {
      dataItem.name = rowData.providerName;
      dataItem.origAmount = this.utilsService.formatNumber(dataItem.origAmount)
      dataItem.amount = this.utilsService.formatNumber(dataItem.amount)
    });
    this.agingDaysDetailList = data;
    this.isShowAgingDaysDetail = true;
  }).catch(oError => {
    this.popupService.showError(oError);
  })
}
}
