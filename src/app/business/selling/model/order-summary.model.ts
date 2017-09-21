import {Customer} from './customer.model';
import {User} from 'contacts/user/model/user-model';
import {OrderStatus} from './order-status.model';
import {OrderPayStatus} from './order-pay-status.model';


export class OrderSummary{
    id:string;
    transCode:string;
    customer:Customer;
    contact:User;
    creator:User;
    amount:number;
    received:number;
    createDate:string;
    deliveryDate:string;
    // orderStatus:OrderStatus;
    orderPayStatus:OrderPayStatus;
    remark:string;
}