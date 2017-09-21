import { Injectable }       from '@angular/core';

import { HttpClientService } from 'core/services/http-client.service';

import { SELLING_SETTINGS } from './selling.setting';

import { OrderSummary } from './model/order-summary.model';

import { Query } from  'business/selling/model/query.model';
import { SaleOrder } from 'business/selling/model/saleOrder.model'; 

@Injectable()
export class SellingService {

	constructor(private httpClientService: HttpClientService) {}

	/**
	 * [getOrders 获取所有订单数据]
	 * @param  {string}                  filter [过滤条件]
	 * @return {Promise<OrderSummary[]>}        [description]
	 */
	public getOrders(filter:any):Promise<OrderSummary[]>{
		return this.httpClientService.get(SELLING_SETTINGS.URL.ORDER_LIST 
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	};

	/**
	 * [getOrderItems 获取订单项]
	 * @param  {string}         transCode [订单交易号]
	 * @return {Promise<any[]>}           [description]
	 */
	public getOrderItems(transCode:string):Promise<any[]>{
		return this.httpClientService.get(SELLING_SETTINGS.URL.ORDER_LIST + '/' + transCode + '/items');
	};


	/**
	 * [getProducingOrders 获取生产中的订单]
	 * @param  {any}                     filter [过滤条件]
	 * @return {Promise<OrderSummary[]>}        [description]
	 */
	public getProducingOrders(filter:any):Promise<OrderSummary[]>{
		return this.httpClientService.get(SELLING_SETTINGS.URL.ORDER_LIST
			+'/producing' 
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	};

	/**
	 * [getStayDeliveryOders 获取待出库的订单]
	 * @param  {any}                     filter [过滤条件]
	 * @return {Promise<OrderSummary[]>}        [description]
	 */
	public getStayDeliveryOders(filter:any):Promise<OrderSummary[]>{
		return this.httpClientService.get(SELLING_SETTINGS.URL.ORDER_LIST
			+'/stayDelivery' 
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	};

	/**
	 * [getUsers 获取所有用户]
	 * @return {any} [description]
	 */
	public getUsers():any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.USER_LIST);
	};

	/**
	 * [getUsersRelesByUserId 获取用户所有角色]
	 * @param  {string} userId [用户ID]
	 * @return {any}           [角色数组]
	 */
	public getUserRelesByUserId(userId:string):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.USER_ROLE_LIST+userId+'/roles');
	};


	/**
	 * [getUserOrgByUserId 获取用户组织]
	 * @param  {string} userId [description]
	 * @return {any}           [description]
	 */
	public getUserOrgByUserId(userId:string):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.USER_ORG_LIST+userId+'/groups');
	};


	/**
	 * [getCustomers 获取客户]
	 * @param  {Query} query [过滤条件]
	 * @return {any}         [description]
	 */
	public getCustomers(query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.CUSTOMER_LIST+'&'+query.toString());
	};

	/**
	 * [getSkus 获取SKU]
	 * @param  {Query} query [过滤条件]
	 * @return {any} [description]
	 */
	public getSkus(query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.SKU_LIST+'?filterType=半成品,原料&'+query.toString());
	};


	/**
	 * 获取SPU
	 * @param  {Query} query 过滤条件
	 * @return {any}         数据
	 */
	public getSpus(query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.SPU_LIST+'&'+query.toString());
	}

	/**
	 * [getCustomerAddrsByCustomerId 获取客户地址]
	 * @param  {string} customerId [description]
	 * @param  {Query} query 	   [过滤条件]
	 * @return {any}               [description]
	 */
	public getCustomerAddrsByCustomerId(customerId:string,query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.CUSTOMER_ADDR_LIST
				+customerId+'/officeaddress?dataSourceCode=EntitiesOffice&'+query.toString());
	};

	/**
	 * [getCustomerContactsByAddrId 获取客户地址联系人]
	 * @param  {string} addrId [description]
	 * @param  {Query} query   [过滤条件]
	 * @return {any}           [description]
	 */
	public getCustomerContactsByAddrId(addrId:string,query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.ADDR_CONTACT_LIST
				+addrId+'/contact?dataSourceCode=EntitiesContacts&'+query.toString());
	};

	/**
	 * @param  {string}
	 * @return {any}
	 */
	public getOrderTrace(transCode : string ):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.ORDER_TRACE + transCode + '/trace');
	};


	/**
	 * [importOrderItem 销售订单导入物料明细]
	 * @param  {[type]} data [description]
	 * @return {any}         [description]
	 */
	public importOrderItem(data):any{
		return this.httpClientService.postFileUpLoad(SELLING_SETTINGS.URL.ORDER_ITEM_LSIT,data);
	};

	/**
	 * [getCashFlow 获取现金流类型数据]
	 * @return {any} [description]
	 */
	public getCashFlow():any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.CASHFLOW);
	};



	/**
	 * 通过类型获取sku 结果为内箱或外箱书
	 * @param  {string} type  类型  内箱/外箱
	 * @param  {Query}  query 过滤信息
	 * @return {any}          内箱/外箱数据
	 */
	public getSkusByType(type:string,query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.SKU_LIST_BY_TYPE+type+'&'+query.toString());
	};

	/**
	 * 检查订单号唯一
	 * @param  {string} transCode 订单号
	 * @return {any}          [description]
	 */
	public uniqueTransCode(transCode:string):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.UNIQUETRANSCODE.replace('{transCode}',transCode));
	};


	/**
	 * 创建临时订单
	 * @return {any} [description]
	 */	
	public createTempOrder():any{
		return this.httpClientService.post(SELLING_SETTINGS.URL.TEMP_ORDER,'');	
	};

	/**
	 * 获取临时订单
	 * @return {any} [description]
	 */
	public getTempOrder():any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.TEMP_ORDER);	
	};


	/**
	 * 修改临时订单项
	 * @param  {string}     orderId [description]
	 * @param  {Array<any>} items   [description]
	 * @return {any}                [description]
	 */
	public updateTempOrderItem(orderId:string,items:Array<any>):any{
		return this.httpClientService.put(
			SELLING_SETTINGS.URL.PUT_TEMP_ORDER_ITEM.replace('{id}',orderId),items);
	};
	

	/**
	 * 删除临时订单明细
	 * @param  {string} orderId  临时订单ID
	 * @param  {string} itemCode 订单项编码
	 * @return {any}             [description]
	 */
	public delTempOrderItem(orderId:string,itemCode:string):any{
		return this.httpClientService.delete(
			SELLING_SETTINGS.URL.DEL_TEMP_ORDER_ITEM
			.replace('{id}',orderId).replace('{code}',itemCode));
	};

	/**
	 * 获取产品信息
	 * @param {string}  filter 过滤条件
	 * @param {Query} query  分页信息
	 */
	public getProducts(filter:string,query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.PRODUCTS+filter+'&'+query.toString())
	};

	/**
	 * 获取SPU下面SKU
	 * @param  {string} spuId 
	 * @param  {Query}  query
	 * @return {any}          
	 */
	public getProduct_Skus(spuId:string,query:Query):any{
		return this.httpClientService.get(SELLING_SETTINGS.URL.PRODUCTS_SKUS.replace('{spuId}',spuId)+'?'+query.toString())
	};

	/**
	 * [exportPdf 导出PDF]
	 * @param  {SaleOrder} order    [订单]
	 * @param  {string}    language [语言类型("CN","EN")]
	 * @return {any}                [PDF资源路径]
	 */
	public exportPdf(order:SaleOrder,language:string):any{
		return this.httpClientService.post(SELLING_SETTINGS.URL.EXPORT_PDF.replace('{language}',language),order);
	}

	/**
	 * [exportExcel 导出Excel]
	 * @param  {SaleOrder} order    [订单]
	 * @param  {string}    language [语言类型("CN","EN")]
	 * @return {any}                [Excel资源路径]
	 */
	public exportExcel(order:SaleOrder,language:string):any{
		return this.httpClientService.post(SELLING_SETTINGS.URL.EXPORT_Excel.replace('{language}',language),order);
	}
}