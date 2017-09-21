
import {Component, Input, Output, Injector, AfterViewInit, AfterViewChecked, ViewChild, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ProcessService} from './process.service';

@Component(
    {
        selector:'process-start',
        template:`
           <router-outlet></router-outlet>
            `
    }
)
export class ProcessComponent {

    constructor(private router : Router,
                private processService : ProcessService,
                 private route:ActivatedRoute,){}

    
    

}