import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';

// the Service of foundationinfoModule
import { FoundationinfoService } from 'foundationinfo/foundationinfo-data.service';
//primeng
import { TreeTableModule,TreeNode } from 'primeng/primeng';

import { Message } from 'primeng/primeng';
import { PopupService } from 'core/services/popup.service';
import { CacheService } from 'core/services/cache.service';

import { spu } from  '../spu.data'; 
import {leftTree } from '../../index/foundationinfo-left-treedata';

@Component({
  selector: 'spu-list',
  templateUrl: './spu-list.component.html',
  styleUrls: ['./spu-list.component.scss']
})

export class SpuListComponent implements OnInit {

  
  private msgs           : Message[] = [];
  private spus           : any[];
  private selectedDatas  : any[];
  private toolbarConfigs : any[];
  
  private piffers        : any[];
  private emptyMessage   : string = '没有记录';
  private searchKeyWord  : string = '';
  private totalRecords   : number = 0;
  private skuTotalRecords: number = 0;
  private first          : number = 0;
  private rows           : number = 10;
  private spu            : Object = {}; 
  private query          : Object = {};
  private bomTree        : TreeNode [];
  private selectedNode   : TreeNode [];
  private filter         : Object = {};
  private skuDataList    : Array<any> = [];
  private cols           : Array<any> = [];
  private spuAttrItems   : Array<any> = [];

  private spuAttrTree    : TreeNode [] = [];
  private selectedAttrs  : TreeNode [] = [];
  private showAttrTree   : boolean = false;
  private showAttrFielter: boolean = false;

  private display_bom_modal : boolean = false;
  private display_sku_modal : boolean = false;

  private saveSkusDisabled : boolean = false;

