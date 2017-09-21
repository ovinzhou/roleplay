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

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { ActivatedRoute, Router, RouterOutletMap, provideRoutes,NavigationEnd } from '@angular/router';
import { UserLoginService } from 'core/user-login/user-login.service';
import { Observable } from 'rxjs/Observable';

import { UserRegisterComponent } from 'core/user-register/user-register.component';

import { PluginService } from "core/plugin/plugin.service"
import { HttpClientService } from 'core/services/http-client.service'
import { BreadcrumbService } from 'core/services/breadcrumb.service';
import { PluginExtension } from 'core/plugin/plugin-extension.model'

import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';

import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit{
	private items: MenuItem[] = [];
	// private items: Observable<MenuItem>;

	constructor(
		private elementRef: ElementRef, 
		private renderer: Renderer,
		private router: Router,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: BreadcrumbService
	) {
	    // renderer.listen(elementRef.nativeElement, 'click', (event) => { });
	    this.items.push({
	    	label:"首页",
			routerLink: '/home'
	    });
	}

	ngOnInit() {
		// this.items = this.breadcrumbService.breadcrumbMenus$;
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.subscribe((route) => {
				let pathFromRoot:ActivatedRoute[] = route.pathFromRoot;
				let breadcrumbMenus:MenuItem[] = [
					{
			    		label:"首页",
			    		routerLink: '/home'
		    		}
				];

				let child = route.firstChild;
				let routerLink = "/" + pathFromRoot[1].routeConfig.path; // MainComponent's path

				while(child){
					let label = null;
						
					if(child.routeConfig.path === ""){
						child = child.firstChild;
						continue;
					}

					routerLink += "/";
					routerLink += child.routeConfig.path;

					if(child.routeConfig.data) {
						label = (<any>(child.routeConfig.data)).title;
					}
					if(label == "" || label == undefined){
						label = child.routeConfig.path;
						console.error(`You havn't set title for ${routerLink} ?,the title used in breadcrumb navigation. Using the path's value as default,please fix it..`);
					}

					breadcrumbMenus.push({
						label,
						routerLink
					})

					child = child.firstChild;
				}

				if(breadcrumbMenus.length > 1){
					this.items = breadcrumbMenus;
				}

			});
	}

	private doLogout():void{
		// this.userLoginService.logout();
		// this.router.navigateByUrl("login");
	}
}