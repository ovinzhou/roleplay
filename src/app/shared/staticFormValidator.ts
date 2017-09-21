import { Host, OpaqueToken,Directive,Renderer,Injector, Input ,ElementRef,ComponentRef, TemplateRef, ViewContainerRef ,AfterViewInit,OnInit,OnDestroy } from '@angular/core';
import { DomHandler } from 'primeng/components/dom/domhandler';

@Directive({
    selector: '[rpStaticValidator]',
    host: {
        '(change)': 'onHostChange($event)'
    },
    providers: [DomHandler]
})
export class StaticValidatorDirective implements AfterViewInit, OnDestroy {

    constructor(private elementRef:ElementRef,
                private domHandler:DomHandler) {
    }

    private body:any;
    private validateCallback: Function;

    ngAfterViewInit() {
        this.body = document.createElement("span");
        this.body.style.position = "absolute";
        this.body.setAttribute("data-balloon-pos", "up");
        this.body.setAttribute("ref", this.elementRef.nativeElement.id);

        document.body.appendChild(this.body);
    }

    ngOnDestroy() {
        if (this.body != null) {
            this.body.parentNode.removeChild(this.body);

            this.body = null;
        }
    }

    @Input() set rpStaticValidator(validator:Function) {
        this.validateCallback = validator;
    }

    private onHostChange($event) {
        if(this.validateCallback){
            let errorMsg = this.validateCallback.call(null,$event);
            if(errorMsg){
                this.showErrorMessage(true,errorMsg);
            }else{
                this.showErrorMessage(false);
            }
        }
    }

    /**
     * show the error message if previous validation failed
     * @param show
     */
    private showErrorMessage(show:boolean = true,errorMessage?:String) {
        if (show) {
            let targetElement = this.domHandler.findSingle(this.elementRef.nativeElement, "input");
            if (!targetElement) {
                targetElement = this.domHandler.findSingle(this.elementRef.nativeElement, "select");
            }
            if (!targetElement) {
                targetElement = this.domHandler.findSingle(this.elementRef.nativeElement, "textarea");
            }
            if (!targetElement) {
                console.warn('[rpValidator] only work with input, select or textarea');
                return;
            }
            if (targetElement.offsetWidth == 0 && targetElement.offsetHeight == 0) {
                //元素没有高度宽度,不展示错误提示
                return;
            }
            this.domHandler.absolutePosition(this.body, targetElement);
            let offsetHeight = targetElement.offsetHeight;
            let offsetWidth = targetElement.offsetWidth;
            let top = parseFloat(this.body.style.top.substring(0, this.body.style.top.length - 2));
            let left = parseFloat(this.body.style.left.substring(0, this.body.style.left.length - 2));
            this.body.style.top = (top - offsetHeight) + 'px';
            this.body.style.left = (left + (offsetWidth / 2)) + 'px';
            this.body.setAttribute("data-balloon-visible", '');
            this.body.setAttribute("data-balloon", errorMessage);
        }
        else {
            this.body && this.body.removeAttribute("data-balloon-visible");
        }
    }

}