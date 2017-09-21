import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';

// the Service of FoundationinfoModule
import {FoundationinfoService} from '../../foundationinfo-data.service';
import { Title }     from '@angular/platform-browser';

import { SelectItem,DetailData } from './sku-create.data';
import { PopupService } from 'core/services/popup.service';
import { Location } from '@angular/common';
import { BASE_URL } from 'core/constants/global-setting';

@Component({
  selector: 'sku-create',
  templateUrl: './sku-create.component.html',
  styleUrls: ['./sku-create.component.scss']
})
export class SkuCreateComponent implements OnInit {

  private data         : any;

  private emptyMessage : string  = '没有记录';
  private isUpdate     : boolean = false;

  private spuTotalRecords :number = 0;
  private skuTotalRecords :number = 0;
  private skuDataListfirst:number = 0;
  private spuDataListfirst:number = 0;

  private spuModalToolbarConfigs: any = [];
  private skuModalToolbarConfigs: any = [];

  private spuQuery :any = {};

  private skuQuery :any = {};

  private curImgSrc    : string  = '';
  private imgs         : any = [];
  private imgDatas     : any = [];
  
  

  //控制显示对应选择器状态
  private display_spu_type_modal : boolean = false;
  private display_spu_modal : boolean = false;
  private display_sku_bom_modal  : boolean = false;
  private display_procedure_modal: boolean = false;
  private display_outside_box_modal : boolean = false;

  /**
   * [selectedSpu 选择的SPU]
   * @type {any}
   */
  public selectedSpu   : any;
  /**
   * [firstLevelItems 物料类型 一级分类数据]
   * [secondLevelItems物料类型 二级分类数据]
   * [thirdLevelItems 物料类型 三级分类数据]
   * @type {Array<any>}
   */
  private firstLevelItems : Array<any> = [];
  private secondLevelItems: Array<any> = [];
  private thirdLevelItems : Array<any> = [];
  /**
   * [handleModeItems 交付方式下拉选择数据]
   * [activeHandleModeItem 处理方式 用于数据回显]
   * items 按单、备品、按单和备品
   * @type {Array<any>}
   */
  private handleModeItems       : Array<any> = [];
  private activeHandleModeItem  : Array<any> = [];
  /**
   * [productModeItems 生产方式下拉选择数据]
   * [activeProductModeItems 生产方式 用于数据回显]
   * items 自制、委外、采购、来料
   * @type {Array<any>}
   */
  private productModeItems       : Array<any> = [];
  private activeProductModeItem  : Array<any> = [];
  /**
   * [partakeMrpCalcItems 参与MRP计算下拉选择数据]
   * [activePartakeMrpCalcItems 参与MRP计算 用于回显]
   * @type {Array<any>}
   */
  private partakeMrpCalcItems      : Array<any> = [];
  private activePartakeMrpCalcItem : Array<any> = [];

  /**
   * [measureItems 计量单位下拉选择数据]
   * [activeMeasureItem 计量单位 用于回显]
   * @type {Array<any>}
   */
  private measureItems        : Array<any> = [];
  private activeMeasureItem   : Array<any> = [];
  /**
   * [userGroupItems 组织关系下拉选择数据]
   * [activeUserGroupItem 组织 用于回显]
   * @type {Array<any>}
   */
  private userGroupItems      : Array<any> = [];
  private activeUserGroupItem : Array<any> = []; 
  /**
   * [spuDataList SPU选择器列表数据]
   * @type {Array<any>}
   */
  private spuDataList  : Array<any> = [];

  /**
   * [skuDataList SKU选择器列表数据]
   * @type {Array<any>}
   */
  private skuDataList  : Array<any> = [];
  /**
   * [procedureDataList 工序选择器列表数据]
   * @type {Array<any>}
   */
  private procedureDataList  : Array<any> = [];

  /**
   * [SelectedSpuDataList 物料选择器列表选中的数据]
   * @type {Array<any>}
   */
  private SelectedSpuDataList : Array<any> = [];

  /**
   * [SelectedSkuDataList description]
   * @type {Array<any>}
   */
  private SelectedSkuDataList : Array<any> = [];
   /**
   * [SelectedProcedureDataList 工序选择器列表选中的数据]
   * @type {Array<any>}
   */
  private SelectedProcedureDataList : Array<any> = [];

  /**
   * [selectedBoms 物料关系列表选中的数据]
   * @type {Array<any>}
   */
  private selectedBoms : Array<any> = [];
  /**
   * [selectedProcedures 工序关系列表选中的数据]
   * @type {Array<any>}
   */
  private selectedProcedures : Array<any> = [];

