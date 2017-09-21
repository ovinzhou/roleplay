import { CommonModule } from '@angular/common';
import { NgModule,Optional,SkipSelf } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { UserLoginService } from './user-login/user-login.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { EntityDetailComponent } from './entity/entity-detail.component';
import { UserVerifyComponent } from 'core/user-login/verify_login/verify_login.component';

import { EntityDetailService } from './entity/entity-detail.service';

import { AuthGuard } from './services/auth-guard.service';
import { HttpClientService } from './services/http-client.service';
import { InMemoryDataService } from './services/in-memory-data.service';
import { PopupService } from './services/popup.service';
import { CacheService } from  './services/cache.service';
import { UtilsService } from  './services/utils.service';

import { BreadcrumbService } from './services/breadcrumb.service';

import { PluginService } from "core/plugin/plugin.service";
import { ClientSession } from "core/services/client-session.service";
import { TokenService } from "core/services/token.service";
import { MainComponent } from "./main/main.component";
import { HomeComponent }  from './home/home.component';
import { RouterModule } from '@angular/router';
// 个人信息
import { InformationComponent } from 'setting/information/information.component';
// 修改密码
import { ModifyPasswordComponent } from 'setting/modify-password/modify-password.component'
import { SettingService } from 'setting/setting-data.service'
// 激活
import { ActivationComponent } from 'setting/activation/activation.component'

@NgModule({
  imports: [
	  CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
  	UserLoginComponent,
  	UserRegisterComponent,
    EntityDetailComponent,
    MainComponent,
    HomeComponent,
    UserVerifyComponent,
    InformationComponent,
    ModifyPasswordComponent,
    ActivationComponent
  ],
  exports:[
  	UserLoginComponent,
  	UserRegisterComponent,
    MainComponent,
    HomeComponent
  ],
  providers: [
    AuthGuard,
    HttpClientService,
    // InMemoryDataService,
    UserLoginService,
    PluginService,
    PopupService,
    EntityDetailService,
    ClientSession,
    TokenService,
    CacheService,
    BreadcrumbService,
    SettingService,
    UtilsService
  ]
})
export default class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}