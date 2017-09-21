import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector: 'cost-accrue-list',
  templateUrl: './cost-accrue-list.component.html',
  styleUrls: ['./cost-accrue-list.component.css']
})
export class CostAccrueListComponent implements OnInit {

  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private costAccrueList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private display : boolean = false;
  private first : number;

  constructor(
    private service : FinanceDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilsService : UtilsService
    ) {}

  ngOnInit() {
    this.titleService.setTitle('费用计提列表');
    this.toolbarConfigs = [
      {
        handler: this.all.bind(this),
        type:'all'
      },
      {
        label: "未生效",
        handler: this.checking.bind(this)
      },
      {
        label: "已生效",
        handler: this.checked.bind(this)
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      },
      {
        label: "删除",
        handler: this.onDel.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-trash'
      },
      {
        label: "期间费用计提",
        handler: this.onPeriod.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
      {
        label: "制造费用计提",
        handler: this.onManufacture.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      }
    ]
     this.query = {
      pageNum:1,
      pageSize:10,
      status:''
    }
    this.first = 0 ;
    
    this.initFilter();
    this.route.params.subscribe(() => {
       this.setCostAccrueData();
    });
  }
  public initFilter(){
    this.filter = {
      searchKeyWord : this.searchKeyWord,
      pageNum : this.query.pageNum,
      pageSize : this.query.pageSize,
      status : this.query['status']
    };

    if(this.query['orderItem']){
      this.filter['orderItem'] = this.query['orderItem'];
    }
  }

  public setCostAccrueData(){
    if(this.filter['status'] == ''){
      this.service.getCostAccrueList(this.filter).then(data=>{
        this.formatData(data);
      }).catch(oError => {
        this.popupService.showError(oError);
      })
    }else{
      this.service.getCostAccrueStatusList(this.filter).then(data => {
        this.formatData(data);
      }).catch(oError => {
        this.popupService.showError(oError);
      })
    }
  }

  public formatData(data){
    this.totalRecords = data.totalElements;
    data.content = data.content === null?[]:data.content;
    this.costAccrueList = data.content;
    this.costAccrueList.map(item=>{
       // item.approvalTime = item.approvalTime.split(" ")[0],
       // item.applicationTime = item.applicationTime.split(" ")[0]
       item.amount = item.amount == 0 ? '-' : this.utilsService.formatNumber(item.amount);
    });
  }
    /**
   * [onTsmgcspd 发起收款]
   * @param {[type]} rowData [description]
   */
  public onTsusrpcd(rowData){

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
    //付款
  public onTsusrpmt(rowData : Object){
    console.log('付款'),
    window.localStorage.setItem('extra',JSON.stringify({
      customerId:rowData['id'],
    }));
    this.router.navigateByUrl('main/process/launch/tsvatpmt');
  }

  //审核中
  public checking(){
    this.query['pageNum'] = 1
    this.first = 0;
    this.query['status'] = 'REVIEWING'
    this.initFilter()
    this.setCostAccrueData();
      // this.service.getCostAccrueCheckingList(this.filter).then(data=>{
    //    this.formatData(data);
    // });
  }
  //已审核
  public checked(){
    this.query['pageNum'] = 1
    this.first = 0;
    this.query['status'] = 'REVIEWING_COMPLETE';
      // this.service.getCostAccrueCheckedList(this.filter).then(data=>{
    //    this.formatData(data);
    // });
    this.initFilter();
    this.setCostAccrueData();
  }
   //查看详情
  public onDetail(){
    this.display = true;
  }
      /**
 * [period 制造费用]
 */
  public onManufacture(){
    this.router.navigateByUrl('main/process/launch/tsfbktca');
  }
    /**
 * [period 期间费用]
 */
  public onPeriod(){
    this.router.navigateByUrl('main/process/launch/tsprctca');
  }
  /**
 * [anAdd 添加]
 */
  public onAdd(){
       
  }
    /**
 * [onDel 删除]
 */
  public onDel(){
       
  }
  public all(searchKeyWord){
    this.searchKeyWord = searchKeyWord;
    this.query['pageNum'] = 1
    this.first = 0;
    this.query['status'] = '';
    this.initFilter();
    this.setCostAccrueData();
    // this.service.getCostAccrueList(this.filter).then(data=>{
    //    this.formatData(data);
    // });
  };
 /**
  * [onQuery 查询]
  */
  public onQuery(searchKeyWord):void{
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    this.initFilter();
    this.setCostAccrueData();
  };
   /**
  * [onQuery 权限]
  */
  public jurisdiction(searchKeyWord):void{
    
  };

  //分页
  public paginate(event){
    // this.first = event.first;
    // this.query.pageNum = event.page + 1;
    // this.query.pageSize = event.rows;
    // this.initFilter('')
    // this.setEmployeeContactData();
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter()
      this.setCostAccrueData();
  }

  public onSort(event):void{
      this.query['orderItem'] = {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initFilter();
      this.setCostAccrueData();
  };

}