  /**
   * [piffers 皮费]
   * @type {Array<any>}
   */
  private piffers : Array<any> = [];
  
  private title: string = "";

  //外箱/内箱参数
  private boxFilter : Object = {};
  private boxQuery : Object = {};
  private boxFirst : number = 0;
  private boxTotalRecords : number = 0;
  private boxSearchKeyWord : string = '';
  private boxDataList : Array<any> = [];
  private selectedBoxData : Array<any> = [];
  private toolbarConfigs : Array<any> = [];
  private boxName : string = '外箱名称';
  private heaaderBoxName : string = '选择外箱';

  //提前期
  private leadTimeItems : Array<any> = [];
  //回显提前期
  private activeLeadTimeItem : Array<any> = [];

   constructor(
     private router : Router,
     private route : ActivatedRoute, 
     private popupService: PopupService,
     private titleService: Title,
     private service:FoundationinfoService,
     private location: Location){

      //交付方式
      this.handleModeItems = SelectItem.handleModeItems;
      //生产方式
      this.productModeItems = SelectItem.productModeItems;
      //提前期
      this.leadTimeItems = SelectItem.leadTimeItems;

      this.partakeMrpCalcItems.push({id:'1', text:'是'});
      this.partakeMrpCalcItems.push({id:'0', text:'否'});

      this.piffers.push({name:'皮费',type:'制造费用',amount:'',comment:''});
   };

ngOnInit() {
    this.data = {
        code:'',
        customCode:'',
        name:'',
        spuName:'',
        spuId:'',
        skutype:'',
        handleMode:'',
        measureId:'',
        measureName:'',
        mrpCalc:'',
        userGroupId:'',
        typeId:'',
        productMode:'',
        skuAttrs:[],
        skuBoms:[],
        spuProcedures:[],
        comment:'',
       };


    this.spuModalToolbarConfigs = [
      {
        type: "search",
        handler: this.onQuerySpus.bind(this),
        align: "right"
      }
    ];

    this.skuModalToolbarConfigs = [
      {
        type: "search",
        handler: this.onQuerySkus.bind(this),
        align: "right"
      }
    ];


    this.spuQuery ={
      searchKeyWord:'',
      pageNum:1,
      pageSize:10,
      status:1
    };

    this.skuQuery =  {
      searchKeyWord:'',
      pageNum:1,
      pageSize:10,
      status:1
    };


    this.titleService.setTitle('新增物料SKU');
    //提前期默认是小时
    this.activeLeadTimeItem = [this.leadTimeItems[1]];
    this.data.leadType = "hour";

    this.route.params.subscribe(params => {
        var operation = params['operation'],id = params['id'];

        //获取组织
        this.service.getUserGroups().then(data =>{
          data.map(i =>i.text = i.name);
          this.userGroupItems = data;

          if('edit' === operation){

            this.title ='修改物料SKU';
            this.titleService.setTitle('修改物料SKU');
            this.isUpdate = true;

            this.service.getSku(params['id'])
              .then(data=>this.data = this.formatDetailData(data))
              .catch(res => this.popupService.showError(res));
          };

        }).catch(res => this.popupService.showError(res));
    })
  };


  /**
   * [onOpenSpuModal 弹出选择SPU的选择器]
   */
  public onOpenSpuModal():void{
    
    this.selectedSpu = {};

    this.service.getSpus(encodeURIComponent(JSON.stringify(this.spuQuery))).then(data =>{

      data.content.map(i=>{
          i['childId'] = i.id;
        });
      this.spuDataList = data.content;
      this.spuTotalRecords = data.totalElements;

      //回显SPU选择器选中数据
      this.spuDataList.map(i =>{
       if(i.id === this.data.spuId || i.name === this.data.spuName){
         this.selectedSpu = i;
       }
      });
      this.display_spu_modal = true;

    }).catch(res => this.popupService.showError(res));
  };

