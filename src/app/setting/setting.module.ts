import { NgModule }      from '@angular/core';
import { RouterModule }  from '@angular/router';
import { CommonModule}   from '@angular/common';
import { FormGroup}      from '@angular/forms';
// The plug-in component of primeng
import {TreeNode}        from 'primeng/primeng';
import {TreeTableModule} from 'primeng/primeng';
import {ButtonModule}    from 'primeng/primeng';
import {DataListModule}  from 'primeng/primeng';
import {DialogModule}    from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
// SharedModule
import { SharedModule }  from '../shared/shared.module';
import { GrowlModule} from 'primeng/primeng';
// foundationinfoModule routes
import { settingRoutes }       from './setting.routes';
import { SettingService}        from  './setting-data.service';
import { SettingComponent } from './index/setting.component'

// 忘记密码
import { ConfirmCodeComponent } from './forget-pwd/confirm-code/confirm-code.component'
import { ResetPasswordComponent } from './forget-pwd/reset-password/reset-password.component'


@NgModule({
  imports: [
    SharedModule,
    TreeTableModule,
    DataListModule,
    DialogModule,
    CommonModule,
    GrowlModule,
    RouterModule.forChild(settingRoutes)
  ],
  declarations: [
  SettingComponent,
  // 忘记密码
  ConfirmCodeComponent,
  ResetPasswordComponent,

  ],
  exports:[
  ],
  providers: [
    SettingService
  ],
})
export default class foundationinfoModule {
  
}