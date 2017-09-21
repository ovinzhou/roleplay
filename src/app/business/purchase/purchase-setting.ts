'use strict';

import { BASE_URL } from 'core/constants/global-setting';


export const PURCHASE  = {
	//备品采购列表
	SPARE_PORT_LIST : `${BASE_URL}/datasource/purchase/spare/skus`,
	//备品采购第二层采购数弹窗
	SPARE_PORT_POPUP_NUMBER : `${BASE_URL}/purchase/{code}/orderitems`,
	//采购订单列表
	ORDER_LIST : `${BASE_URL}/purchase/orders`


}







