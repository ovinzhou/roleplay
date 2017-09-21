import { Component,HostListener,ElementRef,Renderer,
	Injector,
	ReflectiveInjector,
	Directive,
	Type,
	ComponentFactoryResolver,
	Input,
	ViewContainerRef,
	ResolvedReflectiveProvider,
	ViewChildren,
	OnInit
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutletMap, provideRoutes} from '@angular/router';
import { UserLoginService } from 'core/user-login/user-login.service';
import { Observable } from 'rxjs/Observable';
import { UserRegisterComponent } from 'core/user-register/user-register.component';
import { PluginService } from "core/plugin/plugin.service"
import { HttpClientService } from 'core/services/http-client.service'
import { PluginExtension } from 'core/plugin/plugin-extension.model'
import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';
//主体详情
import { EntityDetailService } from 'core/entity/entity-detail.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit{
	private extensions: PluginExtension[];
	private sideBarHidden: boolean = false;
	private name : any;
	private logo : any;	
	private boardGroupSections: any[];

	constructor(
		private elementRef: ElementRef, 
		private renderer: Renderer,
		private router: Router,
        private route: ActivatedRoute,
        private titleService : Title
	) {
	    // renderer.listen(elementRef.nativeElement, 'click', (event) => { });
	}

	ngOnInit() {
		this.titleService.setTitle('首页');
		this.boardGroupSections = [
			{
				groupLabel: "常用",
				groupList: [
					{
						label: "我的任务",
						routePath: "/main/process/todo"
					},
					{
						label: "我的消息",
						routePath: ""
					}
				]
			},
			{
				groupLabel: "业务模块",
				groupList: [
					{
						label: "订单",
						routePath: "/main/business/selling"
					},
					{
						label: "销售",
						routePath: "/main/business/selling/products"
					},
					// {
					// 	label: "计划",
					// 	routePath: ""
					// },
					// {
					// 	label: "备品加工",
					// 	routePath: ""
					// },
					{
						label: "自制",
						routePath: "/main/business/homebrew"
					},
					// {
					// 	label: "采购",
					// 	routePath: ""
					// },
					// {
					// 	label: "委外",
					// 	routePath: ""
					// },
					{
						label: "客户往来",
						routePath: "/main/business/finance/customercontact"
					},
					{
						label: "库存",
						routePath: "/main/business/inventory"
					},
					{
						label: "资金账户",
						routePath: "/main/business/finance/financeaccount"
					},
					{
						label: "供应商往来",
						routePath: "/main/business/finance/suppliercontact"
					},
					{
						label: "员工往来",
						routePath: "/main/business/finance/employeecontact"
					},
					{
						label: "期间费用",
						routePath: "/main/business/finance/periodcost"
					},
					{
						label: "制造费用",
						routePath: "/main/business/finance/manufacturecost"
					},
					{
						label: "增值税",
						routePath: "/main/business/finance/valueaddedtax"
					},
					{
						label: "费用计提",
						routePath: "/main/business/finance/costaccrue"
					},
					{
						label: "费用报销",
						routePath: "/main/business/finance/costreimbursement"
					},
					{
						label: "备品采购",
						routePath: "/main/business/purchase/spareport"
					},
					{
						label: "采购订单",
						routePath: "/main/business/purchase/order"
					}
				]
			},
			{
				groupLabel: "通讯录",
				groupList: [
					{
						label: "组织",
						routePath: "/main/contacts/org"
					},
					{
						label: "角色",
						routePath: "/main/contacts/role"
					},
					{
						label: "成员",
						routePath: "/main/contacts/user"
					},
					{
						label: "商业圈",
						routePath: "/main/contacts/biz"
					}
				]
			},
			{
				groupLabel: "基础数据",
				groupList: [
					{
						label: "SPU",
						routePath: "/main/foundationinfo/spu/"
					},
					{
						label: "SKU",
						routePath: "/main/foundationinfo/sku/"
					},
					{
						label: "仓库",
						routePath: "/main/foundationinfo/warehouse/"
					},
					{
						label: "费用",
						routePath: "/main/foundationinfo/charge/"
					},
					{
						label: "工价",
						routePath: "/main/foundationinfo/wage/"
					},
					{
						label: "工序",
						routePath: "/main/foundationinfo/procedure/"
					},
					{
						label: "物料属性",
						routePath: "/main/foundationinfo/spuattrbute/"
					},
					{
						label: "物料类型",
						routePath: "/main/foundationinfo/sputype/"
					},
					{
						label: "设计BOM",
						routePath: "/main/foundationinfo/designbom/"
					}				
				]
			},
			// {
			// 	groupLabel: "测试模块",
			// 	groupList: [
			// 		{
			// 			label: "测试模块1(工价)",
			// 			routePath: "/main/foundationinfo/ceshi/list"
			// 		},
			// 	]
			// }
		]
	}

	// get element(): any {
	//     return this._elementRef.nativeElement;
	// }

	private doLogout():void{
		// this.userLoginService.logout();
		// this.router.navigateByUrl("login");
	}
}