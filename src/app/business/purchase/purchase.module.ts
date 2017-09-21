import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule} from '@angular/common';
import { SharedModule } from 'shared/shared.module';
//备品采购
import { SparePortListComponent } from './spare-port/spare-port-list/spare-port-list.component';
//按单采购列表
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component'

import { purchaseRoute } from './purchase.route';
import { PurchaseDataService } from './purchase-data.service'
//跟踪
import { FollowingComponent } from './following/following.component'

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(purchaseRoute)
  ],
  declarations: [
    //备品采购
    SparePortListComponent,
    //订单采购
    PurchaseOrderListComponent,
    //跟踪
    FollowingComponent
  ],
  exports:[
  ],
  providers: [
    PurchaseDataService
  ],
})
export default class PurchaseModule {
  
}