  /**
   * [inheritSpuProperty 继承SPU属性]
   * @param {[type]} spuId [description]
   */
  public inheritSpuProperty():void{
    this.data.spuName = this.selectedSpu.name;
    this.data.spuId   = this.selectedSpu.id;
    this.data.safeStock   = this.selectedSpu.safeStock;
    this.display_spu_modal = false;
    this.service.getSpu(this.data.spuId).then(spu =>{
      //物料类型
      this.data['skutype'] = spu['firstLevel']+'->'+ spu['secondLevel']+'->'+ spu['thirdLevel'];
      this.data.firstLevel = spu['firstLevel'];
      this.data.secondLevel= spu['secondLevel'];
      this.data.thirdLevel = spu['thirdLevel'];

      if(spu['firstLevel'] ==='产成品' || spu['firstLevel'] === '半成品' || spu['firstLevel'] === '备品'){
        this.piffers[0]['amount'] = spu['piffer'];
        this.piffers[0]['comment'] = spu['pifferComment'];
      }
      this.data['typeId']  = spu['typeId'];
      //处理方式
      this.handleModeItems.map(i =>{
        this.data['handleMode'] = spu['handleMode'];
        if(i.id === spu['handleMode'])
          this.activeHandleModeItem = [i];
      });
      //生产方式
      this.productModeItems.map(i =>{
        this.data['productMode'] = spu['productMode'];
        if(i.id === spu['productMode'])
          this.activeProductModeItem = [i];
      });
      //参与计算
      if(spu['mrpCalc']){
        this.activePartakeMrpCalcItem = [{id:'1',text:'是'}];
      }else{
        this.activePartakeMrpCalcItem = [{id:'0',text:'否'}];
      }
      //提前期
      if(spu['leadTime'] && spu['leadType']){
        this.data['leadTime'] = spu['leadTime'];
        this.data['leadType'] = spu['leadType'];
        this.leadTimeItems.map(item => {
          if(item.id ==  spu['leadType']){
            this.activeLeadTimeItem = [item];
          }
        })
      }

      this.data['mrpCalc'] = spu['mrpCalc'];

      //组织关系
      this.userGroupItems.map(i =>{
        this.data['userGroupId'] = spu['userGroupId'];
        if(i.id === spu['userGroupId'])
          this.activeUserGroupItem = [i];
      });
      //扩展属性字段
      this.data.skuAttrs = [];
      spu.spuAttrs.map(i =>{
        if(i.forSkuEncode){
          this.data.skuAttrs.push(i);
        }
      });

      this.data.skuAttrs.map(i =>{
        i['name']        = i.attrName;
        i['items']       = i.values;
        i['items'].map(n =>{
          n.text = n.value;
        });
        i['activeItem']  = i['items'] && i['items'].length > 0 ? [i['items'][0]] : [];

      });

      //计量单位
      this.service.getMeasuresByType(spu['measureType']).then(measures=>{

        measures.map(i =>{i.id = i.code;i.text =i.name;});
        this.measureItems = measures;
        this.measureItems.map(i =>{
          if(spu['spuMeasureId'] === i.id){
            this.activeMeasureItem = [i];
          }
        });
        
        this.data['measureId'] = spu['spuMeasureId'];

      }).catch(res => this.popupService.showError(res));

      //包装信息
      //外箱  
      if(spu['firstLevel'] ==='产成品'){
        this.data['outsideBoxName'] = spu['outerSku'] ? spu['outerSku'].name : '';
        if(spu['outerSku'] && spu['outerSku'].code){
          this.data['outerCode'] = spu['outerSku'].code ;
        }
        if(spu['outerSku'] && spu['outerSku'].skuAttrs && spu['outerSku'].skuAttrs[0].value){
          this.data['outsideBoxSpecifications'] = spu['outerSku'].skuAttrs[0].value.code;
        }
        this.data['outerNumber'] = spu['outerNumber'];
         //内箱
        this.data['withinBoxName'] = spu['innerSku'] ? spu['innerSku'].name : '';

        if(spu['innerSku'] && spu['innerSku'].code){
          this.data['innerCode'] = spu['innerSku'].code ;
        }
        this.data['innerCode'] = spu['innerSku'] ? spu['innerSku'].code : '';
        if(spu['innerSku'] && spu['innerSku'].skuAttrs && spu['innerSku'].skuAttrs[0].value){
          this.data['withinBoxSpecifications'] = spu['innerSku'].skuAttrs[0].value.code;
        }    
        this.data['innerNumber'] = spu['innerNumber'];
      }

      //图片
      if(spu['files']){
        this.data['files'] = spu['files'];
        this.data['files'].map(file =>{
          this.imgs.push(BASE_URL+ file.path);
        });
        this.curImgSrc = this.imgs[0];
      }
      
    });
  };

  /**
   * [onSelectedSpu 确定选择SPU]
   */
  public onSelectedSpu():void{
    this.inheritSpuProperty();
  };

  /**
   * [refreshSkuAttrValues 扩展属性字段选择下拉值]
   */
  public refreshSkuAttrValues(item,event):void{
    item['activeItem'] = [event];

    if(event.length==0)
       item['activeItem'] = [];


  };

  /**
   * [onSpuRowDblclick 双击选择SPU]
   * @param {[type]} event [description]
   */
  public onSpuRowDblclick(event):void{
    this.selectedSpu  = event.data;
    this.inheritSpuProperty();
  };

