import { Injectable,ElementRef,ComponentFactoryResolver,ViewContainerRef,Injector,ReflectiveInjector } from "@angular/core";
import { Component,Input,NgModule,Compiler,ComponentFactory } from "@angular/core";
import { ConfirmDialog,ConfirmationService,Confirmation,ConfirmDialogModule } from 'primeng/primeng';

import { CustomConfirmDialog } from "shared/confirmDialog/custom-confirm-dialog.component"
import { PromptDialog } from "shared/promptDialog/prompt-dialog.component";

//错误码
import { ROLEPLAY_ERROR } from 'core/constants/roleplay-error';

@Injectable()
export class PopupService {

    constructor(
    	private _resolver: ComponentFactoryResolver,
      private compiler: Compiler,
    	private _injector: Injector) {
    }

    private dynamicComponentTarget: ViewContainerRef;

    private createNewComponent (tmpl:string) {
      @Component({
          selector: 'dynamic-component',
          template: tmpl,
      })
      class CustomDynamicComponent{
          @Input()  public entity: any;
      };

      return CustomDynamicComponent;
    }

    private createComponentModule (componentType: any) {
      @NgModule({
        imports: [
          ConfirmDialogModule,
        ],
        declarations: [
          componentType
        ],
      })
      class RuntimeComponentModule{
      }
      return RuntimeComponentModule;
    }

    private createComponentFactory(template: string) : Promise<ComponentFactory<any>> {    
        // let factory = this._cacheOfFactories[template];

        // if (factory) {
        //     console.log("Module and Type are returned from cache")

        //     return new Promise((resolve) => {
        //         resolve(factory);
        //     });
        // }

        // unknown template ... let's create a Type for it
        let type   = this.createNewComponent(template);
        let module = this.createComponentModule(type);

        let factory;

        return new Promise((resolve) => {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) =>
                {
                    const factory = moduleWithFactories.componentFactories.find((comp) =>
                      comp.componentType === type
                    );
                    // this._cacheOfFactories[template] = factory;
                    resolve(factory);
                });
        });
    }

    public setDynamicComponentTarget(appContainer: ViewContainerRef){
      this.dynamicComponentTarget = appContainer;
    }

    public alert(confirmation){
        let confirmationService = new ConfirmationService();

        let injector = ReflectiveInjector.resolveAndCreate([
            {  provide: ConfirmationService, useValue: confirmationService },
          ], this._injector);

        if(typeof confirmation === "string"){
            confirmation = {
              message: confirmation
            }
        }

        let originAccept = confirmation.accept;
        // let factory = this._resolver.resolveComponentFactory(ConfirmDialog);
        let factory = this._resolver.resolveComponentFactory(CustomConfirmDialog);
        let componentRef = this.dynamicComponentTarget.createComponent(factory,0,injector);

        componentRef.instance.width = confirmation.width || 400;
        componentRef.instance.rejectVisible = false;
        componentRef.instance.acceptLabel = confirmation.acceptLabel || "关闭";
        confirmation.accept = () => {
          if(originAccept){
            originAccept.call(null);
          }
          componentRef.destroy();
        };

        if(confirmation.header === void 0){
          confirmation.header = "错误";
        }

        setTimeout(() => {
            confirmationService.confirm(confirmation);
        },0);
    }

    public confirm(confirmation){
    	  let confirmationService = new ConfirmationService();

      	let injector = ReflectiveInjector.resolveAndCreate([
	          {  provide: ConfirmationService, useValue: confirmationService },
	      	], this._injector);


        let originAccept = confirmation.accept;
        let originReject = confirmation.reject;
        let factory = this._resolver.resolveComponentFactory(CustomConfirmDialog);
      	let componentRef = this.dynamicComponentTarget.createComponent(factory,0,injector);

        componentRef.instance.width = confirmation.width || 400;
        componentRef.instance.rejectLabel = confirmation.rejectLabel || "否";
        componentRef.instance.acceptLabel = confirmation.acceptLabel || "是";
        confirmation.accept = () => {
          if(originAccept){
            originAccept.call(null);
          }
          componentRef.destroy();
        };
        confirmation.reject = () => {
          if(originReject){
            originReject.call(null);
          }
          componentRef.destroy();
        };

      	// document.body.appendChild(componentRef.location.nativeElement);

        setTimeout(() => {
            confirmationService.confirm(confirmation);
        },0);
  

        // this.createComponentFactory(`<p-confirmDialog width="400"></p-confirmDialog>`)
        // .then((factory: ComponentFactory<any>) =>
        // {
        //     // Target will instantiate and inject component (we'll keep reference to it)
        //     // this.componentRef = this
        //     //     .dynamicComponentTarget
        //     //     .createComponent(factory);

        //     // // let's inject @Inputs to component instance
        //     // let component = this.componentRef.instance;


        //     let confirmationService = new ConfirmationService();

        //     let injector = ReflectiveInjector.resolveAndCreate([
        //         {  provide: ConfirmationService, useValue: confirmationService },
        //       ], this._injector);

        //     // let componentRef = factory.create(injector);
        //     let componentRef = this.dynamicComponentTarget.createComponent(factory,0,injector);
        //     // componentRef.instance.width = 400;
            
        //     document.body.appendChild(componentRef.location.nativeElement);

        //     confirmationService.confirm(confirmation);

        // });
    }

    public prompt(confirmation){
        let confirmationService = new ConfirmationService();

        let injector = ReflectiveInjector.resolveAndCreate([
              {  provide: ConfirmationService, useValue: confirmationService },
            ], this._injector);


        let originAccept = confirmation.accept;
        let originReject = confirmation.reject;
        let factory = this._resolver.resolveComponentFactory(PromptDialog);
        let componentRef = this.dynamicComponentTarget.createComponent(factory,0,injector);

        componentRef.instance.width = confirmation.width || 400;
        componentRef.instance.rejectLabel = confirmation.rejectLabel || "否";
        componentRef.instance.acceptLabel = confirmation.acceptLabel || "是";


        confirmation.header = confirmation.header || "系统提示";

        confirmation.accept = () => {
          if(originAccept){
            originAccept.call(null,(<any>componentRef.instance).promptInfo);
          }
          componentRef.destroy();
        };
        confirmation.reject = () => {
          if(originReject){
            originReject.call(null);
          }
          componentRef.destroy();
        };

        // document.body.appendChild(componentRef.location.nativeElement);

        setTimeout(() => {
            confirmationService.confirm(confirmation);
        },0);
    }

    showError(oError){
      let message = "系统异常";
      if(oError.headers && ROLEPLAY_ERROR[oError.headers.get('roleplay-error-code')]){
          message = ROLEPLAY_ERROR[oError.headers.get('roleplay-error-code')];
      }else if(oError._body){
        let errorObj = JSON.parse(oError._body);
        if(errorObj && errorObj.message){
          message = errorObj.message;
        }
      }
      this.alert(message);
    }
}
