import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { SettingService } from 'setting/setting-data.service'

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    private data : any;
    private type : string = 'password' ; 

   constructor(
        private router: Router,
        private route: ActivatedRoute,
        private popupService: PopupService,
        private service : SettingService
    ) {}

    ngOnInit(){
      this.data = {};
      this.route.params.subscribe(params => {
        this.data.userCode = params['userCode']
      })
    }


    private onSubmit(passForm:any){
        if(!passForm.form.valid){
            return;
        }
        if(this.data.password != this.data.repassword){
          return;
        }
        
        let passInfo = {
            password :this.data.password,
            userCode :this.data.userCode
        }   
        this.service.resetPassword(passInfo).then(() => {
		      // this.router.navigateByUrl('/login')
          this.router.navigate(['login',{mobile:this.data.userCode}]);
        })
       .catch(oError =>this.popupService.alert(oError))
   } 

}