  /**
   * [onSpuDataListPage SPU选择数据分页]
   * @param {[type]} event [description]
   */
  public onSpuDataListPage(event):void{

    this.spuDataListfirst = event.first;
    this.spuQuery['pageNum'] = (event.first/event.rows)+1;
    this.spuQuery['pageSize'] = event.rows;

    this.setSpus();

  };

  /**
   * [onQuerySpus 查询过滤SPU选择器数据]
   */
  public onQuerySpus(searchKeyWord:string):void{

    if(searchKeyWord){
      searchKeyWord = searchKeyWord.trim(); 
    }

    this.spuDataListfirst = 0;
    this.spuQuery['searchKeyWord'] = searchKeyWord;
    this.spuQuery['pageNum'] = 1;
    
    this.setSpus();
  };


 /**
   * [setSpus 设置SPU选择器列表数据]
   */
  public setSpus():void{
    this.service.getSpus(encodeURIComponent(JSON.stringify(this.spuQuery))).then(data =>{

      data.content.map(i=>{
          i['childId'] = i.id;
        });
      this.spuDataList = data.content;
      this.spuTotalRecords = data.totalElements;

      //回显SPU选择器选中数据
      this.spuDataList.map(i =>{
       if(i.id === this.data.spuId || i.name === this.data.spuName){
         this.selectedSpu = i;
       }
      });

    }).catch(res => this.popupService.showError(res));
  };


   /**
    * [onSkuDataListPage SKU选择器分页]
    * @param {[type]} event [description]
    */
  public onSkuDataListPage(event):void{

    this.skuDataListfirst = event.first;
    this.skuQuery['pageNum'] = (event.first/event.rows)+1;
    this.skuQuery['pageSize'] = event.rows;

    
    this.setSkus();
  
  };

  /**
   * [onSkuListSort SKU选择器排序]
   * @param {[type]} event [description]
   */
  public onSkuListSort(event):void{

    var orderItem = {
      columnName:event.field,
      asc:event.order===1?true:false
    }

    this.skuQuery['orderItem']=orderItem;
    this.setSkus();
  };


  /**
   * [onSpuListSort SPU选择器排序]
   * @param {[type]} event [description]
   */
  public onSpuListSort(event):void{
    var orderItem = {
      columnName:event.field,
      asc:event.order===1?true:false
    }

    this.spuQuery['orderItem']=orderItem;
    this.setSpus();
  }

  /**
   * [setSpus 设置sku选择器列表数据]
   * @param {any} filter [过滤数据]
   */
  public setSkus():void{

    if(this.isUpdate){
      this.skuQuery['code'] = this.data.code;
    }

    this.skuQuery['types'] =["商品","产成品"];

    this.service.getSkus(encodeURIComponent(JSON.stringify(this.skuQuery))).then(data =>{
          data.content.map(i =>{
            i['childCode'] = i.code;
            i['skuTypeName'] = i.firstLevel+'>'+i.secondLevel+'>'+i.thirdLevel;
          });
          this.skuDataList = data.content;
          this.skuTotalRecords = data.totalElements;


          //回显SKU选择选中的数据
          if(!this.data.skuBoms){
            return;
          }

          this.data.skuBoms.map(i =>{
            this.skuDataList.map(n =>{
              if(i.childCode === n.childCode){
                this.SelectedSkuDataList.push(n);
              }
            });
          });

        });
  };

  /**
   * [onQuerySpus 查询过滤SPU选择器数据]
   */
  public onQuerySkus(searchKeyWord:string):void{

    
    if(searchKeyWord){
      searchKeyWord = searchKeyWord.trim(); 
    }

    this.skuDataListfirst = 0;
    this.skuQuery['searchKeyWord'] = searchKeyWord;
    this.skuQuery['pageNum'] =1;

    this.setSkus();

    };

  /**
   * [onSpuRowlclick 单击选择SPU列表]
   * @param {[type]} event [description]
   */
  public onSpuRowlclick(event):void{
    this.selectedSpu  = event.data;
  };

  /**
   * [CaneclSpuModal 关系SPU选择器]
   */
  public onCloseSpuModal():void{
    this.spuDataList.map(i =>{
     if(i.id === this.data.spuId){
       this.selectedSpu = i;
     }
    });
    this.display_spu_modal = false;
  };

