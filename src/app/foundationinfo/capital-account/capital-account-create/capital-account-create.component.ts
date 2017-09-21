import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { inventoryList } from  './mock/inventory-list';
import { PopupService } from 'core/services/popup.service';
import { flyIn } from 'core/animations/fly-in';
import { FoundationinfoService} from '../../foundationinfo-data.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector   : 'capital-account',
  templateUrl   : 'capital-account-create.component.html',
  styleUrls: ['./capital-account-create.component.scss'],
  animations : [flyIn]
})

export class CapitalAccountCreateComponent implements OnInit {

  private chargeCreate   : any;
  private title          : string;
  private data           : any;
  private isUpdate       : any;
  private activeItem     : any;
  private procedureGroup : any;
  private chargeTypeList : any;

  constructor(
    private router       : Router,
    private route        : ActivatedRoute,
    private service      : FoundationinfoService,
    private popupService : PopupService,
    private location     : Location,
    private titleService : Title
  ){}

  ngOnInit( ){
    this.titleService.setTitle('新增资金账户');
    this.activeItem = [];
    this.chargeTypeList = [];
    this.procedureGroup = {id:'',name:''};
    this.data = {chargename:'',describe:'',chargetype:'',id:''};

    this.route.params.subscribe(params => {
      var operation = params['operation'];
      this.setChargetypes();
      if('edit' === operation){
        this.isUpdate = true;
        this.service.getChargeinfo(params['id']).then(data=>{
          this.data = {
            id : data.id,
            chargename:data.name,
            describe: data.comment ,
            chargetype:data.typeValue
          }
          this.activeItem = [{id:data.typeValue,text:data.typeName}];
        }).catch(res => this.popupService.showError(res))
      }
    })
  }

  public setChargetypes():void{

    this.service.getChargetypes({}).then(data=>{
      let chargetTypes = [];
      data.forEach(item => {
        chargetTypes.push({id : item.value,text : item.label})
      })
      this.chargeTypeList = chargetTypes;
    }).catch(res => this.popupService.showError(res))
  };
/**
 * [onCancel 取消]
 */
  public onCancel():void{
    this.location.back(); 
  };
/**
 * [onSubmit 提交]
 */
  public onSubmit(chargeCreateForm:any):void{

    if(!chargeCreateForm.form.valid ){
      return;
    };
    if(!this.data.chargetype ) return;

    let chargeinfo = {
      id:this.data.id,
      name:this.data.chargename,
      comment:this.data.describe,
      type:this.data.chargetype
    }
    if(this.isUpdate){
      this.service.updateCharge(chargeinfo.id,chargeinfo).then(data=>this.location.back())
      .catch(res =>this.popupService.showError(res));
    }else{
      this.service.addCharge(chargeinfo).then(data=>this.location.back())
      .catch(res=>this.popupService.showError(res));
    }
  };

  public refreshValue(event):void {
    this.data.chargetype = event.id;
  }
/**
 * 清空输入框内容
 */
  public removed(event):void {
    this.data.chargetype = null;
  }
}

