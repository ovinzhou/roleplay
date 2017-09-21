import { Component, OnInit , HostListener} from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Location } from '@angular/common';


// the Service of FoundationinfoModule
import { FoundationinfoService} from '../../foundationinfo-data.service';
import { PopupService } from 'core/services/popup.service';
import { SelectItem,DetailData } from './spu-create.data';
import { BASE_URL } from 'core/constants/global-setting';


@Component({
  selector: 'spu-create',
  templateUrl: './spu-create-tab.component.html',
  styleUrls: ['./spu-create.component.scss']
})
export class SpuCreateComponent implements OnInit {

  private data         : any;
  private spuQuery     : any = {};
  private emptyMessage : string  = '没有记录';
  private isUpdate     : boolean = false;
  private first        : number  = 0;

  private curImgSrc    : string  = '';
  private imgs         : any = [];
  private imgDatas     : any = [];

  private spuTotalRecords       : number = 0;
  private spuModalToolbarConfigs: any = [];



  //控制选择确定按钮
  private disabled_spu_type : boolean = true;
  private disabled_spu_attr : boolean = true;
  private disabled_spu_bom  : boolean = true;
  private disabled_procedure: boolean = true;

  //控制显示对应选择器状态
  private display_spu_type_modal : boolean = false;
  private display_spu_attr_modal : boolean = false;
  private display_spu_bom_modal  : boolean = false;
  private display_procedure_modal: boolean = false;
  private display_outside_box_modal : boolean = false;
  
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
   * items 自制、委外、采购、来料
   * @type {Array<any>}
   */
  private handleModeItems       : Array<any> = [];
  private activeHandleModeItem  : Array<any> = [];
  /**
   * [productModeItems 生产方式下拉选择数据]
   * [activeProductModeItems 生产方式 用于数据回显]
   * items 按单、备品、按单和备品
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
   * [measureTypeItems 计量单位类型下拉选择数据]
   * [activeMeasureTypeItems 计量单位类型 用于回显]
   * @type {Array<any>}
   */
  private measureTypeItems        : Array<any> = [];
  private activeMeasureTypeItem   : Array<any> = [];
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
   * [spuDataList 物料选择器列表数据]
   * @type {Array<any>}
   */
  private spuDataList  : Array<any> = [];
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
   * [spuAttrsList 供选择的物料属性数据]
   * @type {Array<any>}
   */
  private spuAttrsList      : Array<any> = [];
  /**
   * [selectedSpuAtters 已选择的物料属性数据]
   * @type {Array<any>}
   */
  private selectedSpuAtters : Array<any> = [];

  /**
   * [piffers 皮费]
   * @type {Array<any>}
   */
  private piffers : Array<any> = [];

  private title: string = "";
  //组织
  private isShowGroupTree : boolean = false;
  private selectedGroup : any;
  //提前期
  private leadTimeItems : Array<any> = [];
  //回显提前期
  private activeLeadTimeItem : Array<any> = [];

  //外箱/内箱参数
  private boxFilter : Object = {};
  private boxQuery : Object = {};
  private boxFirst : number = 0;
  private boxTotalRecords : number = 0;
  private boxSearchKeyWord : string = '';
  private boxDataList : Array<any> = [];
  private selectedBoxData : Array<any> = [];
  private toolbarConfigs : any;
  private boxName : string = '外箱名称';
  private heaaderBoxName : string = '选择外箱';

  private oldSpuAttrList : any ;
  private backupAttrItems : any = {};
  private searchAttrValue : string = "";

