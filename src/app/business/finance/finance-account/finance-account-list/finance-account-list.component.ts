import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { CacheService } from 'core/services/cache.service';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector   : 'finance-account-list',
  templateUrl: './finance-account-list.component.html',
  styleUrls  : ['./finance-account-list.component.scss']
})

export class FinanceAccountListComponent implements OnInit {

  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private financeAccountList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private first : number = 0;
  private banks : any;
  private isCashflow : boolean = false;

  //原币金额弹出层相关
  private isShowAmountDetail : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number = 0;
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private capName : string = '';
  private accountNumber : string = '';
  private type : string = '';

  //账龄追溯弹出层相关
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
    private cacheService : CacheService,
    private titleService : Title,
    private utilsService : UtilsService
  ){};

  ngOnInit(){
    this.titleService.setTitle('资金账户列表');

    this.toolbarConfigs = [
      {
        handler: this.onCapital.bind(this),
        label:"资金账户",
        default: true
      },
      {
        handler: this.onCashflow.bind(this),
        label:"现金流账户"
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right",
        value:''
      },
      {
        label:"删除",
        handler: this.del.bind(this),
        align: "right",
        icon:"glyphicon glyphicon-trash"
      },
      {
        label:"添加",
        handler: this.add.bind(this),
        align: "right",
        icon:"glyphicon glyphicon-plus"
      }
    ]
    
    this.query = {
      pageNum:1,
      pageSize:10,
      orderItem:{
        columnName : 'agingDays',
        asc :true
      }
    }
    this.detailQuery = {
      pageNum:1,
      pageSize:10
    };
    
    this.initFilter('');
    this.route.params.subscribe(() => {
      if(this.cacheService.get('financeAccountFilter')){
        this.filter = this.cacheService.get('financeAccountFilter');
        this.first = this.cacheService.get('financeAccountFirst')?this.cacheService.get('financeAccountFirst'):0;
        this.cacheService.remove('financeAccountFilter');
        this.cacheService.remove('financeAccountFirst');
      }
       this.setFinanceAccountData();
    });

  };

  public onQuery(searchKeyWord){
    this.searchKeyWord = searchKeyWord.trim();
    // this.query['searchKeyWord'] = searchKeyWord.trim();
    // this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    this.initFilter('');
    this.setFinanceAccountData();
  }

  //查看详情
  public onDetail(rowData){
    this.capName = rowData.capName;
    this.accountNumber = rowData.accountNumber;
    this.type = rowData.type;
    this.sumAgingDays = rowData.agingDays;
    this.detailQuery['transObjCode'] = rowData['transObjCode'] ? rowData['transObjCode'] : '';
    this.detailQuery['containerCode'] = rowData['containerCode'] ? rowData['containerCode'] : '';
    this.detailQuery['dealerCode'] = rowData['dealerCode'] ? rowData['dealerCode'] : '';
    this.initFilter('detail');
    this.setFinanceDetailPopup();
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
        calcId:'crcash',
        transObjCode : this.detailQuery['transObjCode'],
        containerCode : this.detailQuery['containerCode'],
        dealerCode : this.detailQuery['dealerCode'],
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailQuery['orderItem'];
      }
    }

  }

  public setFinanceAccountData(){
    this.service.getFinanceAccountList(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }

  public formatData(data,type){
    if(type == ''){
      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.financeAccountList = data.content;
      let accountsInfoList = [];
      
      data.content.forEach(item => {

        // let bankCode = JSON.parse(item.accountBank) ? JSON.parse(item.accountBank).bankCode : '',
        // bankType = this.banks.find(item => {
        //   return item.value == bankCode;
        // })
        let accountsInfo = {
          id : item.id,
          capName : item.capName,
          accountName:item.accountName,
          accountNumber : item.accountNumber,
          accountBank : item.accountBank,
          amount: item.amount == 0 ? '-' : this.utilsService.formatNumber(item.amount),
          origAmount: item.origAmount == 0 ? '-' : this.utilsService.formatNumber(item.origAmount),
          type : item.cashFlowName,
          agingDays : item.agingDays == 0 ? '-' : item.agingDays,
          transObjCode : item.transObjCode,
          containerCode : item.containerCode,
          dealerCode : item.dealerCode,
          currency : item.currency,
        }
        accountsInfoList.push(accountsInfo);
      })

      this.financeAccountList = accountsInfoList;

    }else{

      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.type = this.type;
        item.name = this.capName;
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

  //添加
  public add(){
    // this.router.navigate(['../add'],{relativeTo: this.route});
    this.router.navigateByUrl("/main/business/finance/financeaccount/add/");
   
  }

  //删除
  public del(){
    console.log(this.selectedDatas)

    if (!this.selectedDatas || this.selectedDatas.length === 0) {
        this.popupService.alert('请至少选择一个账户进行操作')
        return;
    }

    var ids = [];
    this.selectedDatas.forEach(item => {
        ids.push(item.id)
    })

    this.service.delFinanceAccount(ids.toString())
    .then(() => {
      this.setFinanceAccountData();
    }).catch(res => {
      this.popupService.alert(res)
    })

  }

  //收款
  public onTsmgcspd(){
    this.router.navigateByUrl('main/process/launch/tsmgcspd');
  }

  //资金账户
  onCapital(){
    this.financeAccountList = [];
    this.setFinanceAccountData();
    this.isCashflow = false;
    this.toolbarConfigs = [
      {
        handler: this.onCapital.bind(this),
        label:"资金账户",
        default: true
      },
      {
        handler: this.onCashflow.bind(this),
        label:"现金流账户"
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right",
        value:''
      },
      {
        label:"删除",
        handler: this.del.bind(this),
        align: "right",
        icon:"glyphicon glyphicon-trash"
      },
      {
        label:"添加",
        handler: this.add.bind(this),
        align: "right",
        icon:"glyphicon glyphicon-plus"
      }
    ]
  }

  //现金流账户
  onCashflow(){  
        this.isCashflow = true;
        this.toolbarConfigs = [
        {
          handler: this.onCapital.bind(this),
          label:"资金账户"
        },
        {
          handler: this.onCashflow.bind(this),
          label:"现金流账户",
          default: true
        },
        {
          type: "search",
          handler: this.onQuery.bind(this),
          align: "right",
          value:''
        }
      ]
      this.financeAccountList = [];
      this.service.getFinanceAccountListCombined(this.filter)
      .then(data => {
      this.formatData(data,'');
    }).catch(res => {
      this.popupService.alert(res)
    })
      
  }

  public onEdit(arrData){
    this.cacheService.put('financeAccountFilter',this.filter)
    this.router.navigate(['../edit',arrData['id']],{relativeTo: this.route});
  }

  //付款
  public onTsmgcspy(){
    this.router.navigateByUrl('main/process/launch/tsmgcspy');
  }

  //分页
  public paginate(event,type){
    console.log(event.first)
    this.cacheService.put('financeAccountFirst',event.first) 
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      if (this.isCashflow) {
        this.financeAccountList = [];
        this.service.getFinanceAccountListCombined(this.filter)
        .then(data => {
        this.formatData(data,'');
    }).catch(res => {
      this.popupService.alert(res)
    })
      }else{
        this.setFinanceAccountData();
      }
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setFinanceDetailPopup();
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
        this.setFinanceAccountData();
      }else{
        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setFinanceDetailPopup();
      }
  };

  public setFinanceDetailPopup(){
    this.service.getFinanceDetailPopupList(this.detailFilter).then(data => {
      this.formatData(data,'detail');
    })
  }
  //转账
  onTspvdpcd(){

  }

  //查看账龄详情
  public onAgingDaysDetail(rowData){
    if (this.isCashflow) {
      let params = {
      calcId:'crcash',
      transObjCode : rowData['transObjCode'] ? rowData['transObjCode'] : '',
      containerCode : rowData['containerCode'] ? rowData['containerCode'] : '',
      dealerCode : rowData['dealerCode'] ? rowData['dealerCode'] : ''
    };
    this.accountNumber = rowData.accountNumber;
    this.sumAmount = rowData.amount;
    this.sumAgingDays = rowData.agingDays;
    this.sumOrigAmount = rowData.origAmount;
    this.service.getAgingDaysDetail(params).then(data => {
      this.isShowAgingDaysDetail = true;
      data.forEach((dataItem) => {
        dataItem.name = rowData.capName;
        dataItem.type = rowData.type;
        dataItem.origAmount = this.utilsService.formatNumber(dataItem.origAmount);
        dataItem.amount = this.utilsService.formatNumber(dataItem.amount);

      });
      this.agingDaysDetailList = data;

    }).catch(oError => {
      this.popupService.showError(oError);
    })

    }else{
      this.isShowAgingDaysDetail = true;
    }
  }
}
