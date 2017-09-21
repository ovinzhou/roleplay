import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FormGroup} from '@angular/forms';
import {CalendarModule} from 'primeng/primeng';

import {ProcessComponent} from '../process/process.component';
import {DynamicFormModule} from "rp-dynamic-form/components/form/core/dynamic-form.module";
import {ProcessService} from '../process/process.service';
import { ProcessRoutes } from  './process.routes';
import { ProcessDetailComponent } from './detail/detail.component';

// SharedModule
import { SharedModule } from '../shared/shared.module';
import { ProcessStartComponent } from './start/process-start.component';
import { ProcessStartStaticComponent } from './start/process-start-static.component';
import { ProcessUpdateComponent } from './update/process-update.component';
import { ProcessLaunchComponent } from './launch/process-launch.component';
import { TodoListComponent } from 'process/list/todo/todo-list.component';

import { SellingDetailComponent } from 'process/static-form/selling/selling-detail.component';

import {TabViewModule} from 'primeng/primeng';

import { SellingService } from 'business/selling/selling-data.service';

@NgModule({
    imports:[
        SharedModule,
        DynamicFormModule,
        CommonModule,
        RouterModule.forChild(ProcessRoutes),
        TabViewModule,
        CalendarModule
    ],
    declarations:[
        ProcessComponent,
        ProcessStartComponent,
        ProcessStartStaticComponent,
        ProcessUpdateComponent,
        ProcessLaunchComponent,
        TodoListComponent,
        ProcessDetailComponent,
        SellingDetailComponent
    ],
    exports:[
        ProcessDetailComponent
    ],
    providers:[
        ProcessService,
        SellingService
    ]

})

export default class ProcessModule{}