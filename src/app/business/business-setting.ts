'use strict';

import { BASE_URL } from '../core/constants/global-setting';


export const BUSINESS  = {
	//库存
	INVENTORY:`${BASE_URL}/report/remainbalance`,
	FINANCIAL:`${BASE_URL}/items`,

	//自制
	ITEMS:`${BASE_URL}/items`,
	WAITSTORAGE: `${BASE_URL}/items/unfinished`,	

	//备品采购列表
	SPARE_PORT_LIST : `${BASE_URL}/foundation/skus`,

	FINANCE_AGING_DAYS_LIST: `${BASE_URL}/financedatasource/aging`,

	// 获取库存中余额账龄
	BALANCE_AGES_INSTROE : `${BASE_URL}/report/inventory/balanceaging`,

	// 仓库库存下的 库龄明细
	INVN_AGINGE_DETAIL_FOR_STORE: `${BASE_URL}/report/inventory/invnagingdetail`,

	// 仓库账龄下的 库龄
	BALANCE_AGES_LIST: `${BASE_URL}/report/inventory/balanceagingdetail`,

	// 仓库账龄下的 库龄追溯（第三层弹窗）
	BALANCE_AGES_SECOND_LIST: `${BASE_URL}/report/inventory/balanceagingtrackdetail`,
	
	// 仓库财务库存的 金额余额
	MONEY_BALANCE: `${BASE_URL}/report/remainbalance/flow`,
}







