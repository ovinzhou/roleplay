import { Component, OnInit,EventEmitter } from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { inventoryList } from  './mock/inventory-list';
import { BusinessDataService } from 'business/business-data.service'
import { PopupService } from 'core/services/popup.service';
import { flyIn } from 'core/animations/fly-in';

@Component({
  selector   : 'inventory',
  templateUrl   : 'inventory.component.html',
  animations : [flyIn]
})

export class InventoryComponent implements OnInit {

	private toolbarConfigs : any[];
	private inventoryList : Array<any> = [];
	private totalRecords   : number     = 0;
	public searchEventEmitter: EventEmitter<string> = new EventEmitter();

	constructor(

	    private router       : Router,
	    private service      : BusinessDataService,
		private route        : ActivatedRoute,
	    private popupService : PopupService){}

	ngOnInit(){
		this.toolbarConfigs = [
	        // {
	        // 	handler: this.onQuery.bind(this),
	        // 	type:'all'
	        // },
	        {
	        	label: "仓库库存",
	        	handler: this.onWarehouse.bind(this),
	        	default: this.router.isActive('main/business/inventory/list',false)
	        },
	        {
	        	label: "财务库存",
	        	handler: this.onFinancial.bind(this),
	        	default: this.router.isActive('main/business/inventory/financial',false)
	        },
	        {
	        	label: "物料账龄",
	        	handler: this.onBalanceAges.bind(this),
	        	default: this.router.isActive('main/business/inventory/balanceages',false)
	        },
	        {
	            type: "search",
	        	handler: this.onQuery.bind(this),
	        	align: "right"
	        },
	        {
	        	label: "即时调拨",
	        	handler: () => this.router.navigate(['main/process/start/tsrlitin']),
	        	align: "right"
	        },
	        {
	        	label: "盘亏出库",
	        	handler: () => this.router.navigate(['main/process/start/tslossin']),
	        	align: "right"
	        },
	        {
	        	label: "盘盈入库",
	        	handler: () => this.router.navigate(['main/process/start/tsgainin']),
	        	align: "right"
	        }
	    ];

	}

    private onQuery(event):void{
    	this.searchEventEmitter.emit(event);
    };

    private onWarehouse(){
    	this.toolbarConfigs[0].default = true;
    	this.toolbarConfigs[1].default = false;
    	this.toolbarConfigs[2].default = false;
       	this.router.navigateByUrl('/main/business/inventory/list');
    }

    private onFinancial(event):void{
    	this.toolbarConfigs[1].default = true;
    	this.toolbarConfigs[0].default = false;
    	this.toolbarConfigs[2].default = false;
        this.router.navigateByUrl('/main/business/inventory/financial');
    };

    private onBalanceAges(){
    	this.toolbarConfigs[2].default = true;
    	this.toolbarConfigs[0].default = false;
    	this.toolbarConfigs[1].default = false;
    	this.router.navigateByUrl('/main/business/inventory/balanceages');
    }
}

