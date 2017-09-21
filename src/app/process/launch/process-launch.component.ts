import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'; 
import {Router, ActivatedRoute, Params} from '@angular/router';

import {ProcessService} from '../process.service';
import {BASE_URL} from 'core/constants/global-setting';
import { PopupService} from 'core/services/popup.service';

@Component({
        selector:'process-launch',
        template:`<iframe
            [src]='src'
            width='100%'
            height='1000'
            scrolling='yes'
            frameborder='0'
        ></iframe>`
})
export class ProcessLaunchComponent implements OnInit {


    private src:any ='';

    constructor(private router : Router,
                private processService : ProcessService,
                private route:ActivatedRoute,
                private popupService:PopupService,
                private sanitizer: DomSanitizer){}




    ngOnInit(): void {

        var processTypeId = this.route.snapshot.params['processTypeId'],
            taskId = this.route.snapshot.params['id'],
            htmlName = 'display.html',
            taskStatus = this.route.snapshot.queryParams['status'];

        window.localStorage.setItem('baseUrl',BASE_URL);
        window.localStorage.setItem('processTypeId',processTypeId);
        window.localStorage.setItem('taskId',taskId==null?"":taskId);

       


        if(taskId && taskStatus != 'draft'){
            htmlName ='show.html';
        }

        this.src = this.sanitizer.bypassSecurityTrustResourceUrl('/src/app/process/dynamic-form/'+htmlName);  
    }

}