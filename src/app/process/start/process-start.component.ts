import { Component, Input, Output, Injector, AfterViewInit, AfterViewChecked, ViewChild, OnInit, OnDestroy, ElementRef, Renderer} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { Location } from '@angular/common';
import { ProcessService } from '../process.service';
import { DynamicFormSupport,DynamicFormDataSupport } from 'rp-dynamic-form/components/form/core/dynamic-form.support'
import { HttpClient } from "rp-dynamic-form/components/form/shared/http-client";
import { ProcessHttpClient } from '../process.httpclient';
import { AppComponent } from 'app.component'
import { ValidatorErrors } from "rp-dynamic-form/components/form/validator/validator.errors";

@Component(
    {
        selector:'process-start',
        template:`
            <rp-dyna-form [init]="initializeFormData"
                [readOnly]="isReadOnly"
                [actions]="createContext.actions"
                actionsPosition="footer">
            </rp-dyna-form>`,
        providers:[
            {
                provide: HttpClient, useClass: ProcessHttpClient,
            }
        ]
    }
)
export class ProcessStartComponent implements OnInit,AfterViewInit,OnDestroy {
    constructor(private router: Router,
                private processService : ProcessService,
                private location: Location,
                private popupService : PopupService,
                private httpClient: HttpClient,
                private element: ElementRef, 
                private renderer: Renderer,
                private appComponent: AppComponent,
                private route:ActivatedRoute){
    }
    
    private createContext:any = {};
    private dynamicFormSupportRef:DynamicFormSupport;
    private processTypeId:string;
    private taskId:string;
    private initContext:any;
    private initRawData:any;

    private scrollListener: Function;
    private isReadOnly: boolean = false;
    private queryParams: any;
    private isChecked: boolean = false;

    ngOnInit(): void {
        this.processTypeId = this.route.snapshot.params['processTypeId'];
        this.taskId = this.route.snapshot.params['taskId'] == null?"":this.route.snapshot.params['taskId'];
        this.queryParams = <any>(this.route.snapshot.queryParams);

        if(this.queryParams){
            if (this.queryParams.readonly !== void 0) {
                this.isReadOnly = true;
            }

            if (this.queryParams.context) {
                this.initContext = JSON.parse(this.queryParams.context);
            }
            if (this.queryParams.initData) {
                this.initRawData = JSON.parse(this.queryParams.initData);
            }
        }
    }

    ngAfterViewInit() {
        let scrollBody = document.body.querySelector(".content.gray-bg");
        if(scrollBody){
            this.scrollListener = this.renderer.listen(scrollBody, 'scroll', (event) => {
                if (this.isChecked) {
                    this.dynamicFormSupportRef.validatorErrors.displayErrorOnScroll();
                }
            });
        }
    }

    initializeFormData = ($form) => {
        if ($form.dynamicFormSupport == null) {
            throw new Error('No dynamicFormSupport found.');
        }

        if (this.processTypeId == null || this.processTypeId === '') {
            throw new Error('The processId is not supplied.');
        }

        this.dynamicFormSupportRef = $form.dynamicFormSupport;

        
        if(this.taskId){
            this.processService.doTask(this.taskId)
                .then(result =>{
                    this.init(result);
                    return result;
                });

        }else{
            this.processService.start(this.processTypeId,this.initContext)
                .then(result => {
                    this.init(result);
                    return result;
                });

        }
    }