  constructor(
    private router : Router,
    private route  : ActivatedRoute, 
    private titleService: Title,
    private popupService:PopupService,
    private service:FoundationinfoService,
    private location: Location){

    this.handleModeItems = SelectItem.handleModeItems;
    this.productModeItems = SelectItem.productModeItems;
    this.leadTimeItems = SelectItem.leadTimeItems;

    this.partakeMrpCalcItems.push({id:'1', text:'是'});
    this.partakeMrpCalcItems.push({id:'0', text:'否'});
    this.piffers.push({name:'皮费',type:'制造费用',amount:'',comment:''});
 };

ngOnInit() {
    this.toolbarConfigs = [
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      }
    ]
    this.data = {
      id:'',
      code:'',
      name:'',
      sputype:'',
      handleMode:'',
      mrpCalc:'',
      userGroupId:'',
      typeId:'',
      measureType:'',
      spuMeasureId:'',
      productMode:'',
      spuAttrs:[],
      spuBoms:[],
      spuProcedures:[],
      comment:'',
      status:1,
      safeStock:'0',
    };
    this.selectedGroup = {};
    //默认选中是
    this.activePartakeMrpCalcItem = [{id:'1', text:'是'}];
    this.data['mrpCalc'] = '1';
    //获取方式默认是自制
    this.activeProductModeItem = [this.productModeItems[0]];
    this.data.productMode = 'SELF_SUPPOR';
    //交付方式默认是按单
    this.activeHandleModeItem = [this.handleModeItems[0]];
    this.data.handleMode = 'MAKE_ORDER';
    //提前期默认是小时
    this.activeLeadTimeItem = [this.leadTimeItems[1]];
    this.data.leadType = "hour";
    this.spuQuery = {
      searchKeyWord:'',
      pageNum:1,
      pageSize:10,
      status:1
    };


    this.spuModalToolbarConfigs = [
      {
        type: "search",
        handler: this.onQuerySpus.bind(this),
        align: "right"
      }
    ]

    this.route.params.subscribe(params => {
      var operation = params['operation'],id = params['id'];
       this.titleService.setTitle( '新增物料SPU' );

      //获取物料类型一级分类
      this.service.getSpuTypes('').then(data =>{
        this.firstLevelItems = data.content;
      });

      //获取产品属性
      this.service.getSpuAttrs('').then(data =>{
        data.content.map(i =>{
          i.attrName = i.name;
          i.attrId   = i.id;
        });
        this.spuAttrsList = data.content;
        this.oldSpuAttrList = data.content;
      });



      //获取组织
      this.service.getProcedureGroup().then(data => {
      // this.service.getUserGroups().then(data =>{
        // data.map(i =>{
        //   i.text = i.name;
        // });
        this.formatGroupList(data);
        this.userGroupItems = data;


        //获取计量单位类型
        this.service.getMeasureTypes().then(data =>{
          data.map(i =>{
            i.id = i.code;
            i.text = i.name;
          });
          this.measureTypeItems = data;

          if('edit' === operation){

            this.isUpdate = true;
            this.title ='修改物料SPU';
            this.titleService.setTitle( '修改物料SPU' );

            this.service.getSpu(params['id']).then(data =>{
              

              this.data = this.formatDetailData(data);
            }).catch(res => this.popupService.showError(res));
          }

        }).catch(res => this.popupService.showError(res));

      }).catch(res => this.popupService.showError(res));
    })
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

    this.disabled_spu_type = true;
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

    this.disabled_spu_type = true;
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

