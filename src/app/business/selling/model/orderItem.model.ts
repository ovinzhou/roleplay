
export class OrderItem{

	Id:string;
    /**
     * spuCode 货号
     * @type {string}
     */
    spuCode:string;
    /**
     * name SKU名称
     * @type {string}
     */
    name:string;
    /**
     * Code SKU编码
     * @type {string}
     */
    code:string;
    /**
     * boxColor 盒子颜色
     * @type {string}
     */
    boxColor:string;
    /**
     * TopColor 内顶颜色
     * @type {string}
     */
    topColor:string;
    /**
     * CoreColor 内芯颜色
     * @type {string}
     */
    coreColor:string; 
    
    /**
     * perQty 每件量
     * @type {string}
     */
    perPiece:string;
    /**
     * packageNum 件数
     * @type {number}
     */
    packageNum:number;
    /**
     * 内箱编码
     * @type {string}
     */
    innerCode:string;
    /**
     * 内箱名称
     * @type {string}
     */
    innerCarton:string;
    /**
     *  内箱装箱量
     * @type {number}
     */
    innerQty:number;
    /**
     * 内箱箱数
     * @type {number}
     */
    innerCtn:number;
    /**
     * [innerSize 内箱尺寸
     * @type {string}
     */
    innerSize:string;
    
    /**
     * 外箱编码
     * @type {string}
     */
    outerCode:string;
    /**
     * 外箱名称
     * @type {string}
     */
    outerCarton:string;
    /**
     * 外箱装箱量
     * @type {number}
     */
    outerQty:number;
    /**
     * 外箱箱数
     * @type {number}
     */
    outerCtn:number;
    /**
     * [outerSize 外箱尺寸
     * @type {string}
     */
    outerSize:string;
    /**
     * [qty 订单数
     * @type {number}
     */
    qty:number;
    /**
     * [price 单价
     * @type {number}
     */
    price:number;
    /**
     * [amount 总金额
     * @type {number}
     */
    amount:number;
    /**
     * [logo 图标
     * @type {string}
     */
    logo:string;
    /**
     * [customCode 客户货号
     * @type {string}
     */
    customCode:string;
    /**
     * [parts 配件
     * @type {string}
     */
    parts:string; 
    /**
     * [remark 备注
     * @type {string}
     */
    remark:string;
    /**
     * [exchangeRate 汇率
     * @type {number}
     */
    exchangeRate:number;
    /**
     * [originalCurrencyAmount 原币金额
     * @type {number}
     */
    originalCurrencyAmount:number;
    /**
     * [currency 币种
     * @type {string}
     */
    currency:string;
    /**
     * [taxRate 税率
     * @type {number}
     */
    taxRate:number;
    /**
     * [taxAmount 税金
     * @type {number}
     */
    taxAmount:number;
    /**
     * addingmode 添加方式
     * @type {string}
     */
    addingmode:string;
    /**
     * 图片
     * @type {string}
     */
    img:string;
    /**
     * 计量单位名称
     * @type {string}
     */
    measuringUnitName:string;
    /**
     * 计量单位编码
     * @type {string}
     */
    measuringUnit:string;

}