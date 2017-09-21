import {Component,OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';

import {DomSanitizer} from '@angular/platform-browser'; 

import { PopupService } from 'core/services/popup.service';

import { ProcessService } from  'process/process.service'; 
import { PROCESS_SETTING } from 'process/process.setting';

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import { DynamicFormSupport,DynamicFormDataSupport } from 'rp-dynamic-form/components/form/core/dynamic-form.support'
import { HttpClient } from "rp-dynamic-form/components/form/shared/http-client";
import { ProcessHttpClient } from '../process.httpclient';
@Component({
    selector:'process-detail',
    templateUrl:'./detail.component.html',
    styleUrls:['./detail.component.css'],
    providers:[
            {
                provide: HttpClient, useClass: ProcessHttpClient,
            }
        ]
})
export class ProcessDetailComponent implements OnInit{

	private imgUrl : string = '';
    private taskLogs : Array<any> = [];
    private emptyMessage : string = "没有记录";
    private formData : any;
    private src : any;
    private isFinished : boolean;
    private display : boolean;
    private formType : string = "";

    private processInfo : BehaviorSubject<any> = new BehaviorSubject(null);

    private processCode : string;

    private dynamicFormSupportRef:DynamicFormSupport;
    /**
     * [params 可观察对象，数据形式{"processCode":"流程code","transType":"流程类型"}]
     */
    @Input() 
    params : BehaviorSubject<any>;

	constructor(
        private router : Router,
        private popupService:PopupService,
        private processService:ProcessService,
        private sanitizer: DomSanitizer){}

	ngOnInit(){
        this.params.subscribe(params=>{
            this.init();
            if(params == null || params.processCode == null){
                this.formType = "";
                return;
            }

            this.formType = params.transType;

            this.display = true;
      		this.imgUrl = PROCESS_SETTING.URL.IMG.replace("{processCode}",params.processCode)+"&random="+Math.random();
            this.processCode = params.processCode;
            window.localStorage.setItem("processCode",params.processCode);
	        
            this.processService.getTaskLogs(params.processCode)
                .then(data =>{
                    var my = this;
                    this.taskLogs = data;
                    if(this.taskLogs[this.taskLogs.length-1].completeTime != null){
                        this.isFinished = true;
                    }
                }).catch(res => this.popupService.showError(res))
            
            this.processInfo.next({"processCode":params.processCode});
            
        })
    }

    public init():void{
        this.isFinished = false;
        this.display = false;
    }

    initializeFormData = ($form) => {
        if ($form.dynamicFormSupport == null) {
            throw new Error('No dynamicFormSupport found.');
        }

        this.dynamicFormSupportRef = $form.dynamicFormSupport;

        this.processService.getFormByProcessCode(this.processCode)
            .then(result =>{
                let formDefinition = JSON.parse(result.formConfiguration);
                let formData = result.formData ? {jsonData: JSON.parse(result.formData)} : null;
                this.dynamicFormSupportRef.initialize({}, formDefinition, formData);
            });
    }
}