  /*
   * [onOpenSpuTypeModal 弹出物料分类选择器]
   */
  public onOpenSpuTypeModal():void{
    this.display_spu_type_modal = true;
  };
  /**
   * [onFirstLevelItemClick 物料分类-->选择一级分类]
   * @param {[type]} Item [一级分类]
   */
  public onFirstLevelItemClick(item):void{
    item.active   = true;

    this.firstLevelItems.map(i =>{
      if(i.id !== item.id){
        i['active'] = false;
      }
    });
    //异步加载下一级分类信息
    this.service.getLazySpuTypes(item.id).then(data =>{
      this.secondLevelItems = data.content;
      this.thirdLevelItems  = [];
    });
  };
  /**
   * [onSecondLevelItemClick 物料分类-->选择二级分类]
   * @param {[type]} item [二级分类]
   */
  public onSecondLevelItemClick(item):void{
    item.active   = true;

    this.secondLevelItems.map(i =>{
      if(i.id !== item.id){
        i['active'] = false;
      }
    });
    //异步加载下一级分类信息
    this.service.getLazySpuTypes(item.id).then(data =>{
      this.thirdLevelItems = data.content;
    });
  };
  /**
   * [onThirdLevelItemClick 物料分类-->选择三级分类]
   * @param {[type]} item [三级分类]
   */
  public onThirdLevelItemClick(item):void{
    item.active = true;

    this.thirdLevelItems.map(i =>{
      if(i.id !== item.id){
        i['active'] = false;
      }
    });

  };
  /**
  * [onLevelChange 分类过滤]
  * @param{[string] key [过滤关键字]}
  */
  public onLevelSearch(key):void{

  };
  /**
   * [onSelectedSpuType 确定选择物料类型]
   */
  public onSelectedSpuType():void{
    var sTr = '';
    this.firstLevelItems.map(i =>{
      if(i['active'])
        sTr = i.name;
    });
    this.secondLevelItems.map(i =>{
      if(i['active'])
      sTr +='->'+i.name;
    });
    this.thirdLevelItems.map(i =>{
      if(i['active']){
        sTr +='->'+i.name;
        this.data.typeId = i.id;
      }
    });
    this.data.sputype = sTr;
    this.display_spu_type_modal = false;
  };
  /**
   * [refreshValue 处理方式/生产方式/是否参与MRP计算选择下拉数据]
   * @param {string} key   [description]
   * @param {any}    value [选择的数据]
   */
  public refreshValue(key:string,value:any):void {
    this.data[key] = value.id;
    if(key == 'productMode'){
      if(value.id == 'PURCHASE'){
        this.handleModeItems = this.handleModeItems.filter(item => {
          return item.id != 'SPARE_ORDER';
        })
      }else{
        this.handleModeItems = SelectItem.handleModeItems;
      }
    }
  }

 /**
  * [removed 处理方式/生产方式/是否参与MRP计算清空下拉数据]
  * @param {string} key   [description]
  * @param {any}    value [删除的数据]
  */
  public removed(key:string,value:any):void {
    this.data[key] = null;
  }
  /**
   * [onSelectedMeasure 选择计量单位]
   */
  public refreshMeasure(event):void{
    this.data.measureId = event.id;
  };
  /**
   * [onRemovedMeasure 清空计量单位]
   * @param {[type]} event [description]
   */
  public onRemovedMeasure(event):void{
     this.data.measureId = null;
  };

  


  /**
   * [onOpenSpuBomModal 点击 物料关系-->添加]
   */
  public onOpenSkuBomModal():void{

    if(!this.data.firstLevel){

      this.popupService.alert('请选择SPU');
      return;
    }

    this.SelectedSpuDataList = [];

    if(this.isUpdate){
      this.skuQuery['code'] = this.data.code;
    }

    this.skuQuery['types'] =["商品","产成品"];


    this.service.getSkus(encodeURIComponent(JSON.stringify(this.skuQuery)))
        .then(data =>{
          data.content.map(i =>{
            i['childCode'] = i.code;
            i['skuTypeName'] = i.firstLevel+'>'+i.secondLevel+'>'+i.thirdLevel;
          });
          this.skuDataList = data.content;
          this.skuTotalRecords = data.totalElements;


          if(!this.data.skuBoms){
            return;
          }

          this.data.skuBoms.map(i =>{
            this.skuDataList.map(n =>{
              if(i.childCode === n.childCode){
                this.SelectedSkuDataList.push(n);
              }
            });
          });

          this.display_sku_bom_modal = true;


        }).catch(res => this.popupService.showError(res));

  };