    this.disabled_spu_type = false;
    this.thirdLevelItems.map(i =>{
      if(i.id !== item.id){
        i['active'] = false;
      }
    });

  };

  /**
   * [onSelectedSpuType 确定选择物料类型]
   */
  public onSelectedSpuType():void{
    var sTr = '';
    this.firstLevelItems.map(i =>{
      if(i['active']){
        sTr = i.name;
        this.data.firstLevel = i.name;
      }
    });
    this.secondLevelItems.map(i =>{
      if(i['active']){
        sTr +='->'+i.name;
        this.data.secondLevel = i.name;
      }
    });
    this.thirdLevelItems.map(i =>{
      if(i['active']){
        sTr +='->'+i.name;
        this.data.thirdLevel = i.name;
        this.data.typeId = i.id;
      }
    });

    if(this.data.firstLevel ==='原料'){
      this.data.spuBoms = [];
      //获取方式默认是采购
      this.activeProductModeItem = [{id:'PURCHASE', text:'采购'}];
      this.data.productMode = 'PURCHASE';
      this.handleModeItems = this.handleModeItems.filter(item => {
        return item.id != 'SPARE_ORDER';
      })
    }
    if(this.data.firstLevel ==='半成品' || this.data.firstLevel ==='产成品'){
      //获取方式默认是自制
      this.activeProductModeItem = [this.productModeItems[0]];
      this.data.productMode = 'SELF_SUPPOR';
      this.handleModeItems = SelectItem.handleModeItems;
    }

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
    this.data[key] = '';
  }
  /**
   * [refreshMeasureType 选择计量单位类型]
   */
  public refreshMeasureType(event):void{
    this.data.measureType  = event.id;
    this.data.spuMeasureId = null;
    this.service.getMeasuresByType(event.id).then(data =>{
      data.map(i =>{i.id  = i.code;i.text = i.name;});     
      this.measureItems = data; 
    });
    this.activeMeasureItem = [];
  };
  /**
   * [onRemovedMeasureType 清空计量单位类型]
   * @param {[type]} event [description]
   */
  public onRemovedMeasureType(event):void{
     this.data.measureType  = null;
     this.data.spuMeasureId = null;
     this.measureItems      = [];
     this.activeMeasureItem = [];
  };
  /**
   * [onSelectedMeasure 选择计量单位]
   */
  public refreshMeasure(event):void{
    this.data.spuMeasureId = event.id;
  };
  /**
   * [onRemovedMeasure 清空计量单位]
   * @param {[type]} event [description]
   */
  public onRemovedMeasure(event):void{
     this.data.spuMeasureId = null;
  };



  /**
   * [onSelectSpuAttr 弹出产品属性选择器]
   */
  public onOpenSpuAttrModal():void{
    this.display_spu_attr_modal = true;
  };
  /**
   * [pitchOnSpuAttr 选择产品属性]
   * @param {[type]} item [description]
   */
  public pitchOnSpuAttr(item):void{
    this.selectedSpuAtters.push(item);
    this.disabled_spu_attr = false;
    this.spuAttrsList = this.spuAttrsList.filter(i =>{
      return i.id != item.id;
    });
  };
  /**
   * [removeSpuAttr 删除产品属性]
   * @param {[type]} item [description]
   */
  public removeSpuAttr(item):void{
    this.spuAttrsList.push(item);
    this.selectedSpuAtters = this.selectedSpuAtters.filter(i =>{
      return i.id != item.id;
    });
    this.disabled_spu_attr = false;
  };
  /**
   * [selectSpuAttrs 选择产品属性]
   */
  public onSelectedSpuAttrs():void{
    var checkDuplicate = function (attrId,selectedDatas) {
      var isTrue = false;
      selectedDatas.map(i=>{
        if(i.attrId === attrId){
          isTrue = true;
        }
      });
      return isTrue;
    };

    if(this.data.spuAttrs === null || this.data.spuAttrs.length===0){

      this.data.spuAttrs = this.selectedSpuAtters.slice(0);

      this.data.spuAttrs.map(i =>{

        i['activeItems'] = [];
        i['items'] = [];

        i.values.map(n =>{
          i['items'].push({id:n.id,code:n.code,value:n.value,text:n.value});
        });

      });

    }else{
      this.selectedSpuAtters.map(i =>{

        if(!checkDuplicate(i.attrId,this.data.spuAttrs)){
          i['items'] = [];
          i['activeItems'] = [];
          i.values.map(n =>{
            i['items'].push({id:n.id,code:n.code,value:n.value,text:n.value});
          });
          this.data.spuAttrs.push(i);
        }

      });
      this.data.spuAttrs.map(i =>{

        if(!checkDuplicate(i.attrId,this.selectedSpuAtters)){
          this.data.spuAttrs = this.data.spuAttrs.filter(n =>i.attrId !== n.attrId);
        }
      });
    }

    this.display_spu_attr_modal = false;
    
  };


  /**
   * [onCancelSelectedSpuAttrs 关闭选择产品属性弹出框]
   */
  public onCancelSelectedSpuAttrs(){
   
    var checkDuplicate = function (attrId,selectedDatas) {
      var isTrue = false;
      selectedDatas.map(i=>{
        if(i.attrId === attrId){
          isTrue = true;
        }
      });
      return isTrue;
    };

    this.selectedSpuAtters = this.data.spuAttrs.slice(0);
    this.spuAttrsList = [];

    this.service.getSpuAttrs('').then(data =>{
      data.content.map(i =>{
        i.attrName = i.name;
        i.attrId   = i.id;

        if(!checkDuplicate(i.attrId,this.selectedSpuAtters)){
          this.spuAttrsList.push(i);
        }
      });
    });
   
    this.display_spu_attr_modal = false;
  };

  /**
   * [refreshSpuAttrValues 扩展属性字段选择数据]
   * @param {[type]} item  [当前属性字段对象]
   * @param {[type]} event [数据集合]
   */
  public refreshSpuAttrValues(item,event):void{
       item['activeItems'] = event;
  };


  /**
   * [onOpenSpuBomModal 点击 物料关系-->添加]
   */
  public onOpenSpuBomModal():void{

    if(!this.data.firstLevel){
      this.popupService.alert('请先选择物料类型');
      return;
    }

    this.display_spu_bom_modal = true;
    this.SelectedSpuDataList = [];

    this.setSpus();
  };

  /**
   * [onSelectedSpuBoms 选择物料]
   */
  public onSelectedSpuBoms():void{

    // check the item is in boms
    var checkInBom = function (item,boms) {
      var a = false;
      boms.map(i =>{
        if(i.childId === item.childId)
          a =true;
          return;
      });

      return a;
    };
    this.SelectedSpuDataList.map(item =>{
      item['spuTypeName'] = item.firstLevel+'>'+item.secondLevel+'>'+item.thirdLevel;

    });


    if(this.data.spuBoms.length ===0){
      this.data.spuBoms = this.SelectedSpuDataList.slice(0);
      this.SelectedSpuDataList.map(i =>{
        this.service.getMeasuresByType(i.measureTypeCode)
            .then(data =>{
              i['measureItems'] = [];

              data.map(n =>{
                i['measureItems'].push({label:n.name,value:n.code});
              });

            }).catch(res =>this.popupService.showError(res));
      });

    }else{
      this.SelectedSpuDataList.map(i =>{
        if(!checkInBom(i,this.data.spuBoms)) {
          this.data.spuBoms.push(i);
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
    this.display_spu_bom_modal = false;
  };

  /**
   * [onSpuDataListPage SPU选择数据分页]
   * @param {[type]} event [description]
   */
  public onSpuDataListPage(event):void{

    this.first = event.first;
    this.spuQuery['pageNum'] =(event.first/event.rows)+1;
    this.spuQuery['pageSize'] = event.rows;


    this.setSpus();

  };

  /**
   * [onQuerySpus 查询过滤SPU选择器数据]
   */
  public onQuerySpus(searchKeyWord:string):void{

    this.first = 0;

    if(searchKeyWord){
      searchKeyWord = searchKeyWord.trim(); 
    }

    this.spuQuery['searchKeyWord'] = searchKeyWord;
    this.spuQuery['pageNum'] = 1;

    this.setSpus();
    
  };

  /**
   * [setSpus 设置SPU选择器列表数据]
   * @param {any} filter [过滤数据]
   */
  public setSpus():void{

    if(this.isUpdate){
      this.spuQuery['id'] = this.data.id;
    }

    this.spuQuery['types'] =["产成品"];
    this.spuQuery['status'] = 1;


    this.service.getSpus(encodeURIComponent(JSON.stringify(this.spuQuery))).then(data =>{

      data.content.map(i=>{
          i['childId'] = i.id;
        });
      this.spuDataList = data.content;
      this.spuTotalRecords = data.totalElements;

      if(this.data.spuBoms){
        this.data.spuBoms.map(i =>{
          this.spuDataList.map(n =>{
            if(i.childId === n.childId){
              this.SelectedSpuDataList.push(n);
            }
          });
        });
      };

    }).catch(res => this.popupService.showError(res));
  };

  /**
   * [onDelSpuBom 点击 物料关系-->删除]
   */
  public onDelSpuBom():void{
    this.selectedBoms.map(item =>{
      this.data.spuBoms = this.data.spuBoms.filter(n => n !== item);
      this.SelectedSpuDataList = this.SelectedSpuDataList.filter(n => n !== item);
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
   * [onSubmit 提交表单数据]
   * @param {any} spuForm [表单]
   */
  public onSubmit(spuForm:any):void{
    var valid_attr_not_null = true,
        funcName = 'addSpu';

    if(!this.data.userGroupId){
      this.popupService.alert('组织必选');
      return;
    }
    if(!spuForm.form.valid){
      return;
    };

    if(!this.data.handleMode) return;

    if(this.data.handleMode !=='IN_COMING' && !this.data.productMode) return;

    if(this.data.mrpCalc === '' || this.data.mrpCalc === undefined) return;

    if(this.data.leadType === '' || this.data.leadType === undefined) return;

    if(typeof(this.data.mrpCalc) !== 'boolean'){
      this.data.mrpCalc = this.data.mrpCalc==='1'?true:false;      
    }


    if(this.data.firstLevel === '产成品' || this.data.firstLevel === '半成品' || this.data.firstLevel === '备品'){

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

    if(this.data['spuAttrs']){
      this.data['spuAttrs'].map(i =>{
        i.values = i.activeItems;
        if(i.activeItems.length ===0){
          valid_attr_not_null = false;
        }
      });
    };

    if(this.data.firstLevel ==='原料'){
       this.data.spuBoms = [];
    }


    if(this.data['spuBoms']){
      this.data['spuBoms'].map(i=>{

        if(i.child){
          i['childId'] = i.child.id;
        }

      });
    };



    if(this.isUpdate){
      funcName = 'updateSpu';
    }
    //组织id
    this.data.userGroupId = this.selectedGroup && this.selectedGroup.id ? this.selectedGroup.id : null;
    if(this.imgDatas.length>0){
      let formData   = new FormData(spuForm);
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
    }else{
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
   * [setStatus 启用或者禁用]
   */
  public setStatus(status:number):void{

    this.data['status'] = status;
    this.service.updateSpuStatus(this.data.id,{status:status})
        .then()
        .catch(res => this.popupService.showError(res));
  };

  /**
   * [formatDetailData 格式化SPU详情数据]
   * @param {Object} data []
   */
  public formatDetailData(data:Object):Object{
    // 物料类型
    data['sputype'] = data['firstLevel']+'->'+ data['secondLevel']+'->'+ data['thirdLevel'];

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

    //提前期类型
    if(data['leadType']){
      this.leadTimeItems.map(item => {
        if(item.id == data['leadType']){
          this.activeLeadTimeItem = [item];
        }
      })
    }
    
    //计量单位类型
    this.measureTypeItems.map(i =>{
       if(i.id === data['measureType']){
         this.activeMeasureTypeItem = [i];
         this.service.getMeasuresByType(i.id).then(measures =>{
           measures.map(i =>{i.id = i.code;i.text = i.name;});
           this.measureItems = measures;
           this.measureItems.map(m =>{
             if(m.id === data['spuMeasureId'])
               this.activeMeasureItem = [m];
           });
         });
       }
    });
    //产品属性
    if(data['spuAttrs']){
      if(data['spuAttrs'].length > 0){
         data['spuAttrs'].map(i =>{
            this.selectedSpuAtters.push({
              id:i.id,
              attrId:i.attrId,
              attrName:i.attrName,
              name:i.attrName,
              forSkuEncode:i.forSkuEncode,
              values:i.values
            });
            this.spuAttrsList = this.spuAttrsList.filter(n=> n.attrId !== i.attrId);
            i['activeItems'] = i.values;
            if(i['activeItems'].length > 0){
                 i['activeItems'].map(n =>{
                     n.text = n.value;
                 });  
            }
            this.service.getSpuAttr(i.attrId).then(data =>{
              i.values = data.values;
              i.items = data.values;
              i.items.map(j =>{
                j.text = j.value;
              });
            });
         });  


      }
    }
    
    this.selectedGroup = {
      label:data['userGroupName'],
      id:data['userGroupId'],

    }
    //组织关系
    this.userGroupItems.map(i =>{
       if(i.id === data['userGroupId'])
          // this.activeUserGroupItem = [i];
          this.selectedGroup = i;
    });

    //包装信息
    //外箱
    data['outsideBoxName'] = data['outerSku'] ? data['outerSku'].name : '';
    if( data['outerSku'] && data['outerSku'].code){
      data['outerCode'] = data['outerSku'].code;
    }
    if(data['outerSku'] && data['outerSku'].skuAttrs && data['outerSku'].skuAttrs[0].value){
      data['outsideBoxSpecifications'] = data['outerSku'].skuAttrs[0].value.code;
    }
     //内箱
    data['withinBoxName'] = data['innerSku'] ? data['innerSku'].name : '';
    if( data['innerSku'] && data['innerSku'].code){
      data['innerCode'] = data['innerSku'].code;
    }
    if(data['innerSku'] && data['innerSku'].skuAttrs && data['innerSku'].skuAttrs[0].value){
      data['withinBoxSpecifications'] = data['innerSku'].skuAttrs[0].value.code;
    }

    if(data['spuBoms']){
      data['spuBoms'].map(i =>{
        i.childId = i.child.id,
        i.name = i.child.name;
        i.spuTypeName =i.child.firstLevel+'->'+i.child.secondLevel+'->'+i.child.thirdLevel;
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
    };

    //spu图片
    if(data['files']){
      data['files'].map(file =>{
        this.imgs.push(BASE_URL+file.path);
      });
      this.curImgSrc = this.imgs[0];
    }


    //皮费
    if(data['piffer'] == 0){
      data['piffer'] = '0';
    }
    this.piffers[0]['amount']  = data['piffer'];
    this.piffers[0]['comment'] = data['pifferComment'];

    return data;
  };


  public setAccountStyles():any{
     let styles = {
          'width':'120px',
          'overflow':'visible'

        };
        return styles;
  };

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

  //选择产品属性进行格式化
  public selectSpuAttrFormatData(attr){
    this.spuAttrsList = this.spuAttrsList.filter(i =>{
      return i.id != attr.id;
    });
    attr['activeItems'] = [];
    attr['items'] = [];
    this.data.spuAttrs.push(attr);
    this.data.spuAttrs.map(i =>{

      i.values.map(n =>{
        i['items'].push({id:n.id,code:n.code,value:n.value,text:n.value});
      });

    });
  }

  //删除产品属性
  public delSpuAttr(index,attr):void{
    debugger
    this.spuAttrsList.push(attr);
    this.spuAttrsList = this.spuAttrsList.filter(item => {
      return item.attrName.includes(this.searchAttrValue);
    })
    if(this.backupAttrItems.backup && this.backupAttrItems.backup.length > 0){
      if(!this.backupAttrItems.backup.includes(attr)){
        this.backupAttrItems.backup.push(attr);
      }
    }
    this.data.spuAttrs.splice(index,1);
  }

  //格式化树形列表
  public formatGroupList(data):void{
    data.forEach(item => {
      item.expandedIcon = 'fa-folder-open';
      item.collapsedIcon = 'fa-folder';
      item.leaf = !item.hasNextLevel;
      item.label = item.name;
      
    })
  }

  //点击树展开时查找下级组织
  public nodeExpandGroup(event):void{
    event.node.children = [];
    this.service.getUnitSubList(event.node.id)
        .then(data => {
          this.formatGroupList(data);
          event.node.children = data;
        })
        .catch(oError => {
          this.popupService.showError(oError);
        })
  }

  @HostListener('document:click', ['$event'])
  onBodyClick(btn: Event) {
    this.isShowGroupTree = false;
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

  //打开内箱modal
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

  //过滤物料属性
  public onInput(event){
    this.searchAttrValue = event.target.value;
    if(event.target.value == ''){
      this.backupAttrItems.backup = this.backupAttrItems.backup.filter(ea=>this.data.spuAttrs.every(eb=>eb!==ea));
      this.spuAttrsList = this.backupAttrItems.backup;
      delete this.backupAttrItems.backup;
    }else{
        let filterList = this.oldSpuAttrList.slice(0);
        filterList = this.oldSpuAttrList.filter(ea=>this.data.spuAttrs.every(eb=>eb!==ea));
        filterList = filterList.filter(item => {
           return item.name.includes(event.target.value)
        })

       
        if(!this.backupAttrItems.backup){
          this.backupAttrItems.backup = this.spuAttrsList.slice(0);
        }
        this.spuAttrsList = filterList;
    }
  }

}