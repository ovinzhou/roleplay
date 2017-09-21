import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,DoCheck } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/primeng';
import { EntityDetailService } from './entity-detail.service';
import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';
import { Title } from '@angular/platform-browser';
import { UserLoginService } from 'core/user-login/user-login.service'

@Component({
  selector: 'entity-detail',
  templateUrl: './entity-detail.component.html',
  styleUrls : ['./entity-detail.component.scss'],
  animations: [
  ]
})
export class EntityDetailComponent implements OnInit {
    private data : any ;
    private isAddr : boolean;
    private addressList : any;
    private modifyContactList : any;
    private modifyAddressList : any;
    private index : any = 1;
    private principalList : any;
    private principal : string;
    private emptyMessage : string;
    private financeAccountList : any
    selectedRelationType: string[] = [];
    private provinceList : any;
    private selectedAccount : any;
    private banks : any;
    private currencyList : any;
    private modifyAccountList : any;
    //保存上传图片的数据
    private formData : any;
    private activeItem : any;
    selectedCities: string[] = [];

    constructor(private entityDetailService : EntityDetailService,
                private route : ActivatedRoute,
                private router : Router,
                private popupService : PopupService,
                private titleService : Title,
                private userLoginService : UserLoginService) { 
      
    }

    ngOnInit() {
      this.isAddr = false;
      //用于记录删除的联系人
      this.modifyContactList = [];
      //用于存储修改的主体地址
      this.modifyAddressList = [];
      //用于存储修改的资金账户
      this.modifyAccountList = [];

      this.principalList = [];
      //省份
      this.provinceList = [];
      //初始化资金账户
      this.financeAccountList = [];
      this.selectedAccount = [];
      // Promise.resolve()

      this.addressList = [];
      //初始化表格没有数据时显示什么。
      this.emptyMessage = '没有数据.'
      this.titleService.setTitle("编辑自主体");
      this.data = {}
      //银行,货币信息先这样初始化。 到时候拿后台数据
      this.currencyList = [];
      this.currencyList.push({label: 'RMB', value: 'RMB'});
      this.currencyList.push({label: 'US', value: 'dollar'});
      this.currencyList.push({label: 'HK', value: 'HK'});
      
      this.banks = [];
      this.banks.push({label: '建设银行', value: 'CCB'});
      this.banks.push({label: '农业银行', value: 'ABC'});
      this.banks.push({label: '工商银行', value: 'ICBC'});
      this.banks.push({label: '中国银行', value: 'BOC'});
      this.banks.push({label: '民生银行', value: 'CMBC'});
      this.banks.push({label: '招商银行', value: 'CMB'});
      this.banks.push({label: '交通银行', value: 'BCM'});
      this.banks.push({label: '香港恒生银行', value: 'HSB'});
      this.banks.push({label: '农商银行', value: 'RCB'});

      this.entityDetailService.getPrincipalList().then(data => {
        let principalList = []
        data.forEach(item => {
          principalList.push({
            text:item.nickName,
            id:item.id
          })
        });
        this.principalList = principalList;
         this.entityDetailService.getEntityInfo().then(data => {
         this.data = {
             entityName : data.name,
             shortName : data.shortName,
             identifyId : data.identifyId,
             description : data.signature,
             files : BASE_URL + data.logo,
             userPictureSrc : data.logo
          }
              let activeItem = this.principalList.find(item => {
              return item.id == data.principal;
            })
            //回显
            this.activeItem = activeItem ? [activeItem] : [];
            this.principal = data.principal;
      })   
      })
  

    }

    onSubmit(bizForm){
      
       if(!bizForm.form.valid){
         return;
       }

       if(this.formData){
          this.entityDetailService.uploadAvatar(this.formData).then(data =>{
           this.data.userPictureSrc = data.resourceURI;
           this.onSubmitAfterUpload();
          }).catch(oError => {
            this.popupService.showError(oError);
          });
       }else{
          this.onSubmitAfterUpload();
       }
    }


    onSubmitAfterUpload(){

       let modifiedEntityInfo = {
         identifyId : this.data.identifyId,
         name : this.data.entityName,
         shortName : this.data.shortName,
         principal : this.principal,
         addresses : this.modifyAddressList,
         financeAccounts : this.financeAccountList,
         signature : this.data.description,
         logo:this.data.userPictureSrc
       }
       this.entityDetailService.editEntityInfo(modifiedEntityInfo).then(() =>{
         //用于刷新首页图片跟name
          // this.router.navigate(['home',{id: + new Date()}]);
          // this.router.navigateByUrl("home/contacts/biz/all");
          this.userLoginService.loginNotifier.emit({login:true});
          window.history.go(-1);
       }).catch(oError => {
          this.popupService.showError(oError);
       })
    }

    setStyles(){
     let styles = {
          'width':'80%',
          'max-height':'240px',
          'overflow-x':'scroll'

        };
        return styles;
    }

    setAccountStyles(){
     let styles = {
          'width':'120px',
          'overflow':'visible'

        };
        return styles;
    }

    relationTypeRequired(bizForm){
       

        // return bizForm.relationType.$setValidity('required', isRequired);
    };

    toReturn(){
      window.history.go(-1);
    }

    onFileChange(event){
      //将上传的图片回显
      let fileReader = new FileReader(),
      that = this;
      //加载图片为流
      fileReader.onload = function(loadReader : any){
         that.data.files = loadReader.target.result;
      }
      fileReader.readAsDataURL(event.target.files[0]);
      //formData 是后台需要的图片数据
      let formData: FormData = new FormData(); 
      formData.append('file', event.target.files[0]);
      this.formData = formData;
    };

    setPrincipal(event){
      this.principal = event.id;
    }

}