  //sku数量相关
  private skuNumberList : Array<any>  = [];
  private display_sku_number : boolean = false;
  private selectedSkuDatas : Array<any> = [];
  private skuNumberFilter : any;
  private skuNumberQuery : any;
  private skuNumberTotalRecords : number;
  private skuNumberSearchKeyWord : string = '';
  private skuNumberFirst : number = 0;
  private spuId : string;

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
    private titleService: Title,
    private cacheService:CacheService,
    private service:FoundationinfoService,
    private popupService:PopupService){
    // this.query['types'] =[];
  };

	ngOnInit() {

    this.initQuery('');

    this.initToolbarConfigs();

    this.titleService.setTitle('物料SPU列表');

    
    this.route.params.subscribe(() => {

        this.piffers = [];
        this.piffers.push({name:'皮费',type:'制造费用',amount:'',comment:''});
        
        this.spu['spuBoms'] = [];
        if(this.cacheService.get('spuListQuery')){

          this.filter = this.cacheService.get('spuListQuery');
          this.query = this.cacheService.get('spuListQuery');
          this.first = this.cacheService.get('spuListQueryFirst')?this.cacheService.get('spuListQueryFirst'):0;
          this.rows  = this.cacheService.get('spuListQueryRows')?this.cacheService.get('spuListQueryRows'):10;
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
              this.rawMaterialToolDefault = false;
              this.sparePartsToolDefault = false;
              this.halfProductToolDefault = false;
              this.productToolDefault = false;
              this.allToolDefault = true;
              break;
          }
          this.initToolbarConfigs();
          this.toolbarConfigs.map(i =>{

            if(!i.type){return;}

            if(i.type ==='search'){i.value = this.filter['searchKeyWord'];}

          });
        }
        
        this.setSpus();

        this.cacheService.remove('spuListQuery');
        this.cacheService.remove('spuListQueryFirst');
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
    this.router.navigate(['../upload'],{relativeTo: this.route});
  };


  /**
   * [onSeeBom 查看BOM结构]
   * @param {[type]} spu [description]
   */
  public onSeeBom(spu):void{
    this.service.getSpu(spu.id).then(data => {
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

    this.display_bom_modal = true;

  };

  /**
   * [onSort 列表排序]
   * @param {[type]} event [description]
   */
  public onSort(event,type):void{
    if(!type){
      var orderItem = {
        columnName:event.field,
        asc:event.order===1?true:false
      }

      this.query['orderItem']=orderItem;
      this.initQuery('');
      this.setSpus();
    }else{
      if(event.field == 'skuType'){
        event.field = 'firstLevel'
      }
      this.skuNumberQuery['orderItem'] = {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
      this.initQuery('skuNumber');
      this.getskuListBySpuId();
    }
  };


  /**
   * [nodeExpand 异步加载BOM]
   * @param {[type]} $event [description]
   */
  public nodeExpand(event):void{
    if(event.node){
      this.service.getSpu(event.node.data.id).then(data =>{
        event.node.children = this.formatBomData(data['spuBoms']);
      }).catch(res =>this.popupService.showError(res));
    }
  };

  /**
   * [onNodeSelect description]
   * @param {[type]} event [description]
   */
  public onNodeSelect(event):void{
    this.piffers[0]['amount'] = event.node.data['piffer'];
    this.piffers[0]['comment']= event.node.data['pifferComment'];
  };

  /**
   * [onAdd 添加]
   */
  public onAdd():void{
    this.router.navigate(['../add'],{relativeTo: this.route});   
  };

 /**
  * [onDel 删除]
  */
  public onDel():void{


    if(this.selectedDatas.length === 0){
      return;
    }

    var ids = [];


    this.selectedDatas.map(item=>{ids.push(item.id)});

    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除您选中的这些数据吗？',
      accept:()=>{
        this.service.delSpu(encodeURIComponent(JSON.stringify(ids))).then(data =>{
          this.setSpus();
          this.selectedDatas = [];
        }).catch(res =>this.popupService.showError(res));
      }

    });

  };

  /**
   * [void 查看详情/编辑]
   */
  public onEdit(rowData:Object):void{


    this.cacheService.put('spuListQuery',this.filter);
    this.router.navigate(['../edit',rowData['id']],{relativeTo: this.route});
  };

  /**
   * [onGenerateSkuByFilter description]
   */
  public onGenerateSkuByFilter():void{
    var filter = {id:'',spuAttrs:[]};

    var isExist =function (spuAttrs:Array<any>,id):boolean {
        var isExist = false;
        spuAttrs.map(i =>{
          if(i.attrId === id){ isExist = true;}
        });
        return isExist;
    };

    this.selectedAttrs.map(i =>{
      filter['id'] = i.data.spuId;
      if(i.children){
        if(!isExist(filter['spuAttrs'],i['data']['attrId'])){
          filter.spuAttrs.push({attrId:i.data.attrId,values:[]});
        }
      }else{
        if(!isExist(filter['spuAttrs'],i['data']['attrId'])){
          filter.spuAttrs.push({attrId:i.data.attrId,values:[{id:i.data.id}]});
        }else{

          filter.spuAttrs.map(n =>{
            if(n.attrId === i.data.attrId){
               n.values.push({id:i.data.id})
            }
          });
        }
      }
    });

    if(filter.spuAttrs.length >0 && this.spuAttrTree.length !== filter.spuAttrs.length){
      this.popupService.alert('如果要按条件生成,每个SKU产品属性的值必须有一个选中!');
      return;
    }else if(filter.spuAttrs.length===0){
      this.popupService.alert('请选择生成条件!');
      return;
    }



    if(filter.id ===''){

      if(this.spuAttrTree.length>0){

        this.setSkuDataList(this.spuAttrTree[0].data['spuId'],'');
      }

      
    }else{
      this.setSkuDataList(filter['id'],encodeURIComponent(JSON.stringify(filter)));
    }
    
    this.showAttrFielter  = false;
    this.skuTotalRecords = this.skuDataList.length;
  };


  /**
   * [setSkuDataList 获取批量生成的SKU集合]
   * @param {[type]} id     [spuId]
   * @param {[type]} filter [生成过滤条件]
   */
  public setSkuDataList(id,filter):void{
    this.cols = [];
    this.service.getSkusBySpu(id,filter)
        .then(skus =>{

        var num = 1;
        if(skus.content.length > 0){
          skus.content[0]['skuAttrs'].map(i =>{
            this.cols.push({field:'attr'+num,name:i.name});
            num++;
          });
        }
     
        skus.content.map(i=>{
          i['spuTypeName']  = i.firstLevel+'->'+i.secondLevel+'->'+ i.thirdLevel;
          var j = 1;
          i['skuAttrs'].map(n =>{
            i['attr'+j] = n.value.value;
            j++;
          });
        });

        this.skuDataList = skus.content;
        this.skuTotalRecords = this.skuDataList.length;
        this.display_sku_modal = true;

    }).catch(res =>this.popupService.showError(res));
  };


  /**
   * [onGenerateSku 批量生成SKU]
   * @param {Object} spu [description]
   */
  public onOpenSkuModal(spu:Object):void{

    this.showAttrFielter = false;
    this.showAttrTree = false;
    this.spuAttrTree =[];
    this.skuDataList = [];
    this.selectedAttrs = [];

    this.saveSkusDisabled = false;

    this.service.getSpu(spu['id']).then(data =>{

      data['spuAttrs'].map(i =>{

        if(!i.forSkuEncode){
          return;
        }
        
       var newObj = {
          label:i.attrName,
          data:{
            spuId:data.id,
            attrId:i.attrId
          },
          expandedIcon: "fa-folder-open",
          collapsedIcon: "fa-folder",
          children:[]
        };
       
        i.values.map(n=>{

         newObj.children.push({label:n.value,data:{id:n.id,attrId:i.attrId,spuId:data.id}});
       });

       this.spuAttrTree.push(newObj);


      });

    }).catch(res =>this.popupService.showError(res));

    this.skuDataList = [];
    this.skuTotalRecords = 0;

    this.setSkuDataList(spu['id'],'');
  };


  /**
   * [saveSkus 保存SKU]
   */
  public saveSkus():void{

    this.saveSkusDisabled = true;

    if(this.skuDataList.length === 0){
      this.display_sku_modal = false;
      return;
    }

    var spuId = this.skuDataList[0]['spuId'];
    this.service.addSkusBySpu(spuId,this.skuDataList)
        .then(data => {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'操作成功', detail:'已按您选择的条件批量生成SKU!'});
        this.display_sku_modal = false;
        })
        .catch(res => this.popupService.showError(res));
  };

  /**
   * [onCleanupSkus 清空SKU]
   */
  public onCleanupSkus():void{
    this.skuDataList = [];
    this.skuTotalRecords = 0;
  };


  /**
   * [onDeleteSku 删除SKU]
   * @param {Object} sku [description]
   */
  public onDeleteSku(sku:Object):void{
    this.skuDataList = this.skuDataList.filter(n => n.customCode != sku['customCode']);
    this.skuTotalRecords = this.skuDataList.length;
  };


  /**
   * [onQuery 查询过滤]
   */
  public onQuery(searchKeyWord):void{
    this.first = 0;
    if(!searchKeyWord){
      searchKeyWord = '';
    }
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    this.cacheService.put('spuListQueryFirst',0);
    this.initQuery('');
    this.setSpus();
  };


  /**
   * [initFoap to  init foap info,the filterInfo、sortInfo、searchKeyWord、pageInfo ]
   */
  private initQuery(type):void{
    if(type == ''){
      if(!this.query['pageNum']){
        this.query['pageNum'] = 1;
        this.query['pageSize'] = 10;
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
        this.filter['types'] =  this.query['types']
      }
    }else{
      this.skuNumberFilter = {
        searchKeyWord:this.skuNumberSearchKeyWord,
        pageNum:this.skuNumberQuery.pageNum,
        pageSize:this.skuNumberQuery.pageSize,
        spuId:this.spuId
      }
      if(this.skuNumberQuery['orderItem']){
        this.skuNumberFilter['orderItem'] = this.skuNumberQuery['orderItem'];
      }
    }
  };


  /**
   * [onPage 分页]
   * @param {[type]} event [分页信息]
   */
  public onPage(event,type):void{
    if(!type){
      this.first = event.first;
      this.query['pageNum']  = (event.first/event.rows)+1,
      this.query['pageSize'] = event.rows;
      this.cacheService.put('spuListQueryFirst',this.first);
      this.cacheService.put('spuListQueryRows',event.rows);
      this.initQuery('');
      this.setSpus();
    }else{
      this.skuNumberFirst = event.first;
      this.skuNumberQuery.pageNum = event.page + 1;
      this.skuNumberQuery.pageSize = event.rows;
      this.initQuery('skuNumber');
      // this.setProcedureData();
      this.getskuListBySpuId();
    }
  };


  /**
   * [setSpus description]
   */
  private  setSpus():void{
    this.service.getSpus(encodeURIComponent(JSON.stringify(this.filter))).then(data=>{
        this.spus = this.formatData(data);
        this.totalRecords = data.totalElements;
      }).catch(res =>this.popupService.showError(res));
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
      item['id']   = item['child']['id'];
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
        {
          type: "search",
          handler: this.onQuery.bind(this),
          align: "right",
          value:''
        },
        {
          label: "批量导入",
          handler: this.onBatchImport.bind(this),
          align: "right",
          icon:"glyphicon glyphicon-plus-sign"
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
      // {
      //   label: "批量导出",
      //   handler: this.onBatchExport.bind('batch')
      // },
      
    ]
  }

  //sku数量弹出层
  public onOpenSkuNumber(rowData){
    // this.skuFirst
    this.skuNumberQuery = {
      pageNum:1,
      pageSize:10
    }
    this.spuId = rowData['id']
    this.initQuery('skuNumber');
    this.getskuListBySpuId();
  }

  //根据spu_id去查找skuList
  public getskuListBySpuId(){
    this.service.getSkus(encodeURIComponent(JSON.stringify(this.skuNumberFilter))).then(data => {
      this.skuTotalRecords = data.totalElements;
      data.content = data.content ? data.content : [];
      this.skuNumberList = data.content;
      this.skuNumberList.forEach(item => {
        item.skuType = item.firstLevel + '>' + item.secondLevel + item.thirdLevel;
        item.mrpCalc = item.mrpCalc ? '是' : '否';
      })
      this.display_sku_number = true;
    }).catch(oError => this.popupService.showError(oError));
  }

  //全部
  public all(){
    this.query['types'] = [];
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

  //设置状态
  public setStatus(rowData){
    this.service.updateSpuStatus(rowData.id,{status:rowData.status == 1 ? -1 : 1})
        .then(data => this.setSpus())
        .catch(res => this.popupService.showError(res));
  }

}