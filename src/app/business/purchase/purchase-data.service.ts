import { Injectable }       from '@angular/core';
import { HttpClientService } from 'core/services/http-client.service';
import { PURCHASE } from './purchase-setting'
@Injectable()
export class PurchaseDataService {
	constructor(private httpClientService: HttpClientService) {
		
	}

	public getPurchaseOrderList(filter:any): Promise<any> {
		return Promise.reject("TODO");
	}

	//备品采购
	public getSparePortList(filter):any{
		let queryString = this.initQueryParams(filter);
		queryString += '&all=' + filter['type'];
		return this.httpClientService.get( PURCHASE.SPARE_PORT_LIST + queryString);
	}

	public initQueryParams(filter):any{
		let queryString = '?pageNum=' + filter['pageNum'] + '&pageSize=' + filter['pageSize'] 
						+  '&searchKeyWord=' + filter['searchKeyWord'];
		if(filter['orderItem']){
			queryString += '&orderItem.columnName=' + filter['orderItem']['columnName']
						+ '&orderItem.asc=' + filter['orderItem']['asc'];
		}
		return queryString
	}

	//备品采购第二层采购数弹窗
	public getSparePortPopupNumber(filter,skuCode:string){
		let queryString = this.initQueryParams(filter);
		// return this.httpClientService.get( PURCHASE.SPARE_PORT_POPUP_NUMBER.replace('{code}',skuCode) + queryString)
		return this.httpClientService.get( PURCHASE.SPARE_PORT_POPUP_NUMBER.replace("{code}",skuCode) + queryString )
	}

	public getOrderList(filter){
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get ( PURCHASE.ORDER_LIST + queryString);
	}
}