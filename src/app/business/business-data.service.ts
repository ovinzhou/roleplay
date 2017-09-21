import { Injectable }       from '@angular/core';
import { Http }       from '@angular/http';
import { BUSINESS } from './business-setting'

import { HttpClientService } from '../core/services/http-client.service';

@Injectable()
export class BusinessDataService {
    
    constructor(private httpClientService: HttpClientService) {}
    
	public getInventory(filter:string):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( BUSINESS.INVENTORY			
			+queryString
            );
	}

	public getFinancial(filter:string):any{
		return this.httpClientService.get( BUSINESS.FINANCIAL + filter );
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

	public getItems(filter:any):any{
		return this.httpClientService.get(BUSINESS.ITEMS
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	}


	public getWaitStorage(filter:any):any{
		return this.httpClientService.get(BUSINESS.WAITSTORAGE
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	}
	
	//备品采购
	public getSparePortList(filter):any{

		// let queryString = this.initQueryParams(filter);
		// queryString += '&needStock=' + filter['needStock'] + '&types=' + filter['types'];
		return this.httpClientService.get( BUSINESS.SPARE_PORT_LIST + '?query=' + encodeURIComponent(JSON.stringify(filter)));
	}

	// 获取库存中余额账龄
	public getBalanceAgesInStore(filter) : any {
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( BUSINESS.BALANCE_AGES_INSTROE + queryString);
	}

	// 库存下的 库龄明细
	public getInvnAgingeDetailForStore(filter) : any {
		// let queryString = this.initQueryParams(filter);
		let queryString = '?calcId=' + filter['calcId'] + '&transObjCode=' + filter['transObjCode'] + '&containerCode=' + filter['containerCode'] + '&dealerCode=' + filter['dealerCode']
		return this.httpClientService.get( BUSINESS.INVN_AGINGE_DETAIL_FOR_STORE + queryString);
	}

	// 账龄下 库龄列表
	public getBalanceAgesList(filter) : any {
		// let queryString = this.initQueryParams(filter);
		let queryString =  '?transObjCode=' + filter['transObjCode'] 
		return this.httpClientService.get( BUSINESS.BALANCE_AGES_LIST + queryString);
	}

	// 库存下的 库龄追溯
	public getBalanceAgesSconedList(filter) : any {
		// let queryString = this.initQueryParams(filter);
		let queryString = '?transObjCode=' + filter['transObjCode'] + '&transCode=' + filter['transCode'] 
		return this.httpClientService.get( BUSINESS.BALANCE_AGES_SECOND_LIST + queryString);
	}

	// 财务库存下的 金额余额
	public getBalanceSconedList(filter) : any {

		let queryString = this.initQueryParams(filter);
		queryString += '&calcId=' + filter['calcId'] + '&transObjCode=' + filter['transObjCode'] + '&containerCode=' + filter['containerCode'] + '&dealerCode=' + filter['dealerCode']
		return this.httpClientService.get( BUSINESS.MONEY_BALANCE + queryString);
	}

}