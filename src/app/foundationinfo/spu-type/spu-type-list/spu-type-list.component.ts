import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

//primeng
import { TreeTableModule,TreeNode } from 'primeng/primeng';

// the Service for foundationinfoModule
import { FoundationinfoService } from '../../foundationinfo-data.service';

import { PopupService } from '../../../core/services/popup.service';

import { spuType } from '../spu-type.data';

@Component({
  selector: 'spu-type-list',
  templateUrl: './spu-type-list.component.html',
  styleUrls: ['./spu-type-list.component.scss']
})

export class SpuTypeListComponent implements OnInit {

	private spuTypes       : TreeNode[];
	private selectedData   : TreeNode;
  private searchKeyWord  : string;
  private toolbarConfigs : any[];
  private query          : Object;


	constructor(
    private router : Router,
    private route  : ActivatedRoute,
    private popupService:PopupService,
    private titleService:Title,
    private service:FoundationinfoService
    ){

  };

	ngOnInit() {

    this.initQuery();

    this.titleService.setTitle('物料类型列表');

    this.route.params.subscribe(() => {
        this.setSpuTypes();
    });

    this.toolbarConfigs = [
      {
        handler: this.onQuery.bind(this),
        type:'all'
      },
      {
        label: "添加兄弟节点",
        handler: this.onAddBrother.bind(this)
      },
      {
        label: "添加子节点",
        handler: this.onAddChild.bind(this)
      },
      {
        label: "修改",
        handler: this.onEdit.bind(this)
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
   * [onAddBrother 添加兄弟节点]
   */
  public onAddBrother():void{
   
    if(!this.beforeDoActionCheck()){
      return;
    }
    //如果当前选中节点数据的parentId为空，那么就是根节点
    if(!this.selectedData.data.parentId){
      this.router.navigateByUrl("main/foundationinfo/sputype/addroot/" + this.selectedData.data.id);
    }else{
      this.router.navigateByUrl("main/foundationinfo/sputype/addbrother/" + this.selectedData.data.parentId);
    };

  };

  /**
   * [onAdd 添加子节点]
   */
  public onAddChild():void{

    if(!this.beforeDoActionCheck()){
      return;
    }
    this.router.navigate(['../addchild/',this.selectedData.data.id],{relativeTo:this.route});
  };

  /**
   * [onEdit 修改产品类型]
   */
  private onEdit():void{

    if(!this.beforeDoActionCheck()){
      return;
    }
    this.router.navigate(['../edit/',this.selectedData.data.id],{relativeTo:this.route});
  };

  /**
  * [onDel 删除当前节点]
  */
  public onDel():void{

    var ids = [];

    if(!this.beforeDoActionCheck()){
      return;
    }

    ids.push(this.selectedData.data.id);

    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除这条数据吗？',
      accept:()=>{
        this.service.delSpuType(encodeURIComponent(JSON.stringify(ids))).then(data=>{

          this.setSpuTypes();

        }).catch(res => this.popupService.showError(res));

      }
    });
  };

  /**
   * [onQuery 查询过滤]
   */
  public onQuery(searchKeyWord):void{

    this.query['searchKeyWord'] = searchKeyWord;
    this.setSpuTypes();
  };

  /**
   * [nodeExpand 展开加载节点]
   * @param {[type]} event [当前节点元素]
   */
  public nodeExpand(event):void {
    
    if(event.node) {
        var id:string = event.node.data.id;

        this.service.getLazySpuTypes(id).then(data=>{
          event.node.children = this.formatData(data);
        });
    }

  };


  /**
   * [formatData 处理后端返回过来的数据,加容错或者处理成前端需要的数据 ]
   * @param  {[object]} data [后端数据 ]
   * @return {any}         [前端需要的数据]
   */
  private formatData(data:any):any{
    var temp = [];
    data.content = data.content===null?[]: data.content;
    data.content.map(item => {temp.push({data:item,leaf:!item.leaf});});
    return temp;
  };


  /**
   * [beforeDoAction 添加或删除之前调用,主要做一些校验以及提示]
   */
  public beforeDoActionCheck():boolean{
    if(!this.selectedData){
        this.popupService.alert({
          header:'系统提示',
          message:'请选中一条数据,以便进行您需要的操作!'
        });
        return false;
    };
    return true;
  };


  /**
   * [setSpuTypes to set dataTable data]
   */
  public setSpuTypes():void{
    this.service.getSpuTypes(encodeURIComponent(JSON.stringify(this.query))).then(data=>{
      this.spuTypes = this.formatData(data);
    }).catch(res => this.popupService.showError(res));
  };


  /**
   * [initFoap to  init foap info,the filterInfo、sortInfo、searchKeyWord、pageInfo ]
   */
  private initQuery():void{
    this.query = {searchKeyWord:'',pageNum: 1,pageSize: 10};
  };

}