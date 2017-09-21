import { Component, OnInit} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { Router , ActivatedRoute ,Params} from '@angular/router';
import { Location } from '@angular/common';
// the Service of BasicDataModule
import { FoundationinfoService } from '../../foundationinfo-data.service';
import { PopupService } from '../../../core/services/popup.service';
import {ROLEPLAY_ERROR} from '../../../core/constants/roleplay-error';
import { SpuAttrbute } from '../../model/spu-attrbute';


@Component({
  selector: 'spu-attribute-create',
  templateUrl: './spu-attribute-create.component.html',
  styleUrls: ['./spu-attribute-create.component.scss']
})
export class SpuAttrbuteCreateComponent implements OnInit {
  private spuAttrbute   : any;
  private selectedValus : any;
  private isUpdate      : boolean = false;
  private emptyMessage  : string = '没有记录';

	constructor(
      private router : Router,
      private route  : ActivatedRoute, 
      private popupService:PopupService,
      private titleService:Title,
      private service:FoundationinfoService,
      private location: Location,){

	};

	ngOnInit() {
    this.spuAttrbute = new SpuAttrbute();
    this.titleService.setTitle('新增物料属性');
    this.route.params.subscribe(params => {
        var operation = params['operation'],id = params['id'];
        if('edit' === operation){

          this.isUpdate = true;
          this.titleService.setTitle('修改物料属性');

          this.service.getSpuAttr(id)
            .then(data =>this.spuAttrbute = data)
            .catch(res => this.popupService.showError(res));
        };
    })
  };

  /**
   * [onAddValue add spuAttrbute value]
   */
  public onAddValue():void{
    var toAddNew = true;

    //检测是否为null
    this.spuAttrbute.values=this.spuAttrbute.values === null?[]:this.spuAttrbute.values;

    this.spuAttrbute.values.map(item=>{
      //如果检测到属性值编码和属性值为空，则不需要添加新的对象
      if(item.code ==='' && item.value === ''){
         toAddNew = false;
      };
    });

    if(toAddNew){
      this.spuAttrbute.values.push({code:'',value:'',opiton:true});
    }else{
      this.popupService.alert('已经存在一条属性值为空或者属性值编码为空的数据!');
    };

  };

  /**
   * [onEdit 在修改行数据得时候]
   * @param {[type]} event [列头以及行数据信息]
   */
  public onEdit(event):void{
    if(!event.data.opiton){
      this.popupService.alert('不好意思!此行数据不允许修改!');
      return;
    }
  };

  /**
   * [onDelValue del spuAttrbute value]
   */
  public onDelValue():void{

    var ids = []
    this.selectedValus.map(item=>ids.push(item.id));

    this.popupService.confirm({
      header:'系统提示',
      message:'确定要删除这些数据吗？',
      accept:()=>{
        this.service.delValue(ids.toString()).then(()=>{
          this.selectedValus.map(item=>{
            this.spuAttrbute.values = this.spuAttrbute.values.filter( n => n !== item);
            this.selectedValus = this.selectedValus.filter(n => n != item);      
          });
        }).catch(res => this.popupService.showError(res));
      }
    }) 
  };


  /**
   * [onSubmit 提交表单数据]
   * @param {any} spuAttrbuteForm [表单]
   */
  public onSubmit(spuAttrbuteForm:any):void{


    var valid_null = true ,
        valid_max_length = true,
        valid_code_duplication = true,
        valid_value_duplication = true;
 
   /**
    * [function 校验重复]
    * @param {[type]} key    [属性]
    * @param {[type]} value  [属性值]
    * @param {[type]} values [属性值集合]
    */
    var checkDuplication = function (key,value,values) {

      var count = 0;

      values.map(function (n) {
         if(n[key] === value){count++;}
      });

      return count>1?true:false;
    };

    if(this.spuAttrbute.values){
      this.spuAttrbute.values.map(i =>{
        if(!i.code || !i.value){
          valid_null = false;
          return;
        };

        // if(i.code.length>10 || i.value.length>10){
        //   valid_max_length = false;
        //   return;
        // };

        if(checkDuplication('code',i.code,this.spuAttrbute.values)){
          valid_code_duplication = false;
          return;
        };


        if(checkDuplication('value',i.value,this.spuAttrbute.values)){
          valid_value_duplication = false;
          return;
        }

      });


      if(!valid_null){
        this.popupService.alert('属性值编码或属性值不能为空!');
        return;
      };

      if(!valid_max_length){
        this.popupService.alert('属性值编码或属性值字符长度不能大于10!');
        return;
      };

      if(!valid_code_duplication){
        this.popupService.alert('属性值编码重复!');
        return;
      };

      if(!valid_value_duplication){
        this.popupService.alert('属性值重复!');
        return;
      };

    }

    if(!spuAttrbuteForm.form.valid){
      return;
    };


    if(this.isUpdate){
      this.service.updateSpuAttr(this.spuAttrbute)
          .then(data=>this.location.back())
          .catch(res => this.popupService.showError(res));
    }else{
      this.service.addSpuAttr(this.spuAttrbute)
          .then(data=>this.location.back())
          .catch(res => this.popupService.showError(res));
    }
  };


  /**
   * [onCancel click calcel button]
   */
  public onCancel():void{
    this.location.back();
  };
}