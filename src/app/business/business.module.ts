import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule} from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {CalendarModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {SpinnerModule} from 'primeng/primeng';
import { DynamicFormModule} from "rp-dynamic-form/components/form/core/dynamic-form.module";
import { BusinessDataService } from "./business-data.service";
import { SellingService } from 'business/selling/selling-data.service';
import { ProcessService } from 'process/process.service';
import { businessRoutes } from './business.routes';
import { BusinessComponent } from './index/business.component';
//库存
import { InventoryListComponent } from  './inventory/inventory-list/inventory-list.component';
import { InventoryComponent } from  './inventory/inventory.component';
import { FinancialListComponent } from  './inventory/financial-list/financial-list.component';
import { BalanceAgesComponent } from  './inventory/balance-ages/balance-ages.component';
//销售
import { SellingComponent } from 'business/selling/selling.component';
import { SellingListComponent } from 'business/selling/selling-list/selling-list.component';
import { FollowingComponent } from  'business/selling/following/following.component';
import { SellingCreateComponent } from 'business/selling/selling-create/selling-create.component';
import { ProductListComponent } from  'business/selling/product/product.component';
import { OrderDetailComponent } from 'business/selling/order-detail/order-detail.component';
// 自制
import { HomebrewInfoComponent } from 'business/homebrew/index/homebrew.component';

//财务模块
import FinanceModule from './finance/finance.module';
//采购模块
import PurchaseModule from './purchase/purchase.module';

import ProcessModule from 'process/process.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(businessRoutes),
    DynamicFormModule,
    CalendarModule,
    InputTextModule,
    SpinnerModule,
    //财务模块
    FinanceModule,
    //采购模块
    PurchaseModule,
    //流程模块
    ProcessModule
  ],
  declarations: [
    BusinessComponent,
    InventoryListComponent,
    InventoryComponent,
    FinancialListComponent,
    BalanceAgesComponent,
    //销售
    SellingComponent,
    SellingListComponent,
    FollowingComponent,
    SellingCreateComponent,
    ProductListComponent,
    OrderDetailComponent,
    //自制
    HomebrewInfoComponent,
  ],
  exports:[
  SellingCreateComponent
  ],
  providers: [
    BusinessDataService,
    SellingService,
    ProcessService
  ],
})
export default  class BusinessModule {
  
}