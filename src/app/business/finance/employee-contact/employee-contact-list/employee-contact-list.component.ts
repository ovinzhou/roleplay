import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector   : 'employee-contact-list',
  templateUrl: './employee-contact-list.component.html',
  styleUrls  : ['./employee-contact-list.component.scss']
})

export class EmployeeContactListComponent implements OnInit {

  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private employeeContactList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private first : number;

  private mobile : number;

  //原币金额弹出层相关
  private isShowOrigAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number = 0;
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private employeeName : string = '';

  //账龄追溯弹出层相关
  private agingDaysDetailList: any[];
  private isShowAgingDaysDetail: boolean = false;
  //小计或加权平均
  //余额
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
    this.titleService.setTitle('员工往来列表');
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
    };
    this.first = 0 ;
    
    this.initFilter('');
    this.route.params.subscribe(() => {
       this.setEmployeeContactData();
    });

  };

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setEmployeeContactData();
  }

  //查看余额详情
  public onDetail(rowData){
    
    this.employeeName = rowData.employeeName;
    this.mobile = rowData.mobile;
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.initFilter('detail');
    this.setEmployeeDetailList();
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
        calcId:'cruser',
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailFilter['orderItem'];
      }
    }
  }

  public setEmployeeContactData(){
    this.service.getEmployeeContactList(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }

  public formatData(data,type){
    if(type == ''){
      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.employeeContactList = data.content;
      this.employeeContactList.map(item => {
        item.amount = item.amount == 0 ? '-' : this.utilsService.formatNumber(item.amount);
        item.agingDays = item.agingDays == 0 ? '-' : item.agingDays;
      })
    }else{
      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.name = this.employeeName;
        item.mobile = this.mobile;
        item.amountAugment = this.utilsService.formatNumber(item.amountAugment);
        item.amountReduce = this.utilsService.formatNumber(item.amountReduce);
        item.amountRemainder = this.utilsService.formatNumber(item.amountRemainder);
      })
      this.isShowOrigAmountDetail = true;
    }

  }

  //收款
  public onTsusrpcd(rowData : Object){
    let dynaParams:any = {};
    dynaParams.context = JSON.stringify({
      userId:rowData['id'],
    });

    this.router.navigate(['main/process/start/tsusrpcd'],{
      queryParams: dynaParams
    });

  }

  //付款
  public onTsusrpmt(rowData : Object){
    let dynaParams:any = {};
    dynaParams.context = JSON.stringify({
      userId:rowData['id'],
    });

    this.router.navigate(['main/process/start/tsusrpmt'],{
      queryParams: dynaParams
    });
  }

  //分页
  public paginate(event,type){
    // this.first = event.first;
    // this.query.pageNum = event.page + 1;
    // this.query.pageSize = event.rows;
    // this.initFilter('')
    // this.setEmployeeContactData();
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      this.setEmployeeContactData();
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setEmployeeDetailList();
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
        this.setEmployeeContactData();
      }else{
        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setEmployeeDetailList();
      }
  };

  public setEmployeeDetailList(){
    this.service.getFinanceDetailPopupList(this.detailFilter).then(data => {
      this.formatData(data,'detail');
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }
  public onAgingDaysDetail(rowData){
      let params = {
        calcId:'cruser',
        transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
        containerCode : rowData['containerCode'] ? rowData['containerCode'] : '',
        dealerCode : rowData['dealerCode'] ? rowData['dealerCode'] : ''
      };

      this.sumAmount = rowData.amount;
      this.sumAgingDays = rowData.agingDays;

      this.service.getAgingDaysDetail(params).then(data => {
        data.forEach((dataItem) => {
          dataItem.name = rowData.employeeName;
          dataItem.mobile = rowData.mobile;
          dataItem.amount = this.utilsService.formatNumber(dataItem.amount);
        });
        this.agingDaysDetailList = data;
        this.isShowAgingDaysDetail = true;
      }).catch(oError => {
        this.popupService.showError(oError);
      })
  }
}
