import { RouterModule } from '@angular/router';
// Base data page
import { FoundationinfoComponent } from './index/foundationinfo.component'
// 产品属性
import { SpuAttrbuteComponent } from './spu-attribute/spu-attribute.component';
import { SpuAttrbuteListComponent } from './spu-attribute/spu-attribute-list/spu-attribute-list.component';
import { SpuAttrbuteCreateComponent } from './spu-attribute/spu-attribute-create/spu-attribute-create.component';
// 产品类型
import { SpuTypeComponent } from './spu-type/spu-type.component';
import { SpuTypeListComponent} from  './spu-type/spu-type-list/spu-type-list.component';
import { SpuTypeCreateComponent } from './spu-type/spu-type-create/spu-type-create.component';
// 工价
import { WageComponent } from './wage/wage.component';
import { WageListComponent } from './wage/wage-list/wage-list.component';
import { WageCreateComponent } from './wage/wage-create/wage-create.component';
// 工序
import { ProcedureComponent } from './procedure/procedure.component';
import { ProcedureListComponent } from  './procedure/procedure-list/procedure-list.component';
import { ProcedureCreateComponent } from './procedure/procedure-create/procedure-create.component';
// 物料SKU
import { SkuComponent } from  './sku/sku.component';
import { SkuListComponent } from './sku/sku-list/sku-list.component';
import { SkuCreateComponent } from  './sku/sku-create/sku-create.component';
//物料SPU
import { SpuComponent } from './spu/spu.component';
import { SpuListComponent } from  './spu/spu-list/spu-list.component';
import { SpuCreateComponent } from  './spu/spu-create/spu-create.component';
import { SpuUploadComponent } from './spu/spu-upload/spu-upload.component';

//仓库
import { WarehouseComponent }         from  './warehouse/warehouse.component';
import { WarehouseListComponent }     from  './warehouse/warehouse-list/warehouse-list.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create/warehouse-create.component';

// 费用
import { ChargeComponent }         from './charge/charge.component';
import { ChargeListComponent }     from './charge/charge-list/charge-list.component';
import { ChargeCreateComponent }   from './charge/charge-create/charge-create.component';
//资金账户
import { CapitalAccount } from './capital-account/capital-account.component'
import { CapitalAccountListComponent }     from './capital-account/capital-account-list/capital-account-list.component';
import { CapitalAccountCreateComponent }   from './capital-account/capital-account-create/capital-account-create.component';
//设计BOM
import { DesignBomComponent } from './design-bom/design-bom.component';
import { DesignBomListComponent } from './design-bom/design-bom-list/design-bom-list.component';
import { DesignBomCreateComponent } from './design-bom/design-bom-create/design-bom-create.component';

