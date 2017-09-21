import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { SettingService } from '../setting-data.service';

@Component({
  selector: 'modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls : ['./modify-password.component.scss'],
  animations: [
  ]
})

export class ModifyPasswordComponent implements OnInit {
    private data : any;
    private type : string = 'password' ; 

   constructor(
        private router: Router,
        private route: ActivatedRoute,
        private popupService: PopupService,
        private service : SettingService
    ) { }

     ngOnInit(){
        this.data = {};

    }
    //显示密码
     onChange(){
        if(this.type == 'password'){
          this.type = 'text';
       }else{
           this.type = 'password';
      }
   }

   onSubmit(passForm){
         //判断填写表单是否有错，有错直接返回
       if(!passForm.form.valid){
         return;
       }
       if(this.data.newpassworde!= this.data.repassword){
           return;
       }
       if(this.data.oldpassword == this.data.newpassworde){
         this.popupService.alert('新密码与原密码相同');
         return;
       }
       let passInfo = {
           password :this.data.oldpassword,
           newpassword :this.data.newpassworde
       }
//de....
       
       this.service.modifyPass(passInfo).then(() => {
         window.history.go(-1);
       })
       .catch(oError =>this.popupService.showError(oError))
   } 
}
