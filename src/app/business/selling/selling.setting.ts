'use strict';
import {BASE_URL} from 'core/constants/global-setting';

export const SELLING_SETTINGS  = {
	
	URL:{
		ORDER_LIST  	: `${BASE_URL}/orders`,
		USER_LIST		: `${BASE_URL}/communityformdata/users`,
		USER_ROLE_LIST	: `${BASE_URL}/communityformdata/`,
		USER_ORG_LIST	: `${BASE_URL}/communityformdata/`,
		CUSTOMER_LIST	: `${BASE_URL}/communityformdata/customer?dataSourceCode=EntitiesCustomer`,
		CUSTOMER_ADDR_LIST	:`${BASE_URL}/communityformdata/`,
		ADDR_CONTACT_LIST	:`${BASE_URL}/communityformdata/`,
		SKU_LIST		: `${BASE_URL}/foundation/skus/details`,
		SPU_LIST		: `${BASE_URL}/foundation/spus/details?details=true`,
		SKU_LIST_BY_TYPE: `${BASE_URL}/foundation/skus/details?type=`,
		ORDER_TRACE  	: `${BASE_URL}/orders/`,
		ORDER_ITEM_LSIT	: `${BASE_URL}/foundation/sales/order/`,
		CASHFLOW 		: `${BASE_URL}/cashFlow`,
		UNIQUETRANSCODE : `${BASE_URL}/orders/{transCode}`,
		// 临时订单
		TEMP_ORDER		: `${BASE_URL}/orders/temporary`,
		PUT_TEMP_ORDER_ITEM: `${BASE_URL}/orders/temporary/{id}`,
		DEL_TEMP_ORDER_ITEM:`${BASE_URL}/orders/temporary/{id}/items/{code}`,

		EXPORT_PDF : `${BASE_URL}/orders/pdf?language={language}`,
		EXPORT_Excel : `${BASE_URL}/orders/excel?language={language}`,
		
		PRODUCTS :`${BASE_URL}/selling/spus`,

		PRODUCTS_SKUS:`${BASE_URL}/selling/spu/{spuId}/skus`,
		
	}
}






