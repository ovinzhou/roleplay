import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from  'core/services/utils.service';

@Component({
  selector   : 'customer-contact-list',
  templateUrl: './customer-contact-list.component.html',
  styleUrls  : ['./customer-contact-list.component.scss']
})

export class CustomerContactListComponent implements OnInit {

  private filter          : any;
  private page            : any;  
  private customerContactList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private totalRecords    : number = 0;
  private first : number;

  //原币余额弹出层相关
  private isShowOrigAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private name : string = '';

  //账龄弹出层相关
  private agingDaysDetailList: any[];
  private isShowAgingDaysDetail: boolean = false;
  private rowData : Object;
  //弹出层类型
  private popupType : string = '';
  //小计或加权平均
  //原币
  private sumOrigAmount : any;
  //本币
  private sumAmount : any;
  //账龄
  private sumAgingDays : number = 0;

	constructor(
    private service : FinanceDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private utilsService : UtilsService,
    private titleService : Title
  ){};

  ngOnInit(){
    this.titleService.setTitle('客户往来列表');
    this.detailList = [];
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
      pageSize:10,
    }
    this.first = 0 ;
    
    this.initFilter('');
    this.route.params.subscribe(() => {
       this.setCustomerContactData();
    });

  };

  /**
   * [onQuery 过滤查询]
   * @param {[type]} searchKeyWord [description]
   */
  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord ? searchKeyWord.trim() : '';
    this.query['pageNum'] = 1;
    this.detailQuery['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setCustomerContactData();
  }

  /**
   * [onDetail 查看余额详情]
   */
  public onDetail(rowData){
    // this.isShowOrigAmountDetail = true;
    this.popupType = 'origAmountDetail';
    this.detailFirst = 0;
    this.name = rowData.name;
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.detailFirst = 0 ;
    this.initFilter('detail');
    this.setCustomerDetailList();
  }

  /**
   * [initFilter 初始化查询数据]
   */
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
        searchKeyWord : '',
        pageNum : this.detailQuery.pageNum,
        pageSize : this.detailQuery.pageSize,
        calcId:'crclnt',
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailQuery['orderItem'];
      }
    }
  }


  /**
   * [setCustomerContactData 获取列表数据]
   */
  public setCustomerContactData(){
    this.service.getCustomerContactLIST(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }

  /**
   * [formatData 格式化数据]
   * @param {[type]} data [description]
   */
  public formatData(data,type){
    if(type == ''){

      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      data.content.map(i =>{
        i.origAmount = i.origAmount ==0 ? '-' : this.utilsService.formatNumber(i.origAmount);
        i.amntTbMatched = i.amntTbMatched ==0?'-':this.utilsService.formatNumber(i.amntTbMatched);
        i.agingDays = i.agingDays == 0 ? '-' : i.agingDays;
      });
      this.customerContactList = data.content;
    }else{
      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.name = this.name;
        item.qtyAugment = this.utilsService.formatNumber(item.qtyAugment);
        item.qtyReduce = this.utilsService.formatNumber(item.qtyReduce);
        item.qtyRemainder = this.utilsService.formatNumber(item.qtyRemainder);
        item.amountAugment = this.utilsService.formatNumber(item.amountAugment);
        item.amountReduce = this.utilsService.formatNumber(item.amountReduce);
        item.amountRemainder = this.utilsService.formatNumber(item.amountRemainder);
      })
      if(!this.isShowOrigAmountDetail && this.popupType == 'origAmountDetail'){
        this.isShowOrigAmountDetail = true;
      }
      // if(!this.isShowAgingDaysDetail && this.popupType == 'agingDaysDetail'){
      //   this.isShowAgingDaysDetail = true;
      // }
    }
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
      queryParams: dynaParams
    });

  }
  
  /**
   * [onTsmgcspy 发起付款]
   * @param {[type]} rowData [description]
   */
  public onTsmgcspyDynamic(rowData){
    let dynaParams:any = {};

    dynaParams.context = JSON.stringify({
      customerId:rowData.customerId,
    });
    
    // this.router.navigateByUrl('main/process/launch/tsmgcspy');
    this.router.navigate(['main/process/start/tsmgcspy'],{
      queryParams: dynaParams
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
    
      // window.localStorage.setItem('stuff',JSON.stringify({
      // 'fgouty.fgenty003':rowData.name,
      // 'fgouty.fgenty002':rowData.customerId,
      // 'fgouty.fgenty001':rowData.customerId
      // }));
    
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
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      this.setCustomerContactData();
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setCustomerDetailList();
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
        this.setCustomerContactData();
      }else{

        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setCustomerDetailList();
      }
  };

  //弹出层List获取
  public setCustomerDetailList(){
    this.service.getFinanceDetailPopupList(this.detailFilter).then(data => {
      this.formatData(data,'detail');
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

  public onAgingDaysDetail(rowData){
    this.popupType == 'agingDaysDetail';
    let params = {
      calcId:'crclnt',
      transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
      containerCode : rowData['containerCode'] ? rowData['containerCode'] : '',
      dealerCode : rowData['dealerCode'] ? rowData['dealerCode'] : ''
    };
    this.sumAmount = rowData.amntTbMatched;
    this.sumOrigAmount = rowData.origAmount;
    this.sumAgingDays = rowData.agingDays;

    this.service.getAgingDaysDetail(params).then(data => {
      data.forEach((dataItem) => {
        dataItem.name = rowData.name;
        dataItem.origAmount = this.utilsService.formatNumber(dataItem.origAmount);
        dataItem.amount = this.utilsService.formatNumber(dataItem.amount);
      });
      this.agingDaysDetailList = data;
      this.isShowAgingDaysDetail = true;
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }
}
