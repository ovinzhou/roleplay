import { Creator } from 'business/selling/model/creator.model';
import { OrderItem } from 'business/selling/model/orderItem.model'; 
import { File } from 'business/selling/model/file.model';

export class SaleOrder{
	/**
	 * [transCode 交易号]
	 * @type {string}
	 */
	transCode:string;
	/**
	 * [effectTime 生效时间]
	 * @type {Date}
	 */
	effectTime:Date;
	/**
	 * [handler 经办人]
	 * @type {string}
	 */
	handler:string;
	/**
	 * [handlerOrg 经办组织]
	 * @type {string}
	 */
	handlerOrg:string;
	/**
	 * [handlerRole 经办角色]
	 * @type {string}
	 */
	handlerRole:string;
	/**
	 * [creator 创建信息]
	 * @type {Creator}
	 */
	creator:Creator;
	/**
	 * [customerId 客户ID]
	 * @type {string}
	 */
	customerId:string;
	/**
	 * [customerName 客户名称]
	 * @type {string}
	 */
	customerName:string;
	/**
	 * [customerAddrId 客户地址ID]
	 * @type {string}
	 */
	customerAddrId:string;
	/**
	 * [customerAddrName 客户地址名称]
	 * @type {string}
	 */
	customerAddrName:string;
	/**
	 * [contactId 联系人ID]
	 * @type {string}
	 */
	contactId:string;
	/**
	 * [contactName 联系人名称]
	 * @type {string}
	 */
	contactName:string;

	/**
	 * [mobile 手机号]
	 * @type {string}
	 */
	mobile:string;
	
	/**
	 * [items 订单明细]
	 * @type {Array<OrderItem>}
	 */
	items:Array<OrderItem>;
	/**
	 * [remark 备注]
	 * @type {String}
	 */
	remark:String;
	/**
	 * [status 订单状态]
	 * @type {string}
	 */
	status:string;
	/**
	 * [attachments 附件]
	 * @type {Array<File>}
	 */
	attachments:Array<File>;
	/**
     * [exchangeRate 汇率]
     * @type {number}
     */
    exchangeRate:number;
    /**
     * [originalCurrencyAmount 原币金额]
     * @type {number}
     */
    originalCurrencyAmount:number;
    /**
     * [currency 币种]
     * @type {string}
     */
    currency:string;
    /**
     * [taxRate 税率]
     * @type {number}
     */
    taxRate:number;
    /**
     * [taxAmount 税金]
     * @type {number}
     */
    taxAmount:number;
    /**
     * [deliveryDate 交付时间]
     * @type {Date}
     */
    deliveryDate:any;
}