  /**
   * [onSelectedSkuBoms 选择物料]
   */
  public onSelectedSkuBoms():void{
    // check the item is in boms
    var checkInBom = function (item,boms) {
      var a = false;
      boms.map(i =>{
        if(i.childCode === item.childCode)
          a =true;
          return;
      });

      return a;
    };
    this.SelectedSkuDataList.map(item =>{
      item['skuTypeName'] = item.firstLevel+'>'+item.secondLevel+'>'+item.thirdLevel;
    });


    if(this.data.skuBoms.length ===0){
      this.data.skuBoms = this.SelectedSkuDataList.slice(0);
      this.SelectedSkuDataList.map(i =>{
        this.service.getMeasuresByType(i.measureTypeCode)
            .then(data =>{
              i['measureItems'] = [];

              data.map(n =>{
                i['measureItems'].push({label:n.name,value:n.code});
              });

            }).catch(res =>this.popupService.showError(res));
      });



    }else{
      this.SelectedSkuDataList.map(i =>{
        if(!checkInBom(i,this.data.skuBoms)){
           this.data.skuBoms.push(i);
           this.service.getMeasuresByType(i.measureTypeCode)
            .then(data =>{
              i['measureItems'] = [];

              data.map(n =>{
                i['measureItems'].push({label:n.name,value:n.code});
              });

            }).catch(res =>this.popupService.showError(res));
        }
        
      });
    }
    this.display_sku_bom_modal = false;
  };
  /**
   * [onCloseSkuBomModal 关闭物料选择器]
   */
  public onCloseSkuBomModal():void{
    this.display_sku_bom_modal = false;
  };
  /**
   * [onDelSpuBom 点击 物料关系-->删除]
   */
  public onDelSkuBom():void{
    this.selectedBoms.map(item =>{
      this.data.skuBoms = this.data.skuBoms.filter(n => n !== item);
      this.SelectedSkuDataList = this.SelectedSkuDataList.filter(n => n !== item);
    });
  };

  /**
   * [selectProcedures 点击 工序关系-->添加]
   */
  public onOpenProcedureModal():void{
    this.display_procedure_modal = true;

  };

 /**
  * [onSelectedProcedures 确定选择工序]
  */
  public onSelectedProcedures():void{

  };

  /**
   * [onDelProcedure 点击 工序关系-->删除]
   */
  public onDelProcedure():void{

  };


    /**
   * [setStatus 启用或者禁用]
   */
  public setStatus(status:number):void{

    this.data['status'] = status;
    this.service.updateSkuStatus(this.data.code,{status:status})
        .then()
        .catch(res => this.popupService.showError(res));
        
  };
  
  /**
   * [onSubmit 提交表单数据]
   * @param {any} skuForm [表单]
   */
  public onSubmit(skuForm:any):void{
    var valid_bom_qty_null = true;
    var toSubmit = true;
    var  funcName = 'addSku';

    if(!skuForm.form.valid){
      return;
    };

    if(!this.data.handleMode) return;

    if(this.data.handleMode !=='IN_COMING' && !this.data.productMode) return;

    if(this.data.mrpCalc === '' || this.data.mrpCalc === undefined) return;

    if(this.data.leadType === '' || this.data.leadType === undefined) return;

    if( typeof(this.data.mrpCalc)!=='boolean'){
      this.data.mrpCalc = this.data.mrpCalc==='1'?true:false;
    }

    if(this.data.firstLevel === '产成品' || this.data.firstLevel === '半成品'){

        this.data.piffer = this.piffers[0]['amount'];
        this.data.pifferComment = this.piffers[0]['comment'];

        var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;

        if(!this.data.piffer){
          this.popupService.alert('皮费金额必填!');
          return;
        }

        if(!reg.test(this.data.piffer)){
          this.popupService.alert('皮费金额只能数字');
          return;
        }
    }

    
    if(this.data['skuAttrs']){
      this.data['skuAttrs'].map(i =>{
        if(i.activeItem[0] === undefined){
          toSubmit = false;
          return;
        }else{
          i['value'] = i.activeItem[0];
        }
      });
    };

    if(this.data.firstLevel ==='原料'){
       this.data.skuBoms = [];
    }

    if(this.data['skuBoms']){
      this.data['skuBoms'].map(i=>{
        if(!i.qty){
          valid_bom_qty_null = false;
        }
      });
    };



    if(!valid_bom_qty_null){
      this.popupService.alert('BOM数量必填!');
      return;
    }


    if(this.isUpdate){
      funcName = 'updateSku';
    }

    if(this.imgDatas.length>0 && toSubmit){
      let formData   = new FormData(skuForm);
      var index = 0;
      this.imgDatas.map(i =>{

        formData.append('file',i);
        this.service.uploadFile(formData)
          .then(data =>{
            index ++;
            if(index === this.imgDatas.length){

              this.data['files'] = this.data['files']?this.data['files']:[];

              data.map(id =>{
                this.data['files'].push({id:id});
              });

              this.service[funcName](this.data).then(data=>this.location.back())
              .catch(res=>this.popupService.showError(res));
                
            }
          })
          .catch(res => this.popupService.showError(res));

      });
    }else if(toSubmit){
      this.service[funcName](this.data).then(data=>this.location.back())
      .catch(res=>this.popupService.showError(res));
    }


  };


