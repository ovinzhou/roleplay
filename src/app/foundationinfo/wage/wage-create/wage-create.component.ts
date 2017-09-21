import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
// the Service of BasicDataModule
import {FoundationinfoService} from '../../foundationinfo-data.service';
import { Location } from '@angular/common';
import { PopupService } from '../../../core/services/popup.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'wage-create',
  templateUrl: './wage-create.component.html',
  styleUrls: ['./wage-create.component.scss']
})
export class WageCreateComponent implements OnInit {

  private wage          : any;
  private title         : string;
  private selectedValus : any;
  private emptyMessage  : string = '没有记录';
  private isUpdate      : boolean = false;
  private procedures    : any[];
  private typeDatalist  : any;
  private defaultBody   : any;


  private pricingtypes      : any[];
  private priceType         : string;
  private activeType        : any [];
  private activeProcedure   : any [];
  private selectProcedureId : string ;

	constructor(
      private router       : Router,
      private route        : ActivatedRoute, 
      private service      : FoundationinfoService,
      private location     : Location,
      private popupService : PopupService,
      private titleService : Title){};

	ngOnInit() {
    this.titleService.setTitle('新增工价');
    this.wage = {}; 
    //区间定价datatable
    this.typeDatalist = [];
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
      //查询计件类型工序
    this.service.getFEESProcedureList().then(data => {
       let procedures = [];
       data.forEach(item => {
         procedures.push({
           id:item.id,
           text:item.name
         })
       })
       this.procedures = procedures;
    }).then(() => {
      this.route.params.subscribe(params => {
        var operation = params['operation'];
        if('edit' === operation){
          this.isUpdate = true;
          this.service.getWageInfo(params['id']).then(data => {
            // debugger;priceType
            this.priceType = data.type;
            this.wage = {
              wagesName:data.name,
              billingtype: '计件工资',
              id:data.id
            }

            this.selectProcedureId = data.procedureId;
            this.priceType = data.type;
            //回显工序
            this.activeProcedure = [{id:data.procedureId,text:data.procedureName}];
            let type = this.pricingtypes.find(item => {
               return item.id == data.type
            })
            //回显定价类型
            this.activeType = [type];
            //判断是哪个定价类型
            if(this.priceType == 'SECTION'){
              let typeDataList = [];
              data.wagesValuations.forEach(item => {
                typeDataList.push({
                  id:item.id,
                  valuationNumber:item.number,
                  valuationValue:item.value,
                  numberRange : item.range,
                  manipulate : item.acquiesce ? '默认':'设为默认'
                })
              })
              this.typeDatalist = typeDataList;
              //这个值用于改变默认值的时候，随着改变数据
              this.defaultBody = this.typeDatalist.find(item => {
                return item.manipulate == '默认';
              })

            }else{
              this.wage['priceNum'] = data.wagesValuations[0].number;
              this.wage['price'] = data.wagesValuations[0].value;

            }
            
          })
        }
      })
    })
    
  };



  /**
   * [selectProcedure 选择工序]
   * @param {[type]} event [description]
   */
  public selectProcedure(event):void{
    this.selectProcedureId = event.id
    this.wage.billingtype = '计件工资'
  };


  /**
   * [billingChange 选择定价类型]
   */
  public selectePricingtype(event):void{
    this.priceType = event.id;
  };

  /**
   * [onSubmit 提交表单数据]
   * @param {any} wagesForm [表单]
   */
  public onSubmit(wagesForm:any):void{

    if(!wagesForm.form.valid || this.selectProcedureId || !this.priceType){
      return;
    };
    let wageInfo = {
      id:this.wage.id,
      name:this.wage.wagesName,
      procedureId:this.selectProcedureId,
      type:this.priceType,
      wagesValuations:[]
    }
    if(this.priceType == 'SECTION'){
      let typeDataList = []
      this.typeDatalist.forEach(item => {
        typeDataList.push({
          id:item.id,
          range:item.numberRange,
          value:item.valuationValue,
          number:item.valuationNumber,
          acquiesce:item.manipulate == '默认' ? true:false
        })
      })
      wageInfo.wagesValuations = typeDataList;
    }else{
      wageInfo.wagesValuations.push({
        value:this.wage.price,
        number:this.wage.priceNum,
        acquiesce:true
      })
    }

    if(this.isUpdate){
      this.service.updateWage(wageInfo).then(data=>this.location.back())
      .catch( res=>this.popupService.showError(res))
    }else{
      this.service.addWage(wageInfo).then(data=>this.location.back())
      .catch( res=>this.popupService.showError(res))
    }

    // let funcName = this.isUpdate ? 'updateWage' : 'addWage';
    //   this.service[funcName](wageInfo).then(data=>{
    //     this.router.navigateByUrl("/home/foundationinfo/wage");
    //   }).catch(oError => {
    //     this.popupService.showError(oError);
    //   })
  };


  /**
   * [onCancel click calcel button]
   */
  public onCancel():void{
    this.location.back(); 
  };

  public onAddWages():void{
    this.typeDatalist.push({
      //随机生成id
       numberRange : '',
       valuationNumber : '',
       valuationValue : '',
       // operation : 'New',
       manipulate : '设置默认'
    })
  }

  public onDelWages():void{
    if(this.selectedValus.length == 0){
        return;
      }
      this.selectedValus.forEach(selectValue => {
         this.typeDatalist.forEach(value => {
           if(value.id == selectValue.id){
             let index = this.typeDatalist.indexOf(value);
             //删除符合的数据
             this.typeDatalist.splice(index,1);
           }
         })
      });
  }

  public onEditDefaultValue(item):void{

      if(item['manipulate'] == '默认'){
        return;
      }
      item['manipulate'] = '默认';
      // item.wagesType = $scope.data.wagesType.code;
      if(this.defaultBody){
        this.defaultBody['manipulate'] = '设为默认';
      }
      this.defaultBody = item
    
  }

}