import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
//primeng
import { TreeTableModule,TreeNode } from 'primeng/primeng';
// the Service of foundationinfoModule
import { FoundationinfoService } from '../../foundationinfo-data.service';
import { PopupService } from 'core/services/popup.service';
import { procedure } from  '../procedure.data';
import { Title } from '@angular/platform-browser';
import { CacheService } from 'core/services/cache.service';

@Component({
  selector: 'procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss']
})

export class ProcedureListComponent implements OnInit {

  
  private procedureData   : any = [];
  private selectedDatas   : any;
  private emptyMessage    : string = '没有记录';
  private searchKeyWord   : string = '';
  private toolbarConfigs  : any[];
  private filter          : any;
  private query            : any;
  private totalRecords    : any;
  private chargeTypeList  : any;
  private first           : number;


	constructor(
        private router : Router,
        private route : ActivatedRoute,
        private service:FoundationinfoService,
        private popupService:PopupService,
        private titleService : Title,
        private cacheService : CacheService){};

	ngOnInit() {
    this.titleService.setTitle('工序列表');
    this.query = {
      pageNum:1,
      pageSize:10
    }
    this.first = 0 ;
    this.chargeTypeList = [
      {
        id:'TIME',
        text:'计时工资'
      },
      {
        id:'FEES',
        text:'计件工资'
      }
    ];
    this.initFilter();
    this.route.params.subscribe(() => {
       this.setProcedureData();
       // this.procedureData = procedure.data;
    });

    this.toolbarConfigs = [
      {
        handler: this.onQuery.bind(this),
        type:'all'
      },
      // {
      //   label: "添加",
      //   handler: this.onAdd.bind(this)
      // },
      // {
      //   label: "删除",
      //   handler: this.onDel.bind(this)
      // },
      // {
      //   label: "批量导入",
      //   handler: this.onBatchImport.bind(this)
      // },
      // {
      //   label: "批量导出",
      //   handler: this.onBatchExport.bind('batch')
      // },
      // {
      //   label: "全部导出",
      //   handler: this.onExportAll.bind('all')
      // },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      },
      {
        label: "删除",
        handler: this.onDel.bind(this),
        align: "right",
        icon: "glyphicon glyphicon-minus",
      },
      {
        label: "添加",
        handler: this.onAdd.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
    ]

        if(this.cacheService.get('procedureFilter')){
        this.filter = this.cacheService.get('procedureFilter');
        this.first = this.cacheService.get('procedureFirst')?this.cacheService.get('procedureFirst'):0;
        this.toolbarConfigs.map(i =>{

        if(!i.type){return;}

        if(i.type ==='search'){i.value = this.filter['searchKeyWord'];}

        });
      }
      this.cacheService.remove('procedureFilter')
      this.cacheService.remove('procedureFirst')

  };


  /**
   * [onBatchExport 批量导出]
   */
  public onBatchExport():void{

  };

  /**
   * [onExport 全部导出]
   */
  public onExportAll():void{
  };

  /**
   * [onBatchImport 批量导入]
   */
  public onBatchImport():void{

  };


  /**
   * [onAdd 添加工序]
   */
  public onAdd():void{
    this.router.navigate(['../add'],{relativeTo: this.route});   
  };

 /**
  * [onDel 删除工序]
  */
  public onDel():void{
    if(!this.beforeDoActionCheck()){
      return;
    }
    var ids = [];
    this.selectedDatas.map(item=>{ids.push(item.id)});

    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除这些数据吗？',
      accept:()=>{
        this.service.delProcedure(encodeURIComponent(JSON.stringify(ids))).then(() =>{
          this.setProcedureData();
        }).catch(oError => {
          this.popupService.showError(oError);
        });
        
      }
    });

  };

  /**
   * [void 查看详情]
   */
  public onViewDetail(rowData):void{
    this.cacheService.put('bizFilter',this.filter)
    this.router.navigate(['../viewdetail',rowData.data.id],{relativeTo: this.route});
  };

  /**
   * [onQuery 查询过滤]
   */
  public onQuery(searchKeyWord):void{
    // this.foap['fao']['searchKeyWord'] = searchKeyWord;
    this.searchKeyWord = searchKeyWord;
    this.first = 0 ;
    this.query.pageNum = 1;
    this.initFilter();
    this.setProcedureData();
  };


  /**
   * [initFilter to  init foap info,the filterInfo、sortInfo、searchKeyWord、pageInfo ]
   */
  public initFilter():void{
    this.filter = {
      searchKeyWord : this.searchKeyWord,
      pageNum : this.query.pageNum,
      pageSize : this.query.pageSize,
    };

    if(this.query['orderItem']){
      this.filter['orderItem'] = this.query['orderItem'];
    }
  };

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
      this.setProcedureData();
  };



  /**
   * [setProcedureData description]
   */
  public  setProcedureData():void{
    this.service.getProcedures(encodeURIComponent(JSON.stringify(this.filter))).then(data=>{
         this.formatData(data);
      });
  };

   /**
   * [formatData The front end to the data format ]
   * @param  {[object]} data [The back-end data ]
   * @return {any}         [The front Data]
   */
  private formatData(data):any{
    this.totalRecords = data.totalElements
    data.content = data.content===null?[]:data.content;
    let procedureList = [] , billing;
    data.content.forEach(item => {
      billing = this.chargeTypeList.find(value => {
          return value.id == item.billing;
      });
      //如果是空，则赋空值
      if(!billing){
        billing = {id:'',text:''}
      }
      procedureList.push({
        id:item.id,
        name : item.name,
        billingName : billing.text,
        procedureGroupName:item.userGroupName,
        comment:item.comment

      })
    })
    this.procedureData = procedureList;
  };


  /**
   * [beforeDoAction 添加或删除之前调用,主要做一些校验以及提示]
   */
  public beforeDoActionCheck():boolean{
    if(!this.selectedDatas || this.selectedDatas.length===0){
        this.popupService.alert({
          header:'系统提示',
          message:'请选择数据,以便进行您需要的操作!'
        });
        return false;
    };
    return true;
  };

  public paginate(event):void{
    this.first = event.first;
    this.query.pageNum = event.page + 1;
    this.query.pageSize = event.rows;
    this.cacheService.put('procedureFirst',this.first) 
    this.initFilter();
    this.setProcedureData();
  }

}