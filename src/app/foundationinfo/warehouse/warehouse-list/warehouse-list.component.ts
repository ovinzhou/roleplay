import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { CacheService } from 'core/services/cache.service';
import { FoundationinfoService } from '../../foundationinfo-data.service';
import { PopupService } from '../../../core/services/popup.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})

export class WarehouseListComponent implements OnInit {

  private selectedDatas  : any[];
  private toolbarConfigs : any[];
  private warehouses : any[];
  private emptyMessage   : string = '没有记录';
  private page : any;
  private query : any;
  private filter : any;
  private searchKeyWord : string = '';
  private totalRecords : string = '';
  private first : number = 0;

	constructor(
    private router : Router,
    private route  : ActivatedRoute,
    private service:FoundationinfoService,
    private popupService:PopupService,
    private cacheService : CacheService,
    private location: Location,
    private titleService : Title,
    ){};

	ngOnInit() {
    this.titleService.setTitle('仓库列表');
    this.selectedDatas = [];
    this.page = {
        pageNum : 1,
        pageSize : 10,
        orderItem:{
        columnName : 'name',
        asc :true
      }
      }
    
    this.filter = {
      'pageSize' : this.page.pageSize,
      'pageNum' : this.page.pageNum,
      'searchKeyWord' : this.searchKeyWord,
    }
    this.route.params.subscribe(() => {
      if(this.cacheService.get('wareHouserFilter')){
        this.filter = this.cacheService.get('wareHouserFilter');
        this.first = this.cacheService.get('wareHouseFirst')?this.cacheService.get('wareHouseFirst'):0;

        this.cacheService.remove('wareHouserFilter');
        this.cacheService.remove('wareHouseFirst');
      }
        this.getWarehouseList(this.filter);
    });

    this.toolbarConfigs = [
    {
        handler: this.onQuery.bind(this),
        type:'all'
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      },{
        label: "删除",
        handler: this.onDel.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-trash'
      },
      {
        label: "添加",
        handler: this.onAdd.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      }
    ]
  };

  //添加
  public onAdd(searchKeyWord):void{
    this.router.navigate(['../add'],{relativeTo:this.route})

  };
  //删除
  public onDel(){
    if (this.selectedDatas.length === 0) {
      this.popupService.alert("请至少选择一个仓库进行操作")
      return
    }
    var ids = []
    this.selectedDatas.map(data => {
      ids.push(data.id)
    })
    this.service.delWareHouse(ids.toString())
    .then(() => {
      this.selectedDatas = [];
      this.getWarehouseList(this.filter)
    })
    .catch(oError => {
      this.popupService.showError(oError);
    })
  };

  public onCancel():void{
    this.location.back(); 
  };

  private formatData(data):void{
    this.totalRecords = data.totalElements;
       //用来存储bizList
       let warehouses = [];
       data.content.forEach(item =>{
          let warehouseInfo = {
             id : item.id,
             name : item.name,
             content : item.content,
             officeTel : item.officeTel
          }
          warehouses.push(warehouseInfo);
       })
      this.warehouses = warehouses;
  }

  private getWarehouseList(filter){
      console.log(filter)
      this.service.getWarehouseList(filter)
      .then(data => {
        this.formatData(data)
      })
      .catch(oError => {
        //暂时先用这个提示有错。到时候改成弹出框
        console.log('有错userList')
      })
  }

  private onPage(event , data){
    this.first = event.first;
    this.page.pageNum = event.page + 1;
    this.page.pageSize = event.rows;
    this.getPagingData();
  }

  //编辑
  onEdit(data){
     this.cacheService.put('wareHouserFilter',this.filter)
     this.router.navigate(['../edit',data['id']],{relativeTo: this.route});
  }

  //翻页
  getPagingData(){
    
    this.filter = {
       searchKeyWord : this.searchKeyWord,
       pageNum : this.page.pageNum,
       pageSize : parseInt(this.page.pageSize)
    }
    
     this.cacheService.put('wareHouseFirst',this.first) 
    this.getWarehouseList(this.filter);

  }

  onQuery(searchValue){

     this.searchKeyWord = searchValue.trim();
    //搜索默认第一页
    this.filter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : 1,
        pageSize : parseInt(this.page.pageSize)
      }
     this.getWarehouseList(this.filter);
  }

   public onSort(event):void{
      
      this.page['orderItem'] = {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initFilter();

      this.getWarehouseList(this.filter);
  };

    public initFilter(){
    this.filter = {
      searchKeyWord : this.searchKeyWord,
      pageNum : this.page.pageNum,
      pageSize : this.page.pageSize,
    };

    if(this.page['orderItem']){
      this.filter['orderItem'] = this.page['orderItem'];
    }
  }

}