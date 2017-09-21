import { Component, OnInit,ElementRef } from '@angular/core';
import { UserLoginService } from '../user-login.service'
import { PopupService } from 'core/services/popup.service';
import {DomSanitizer} from '@angular/platform-browser'; 
import { Router , ActivatedRoute } from '@angular/router';
//错误码
import { ROLEPLAY_ERROR } from 'core/constants/roleplay-error';

@Component({
  selector: 'app-verify-login',
  templateUrl: './verify_login.component.html',
  styleUrls: ['./verify_login.component.scss']
})
export class UserVerifyComponent implements OnInit {
    
    private data : any;
    private verify : any;
    private countdown : number;  
    private errorMessage : string;
    // private isVerifycode : boolean;

    constructor(private service : UserLoginService,
                private popupService:PopupService,
                private router : Router,
                private route : ActivatedRoute,
                private sanitizer : DomSanitizer) {}
                
    ngOnInit(){
        this.data = {};
        this.verify = {};

        this.countdown = 0;
        // this.isVerifycode = true;
        this.route.params.subscribe(params => {
          if(params && params['mobile']){
            this.data.userCode = params['mobile'];
          }
        })
    }

    sendVerifyCode (input){
      let credentialsDto = {
        userCode: this.data.userCode,
        verifiCode: this.data.verifycode,
        handle : this.verify.handle
      }
      this.service.sendVerifyCode(this.data.userCode,this.data.verifycode).then(data =>{
        input.style.width="83.5%";//input 就是INPUT输入框的宽度
        this.countdown = 60;
        let that = this;
        let timer = setInterval(function(){
        that.countdown -= 1;
        if(!that.countdown){
            input.style.width="66.5%";//input 就是INPUT输入框的宽度
            clearInterval(timer);
         }
      },1000);
        this.popupService.alert({
           header:'系统提示',
           message:'手机验证码发送成功'
        })
      }).catch(oError => {
        this.popupService.showError(oError);
      })

    }

    toPassword(){
      if(this.data.userCode && this.data.userCode.length == 11){
        this.router.navigate(['login',{mobile : this.data.userCode}]);
      }else{
        this.router.navigateByUrl('login');
      }
    }

    doLogin(loginForm){
      if(!loginForm.form.valid){
         return;
       }
      let loginInfo = {
        passcodeMode : true,
        principal : this.data.userCode,
        password : this.data.messageCode
      }
      this.service.login(loginInfo).then(data => {
        if(data == 'OK'){
          this.router.navigateByUrl("home");
        }else{
          this.router.navigateByUrl('/main/activation/' + this.data.userCode)
        }
      }).catch(oError => {
        // this.popupService.showError(oError);
      })
    }
}