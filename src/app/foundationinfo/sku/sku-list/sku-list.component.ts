import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

// the Service of foundationinfoModule
import { FoundationinfoService } from '../../foundationinfo-data.service';
//primeng
import { TreeTableModule,TreeNode } from 'primeng/primeng';

import { PopupService } from 'core/services/popup.service';

import { CacheService } from 'core/services/cache.service';


@Component({
  selector: 'sku-list',
  templateUrl: './sku-list.component.html',
  styleUrls: ['./sku-list.component.scss']
})

export class SkuListComponent implements OnInit {

  
  private skus           : any[];
  private selectedDatas  : any[];
  private toolbarConfigs : any[];
  private emptyMessage   : string = '没有记录';
  private searchKeyWord  : string = '';
  private query          : Object = {};
  private totalRecords   : number = 0;
  private first          : number = 0;
  private rows           : number = 10;
  private sku            : Object = {}; 
  private display        : boolean = false;
  private piffers        : any[];
  private bomTree        : TreeNode[];
  private selectedNode   : TreeNode;

  private filter :  Object = {};
  //spareParts  rawMaterial halfProduct product sparePartsToolDefault
  private sparePartsToolDefault : boolean = false;
  private rawMaterialToolDefault : boolean = false;
  private halfProductToolDefault : boolean = false;
  private productToolDefault : boolean = false;
  private allToolDefault : boolean = true;
  private type : any[] = ['原料','备品','半成品','产成品','商品'];

  constructor(
    private router : Router,
    private route  : ActivatedRoute,
    private service: FoundationinfoService,
    private titleService:Title,
    private cacheService:CacheService,
    private popupService:PopupService){};

  ngOnInit() {
    this.initQuery();
    this.initToolbarConfigs();
    this.titleService.setTitle('SKU物料列表');

    this.route.params.subscribe(() => {
       this.sku['skuBoms'] = [];

        this.piffers = [];
        this.piffers.push({name:'皮费',type:'制造费用',amount:'',comment:''});

        if(this.cacheService.get('skuListQuery')){

          this.filter = this.cacheService.get('skuListQuery');
          this.query = this.cacheService.get('skuListQuery');
          this.first = this.cacheService.get('skuListQueryFirst')?this.cacheService.get('skuListQueryFirst'):0;
          this.rows =  this.cacheService.get('skuListQueryRows')?this.cacheService.get('skuListQueryRows'):10;
          this.searchKeyWord = this.filter['searchKeyWord'];
          let type = '';
          if(this.filter['types'] && this.filter['types'].length > 0){
            type = this.type.filter(ea=>this.filter['types'].every(eb=>eb!==ea))[0];
          }
          switch (type) {
            case "备品":
              this.sparePartsToolDefault = true;
              this.rawMaterialToolDefault = false;
              this.halfProductToolDefault = false;
              this.productToolDefault = false;
              this.allToolDefault = false;
              break;
            case "原料":
              this.rawMaterialToolDefault = true;
              this.sparePartsToolDefault = false;
              this.halfProductToolDefault = false;
              this.productToolDefault = false;
              this.allToolDefault = false;
              break;
            case "半成品":
              this.halfProductToolDefault = true;
              this.rawMaterialToolDefault = false;
              this.sparePartsToolDefault = false;
              this.productToolDefault = false;
              this.allToolDefault = false;
              break;
            case "产成品":
              this.productToolDefault = true;
              this.halfProductToolDefault = false;
              this.rawMaterialToolDefault = false;
              this.sparePartsToolDefault = false;
              this.allToolDefault = false;
              break;
            default:
              this.productToolDefault = false;
              this.halfProductToolDefault = false;
              this.rawMaterialToolDefault = false;
              this.sparePartsToolDefault = false;
              this.allToolDefault = true;
              break;
          }
          this.initToolbarConfigs();
          this.toolbarConfigs.map(i =>{

            if(!i.type){return;}

            if(i.type ==='search'){i.value = this.filter['searchKeyWord'];}

          });
        }
       
       this.setSkus();
    });


  };


