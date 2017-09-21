import { Breadcrumb } from 'primeng/primeng';
import { NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,EventEmitter,Renderer,ContentChild,trigger,state,style,transition,animate} from '@angular/core';
import { ExtendComponent } from "core/metadata/extend-component.metadata"
import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';

@ExtendComponent({
	selector: 'rp-breadcrumb',
    templateUrl: "./breadcrumb.component.html",
    styleUrls : ['./breadcrumb.component.scss']
})
export class RPBreadcrumb extends Breadcrumb{
    constructor(public router: Router) {
        super(router);
    }

	itemClick(event, item: MenuItem) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!item.url||item.routerLink) {
            event.preventDefault();
        }
        
        if(item.command) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }
                
        // 暂不支持带参数的路由跳转
        if(item.routerLink && item.routerLink.indexOf(":") < 0) {
            this.router.navigateByUrl(item.routerLink);
        }
    }
}