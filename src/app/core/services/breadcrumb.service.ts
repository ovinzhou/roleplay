import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BreadcrumbService {

    private breadcrumbMenusSource = new Subject<MenuItem[]>();

    breadcrumbMenus$ = this.breadcrumbMenusSource.asObservable();

    constructor() {
    	this.breadcrumbMenusSource.next([
    		{
	    		label:"首页",
	    		routerLink: '/home'
    		}
    	]);
    }

    public setMenuList(menuList : MenuItem[]) {
    	if(menuList.length == 0){
    		return;
    	}

    	if(menuList[0].label !== "首页"){
	    	menuList = [
		    	{
		    		label:"首页",
		    		routerLink: '/home'
		    	},
		    	...menuList
	    	];
    	}

    	this.breadcrumbMenusSource.next(menuList);
    }
}