  /**
   * [onBatchExport 批量导出]
   */
  public onBatchExport():void{

  };


  /**
   * [onBatchImport 批量导入]
   */
  public onBatchImport():void{

  };


  /**
   * [onSeeBom 查看BOM结构]
   * @param {[type]} sku [description]
   */
  public onSeeBom(sku):void{
    this.service.getSku(sku.code).then(data => {
      data.qty = 1;
      data['spuType'] = data['firstLevel']+'>'
                      + data['secondLevel']+'>'
                      + data['thirdLevel'];
      var temp = [];
      temp.push({data:data,leaf:false});
      this.bomTree = temp;


      this.piffers[0]['amount']=data['piffer'];
      this.piffers[0]['comment']=data['pifferComment'];

    }).catch(res =>this.popupService.showError(res));

    this.display = true;

  };


  /**
   * [nodeExpand 异步加载BOM]
   * @param {[type]} $event [description]
   */
  public nodeExpand(event):void{
    if(event.node){
      this.service.getSku(event.node.data.code).then(data =>{
        event.node.children = this.formatBomData(data['skuBoms']);
      });
    }
  };

  /**
   * [onNodeSelect description]
   * @param {[type]} event [description]
   */
  public onNodeSelect(event):void{
    this.piffers[0]['amount']=event.node.data['piffer'];
    this.piffers[0]['comment']=event.node.data['pifferComment'];
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



    if(this.selectedDatas.length === 0){
      return;
    }

    var ids = [];
    this.selectedDatas.map(item=>{ids.push(item.code)});

    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除您选中的这些数据吗？',
      accept:()=>{
        this.service.delSku(encodeURIComponent(JSON.stringify(ids)))
        .then(data =>{
          this.setSkus();
          this.selectedDatas = [];
        })
        .catch(res => this.popupService.showError(res));
      }

    });

  };

  /**
   * [void 查看详情/编辑]
   */
  public onEdit(rowData:Object):void{
    this.cacheService.put('skuListQuery',this.filter);
    this.router.navigate(['../edit',rowData['code']],{relativeTo: this.route});
  };

  /**
   * [onQuery 查询过滤]
   */
  public onQuery(searchKeyWord):void{

    this.first = 0;
    this.searchKeyWord = searchKeyWord ? searchKeyWord.trim() : '';
    this.query['pageNum'] = 1;
    this.cacheService.put('skuListQueryFirst',0);
    this.initQuery();
    this.setSkus();
  };


  /**
   * [initFoap to  init foap info,the filterInfo、sortInfo、searchKeyWord、pageInfo ]
   */
  private initQuery():void{
    if(!this.query['pageNum']){
      this.query['pageNum'] = 1;
      this.query['pageSize'] = 10;
      this.query['types'] =[];
    }
    this.filter = {
      searchKeyWord:this.searchKeyWord,
      pageNum:this.query['pageNum'],
      pageSize:this.query['pageSize'],
    };
    if(this.query['orderItem']){
      this.filter['orderItem'] = this.query['orderItem'];
    }
    if(this.query['types']){
      this.filter['types'] = this.query['types'];
    }
  };

  /**
   * [onSort 列表排序]
   * @param {[type]} event [description]
   */
  public onSort(event):void{

    var orderItem = {
      columnName:event.field,
      asc:event.order===1?true:false
    }

    this.query['orderItem']=orderItem;
    this.initQuery();
    this.setSkus();
  };


  /**
   * [onPage 分页]
   * @param {[type]} event [分页信息]
   */
  public onPage(event):void{
    this.first = event.first;
    this.query['pageNum']  = (event.first/event.rows)+1,
    this.query['pageSize'] = event.rows;
    this.cacheService.put('skuListQueryFirst',this.first);
    this.cacheService.put('skuListQueryRows',event.rows);
    this.initQuery();
    this.setSkus();
  };


  /**
   * [setSkus description]
   */
  private  setSkus():void{
    this.service.getSkus(encodeURIComponent(JSON.stringify(this.filter)))
        .then(data=>{
          this.skus = this.formatData(data);
          this.totalRecords = data.totalElements;
        }).catch(res => this.popupService.showError(res));
  };

   /**
   * [formatData The front end to the data format ]
   * @param  {[object]} data [The back-end data ]
   * @return {any}         [The front Data]
   */
  private formatData(data):any{
    var getProductModeName = function (mode) {
      var str = '';
        switch (mode) {
          case "SELF_SUPPOR":
             str  = '自制';
             break;
          case "OUT_SOURCE":
             str  = '委外';
             break;
          case "PURCHASE":
             str  = '采购';
             break;
          case "IN_COMING":
             str  = '来料';
             break;
         }
      return str;
    };
    var getHandleModeName = function (mode) {
      var str = '';
        switch (mode) {
          case "MAKE_ORDER":
             str  = '按单';
             break;
          case "SPARE_PORT":
             str  = '备品';
             break;
          case "SPARE_ORDER":
             str  = '按单和备品';
             break;
         }
      return str;
    };
    data.content = data.content===null?[]:data.content;
    data.content.map( item => {
      item.mrpCalc = item.mrpCalc?'是':'否';
      item.hasBom  = item.hasBom?'是':'否';
      item.productMode = getProductModeName(item.productMode);
      item.handleMode = getHandleModeName(item.handleMode);
    });
    return data.content;
  };


  /**
   * [formatBomData 根式化BOM数据]
   * @param  {[type]} data [description]
   * @return {Array}       [description]
   */
  public formatBomData(data:Array<Object>):Array<Object>{
    var temp = [];
    data.map(item =>{
      item['code']   = item['child']['code'];
      item['name'] = item['child']['name'];

      item['spuType'] =  item['child']['firstLevel']+'>'
                        +item['child']['secondLevel']+'>'
                        +item['child']['thirdLevel'];

      item['userGroupName'] = item['child']['userGroupName'];

      item['piffer']        = item['child']['piffer'];
      item['pifferComment'] = item['child']['pifferComment'];

      temp.push({data:item,leaf:!item['child']['hasBom']});

    });

    return temp;
  };


  /**
   * [initToolbarConfigs 初始化列表工具栏]
   */
  public initToolbarConfigs():void{
    this.toolbarConfigs = [
      {
        label: "全部",
        handler: this.all.bind(this),
        default: this.allToolDefault
      },
      {
        label: "产成品",
        handler: this.product.bind(this),
        default: this.productToolDefault
      },
      {
        label: "半成品",
        handler: this.halfProduct.bind(this),
        default:this.halfProductToolDefault,
      },
      {
        label: "原料",
        handler: this.rawMaterial.bind(this),
        default:this.rawMaterialToolDefault,
      },
      {
        label: "备品",
        handler: this.spareParts.bind(this),
        default:this.sparePartsToolDefault,
      },

      // {
      //   label: "批量导入",
      //   handler: this.onBatchImport.bind(this),
      //  icon:"glyphicon glyphicon-plus-sign"
      // },
      // {
      //   label: "批量导出",
      //   handler: this.onBatchExport.bind('batch'),
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
  }

  //设置状态
  public setStatus(rowData){
    this.service.updateSkuStatus(rowData.code,{status:rowData.status == 1 ? -1 : 1})
        .then(() => this.setSkus())
        .catch(res => this.popupService.showError(res));
  }

  public all(){
    this.query['types'] =[];
    this.onQuery(this.searchKeyWord);
  }

  //产成品
  public product(){
    this.query['types'] =["原料","商品","半成品","备品"];
    this.onQuery(this.searchKeyWord);
  }

  //半成品
  public halfProduct(){
    this.query['types'] =["原料","商品","产成品","备品"];
    this.onQuery(this.searchKeyWord);
  }

  //原料
  public rawMaterial(){
    this.query['types'] =["产成品","商品","半成品","备品"];
    this.onQuery(this.searchKeyWord);
  }

  //备品
  public spareParts(){
    this.query['types'] =["原料","商品","半成品","产成品"];
    this.onQuery(this.searchKeyWord);
  }
}