  /**
   * [onCancel click calcel button]
   */
  public onCancel():void{
    this.location.back(); 
  };

  /**
   * [formatDetailData 格式化SPU详情数据]
   * @param {Object} data []
   */
  public formatDetailData(data:Object):Object{

    data['skutype'] = data['firstLevel']+'->'+ data['secondLevel']+'->'+ data['thirdLevel'];

    this.service.getSpu(data['spuId']).then(spu =>{
      //处理计量单位
      this.service.getMeasuresByType(spu['measureType']).then(measures=>{
        measures.map(i =>{i.id = i.code;i.text =i.name;});
        this.measureItems = measures;
        this.measureItems.map(i =>{
           if(i.id === data['measureId'])
              this.activeMeasureItem = [i];
        });
      
      }).catch(res => this.popupService.showError(res));

      //处理产品属性 扩展字段
      if(this.data.skuAttrs){
        
        this.data.skuAttrs.map(i =>{
          
          this.service.getSpuAttr(i.attrId).then(attr =>{
          
            i['items'] = attr.values;
            i['items'].map(n =>{
              n.text = n.value;
            });
          
          }).catch(res => this.popupService.showError(res));

          i['activeItem'] = [{id:i.value.id,text:i.value.value}];

        });
      }

    });

    //提前期类型
    if(data['leadType']){
      this.leadTimeItems.map(item => {
        if(item.id == data['leadType']){
          this.activeLeadTimeItem = [item];
        }
      })
    }

    // 交付方式
    this.handleModeItems.map(i =>{
       if(i.id === data['handleMode'])
          this.activeHandleModeItem = [i];
    });

    if(data['productMode'] == 'PURCHASE'){
      this.handleModeItems = this.handleModeItems.filter(item => {
        return item.id != 'SPARE_ORDER';
      })
    }
    //生产方式
    this.productModeItems.map(i =>{
       if(i.id === data['productMode'])
          this.activeProductModeItem = [i];
    });
    //参与MRP计算
    if(data['mrpCalc']){
       this.activePartakeMrpCalcItem = [{id:'1', text:'是'}];
    }else{
       this.activePartakeMrpCalcItem = [{id:'0', text:'否'}];
    };
     
    //包装信息
    //外箱
    data['outsideBoxName'] = data['outerSku'] ? data['outerSku'].name : '';
    if(data['outerSku'] && data['outerSku'].code){
      data['outerCode'] = data['outerSku'].code
    }
    if(data['outerSku'] && data['outerSku'].skuAttrs && data['outerSku'].skuAttrs[0].value){
      data['outsideBoxSpecifications'] = data['outerSku'].skuAttrs[0].value.code;
    }
     //内箱
    data['withinBoxName'] = data['innerSku'] ? data['innerSku'].name : '';
    if(data['innerSku'] && data['innerSku'].code){
      data['innerCode'] = data['innerSku'].code
    }
    if(data['innerSku'] && data['innerSku'].skuAttrs && data['innerSku'].skuAttrs[0].value){
      data['withinBoxSpecifications'] = data['innerSku'].skuAttrs[0].value.code;
    }

    //组织关系
    this.userGroupItems.map(i =>{
       if(i.id === data['userGroupId']){
          this.activeUserGroupItem = [i];
       }
    });



    if(data['skuBoms']){
      data['skuBoms'].map(i =>{
        i.childCode= i.child.code;
        i.name = i.child.name;
        i.skuTypeName =i.child.firstLevel+'->'+i.child.secondLevel+'->'+i.child.thirdLevel;
        i.userGroupName = i.child.userGroupName;
        i.measureName = i.child.measureName;

        this.service.getMeasuresByType(i.child.measureTypeCode)
            .then(data =>{
              i['measureItems'] = [];

              data.map(n =>{
                i['measureItems'].push({label:n.name,value:n.code});
              });

            }).catch(res =>this.popupService.showError(res));
      });
    }

     //sku图片
    if(data['files']){
      data['files'].map(file =>{
        this.imgs.push(BASE_URL+file.path);
      });
      this.curImgSrc = this.imgs[0];
    }

    //皮费
    this.piffers[0]['amount']  = data['piffer'];
    this.piffers[0]['comment'] = data['pifferComment'];

    return data;
  };


