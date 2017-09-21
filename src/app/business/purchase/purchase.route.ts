//按单采购
import { PurchaseOrderListComponent } from "./purchase-order-list/purchase-order-list.component"

//备品采购
import { SparePortListComponent } from './spare-port/spare-port-list/spare-port-list.component';
//跟踪
import { FollowingComponent } from './following/following.component'


export const purchaseRoute = [
	{
		path:'',
		data:{title:"采购"},
		children : [
    	  	{ path: '', redirectTo:'order',pathMatch:'full'},
    	  	{
    	  		path : 'order',
    	  		data:{title:"订单采购"},
    	  		children : [
    	  			{ path: '', redirectTo:'list',pathMatch:'full'},
    	  			{ path: 'list', component:PurchaseOrderListComponent,data:{title:"订单列表"}},
    	  		]
    	  	},
    	  	// { path: 'list', component:PurchaseOrderListComponent,data:{title:"订单列表"}},
    	  	
    	  	{
	    		path:'spareport',
	    		// component:SparePortComponent,
	    		data:{title:"备品采购"},
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:SparePortListComponent,data:{title:"列表"}}
	    		] 	    		
	    	},
	    	{
	    		path:'following',
	    		component:FollowingComponent,
	    		data:{title:"跟踪"},
	    	},
		] 	    		
	}
]