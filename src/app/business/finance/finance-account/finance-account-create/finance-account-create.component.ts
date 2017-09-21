import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { PopupService } from 'core/services/popup.service';
import { flyIn } from 'core/animations/fly-in';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FinanceDataService } from 'business/finance/finance-data.service';

@Component({
  selector   : 'finance-account',
  templateUrl   : './finance-account-create.component.html',
  styleUrls: ['./finance-account-create.component.css'],
  animations : [flyIn]
})

export class FinanceAccountCreateComponent implements OnInit {

  private chargeCreate   : any;
  private title          : string;
  private data           : any;
  private isUpdate       : any;
  private activeCurrenys : any;
  private activeBank     : any;
  private procedureGroup : any;
  private currencyList   : any;
  private bankList       : any;
  private id             : string;

  constructor(
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private location     : Location,
    private titleService : Title,
    private service      : FinanceDataService
  ){}

  ngOnInit( ){
    this.titleService.setTitle('新增资金账户');
    this.activeBank = [];
    this.activeCurrenys = [];
    this.currencyList = [];
    this.bankList = [];
    this.data = {capName:'',accountName:'',accountBank:'',accountNumber:'',currency:''};

    this.service.getBankList().then(data => {
        let bankList = [];
        data.map(item => {
            bankList.push({id : item.id,text : item.label})
        })
        this.bankList = bankList;
    })

    this.service.getCurrenys().then(data => {
        let currencyList = [];
        data.map(item => {
            currencyList.push({id : item.id,text : item.label})
        })
        this.currencyList = currencyList;
    })

    this.route.params.subscribe(params => {
      var operation = params['operation'];
      this.id = params['id']
      this.setChargetypes();
      if('edit' === operation){
        this.titleService.setTitle('编辑资金账户');
        this.isUpdate = true;
        this.service.getFinanceAccountInfo(params['id']).then(data=>{
          this.data = {
            capName:data.capName,
            accountName:data.accountName,
            accountBank:data.accountBankId,
            accountNumber:data.accountNumber,
            currency:data.currencyId
          }
          var bank;
          var currency;
          bank = this.bankList.find(item => {
            return this.data.accountBank == item.id
          })
          currency = this.currencyList.find(item => {
            return this.data.currency == item.id
          })
          this.activeBank = bank ? [bank] : [];
          this.activeCurrenys = currency ? [currency] : []
          
        }).catch(res => this.popupService.showError(res))
      }
    })
  }

  public setChargetypes():void{

    // this.service.getChargetypes({}).then(data=>{
    //   let chargetTypes = [];
    //   data.forEach(item => {
    //     chargetTypes.push({id : item.value,text : item.label})
    //   })
    //   this.chargeTypeList = chargetTypes;
    // }).catch(res => this.popupService.showError(res))
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

    if (this.data.capName == '' || this.data.accountName == '' || this.data.ccountBank == '' || this.data.accountNumber == '' || this.data.currency =='') {
      return;
    }
    
    if(this.isUpdate){
       this.service.updateFinanceAccount(this.id,this.data)
      .then(() => {
       this.location.back();
       })
      .catch(res => {
      this.popupService.showError(res)
      })
    }else{
       this.service.addFinanceAccount(this.data)
      .then(() => {
       this.location.back();
       })
      .catch(res => {
      this.popupService.showError(res)
      })
    }
  };

  public refreshValue(type,event):void {
    if (type === 'bank') {
      this.data.accountBank = event.id;
    }else{
      this.data.currency = event.id;
    }
    

  }
/**
 * 清空输入框内容
 */
  public removed(event):void {
    this.data.chargetype = null;
  }
}


