import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule}         from '@angular/forms';
import { PaginationModule } from 'ng2-bootstrap';

import { TreeModule,DropdownModule,DialogModule,PaginatorModule,BreadcrumbModule,SpinnerModule } from 'primeng/primeng';
import { ConfirmDialogModule,ConfirmDialog ,CheckboxModule , FileUploadModule,DataListModule,TabViewModule} from 'primeng/primeng';
import * as PShared from 'primeng/components/common/shared';
import { HttpClientService } from './http-client.service';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { RPBreadcrumb } from './breadcrumb/breadcrumb.component';
import { ProgressCircleComponent } from 'shared/progress-circle/progress-circle.component';

import { CustomConfirmDialog } from "./confirmDialog/custom-confirm-dialog.component";
import { PromptDialog } from "./promptDialog/prompt-dialog.component";

import { StaticValidatorDirective } from "./staticFormValidator";

import { DataTable,DTRadioButton,DTCheckbox,ColumnHeaders,ColumnFooters,TableBody,ScrollableView,RowExpansionLoader } from "./datatable/datatable.component";

/**
 * add by snack 2017-4-13
 */
import {SelectModule}    from 'ng2-select';

@NgModule({
  imports: [ 
  	CommonModule,
  	FormsModule,
  	PaginationModule,
    TreeModule,
    DataListModule,
    // DataTableModule,
    ConfirmDialogModule,
    PaginatorModule,
    CheckboxModule,
    FileUploadModule,
    SelectModule,
    BreadcrumbModule,
    PShared.SharedModule,
    SpinnerModule,
    TabViewModule
  ],
  declarations: [ 
    // 声明需要系统范围内公用的组件
    ToolbarComponent,
    CustomConfirmDialog,
    PromptDialog,
    RPBreadcrumb,
    StaticValidatorDirective,
    ProgressCircleComponent,
    DataTable,DTRadioButton,DTCheckbox,ColumnHeaders,ColumnFooters,TableBody,ScrollableView,RowExpansionLoader,
  ],
  exports: [ 
  	CommonModule, 
  	FormsModule,

    // 导出系统范围内的公用组件
      // 第三方组件库
    TreeModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    PaginatorModule,
    CheckboxModule,
    FileUploadModule,
    PShared.SharedModule,
    SpinnerModule,
    PaginationModule,
    BreadcrumbModule,
    SelectModule,
    TabViewModule,

      // 自定义组件
    ToolbarComponent,
    CustomConfirmDialog,
    RPBreadcrumb,
    ProgressCircleComponent,
    DataTable,
    StaticValidatorDirective,
  ],
  providers:[
    // HttpClientService
  ],
  entryComponents:[
    ConfirmDialog,
    CustomConfirmDialog,
    PromptDialog
  ]
})
export class SharedModule {
  
}