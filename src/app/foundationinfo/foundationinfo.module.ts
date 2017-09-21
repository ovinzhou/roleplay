import { NgModule }      from '@angular/core';
import { RouterModule }  from '@angular/router';
import { CommonModule}   from '@angular/common';
import { FormGroup}      from '@angular/forms';


// The plug-in component of primeng
import {TreeNode}        from 'primeng/primeng';
import {TreeTableModule} from 'primeng/primeng';
import {ButtonModule}    from 'primeng/primeng';
import {DataListModule}  from 'primeng/primeng';
import {DialogModule}    from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';

// SharedModule
import { SharedModule }  from '../shared/shared.module';
import {GrowlModule} from 'primeng/primeng';

// foundationinfoModule routes
import { foundationinfoRoutes }       from './foundationinfo.routes';

// 基础数据
import { FoundationinfoComponent }    from './index/foundationinfo.component';

// 产品属性
import { SpuAttrbuteComponent }       from './spu-attribute/spu-attribute.component';
import { SpuAttrbuteListComponent }   from './spu-attribute/spu-attribute-list/spu-attribute-list.component';
import { SpuAttrbuteCreateComponent } from './spu-attribute/spu-attribute-create/spu-attribute-create.component';

// 产品类型
import { SpuTypeComponent }           from './spu-type/spu-type.component';
import { SpuTypeListComponent }       from './spu-type/spu-type-list/spu-type-list.component';
import { SpuTypeCreateComponent }     from './spu-type/spu-type-create/spu-type-create.component';

// 工价
import { WageComponent }              from './wage/wage.component';
import { WageListComponent }          from './wage/wage-list/wage-list.component';
import { WageCreateComponent }        from './wage/wage-create/wage-create.component';

// 工序
import { ProcedureComponent }         from './procedure/procedure.component';
import { ProcedureListComponent }     from './procedure/procedure-list/procedure-list.component';
import { ProcedureCreateComponent }   from './procedure/procedure-create/procedure-create.component';

//物料SKU
import { SkuComponent }               from './sku/sku.component';
import { SkuListComponent }           from './sku/sku-list/sku-list.component';
import { SkuCreateComponent }         from './sku/sku-create/sku-create.component';

//物料SPU
import { SpuComponent }               from './spu/spu.component';
import { SpuListComponent }           from './spu/spu-list/spu-list.component';
import { SpuCreateComponent }         from './spu/spu-create/spu-create.component';
import { SpuUploadComponent }         from './spu/spu-upload/spu-upload.component';

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
// Business Services
import {FoundationinfoService}        from  './foundationinfo-data.service';
//设计BOM
import { DesignBomComponent } from './design-bom/design-bom.component';
import { DesignBomListComponent } from './design-bom/design-bom-list/design-bom-list.component';
import { DesignBomCreateComponent } from './design-bom/design-bom-create/design-bom-create.component';

@NgModule({
  imports: [
    SharedModule,
    TreeTableModule,
    DataListModule,
    DialogModule,
    CommonModule,

    GrowlModule,
    RouterModule.forChild(foundationinfoRoutes)
  ],
  declarations: [
    //基础数据
    FoundationinfoComponent,

    //产品属性
    SpuAttrbuteComponent,
    SpuAttrbuteListComponent,
    SpuAttrbuteCreateComponent,

    //产品类型
    SpuTypeComponent,
    SpuTypeListComponent,
    SpuTypeCreateComponent,

    //工价
    WageComponent,
    WageListComponent,
    WageCreateComponent,

    //工序
    ProcedureComponent,
    ProcedureListComponent,
    ProcedureCreateComponent,

    //物料SKU
    SkuComponent,
    SkuListComponent,
    SkuCreateComponent,

    //物料SPU
    SpuComponent,
    SpuListComponent,
    SpuCreateComponent,
    SpuUploadComponent,

    //费用
    ChargeComponent,
    ChargeListComponent,
    ChargeCreateComponent,    

    //仓库
    WarehouseComponent,
    WarehouseListComponent,
    WarehouseCreateComponent,
    //费用
    ChargeComponent,
    ChargeListComponent,
    ChargeCreateComponent,
    //资金账户
    CapitalAccount,
    CapitalAccountListComponent,
    CapitalAccountCreateComponent,

    //设计BOM
    DesignBomComponent,
    DesignBomListComponent,
    DesignBomCreateComponent,
     
  ],
  exports:[
  ],
  providers: [
    FoundationinfoService
  ],
})
export default class foundationinfoModule {
  
}