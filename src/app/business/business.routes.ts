import { RouterModule } from "@angular/router";
import { BusinessComponent } from './index/business.component'

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
//自制
import { HomebrewInfoComponent } from 'business/homebrew/index/homebrew.component'

export const businessRoutes = [
  	{
		path:'',
		component:	BusinessComponent,
	    children: [
	    	{ path: '', redirectTo:'inventory',pathMatch:'full'},
	    	{ 
	    		path: 'inventory', 
	    		component:InventoryComponent ,
	    		data: { title: "库存" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:InventoryListComponent,data:{title:"仓库库存"}},
		    	  	{ path: 'financial', component:FinancialListComponent,data:{title:"财务库存"}},
		    	  	{ path: 'balanceages', component:BalanceAgesComponent,data:{title:"物料账龄"}},
	    		] 
	    	},
	    	{ 
	    		path: 'selling', 
	    		component:SellingComponent ,
	    		data: { title: "销售" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:SellingListComponent,data:{title:"列表"}},
		    	  	{ path: 'following/:id', component:FollowingComponent,data:{title:"跟踪"}},
		    	  	{ path: 'create',component:SellingCreateComponent,data:{title:'新建'}},
		    	  	{ path: ':id/view',component:SellingCreateComponent,data:{title:'审批/查看'}},
		    	  	{ path: 'products',component:ProductListComponent,data:{title:'物料列表'}},
		    	  	{ path: 'orders/:id/detail',component:OrderDetailComponent,data:{title:'订单详情'}}
	    		] 
	    	},
	    	{
	    		path:'homebrew',
	    		component:HomebrewInfoComponent,data: {title:"自制"}
	    	},


	    	//财务模块
	    	{
				path:'finance',
				data: { title: '财务' },
				loadChildren: function() {
					return new Promise(function(resolve) {
						require.ensure([], function (require) {
						resolve(require("./finance/finance.module")['default'])
						},"process-plugin");
					});
				}
			},
			//采购模块
	    	{
				path:'purchase',
				data: { title: '采购' },
				loadChildren: function() {
					return new Promise(function(resolve) {
						require.ensure([], function (require) {
						resolve(require("./purchase/purchase.module")['default'])
						},"process-plugin");
					});
				}
			},
	    ]
	},

];
