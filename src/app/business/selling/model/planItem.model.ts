import { OrderItem } from 'business/selling/model/orderItem.model';


export class PlanItem{
	/**
	 * [deliveryDate 交付日期]
	 * @type {Date}
	 */
	deliveryDate:Date;
	/**
	 * [taxRate 税率]
	 * @type {number}
	 */
	taxRate:number;
	/**
	 * [taxationAmount 税金]
	 * @type {number}
	 */
	taxationAmount:number;
	/**
	 * [orderItem 订单明细]
	 * @type {OrderItem}
	 */
	orderItem:OrderItem; 
}