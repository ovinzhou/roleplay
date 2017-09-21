import { ConfirmDialog,ConfirmDialogModule } from 'primeng/primeng';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,EventEmitter,Renderer,ContentChild,trigger,state,style,transition,animate } from '@angular/core';
import { ConfirmationService,Confirmation } from 'primeng/components/common/api';

import { ExtendComponent } from "core/metadata/extend-component.metadata"

@ExtendComponent({
	selector: "rp-prompt-dialog",
    template: `
        <div [ngClass]="{'ui-dialog ui-confirmdialog ui-widget ui-widget-content ui-corner-all ui-shadow':true,'ui-dialog-rtl':rtl}" 
            [style.display]="visible ? 'block' : 'none'" [style.width.px]="width" [style.height.px]="height" (mousedown)="moveOnTop()" [@dialogState]="visible ? 'visible' : 'hidden'">
            <div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                <span class="ui-dialog-title" *ngIf="header">{{header}}</span>
                <a *ngIf="closable"  [ngClass]="{'ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all':true}" href="#" role="button" (click)="hide($event)">
                    <span class="fa fa-fw fa-close"></span>
                </a>
            </div>
            <div class="ui-dialog-content ui-widget-content">
                <textarea autofocus style="width: 100%;" [(ngModel)]="promptInfo"></textarea>
            </div>
            <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" *ngIf="footer">
                <ng-content select="p-footer"></ng-content>
            </div>
            <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" *ngIf="!footer">
                <button type="button" pButton [icon]="rejectIcon" [label]="rejectLabel" (click)="reject()" *ngIf="rejectVisible"></button>
                <button type="button" pButton [icon]="acceptIcon" [label]="acceptLabel" (click)="accept()" *ngIf="acceptVisible"></button>
            </div>
        </div>
    `,
})
export class PromptDialog extends ConfirmDialog{
    private promptInfo: string;

	constructor(public el: ElementRef, public domHandler: DomHandler, 
            public renderer: Renderer, confirmationService: ConfirmationService) {
		super(el,domHandler,renderer,confirmationService);
	}
}