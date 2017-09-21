import { ConfirmDialog,ConfirmDialogModule } from 'primeng/primeng';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,EventEmitter,Renderer,ContentChild,trigger,state,style,transition,animate } from '@angular/core';
import { ConfirmationService,Confirmation } from 'primeng/components/common/api';

import { ExtendComponent } from "core/metadata/extend-component.metadata"

@ExtendComponent({
	selector: "rp-confirm-dialog"
})
export class CustomConfirmDialog extends ConfirmDialog{
	constructor(public el: ElementRef, public domHandler: DomHandler, 
            public renderer: Renderer, confirmationService: ConfirmationService) {
		super(el,domHandler,renderer,confirmationService);
	}

	enableModality() {
        if(!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = this.el.nativeElement.children[0].style.zIndex - 1;
            this.domHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');
            document.body.appendChild(this.mask);
        }
    }
}