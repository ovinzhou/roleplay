import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule} from '@angular/common';
import { SharedModule } from 'shared/shared.module';
//客户往来
import { CustomerContactComponent } from './customer-contact/customer-contact.component';
import { CustomerContactListComponent } from './customer-contact/customer-contact-list/customer-contact-list.component';
//资金账户
import { FinanceAccountComponent } from './finance-account/finance-account.component';
import { FinanceAccountListComponent } from './finance-account/finance-account-list/finance-account-list.component';
//供应商往来
import { SupplierContactComponent } from './supplier-contact/supplier-contact.component';
import { SupplierContactListComponent } from './supplier-contact/supplier-contact-list/supplier-contact-list.component';
//员工往来
import { EmployeeContactComponent } from './employee-contact/employee-contact.component';
import { EmployeeContactListComponent } from './employee-contact/employee-contact-list/employee-contact-list.component';
//期间费用
import { PeriodCostComponent } from './period-cost/period-cost.component';
import { PeriodCostListComponent } from './period-cost/period-cost-list/period-cost-list.component';
//制造费用
import { ManufactureCostComponent } from './manufacture-cost/manufacture-cost.component';
import { ManufactureCostListComponent } from './manufacture-cost/manufacture-cost-list/manufacture-cost-list.component';
//增值税
import { ValueAddedTaxComponent } from './value-added-tax/value-added-tax.component';
import { ValueAddedTaxListComponent } from './value-added-tax/value-added-tax-list/value-added-tax-list.component';
//费用计提
import { CostAccrueComponent } from './cost-accrue/cost-accrue.component';
import { CostAccrueListComponent } from './cost-accrue/cost-accrue-list/cost-accrue-list.component'

// 费用报销
import { CostReimbursementComponent } from './cost-reimbursement/cost-reimbursement.component';
import { CostReimbursementListComponent } from './cost-reimbursement/cost-reimbursement-list/cost-reimbursement-list.component';
// 新建资金账户
import { FinanceAccountCreateComponent } from './finance-account/finance-account-create/finance-account-create.component';
import { FinanceDataService } from './finance-data.service'

import { financeRoutes } from './finance.routes'

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(financeRoutes),
  ],
  declarations: [
    //客户往来
    CustomerContactComponent,
    CustomerContactListComponent,
    //资金账户
    FinanceAccountComponent,
    FinanceAccountListComponent,
    FinanceAccountCreateComponent,
    //供应商往来
    SupplierContactComponent,
    SupplierContactListComponent,
    //员工往来
    EmployeeContactComponent,
    EmployeeContactListComponent,
    //期间费用
    PeriodCostComponent,
    PeriodCostListComponent,
    //制造费用
    ManufactureCostComponent,
    ManufactureCostListComponent,
    //增值税
    ValueAddedTaxComponent,
    ValueAddedTaxListComponent,
    //费用计提
    CostAccrueComponent,
    CostAccrueListComponent,
    // 费用报销
    CostReimbursementComponent,
    CostReimbursementListComponent,
  ],
  exports:[
    CostReimbursementListComponent
  ],
  providers: [
    FinanceDataService
  ],
})

export default class FinanceModule {
}