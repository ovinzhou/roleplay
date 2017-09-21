import { NgModule }      from '@angular/core';
import { RouterModule }  from '@angular/router';
import { CommonModule}   from '@angular/common';
import { FormGroup}      from '@angular/forms';

// SharedModule
import { SharedModule }          from 'shared/shared.module';

// 自制模块路由配置
import { hombrewInfoRoutes }     from 'homebrew/homebrew.routes';

// 自制模块公用数据服务
import { HombrewInfoService }    from 'homebrew/homebrew-data.service';

// 自制模块主页
import { HomebrewInfoComponent } from 'homebrew/index/homebrew.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(hombrewInfoRoutes)
  ],
  declarations: [
    HomebrewInfoComponent
  ],
  exports:[
  ],
  providers: [
    HombrewInfoService
  ],
})
export default class foundationinfoModule {
  
}