export const foundationinfoRoutes = [
  	{
		path:'',
		component:FoundationinfoComponent,
		
	    children: [
	    	{ path: '', redirectTo:'sputype',pathMatch:'full'},
	    	//产品属性
	    	{ 
	    		path:'spuattrbute',
	    		component:SpuAttrbuteComponent,
	    	    data: { title: "物料属性" },
	    		children:[
    			  	{ path: '', redirectTo:'list',pathMatch:'full'},
			      	{ path: 'list',component: SpuAttrbuteListComponent},
			      	{ path: 'add',component: SpuAttrbuteCreateComponent,data: { title: "新增物料属性" },},
			      	{ path: ':operation/:id',component: SpuAttrbuteCreateComponent,data: { title: "修改物料属性" },},
			    ]
	    	},
	    	// 产品类型
	    	{ 
	    		path:'sputype',
	    		component:SpuTypeComponent,
	    	    data: { title: "物料类型" },
	    		children:[
	    			  	{ path: '', redirectTo:'list',pathMatch:'full'},
				      	{ path: 'list',component: SpuTypeListComponent},
				      	{ path: ':operation/:id',component: SpuTypeCreateComponent,data:{ title:"修改物料类型"}},
				    ]
	    	},
	    	// 工价
	    	{ 
	    		path:'wage',
	    		component:WageComponent,
	    	    data: { title: "工价" },	    		
	    		children:[
	    			  	{ path: '', redirectTo:'list',pathMatch:'full'},
				      	{ path: 'list',component: WageListComponent},
				      	{ path: 'add',component: WageCreateComponent,data: { title: "新增工价" }},
				      	{ path: ':operation/:id',component: WageCreateComponent,data: { title: "修改工价" }},
				    ]
	    	},
	    	// 工序
	    	{ 
	    		path:'procedure',
	    		component:ProcedureComponent,
	    	    data: { title: "工序" },
	    		children:[
	    			  	{ path: '', redirectTo:'list',pathMatch:'full',},
				      	{ path: 'list',component: ProcedureListComponent},
				      	{ path: 'add',component: ProcedureCreateComponent,data: { title: "新增工序" }},
				      	{ path: ':operation/:id',component: ProcedureCreateComponent,data: { title: "修改工序" }},
				    ]
	    	},
	    	// 物料SKU
	    	{ 
	    		path:'sku',
	    		component:SkuComponent,
				data: { title: "SKU" },
	    		children:[
	    			  	{ path: '', redirectTo:'list',pathMatch:'full'},
				      	{ path: 'list',component: SkuListComponent},
				      	{ path: 'add',component:SkuCreateComponent,data: { title: "新增SKU" }},
				      	{ path: ':operation/:id',component: SkuCreateComponent,data: { title: "修改SKU" }},
				    ]
	    	},
	    	// 物料SPU
	    	{ 
	    		path:'spu',
	    		component:SpuComponent,
	    		data: { title: "SPU" },
	    		children:[
	    			  	{ path: '', redirectTo:'list',pathMatch:'full'},
				      	{ path: 'list',component: SpuListComponent},
	    			  	{ path: 'add',component:SpuCreateComponent,data: { title: "新增SPU" }},
	    			  	{ path: 'upload',component:SpuUploadComponent,data:{title:"导入"}},
				      	{ path: ':operation/:id',component: SpuCreateComponent,data: { title: "修改SPU" }},
				    ]
	    	},
	    	// 仓库
	    	{ 
	    		path:'warehouse',
	    		component:WarehouseComponent,
	    		data: { title: "仓库" },
	    		children:[
	    			  	{ path: '', redirectTo:'list',pathMatch:'full'},
				      	{ path: 'list',component: WarehouseListComponent,data:{ title: "仓库列表" }},
				      	{ path: 'add',component: WarehouseCreateComponent,data:{ title: "新增仓库" }},
				      	{ path: ':operation/:id',component: WarehouseCreateComponent,data: { title: "修改仓库" }},
				    ]
	    	},
	    	//费用
	    	{
	    		path:'charge',
	    		component:ChargeComponent,
	    		data: { title: "费用" },	    		
	    		children:[
	    				{ path:'',redirectTo:'list',pathMatch:'full'},
	    				{ path:'list',component:ChargeListComponent},
	    			  	{ path: 'add',component:ChargeCreateComponent,data: { title: "新增费用" }},
				      	{ path: ':operation/:id',component: ChargeCreateComponent,data: { title: "修改费用" }},				
	    		]
	    	},	
	    	//资金账户
	    	{
	    		path:'account',
	    		component:CapitalAccount,
	    		data: { title: "资金账户" },	    		
	    		children:[
	    				{ path:'',redirectTo:'list',pathMatch:'full'},
	    				{ path:'list',component:CapitalAccountListComponent},
	    			  	{ path: 'add',component:CapitalAccountCreateComponent,data: { title: "新增账户" }},
				      	{ path: ':operation/:id',component: CapitalAccountCreateComponent,data: { title: "修改账户" }},				
	    		]
	    	},
	    	//设计bom
	    	{
	    		path:'designbom',
	    		component:DesignBomComponent,
	    		data: { title: "设计BOM" },	    		
	    		children:[
	    				{ path:'',redirectTo:'list',pathMatch:'full'},
	    				{ path:'list',component:DesignBomListComponent,data: { title: "BOM列表" }},
	    			    { path: 'add',component:DesignBomCreateComponent,data: { title: "新增BOM" }},
				      	 { path: ':operation/:id',component: DesignBomCreateComponent,data: { title: "修改BOM" }},				
	    		]
	    	}		
	    ]
	}
];