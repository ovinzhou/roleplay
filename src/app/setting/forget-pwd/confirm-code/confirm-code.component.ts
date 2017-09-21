import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router , RouterOutletMap,Params} from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { SettingService } from 'setting/setting-data.service';
import {DomSanitizer} from '@angular/platform-browser'; 

@Component({
  selector: 'confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.scss']
})

export class ConfirmCodeComponent implements OnInit {

    private data : any;
    private verify : any;
    private countdown : number;
    private inputWidth : boolean = true;

  constructor(
    private service      : SettingService,
    private popupService : PopupService,
    private router       : Router,
    private route        : ActivatedRoute,
    private sanitizer    : DomSanitizer) {}
                
  ngOnInit(){
      this.data = {};
      this.verify = {};
      this.getImageVerif();
      this.countdown = 0;
      this.route.params.subscribe(params => {
        if(params && params['mobile']){
          this.data.userCode = params['mobile'];
        }
      })
  }

  private getImageVerif(){
    this.service.getImageVerify().then(data => {
      this.verify = data;
      this.verify['src'] = this.sanitizer.bypassSecurityTrustUrl(this.verify['src']);
      
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

	private toNext(confirmForm:any){
    if(!confirmForm.form.valid){
      return;
    }
    let info = {
      userCode : this.data.userCode,
      verifiCode : this.data.verifycode
    }
    this.service.checkMessage(info).then(data => {
      this.router.navigateByUrl('/setting/resetpassword/' + this.data.userCode)
    }).catch(oError =>{
      this.popupService.showError(oError);
    })
	}

  private toLogin(){
    if(this.data.userCode && this.data.userCode.length == 11){
      this.router.navigate(['login',{mobile : this.data.userCode}]);
    }else{
      this.router.navigateByUrl('/login')
    }
  }

  private sendVerifyCode (input){
    let credentialsDto = {
      userCode: this.data.userCode,
      verifiCode: this.data.verifycode,
    }    
    this.service.sendVerifyCode(this.data.userCode).then(data =>{
      this.inputWidth = false;
      this.countdown = 60;
      let that = this;
      let timer = setInterval(function(){
        that.countdown -= 1;
        if(!that.countdown){
          that.inputWidth = true;
          clearInterval(timer);
        }
      },1000);
    }).catch(oError => this.popupService.showError(oError))
  }
}
