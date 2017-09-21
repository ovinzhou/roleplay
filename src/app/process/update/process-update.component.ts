import {Component, Input, Output, Injector, AfterViewInit, AfterViewChecked, ViewChild, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ProcessService} from '../process.service';

import { HttpClientService } from '../../core/services/http-client.service';
@Component(
    {
        selector:'process-start',
        template:` `
    }
)
export class ProcessUpdateComponent implements OnInit {
    constructor(private router : Router,
                private processService : ProcessService,
                 private route:ActivatedRoute,){}

    // <rp-dyna-form [init]="initializeFormData"
    //             type="update"
    //             [actions]="createContext.actions"
    //             actionsPosition="footer">
    //         </rp-dyna-form>
    
    //the initial context for this component
    private updateContext:any = {};
    // the dynamic form reference
    private dynamicFormSupportRef:any;

    processTypeId:string;
    transCode:string;
    formData:any;

    ngOnInit(): void {
        this.processTypeId = this.route.snapshot.params['processTypeId'];
        this.transCode = this.route.snapshot.params['transCode'];
    }

    start(transType){
        this.processService.start(transType,"");
    }




    //$form the dynamic form reference
    initializeFormData = ($form) => {
        if ($form.dynamicFormSupport == null) {
            throw new Error('No dynamicFormSupport found.');
        }

        if (this.processTypeId == null || this.processTypeId === '') {
            throw new Error('The processId is not supplied.');
        }

        this.dynamicFormSupportRef = $form.dynamicFormSupport;

        let entityId = "20000";//this.authService.getSecurityContext().entityId;

        this.processService.start(this.processTypeId,"")
            .then(result => {
                this.updateContext = result;
                this.updateContext.entityId = entityId;

                 result.options = "[{\"name\":\"submitForm\",\"text\":\"提交\",\"value\":\"2\",\"url\":\"/entities/{entityId}/tasks/submit/{instanceId}/{operateFlag}\"},{\"name\":\"saveDraft\",\"text\":\"保存草稿\",\"value\":\"\",\"url\":\"/entities/{entityId}/tasks/save/{instanceId}/{taskId}\"},{\"name\":\"cancel\",\"text\":\"取消\",\"value\":\"\",\"url\":\"\"}]";
                let options = JSON.parse(result.options);
                let actions = [];
                if (options && options.length > 0) {
                    options.forEach(option => {
                        let action:any = Object.assign({}, option);
                        action.doAction = () => {
                            //delegate to CreateOrderComponents onFormAction function
                            this.onFormAction(action);
                        };
                        actions.push(action);
                    })
                }
                this.updateContext.actions = actions;

                return result;
            })
            .then(result => {
                return this.processService.load(this.transCode)
                    .then((formData:any) => {

                            this.updateContext = Object.assign({},
                                this.updateContext,
                                {
                                    entityId: formData.entityId,
                                    transCode: formData.transCode,
                                });

                        let {jsonData} = formData;
                        formData.jsonData = JSON.parse(jsonData);
                        this.dynamicFormSupportRef.initialize(this.updateContext, result, formData);
                        this.formData = this.dynamicFormSupportRef.formInstance;
                        return formData;
                    });

            })
            .then(result => {
                console.log('formDefinition:', this.dynamicFormSupportRef.formDefinition);
                console.log('formInstance:', this.dynamicFormSupportRef.formInstance);
                console.log('runtimeSupport:', this.dynamicFormSupportRef.runtimeSupport);

                return result;
            })

    }

    

    onFormAction = (action) => {
        console.log(action);

        //cancel
        if (action.name == 'cancel') {
            //do nothing
            alert('user canceled');
            return;
        }

        let dataToSave = {
            "taskId": this.updateContext.taskId,
            "transCode": "",
            "viewId": this.updateContext.viewId,
            "templateViewVersion": "1", // 1 for create
            "jsonData": {
                "transType": this.updateContext.transType,
                "sections": this.dynamicFormSupportRef.getFormDataToSave()
            }
        };

        let { url } = action;

        url = '/H_roleplay-si' + url;

        if (action.name == 'saveDraft') {

            console.log('final url', url);
            console.log('dataToSave', dataToSave);

            return;

        }
        if (action.name == 'submitForm') {

            console.log('final url', url);
            console.log('dataToSave', dataToSave);


            return;
        }

    }


}