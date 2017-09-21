'use strict';

import { BASE_URL } from 'core/constants/global-setting';


export const FINANCE  = {
	//客户往来
	CUSTOMER_CONTACT_LIST:`${BASE_URL}/financedatasource/customerexchange`,

	//资金账户
	
	COMBINED : `${BASE_URL}/financedatasource/financeaccount`,
	//添加资金账户
	ADD_FINANCE_ACCOUNT :  `${BASE_URL}/profile/financeaccount`,
	//删除资金账户
	DEL_FINANCE_ACCOUNT :  `${BASE_URL}/profile/financeaccount?ids=`,
	//更改资金账户
	UPDATE_FINANCE_ACCOUNT :  `${BASE_URL}/profile/{id}/financeaccount`,
	//资金账户详情
	FINANCE_ACCOUNT_INFO :  `${BASE_URL}/profile/{id}/financeaccount`,
	//获取银行列表
	BANK_LIST :  `${BASE_URL}/profile/banks`,
	 //获取银行币种列表
	CURRENYS :  `${BASE_URL}/profileformdata/currencys `,
	 //现金流列表
	FINANCE_ACCOUNT_LIST :  `${BASE_URL}/financedatasource/financeaccountcombined`,

	//供应商往来
	SUPPLIER_CONTACT_LIST : `${BASE_URL}/financedatasource/providerexchange`,

	//员工往来
	EMPLOYEE_CONTACT_LIST : `${BASE_URL}/financedatasource/employeeexchange`,

	//期间费用
	PERIOD_COST_LIST : `${BASE_URL}/financedatasource/periodexpense`,

	//制造费用
	MANUFACTURE_COST_LIST : `${BASE_URL}/financedatasource/overhead`,

	//增值税
	VALUE_ADDED_TAX_LIST : `${BASE_URL}/financedatasource/addtaxs`,

	//费用计提
	COST_ACCRUE_LIST : `${BASE_URL}/financecharge/extract`,
	//费用计提状态
	COST_ACCRUE_LIST_STATUS : `${BASE_URL}/financecharge/{status}/extract`,
	//费用报销
	COST_REIMBURSEMENT_LIST : `${BASE_URL}/financecharge/expense`,
	//费用报销状态
	COST_STATUS_LIST:`${BASE_URL}/financecharge/`,

	//获取财务弹出窗口原币金额数据
	FINANCE_POPUP_LIST:`${BASE_URL}/financedatasource/flow`,

	//获取财务弹出窗口账龄数据
	FINANCE_AGING_DAYS_LIST: `${BASE_URL}/financedatasource/aging`,

}







