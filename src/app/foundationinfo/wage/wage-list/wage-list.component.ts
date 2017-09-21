import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
// the Service of foundationinfoModule
import { FoundationinfoService } from '../../foundationinfo-data.service';
import { PopupService } from '../../../core/services/popup.service';
import { wage } from  '../wage.data'; 
import { Title } from '@angular/platform-browser';
import { CacheService } from 'core/services/cache.service';

@Component({
  selector: 'wage-list',
  templateUrl: './wage-list.component.html',
  styleUrls: ['./wage-list.component.scss']
})

export class WageListComponent implements OnInit {

  private wages           : any[];
  private selectedDatas   : any[];
  private searchKeyWord   : string = '';
  private toolbarConfigs  : any[];
  private filter          : any;
  private query            : any;
  private totalRecords    : any;
  private chargeTypeList  : any;
  private first           : number;
  private pricingtypes    : any;

	constructor(
    private router : Router,
    private route  : ActivatedRoute,
    private service:FoundationinfoService,
    private popupService:PopupService,
    private titleService : Title,
    private cacheService : CacheService){};

	ngOnInit() {
    this.titleService.setTitle('工价列表');
     //分页的时候的参数
    this.query = {
      pageNum:1,
      pageSize:10
    }
    //改变页码的参数
    this.first = 0 ;
    //定价类型
    this.pricingtypes = [
        {
          id:'GENERAL',
          text : '普通定价'
        },
        {
          id:'SECTION',
          text:'区间定价'
        }
    ];

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
        label: "删除",
        handler: this.onDel.bind(this),
        align: "right",
        icon: "glyphicon glyphicon-minus",
      },{
       label: "添加",
        handler: this.onAdd.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      }]

    this.initFilter();
    this.route.params.subscribe(() => {
      if(this.cacheService.get('wageFilter')){
        this.filter = this.cacheService.get('wageFilter');
        this.first = this.cacheService.get('wageFirst')?this.cacheService.get('wageFirst'):0;
        this.toolbarConfigs.map(i =>{

        if(!i.type){return;}

        if(i.type ==='search'){i.value = this.filter['searchKeyWord'];}

        });
      }
      this.cacheService.remove('wageFilter')
      this.cacheService.remove('wageFirst')
       this.setWages();
       // this.wages = wage.data;
    });

       

  };

  /**
   * [onAdd 添加工序]
   */
  public onAdd():void{
    this.router.navigate(['../add'],{relativeTo: this.route});   
  };

 /**
  * [onDel 删除工价]
  */
  public onDel():void{

    var ids = [];
    this.selectedDatas.map(item=>{ids.push(item.id)});

    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除这些数据吗？',
      accept:()=>{
        this.service.delWage(encodeURIComponent(JSON.stringify(ids)));
        this.setWages();
      }
    });

  };

  /**
   * [void 查看详情/编辑]
   */
  public onEdit(rowData:Object):void{
    this.cacheService.put('wageFilter',this.filter)
    this.router.navigate(['../edit',rowData['id']],{relativeTo: this.route});
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
    this.setWagesData();
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

  //查询工价list
  public  setWagesData():void{
    this.service.getWages(encodeURIComponent(JSON.stringify(this.filter))).then(data=>{
         this.formatData(data);
      });
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
      this.setWagesData();
  };


  /**
   * [setwages description]
   */
  private  setWages():void{
    this.service.getWages(encodeURIComponent(JSON.stringify(this.filter))).then(data=>{
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
    let wages = []
    //格式化数据
    data.content.forEach(item => {
      let type = this.pricingtypes.find(i => {
         return i.id == item.type;
      })
      wages.push({
        id:item.id,
        wagesName:item.name,
        proName:item.procedureName,
        valuationNumber:item.number,
        valuationValue:item.value,
        comment:item.comment,
        wagesType : type ? type.text : ''
      })
    })
    this.wages = wages;
  };

  //分页
  public paginate(event):void{
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.first = event.first;
    this.query.pageNum = event.page + 1;
    this.query.pageSize = event.rows;
    this.cacheService.put('wageFirst',this.first) 
    this.initFilter();
    this.setWagesData();
    
  }

}