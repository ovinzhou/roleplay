import { RouterModule } from '@angular/router';
import {ProcessComponent} from '../process/process.component';
import { ProcessStartComponent } from './start/process-start.component';
import { ProcessStartStaticComponent } from './start/process-start-static.component';
import { ProcessUpdateComponent } from './update/process-update.component';

import { ProcessLaunchComponent } from './launch/process-launch.component';

import { TodoListComponent } from 'process/list/todo/todo-list.component';

import { ProcessDetailComponent } from './detail/detail.component';

export const ProcessRoutes = [
    {
        path:'',
        component:ProcessComponent,
        children: [
            { path: 'start/:processTypeId',component:ProcessStartComponent,data: { title: "发起" }},
            { path: 'start/:processTypeId/tasks/:taskId',component:ProcessStartComponent,data: { title: "待办" }},
            { path: 'update/:processTypeId/:transCode',component:ProcessUpdateComponent,data: { title: "修改" }},
            { path: 'launch/:processTypeId',component:ProcessLaunchComponent,data: { title: "发起" }},
            { path: 'launch/:processTypeId/tasks/:id',component:ProcessLaunchComponent,data: { title: "待办" }},
            { path: 'todo',component:TodoListComponent,data: { title: "我的任务" }},
            { path: 'start2/:processTypeId',component:ProcessStartStaticComponent,data: { title: "发起2" }},
            // { path: 'detail/:processCode',component:ProcessDetailComponent,data: { title: "详情" }}
        ]
    }
];