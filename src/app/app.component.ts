import { Component,HostListener,ElementRef,Renderer,
	Injector,
	ReflectiveInjector,
	Directive,
	Type,
	ComponentFactoryResolver,
	Input,
	ViewContainerRef,
	ResolvedReflectiveProvider,
	ViewChildren,
	OnInit
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutletMap, provideRoutes} from '@angular/router';
import { UserLoginService } from 'core/user-login/user-login.service';
import { Observable } from 'rxjs/Observable';

import { PluginService } from "core/plugin/plugin.service"
import { HttpClientService } from 'core/services/http-client.service'
import { PluginExtension } from 'core/plugin/plugin-extension.model'

import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';
import { SettingService } from './setting/setting-data.service'

//主体详情
import { EntityDetailService } from 'core/entity/entity-detail.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
	private extensions: PluginExtension[];
	
	private sideBarHidden: boolean = false;
	private name : any;
	public currentUserInfo : any = {};

	constructor(
		private popupService        : PopupService,
		private elementRef          : ElementRef, 
		private renderer            : Renderer,
		private router              : Router,
        private route               : ActivatedRoute,
        private entityDetailService : EntityDetailService,
        private userLoginService    : UserLoginService,
		private _viewContainer      : ViewContainerRef,
    	private settingService      : SettingService,
	){
		popupService.setDynamicComponentTarget(_viewContainer);
	}

	ngOnInit() {
		this.extensions = [
			{
				name: "通讯录",
				pluginServer: "http://127.0.0.1:9999/",
    			pluginPath: "src/plugin/",
    			pluginId: "contacts-plugin",
    			routePath: 'contacts',
    			moduleId: "./src/app/contacts/contacts.module.ts"
			},
			{
				name: "基础数据",
				pluginServer: "http://127.0.0.1:9999/",
    			pluginPath: "src/plugin/",
    			pluginId: "foundationinfo-plugin",
    			routePath: 'foundationinfo',
    			moduleId: "./src/app/foundationinfo/foundationinfo.module.ts"
			},
			{
				name: "销售",
				pluginServer: "http://127.0.0.1:9999/",
    			pluginPath: "src/plugin/",
    			pluginId: "selling-plugin",
    			routePath: 'selling',
    			moduleId: "./src/app/selling/selling.module.ts"
			}
		];

		this.userLoginService.loginNotifier.subscribe(() => {
			this.getEntityInfo();
			this.getCurrentUser()
		});

		this.getCurrentUser();
		this.getEntityInfo();
		// this.pluginService.loadExtensionList(this.extensions);
 }

 	private getCurrentUser(){
		this.settingService.getUserInfo().then(data => {
			data.photo = data.photo == 'assets/img/defaule_user_image.png' ? data.photo : BASE_URL + data.photo;
			this.currentUserInfo = data;
		},error => {
			console.log("failed to getPhoto: " + error);
		}); 		
 	}
	private getEntityInfo() {
		this.entityDetailService.getEntityInfo().then(data => {
			this.name = data.name;
		},error => {
			console.log("failed to getEntityInfo: " + error);
		});
	}

    // 退回
    public doLogout(): void {
       this.router.navigateByUrl('/login');
    }

    //更改密码
    public modifyPassword(): void {
       this.router.navigateByUrl('/main/modifypassword');
    }
    //个人信息
    public personInfo(): void {
       this.router.navigateByUrl('/main/information');
    }

    public isShowHeader(): boolean{
    	return !(this.router.isActive('login',false) || this.router.isActive('verify_login',false)  || this.router.isActive('setting',false));
    }
}