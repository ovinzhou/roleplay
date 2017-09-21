import { Injectable }       from '@angular/core';
import { Http }       from '@angular/http';
import { FINANCE } from './finance-setting'

import { HttpClientService } from 'core/services/http-client.service';

@Injectable()
export class FinanceDataService {
    
    constructor(private httpClientService: HttpClientService) {}

	//获取客户往来列表
	public getCustomerContactLIST(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.CUSTOMER_CONTACT_LIST + queryString)
	}


	//获取资金账户列表
	public getFinanceAccountList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.FINANCE_ACCOUNT_LIST + queryString)
	}

	//获取资金账户列表
	public getFinanceAccountListCombined(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.COMBINED + queryString)
	}

	

	//添加资金账户列表
	public addFinanceAccount(filter):any{
		return this.httpClientService.post( FINANCE.ADD_FINANCE_ACCOUNT,filter)
	}

	//删除资金账户
	public delFinanceAccount(filter:string):any{
		return this.httpClientService.delete( FINANCE.DEL_FINANCE_ACCOUNT+filter)
	}

	//修改资金账户
    public updateFinanceAccount(id:string,data:Object):any{
		return this.httpClientService.put(FINANCE.UPDATE_FINANCE_ACCOUNT.replace("{id}",id), data)

    }; 

	//获取资金账户详情
	public getFinanceAccountInfo(id:string):any{
		return this.httpClientService.get( FINANCE.FINANCE_ACCOUNT_INFO.replace("{id}",id))
	}

	//获取银行列表
	public getBankList(){
		
		return this.httpClientService.get( FINANCE.BANK_LIST)
	}
	//获取币值列表
	public getCurrenys(){
		
		return this.httpClientService.get( FINANCE.CURRENYS)
	}

	//获取供应商往来列表
	public getSupplierContactList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.SUPPLIER_CONTACT_LIST + queryString)
	}

	//获取员工往来列表
	public getEmployeeContactList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.EMPLOYEE_CONTACT_LIST + queryString)
	}

	//获取期间费用列表
	public getPeriodCostList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.PERIOD_COST_LIST + queryString)
	}

	//获取制造费用列表
	public getManufactureCostList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.MANUFACTURE_COST_LIST + queryString)
	}

	//获取增值税列表
	public getValueAddedTaxList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.VALUE_ADDED_TAX_LIST + queryString)
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
	// 费用报销
	public getCostReimbursementList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.COST_REIMBURSEMENT_LIST + queryString);
	}
	// 费用报销状态
	public getCostReimbursementStatus(filter):any{
		let queryString = this.initQueryParams(filter);
		// queryString +=
		return this.httpClientService.get( FINANCE.COST_STATUS_LIST + filter.status + '/expense' + queryString);
	}

	//费用计提
	public getCostAccrueList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.COST_ACCRUE_LIST + queryString);
	}

	// 财务原币金额弹出层
	public getFinanceDetailPopupList(filter):any{
		let queryString = this.initQueryParams(filter);
		queryString += '&calcId=' + filter['calcId'] + '&transObjCode=' + filter['transObjCode'] + '&containerCode=' + filter['containerCode'] + '&dealerCode=' + filter['dealerCode']
		return this.httpClientService.get( FINANCE.FINANCE_POPUP_LIST + queryString);
	}

	// 财务账龄弹出层
	public getAgingDaysDetail(filter):any {
		let queryString = '?calcId=' + filter['calcId'] + '&transObjCode=' + filter['transObjCode'] + '&containerCode=' + filter['containerCode'] + '&dealerCode=' + filter['dealerCode']
		return this.httpClientService.get( FINANCE.FINANCE_AGING_DAYS_LIST + queryString);
	}

	//费用计提状态
	public getCostAccrueStatusList(filter):any{
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get( FINANCE.COST_ACCRUE_LIST_STATUS.replace('{status}',filter['status']) + queryString);
	}

}