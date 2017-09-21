import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { TreeTableModule,TreeNode } from 'primeng/primeng';
import { PopupService } from 'core/services/popup.service';
import { Location } from '@angular/common';
import { BASE_URL } from 'core/constants/global-setting';
import { SettingService } from '../setting-data.service'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'setting',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})

export class ActivationComponent implements OnInit {

  private orgs             : TreeNode[];
  private data             : any ;
  private operation        : string;
  private genders          : any;
  private dialogTitle      : string ;//用来标识是否显示弹出框
  private groupType        : string;
  private status           : string; 
  private formData         : any;//用于存储图片数据 
  private isShowButton     : boolean = false; //显示顶部按钮
  private uploadedFiles    : any[] = [];
    
  constructor(
    private service             : SettingService,
    private route               : ActivatedRoute,
    private router              : Router,
    private popupService        : PopupService,
    private location            : Location,
    private titleService : Title) {}

  ngOnInit() {
    this.titleService.setTitle('激活用户');
    this.data = {
      gender: 'MAN'
    };

    this.route.params.subscribe(params => {
      this.service.getActivationUserInfo(params['mobile']).then(user=>{
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
      })
    })
  }

  public onSubmit(userForm){
    if(!userForm.form.valid){
      return;
    }

    if(this.data.newpassworde != this.data.repassword){
      return;
    }

    this.onSubmitAfterUpload();
    
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
      'password'    : this.data.newpassworde,
      'id'          : this.data.userId,
      'photo'       : this.data.userPictureSrc,
    }

    this.service.getActivationData(userInfo)
    .then(()=>{
      this.router.navigateByUrl('/home');
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