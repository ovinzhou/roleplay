import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { TreeTableModule,TreeNode } from 'primeng/primeng';
import { FoundationinfoService } from '../../foundationinfo-data.service';
import { PopupService } from 'core/services/popup.service';
import { procedure } from  '../procedure.data';
import { Title } from '@angular/platform-browser';
import { ContactsDataService } from 'contacts/contacts-data.service';
import { DomSanitizer} from '@angular/platform-browser';
import { Location } from '@angular/common';
import { BASE_URL } from 'core/constants/global-setting';
import { SettingService } from '../setting-data.service'
import { UserLoginService } from 'core/user-login/user-login.service';

@Component({
  selector: 'infomation',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})

export class InformationComponent implements OnInit {

  private orgs             : TreeNode[];
  private displayDialog    : boolean = false;
  private data             : any ;
  private operation        : string;
  private roles            : any[] = [];//用来存放已存在的角色
  private units            : any[] = [];//用来存放已存在的组织
  private selectedItems    : any[] = [];//存放已选择的组织或角色
  private genders          : any;
  private dialogTitle      : string ;//用来标识是否显示弹出框
  private groupType        : string;
  private title            : string;
  private status           : string; 
  private formData         : any;//用于存储图片数据 
  private isShowButton     : boolean = false; //显示顶部按钮
  private uploadedFiles    : any[] = [];
    
  constructor(
    private userLoginService    : UserLoginService,
    private contactsDataService : ContactsDataService,
    private SettingService      : SettingService,
    private route               : ActivatedRoute,
    private router              : Router,
    private sanitizer           : DomSanitizer,
    private popupService        : PopupService,
    private titleService        : Title,
    private location            : Location) {}

  ngOnInit() {
    this.titleService.setTitle('个人信息');
    this.data = {
      gender: 'MAN'
    };

    this.route.params.subscribe(params => {
      this.SettingService.getUserInfo().then(user=>{
        this.data = {
          gender      : user.gender,
          nickName    : user.nickName,
          mobile      : user.mobile,
          email       : user.email,
          userCode    : user.code,
          englishName : user.englishName,
          officePhone : user.officePhone,
          userId      : user.id,
          files       : user.photo == 'assets/img/defaule_user_image.png' ? user.photo : BASE_URL + user.photo ,
          userPictureSrc : user.photo
        }
        this.roles  = user.userRoles;
        this.units  = user.userGroups;
      })
    })
  }

  public onSubmit(userForm){
    //判断填写表单是否有错，有错直接返回
    if(!userForm.form.valid){
      return;
    }
    if(this.formData){
      this.contactsDataService.uploadAvatar(this.formData).then(data =>{
        this.data.userPictureSrc = data.resourceURI;
        this.onSubmitAfterUpload();
      }).catch(oError => this.popupService.showError(oError))}
    else{
      this.onSubmitAfterUpload();
    }
  }

  public onSubmitAfterUpload(){
    let userInfo = {
      'englishName' : this.data.englishName,
      'gender'      : this.data.gender,
      'officePhone' : this.data.officePhone,
      'email'       : this.data.email,
      'mobile'      : this.data.mobile,
      'nickname'    : this.data.nickName,
      'code'        : this.data.userCode,
      'id'          : this.data.userId,
      'photo'       : this.data.userPictureSrc,
      'userRoles'   : this.roles,
      'userGroups'  : this.units,
      'invite'      : this.data.notice
    }
    this.contactsDataService.editUserInfo(this.data.userId,userInfo)
      .then(()=>{
        this.userLoginService.loginNotifier.emit({login:true});
        window.history.go(-1);
      })
      .catch(oError =>this.popupService.showError(oError))
  }

  public onFileChange(event){
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

  public onCancel():void{
    this.location.back();
  };
}