import { Component, OnInit} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { Router , ActivatedRoute ,Params} from '@angular/router';

//primeng
import {SortMeta} from 'primeng/primeng';

// the Service of BasicDataModule
import {FoundationinfoService} from '../../foundationinfo-data.service';

import { PopupService } from '../../../core/services/popup.service';
import { spuAttrbute } from '../spu-attribute.data';


@Component({
  selector: 'spu-attribute-list',
  templateUrl: './spu-attribute-list.component.html',
  styleUrls: ['./spu-attribute-list.component.scss']
})
export class SpuAttrbuteListComponent implements OnInit {

	private spuAttrbutes     : any = [];
  private currSpuAttrValues: any = [];
	private selectedDatas    : any;
  private searchKeyWord    : string  = '';
  private emptyMessage     : string  = '没有记录';
  private display          : boolean = false;
  private query            : Object;
  private toolbarConfigs   : any[];
  private totalRecords     : number = 0;
  private first            : number = 0;

	constructor(
      private router : Router,
      private route  : ActivatedRoute, 
      private popupService:PopupService,
      private titleService: Title,
      private service:FoundationinfoService){

	};

	ngOnInit() {
    this.initQuery();
    this.titleService.setTitle('物料属性列表');
    this.route.params.subscribe(() => {
      this.setSpuAttrbutes();
    });

    this.toolbarConfigs = [
      {
        handler: this.onQuery.bind(this),
        type:'all'
      },
      {
        label: "添加",
        handler: this.onAdd.bind(this)
      },
      {
        label: "删除",
        handler: this.onDel.bind(this)
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      }
    ]
  };

  /**
   * [onAdd 添加产品属性]
   */
  public onAdd():void{
    this.router.navigate(['../add'],{relativeTo:this.route});
  };

 /**
  * [onDel 删除产品属性]
  */
  public onDel():void{

    if(!this.beforeDoActionCheck()){
       return;
    };

    var ids = [];
    this.selectedDatas.map(item=>{ids.push(item.id)});
    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除这些数据吗？',
      accept:()=>{
        this.service.delSpuAttr(encodeURIComponent(JSON.stringify(ids)))
            .then(data =>{
              this.setSpuAttrbutes();
              this.selectedDatas = [];
            })
            .catch(res => this.popupService.showError(res));
      }
    });

  };

  /**
   * [void description]
   */
  public onEdit(spuAttrbute:Object):void{
    this.router.navigate(['../edit',spuAttrbute['id']],{relativeTo: this.route});
  };

  /**
   * [onViewValues description]
   * @param {Object} rowData [current row Data]
   */
  public onViewValues(rowData:Object):void{
    this.display = true;
    this.currSpuAttrValues = rowData['values'];

    if(this.currSpuAttrValues.length>0){
      this.currSpuAttrValues.map(item=>{
        item.name = rowData['name'];
      });
    };

  };

  /**
   * [onQuery 查询过滤]
   */
  public onQuery(searchKeyWord:string):void{
    this.first = 0;
    this.query['searchKeyWord'] = searchKeyWord;
    this.query['pageNum'] = 1;
    this.setSpuAttrbutes();
  };

  /**
   * [onSort sort action]
   * @param {[object]} event [sorting info]
   */
  public onSort(event):void{
      this.first = 0;
      this.query['orderItem'] = {columnName:event.field,asc:event.order==1?true:false};
      this.query['pageNum'] =  1;

      this.setSpuAttrbutes();
  };

  /**
   * [onPage description]
   * @param {void(} event) [description]
   */
  public onPage(event):void{
    this.first = event.first;
    this.query['pageNum']  = (event.first/event.rows)+1,
    this.query['pageSize'] = event.rows;

    this.setSpuAttrbutes();
  };

  /**
   * [formatData The front end to the data format ]
   * @param  {[object]} data [The back-end data ]
   * @return {any}         [The front Data]
   */
  private formatData(data):any{

    data.content = data.content===null?[]: data.content;

    data.content.map(item =>{
      if(item.values && item.values.length>0){
        item['value'] = '';
        item.values.map(v =>{
          item['value'] +=','+v.value;
        });
        item['value'] = item['value'].substr(1);
      }else{
        item['value'] = '-';
      }
    });
    return data.content;
  };


  /**
   * [setSpuAttrbutes to set dataTable data]
   */
  private setSpuAttrbutes():void{
    this.service.getSpuAttrs(encodeURIComponent(JSON.stringify(this.query))).then(data=>{
        this.spuAttrbutes = this.formatData(data);
        this.totalRecords = data.totalElements;
      }).catch(res => this.popupService.showError(res));
  };


  /**
   * [initQuery to  init foap info,the filterInfo、sortInfo、searchKeyword、pageInfo ]
   */
  private initQuery():void{
    this.query = {
      searchKeyWord:this.searchKeyWord,
      pageNum:1,
      pageSize:10
    };
  };


  /**
   * [beforeDoAction 添加或删除之前调用,主要做一些校验以及提示]
   */
  public beforeDoActionCheck():boolean{
    if(!this.selectedDatas || this.selectedDatas.length === 0){
        this.popupService.alert({
          header:'系统提示',
          message:'请至少选中一条数据,以便进行您需要的操作!'
        });
        return false;
    };
    return true;
  };

}