    private init(result){

            let entityId = "20000";//this.authService.getSecurityContext().entityId;
            let formDefinition = JSON.parse(result.formConfiguration);
            let formData = result.formData ? {jsonData: JSON.parse(result.formData)} : null;
            
            this.createContext.entityId = entityId;
            this.createContext.currentUser = this.appComponent.currentUserInfo && this.appComponent.currentUserInfo.id;

            Object.assign(this.createContext,this.initContext);

            let actions = [];
            let optionType = formDefinition.optionType;
            
            if (optionType ==='review') {
                Array.prototype.push.apply(actions,[
                    { name:'approve',text:'同意' },
                    { name:'disapprove',text:'不同意' }
                ]);
            } else if(optionType === 'submit') {
                Array.prototype.push.apply(actions,[
                    { name:'draft',text:'保存草稿' },
                    { name:'submit',text:'提交' }
                ]);
            }
            actions.push({name:'cancel',text:'取消'});

            actions.forEach(action => {
                action.doAction = () =>{
                    this.onFormAction(action);
                }
            });

            this.createContext.actions = actions;

            this.dynamicFormSupportRef.initialize(this.createContext, formDefinition, formData);

            // 处理个别form字段的初始化
            if (this.initRawData) {
                Object.keys(this.initRawData).forEach((key) => {
                    this.dynamicFormSupportRef.formData.setFormFieldValueExt(key,this.initRawData[key]);
                });
            }

    }

    private onFormAction = (action) => {
        if (action.name == 'cancel') {
            this.location.back();
            return;
        }

        //do validate
        if (action.name !== 'draft' && this.dynamicFormSupportRef.validatorErrors.hasErrors()) {
            this.dynamicFormSupportRef.validatorErrors.displayError = true;
            this.isChecked = true;
            return;
        }

        //build the post body
        let dataToSave = {
            "transType": this.processTypeId,
            "sections": this.dynamicFormSupportRef.getFormDataSnapshot()
        };

        if (action.name == 'draft') {
            this.processService.draft(this.processTypeId,this.taskId,dataToSave).then(() => {
                this.location.back();
            },(error) => {
                this.popupService.showError(error);
            });
        } else if (action.name == 'submit') {
            this.processService.submit(this.processTypeId,this.taskId,dataToSave).then(() => {
                this.location.back();
            },(error) => {
                this.popupService.showError(error);
            });
        } else if (action.name == 'approve') {
            let ps = this.processService;
            let id = this.taskId;
            let location = this.location;
            this.popupService.prompt({header:'审批意见',accept:function(m){
                ps.approve(id,{"decision":m})
                    .then(() =>{
                         location.back();
                    },(error) => {
                        this.popupService.showError(error);
                    });
            }.bind(this)});
        } else if (action.name == 'disapprove') {
            let ps = this.processService;
            let id = this.taskId;
            let location = this.location;
            this.popupService.prompt({header:'审批意见',accept:function(m){
                ps.disapprove(id,{"decision":m})
                    .then(() =>{
                        location.back();
                    },(error) => {
                        this.popupService.showError(error);
                    });
            }.bind(this)});
        }
    }

    private buildInitFormData() {
        if(!this.initRawData){
            return null;
        }

        let initFormData = [];
        let dynaFormDataSupport = this.dynamicFormSupportRef.formData;

        if(this.initRawData){
            Object.keys(this.initRawData).forEach((key) => {
                let index = dynaFormDataSupport.getFieldIndex(key);
                while(index >= initFormData.length){
                    initFormData.push({});
                }

                initFormData[index][key] = this.initRawData[key]
            });
        }

        return initFormData;
    }

    private initForm() {
        let formInitConfig = this.dynamicFormSupportRef.formData.formDefinition.init;

        if(formInitConfig){
            let pathParams = formInitConfig.pathVar;
            let url = formInitConfig.url2;
            let rel = formInitConfig.rel;

            if(pathParams === void 0 || url === void 0){
                return;
            }

            Object.keys(pathParams).forEach(key => {
                let regex = eval("/\{" + key + "\}/i");
                let value = pathParams[key];

                url = url.replace(regex, this.createContext[key]);
            })

            this.httpClient.get(url).then((data) => {
                Object.keys(rel).forEach( fieldCode => {
                    this.dynamicFormSupportRef.formData.setFormFieldValueExt(fieldCode,data[rel[fieldCode]]);
                });
            },(error) => {
                console.error('failed to init form in global....');
            });
        }
    }

    ngOnDestroy() {
        if(this.scrollListener) {
            this.scrollListener();
        }
    }
}