  public  setAccountStyles():any{
     let styles = {
          'width':'120px',
          'overflow':'visible'

        };
        return styles;
    }

    /**
   * [onImgChange 修改添加图片]
   * @param {[type]} event [description]
   */
  public onImgChange(event):void{
    let fileReader = new FileReader(),
        that       = this;


    var checkImgExist = function (imgs,img) {
      var isExist = false;
        imgs.map(i =>{
          if(i.name === img.name) 
            isExist = true;
        });
        return isExist;
    }

    fileReader.onload = function(loadReader : any){
      
      if(that.imgs.includes(loadReader.target.result)){
        that.popupService.alert('该图片已经存在!');
        return;
      }

      that.curImgSrc = loadReader.target.result;
      that.imgs.push(loadReader.target.result);
    }

    if(!checkImgExist(this.imgDatas,event.target.files[0])){
      fileReader.readAsDataURL(event.target.files[0]);
      this.imgDatas.push(event.target.files[0]);
    }else{
      this.popupService.alert('该图片已经存在,请选择其他图片!');
    }

  };

  /**
   * [onRemoveImg 删除图片]
   * @param {[type]} img [description]
   */
  public onRemoveImg(img,index):void{
    this.imgs = this.imgs.filter(i => i!=img);
    this.curImgSrc = '';
    this.imgDatas.splice(index,1);
    if(this.data['files']){
      for(var i =0;i<this.data['files'].length;i++){

        if(BASE_URL+this.data['files'][i].path === img){
          this.data['files'].splice(i,1);
        }
      }
      
    }
  };


  /**
   * [onMouseoverImg 鼠标悬停在图片上]
   * @param {[type]} img [description]
   */
  public onMouseoverImg(img):void{
    this.curImgSrc = img;
  }


  //打开外箱modal
  public onOpenOutsideBoxModal(){
    this.boxQuery = {
      pageNum : 1,
      pageSize : 10,
      type:'外箱'
    }
    this.initFilter();
    this.getBoxList();
  }

  //打开外箱modal
  public onOpenWithinBoxModal(){
    this.boxQuery = {
      pageNum : 1,
      pageSize : 10,
      type:'内箱'
    }
    this.heaaderBoxName = '选择内箱';
    this.boxName = "内箱名称";
    this.initFilter();
    this.getBoxList();
  }

  public onPage(event){
    this.boxFirst = event.first;
    this.boxQuery['pageNum'] = event.page + 1;
    this.boxQuery['pageSize'] = event.rows;
    this.initFilter();
    this.getBoxList();
  }

  public onSort(event){

  }

  public onQuery(searchKey){
    this.boxSearchKeyWord = searchKey ? searchKey : searchKey.trim();
    this.boxFirst = 0;
    this.boxQuery['pageNum'] = 1;
    this.initFilter();
    this.getBoxList();
  }

  public determineBox(){
    if(this.boxQuery['type'] == '外箱'){
      this.data.outsideBoxName = this.selectedBoxData['name'];
      this.data.outerCode = this.selectedBoxData['code'];
      this.data.outsideBoxSpecifications = this.selectedBoxData['specifications'];
    }else if(this.boxQuery['type'] == '内箱'){
      this.data.withinBoxSpecifications = this.selectedBoxData['specifications'];
      this.data.withinBoxName = this.selectedBoxData['name'];
      this.data.innerCode = this.selectedBoxData['code'];
    }
    this.display_outside_box_modal = false;
  }

  public initFilter(){
    this.boxFilter = {
      pageNum : this.boxQuery['pageNum'],
      pageSize : this.boxQuery['pageSize'],
      searchKeyWord:this.boxSearchKeyWord,
      type : this.boxQuery['type']
    }
    if(this.boxQuery['orderItem']){
      this.boxFilter['orderItem'] = this.boxQuery['orderItem'];
    }
  }

  public getBoxList(){
    this.service.getSkuBoxList(this.boxFilter).then(data => {
      this.boxFormatData(data);
      this.boxTotalRecords = data.totalElements;
      this.display_outside_box_modal = true;
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

  public boxFormatData(data){
    let boxList = [],specifications = '';
    data.content.forEach(item => {
      item.skuAttrs = item.skuAttrs ? item.skuAttrs : [];
      item.skuAttrs.map(i => {
        if(i.name == '尺寸'){
          specifications = i.value.value;
        }
      });
      boxList.push({
        code:item.code,
        name:item.name,
        specifications : specifications
      })
    })
    this.boxDataList = boxList;
  }


}