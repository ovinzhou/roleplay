import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from  './core/home/home.component';
import { MainComponent } from  './core/main/main.component';
import { UserLoginComponent } from './core/user-login/user-login.component';
import { ForgetPwdComponent } from './core/forget-pwd/forget-pwd.component';
import { UserRegisterComponent } from './core/user-register/user-register.component';
import { EntityDetailComponent } from './core/entity/entity-detail.component';
import { ProcessComponent } from './process/process.component';

import { UserVerifyComponent } from './core/user-login/verify_login/verify_login.component';
// 个人信息
import { InformationComponent } from 'setting/information/information.component'
// 修改密码
import { ModifyPasswordComponent } from 'setting/modify-password/modify-password.component'
// 激活
import { ActivationComponent } from 'setting/activation/activation.component'

const appRoutes=[
	{
		path:'',
		redirectTo: 'login',
    	pathMatch: 'full' 
	},
	{
		path:'login',
		component: UserLoginComponent,
	},
	{
		path:'verify_login',
		component:UserVerifyComponent
	},
	{
		path:'home',
		component: HomeComponent
	},
	{
		path:'setting',
		data: { title: '设置' },
		loadChildren: function() {
			return new Promise(function(resolve) {
				require.ensure([], function (require) {
				resolve(require("./setting/setting.module")['default'])
				},"setting-plugin");
			});
		}
	},
	{
		path:'main',
		component: MainComponent,		
		children:[
			{
				path:'contacts',
				data: { title: '通讯录' },
				loadChildren: function() {
			         return new Promise(function(resolve) {
			         	require.ensure([], function (require) {
					      resolve(require("./contacts/contacts.module")['default'])
					    },"contacts-plugin");
			         });
			    }
			},
			{
				path:'foundationinfo',
				data: { title: '基础数据' },
				loadChildren: function() {
			         return new Promise(function(resolve) {
			         	require.ensure([], function (require) {
					      resolve(require("./foundationinfo/foundationinfo.module")['default'])
					    },"foundationinfo-plugin");
			         });
			    }
			}, 
			// {
			// 	path:'ceshi',
			// 	data: { title: '测试数据' },
			// 	loadChildren: function() {
			//          return new Promise(function(resolve) {
			//          	require.ensure([], function (require) {
			// 		      resolve(require("./ceshi/ceshi.module")['default'])
			// 		    },"ceshi-plugin");
			//          });
			//     }
			// }, 
			{
				path:'entity',
				component:EntityDetailComponent,
	            data: { title: "修改主体" },				
			},
			{
				path:'process',
				data: { title: '流程' },
				loadChildren: function() {
					return new Promise(function(resolve) {
						require.ensure([], function (require) {
						resolve(require("./process/process.module")['default'])
						},"process-plugin");
					});
				}
			},
			{
				path:'business',
				data: { title: '业务' },
				loadChildren: function() {
					return new Promise(function(resolve) {
						require.ensure([], function (require) {
						resolve(require("./business/business.module")['default'])
						},"process-plugin");
					});
				}
			},
			{
				path:'information',
				component:InformationComponent,
				data:{title:"个人信息"}
	        },
	        //修改密码
		    {
		    	path:'modifypassword',
		    	component:ModifyPasswordComponent,
		    	data:{title:'修改密码'}
		    },
		    // 激活
		    {
				path:'activation/:mobile',
				component:ActivationComponent,
				data:{title:'用户激活'}
		    },
		]
	},
	{
		path:'register',
		component:UserRegisterComponent
	},
	
	// {
	// 	path:'**',//fallback router must in the last
	// 	redirectTo: 'login',
 //    	pathMatch: 'full'
	// }
];
export default RouterModule.forRoot(appRoutes);