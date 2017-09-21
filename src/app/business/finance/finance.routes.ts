import { RouterModule } from "@angular/router";
import { BusinessComponent } from './index/business.component'
//客户往来
import { CustomerContactComponent } from './customer-contact/customer-contact.component'
import { CustomerContactListComponent} from './customer-contact/customer-contact-list/customer-contact-list.component'
//资金账户
import { FinanceAccountComponent } from './finance-account/finance-account.component'
import { FinanceAccountListComponent } from './finance-account/finance-account-list/finance-account-list.component'
//供应商往来
import { SupplierContactComponent } from './supplier-contact/supplier-contact.component'
import { SupplierContactListComponent } from './supplier-contact/supplier-contact-list/supplier-contact-list.component'
//员工往来
import { EmployeeContactComponent } from './employee-contact/employee-contact.component'
import { EmployeeContactListComponent } from './employee-contact/employee-contact-list/employee-contact-list.component'
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
import { CostAccrueComponent } from './cost-accrue/cost-accrue.component'
import { CostAccrueListComponent } from './cost-accrue/cost-accrue-list/cost-accrue-list.component'

// 费用报销
import { CostReimbursementComponent }from './cost-reimbursement/cost-reimbursement.component'
import { CostReimbursementListComponent }from './cost-reimbursement/cost-reimbursement-list/cost-reimbursement-list.component'

// 新建资金账户
import { FinanceAccountCreateComponent } from './finance-account/finance-account-create/finance-account-create.component';

export const financeRoutes = [
  	{
		path:'',
	    children: [
	    	{ path: '', redirectTo:'customercontact',pathMatch:'full'},
	    	{ 
	    		path: 'customercontact', 
	    		component:CustomerContactComponent ,
	    		data: { title: "客户往来" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:CustomerContactListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{ 
	    		path: 'financeaccount', 
	    		// component:FinanceAccountComponent ,
	    		data: { title: "资金账户" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:FinanceAccountListComponent,data:{title:"列表"}},
		    	  	{ path: 'add', component:FinanceAccountCreateComponent,data:{title:"新增账户"}},
		    	  	{ path: ':operation/:id', component:FinanceAccountCreateComponent,data:{title:"编辑账户"}}
	    		] 
	    	},
	    	{ 
	    		path: 'suppliercontact', 
	    		component:SupplierContactComponent ,
	    		data: { title: "供应商往来" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:SupplierContactListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{ 
	    		path: 'employeecontact', 
	    		component:EmployeeContactComponent ,
	    		data: { title: "员工往来" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:EmployeeContactListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{ 
	    		path: 'periodcost', 
	    		component:PeriodCostComponent ,
	    		data: { title: "期间费用" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:PeriodCostListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{ 
	    		path: 'manufacturecost', 
	    		component:ManufactureCostComponent ,
	    		data: { title: "制造费用" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:ManufactureCostListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{ 
	    		path: 'valueaddedtax', 
	    		component:ValueAddedTaxComponent ,
	    		data: { title: "增值税" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:ValueAddedTaxListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{
	    		path:'costaccrue',
	    		component:CostAccrueComponent,data: {title:"费用计提"},
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:CostAccrueListComponent,data:{title:"列表"}}
	    		] 
	    	},
	    	{
	    		path:'costreimbursement',

	    		component:CostReimbursementComponent,data:{title:"费用报销"},
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:CostReimbursementListComponent,data:{title:"列表"}}
	    		] 	    		
	    	}
	    ]
	},

];

