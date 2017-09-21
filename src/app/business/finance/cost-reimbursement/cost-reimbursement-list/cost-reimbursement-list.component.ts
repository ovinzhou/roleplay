import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';
import { UtilsService } from 'core/services/utils.service';

@Component({
  selector   : 'cost-reimbursement-list',
  templateUrl: './cost-reimbursement-list.component.html',
  styleUrls  : ['./cost-reimbursement-list.component.scss']
})

export class CostReimbursementListComponent implements OnInit {

  private filter          : any;
  private page            : any;  
  private costReimbursementList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private totalRecords    : number = 0;
  private display : boolean = false;
  private first : number;

	constructor(
    private service : FinanceDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilService : UtilsService
  ){};

  ngOnInit(){
    this.titleService.setTitle('费用报销');

    this.toolbarConfigs = [
      {
        handler: this.all.bind(this),
        type:'all'
      },
      {
        label: "未生效",
        handler: this.onReview.bind(this),
      },
      {
        label: "已生效",
        handler: this.onApproved.bind(this),
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
        icon: "glyphicon glyphicon-trash",
      },
      {
        label: "期间费用报销",
        handler: this.onPeriod.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
      {
        label: "制造费用报销",
        handler: this.onManufacture.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
    ]
    this.query = {
      pageNum:1,
      pageSize:10,
      status:''
    }
    this.first = 0 ;
    
    this.initFilter();
    this.route.params.subscribe(() => {
       this.setCostReimbursement();
    });

  };

  /**
   * [onQuery 过滤查询]
   * @param {[type]} searchKeyWord [description]
   */
  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    this.initFilter();
    this.setCostReimbursement();
  }

  /**
   * [onDetail 查看详情]
   */
  public onDetail(){
    this.display = true;
  }

  public onAdd(){

  }

  public onDel(){
    
  }

  //期间费用报销
  public onPeriod(){
    this.router.navigateByUrl('main/process/launch/tsexpsrb');
  }

  //制造费用报销
  public onManufacture(){
    this.router.navigateByUrl('main/process/launch/tsovhdrb');
  }

  public onReview(){

    // let review = { status : 'REVIEWING' }
    this.query['pageNum'] = 1
    this.first = 0;
    this.query['status'] = 'REVIEWING';
    this.initFilter();
    // this.service.getStatus(review).then( data =>{
    //   this.formatData(data);      
    // })
    // .catch(oError =>this.popupService.showError(oError))
    this.setCostReimbursement();
  }

  public onApproved(){

    // let approved = { status : 'REVIEWING_COMPLETE' }
    this.query['pageNum'] = 1
    this.first = 0;
    this.query['status'] = 'REVIEWING_COMPLETE';
    this.initFilter();
    // this.service.getStatus(approved).then( data=>{
    //   this.formatData(data);
    // })
    // .catch(oError =>this.popupService.showError(oError))  
    this.setCostReimbursement();
  }
  /**
   * [initFilter 初始化查询数据]
   */
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


  /**
   * [setCostReimbursement 获取列表数据]
   */
  public setCostReimbursement(){
    if(this.filter['status'] == ''){
      this.service.getCostReimbursementList(this.filter).then(data=>{
         this.formatData(data);
      });
    }else{
      this.service.getCostReimbursementStatus(this.filter).then(data => {
        this.formatData(data);
      }).catch(oError => {
        this.popupService.showError(oError);
      })
    }
  }

  /**
   * [formatData 格式化数据]
   * @param {[type]} data [description]
   */
  public formatData(data){
    this.totalRecords = data.totalElements;
    data.content = data.content === null?[]:data.content;
    let reimbursement = []
    data.content.forEach(item => {
      reimbursement.push({
        transCode : item.transCode,
        type : item.type,
        amount : item.amount == 0 ? '-' : this.utilService.formatNumber(item.amount),
        status : item.status,
        applicant : item.applicant,
        applicationTime : item.applicationTime,
        // approvalperson : item.approver,
        // approvaldata : item.approvalTime,
        // describe : item.qwe,
      })
    })
    this.costReimbursementList = reimbursement;
    this.costReimbursementList.map(i =>{
      i.amout = i.amout == 0 ?'-':i.amout;
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
    
      window.localStorage.setItem('stuff',JSON.stringify({
      'fgouty.fgenty003':rowData.name,
      'fgouty.fgenty002':rowData.customerId,
      'fgouty.fgenty001':rowData.customerId
      }));
    
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
  public paginate(event){
    this.first = event.first;
    this.query.pageNum = event.page + 1;
    this.query.pageSize = event.rows;
    this.initFilter()
    this.setCostReimbursement();
  }

  /**
   * [onSort sort action]
   * @param {[object]} event [sorting info]
   */
  public onSort(event):void{
      this.query['orderItem'] = {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initFilter();
      this.setCostReimbursement();
  };

  public all(searchKeyWord){
    this.searchKeyWord = searchKeyWord;
    this.query['pageNum'] = 1;
    this.first = 0;
    this.query['status'] = '';
    this.initFilter();
    this.setCostReimbursement();
  }

}
