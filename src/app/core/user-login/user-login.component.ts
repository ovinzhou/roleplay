import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginService } from './user-login.service';
import { Observable } from 'rxjs/Observable';
import { PopupService } from 'core/services/popup.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements AfterViewInit {

    private principal      : string = "";
    private password       : string = "";
    private isPasscodeMode : boolean = true;
    private data           : any;
    private isVerifycode : boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userLoginService: UserLoginService,
        private popupService: PopupService
    ) {
    }
    ngOnInit(){
      this.data = {}
      this.isVerifycode = true;
      this.route.params.subscribe(params => {
        if(params && params['mobile']){
          this.data.principal = params['mobile'];
        }
      })
    }
    ngAfterViewInit() {
        // let userName = this.cookieService.get("userName");
        // let password = this.cookieService.get("password");
        // if (userName) {
        //     this.userName = userName;
        // }
        // if (password) {
        //     this.password = password;
        // }
    }

    public doLogin(loginForm): void {
      // if (!this.principal || !this.password) {
      //       // this.toastr.warning('用户名或密码不能为空!');
      //       this.popupService.alert('用户名或密码不能为空!');
      //       return;
      // }
      if(!loginForm.form.valid){
        return;
      }
      // this.router.navigateByUrl("home/contacts");
      let loginInfo = {
        passcodeMode : false,
        principal : this.data.principal,
        password : this.data.password
      }
      this.userLoginService.login(loginInfo).then((response) => {
        this.router.navigateByUrl("home");
      },(error) => {
        this.userLoginService.logout();
      });

      // let redirectUrl = this.userLoginService.redirectUrl || "/user";
      
      
      // this.router.navigateByUrl('home/foundationinfo');
      // this.router.navigateByUrl("user");
    }

    public doLogout():void{
      this.userLoginService.logout();
      this.router.navigateByUrl("login");
    }

    public forgetPwd():void{
      if(this.data.principal && this.data.principal.length == 11){
        this.router.navigate(['setting','confirmcode',{mobile:this.data.principal}]);
      }else{
        this.router.navigateByUrl("/setting/confirmcode");
      }
    }

    public phone():void {
      if(this.data.principal && this.data.principal.length == 11){
        this.router.navigate(['verify_login',{mobile:this.data.principal}]);
      }else{
        this.router.navigateByUrl("verify_login")
      }
    }
    
}
