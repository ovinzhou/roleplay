import { Injectable }       from '@angular/core';

@Injectable()
export class UtilsService {

    private DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g;
    private MILLI_PATTERN = /(?=(?!\b)(\d{3})+$)/g;

    constructor() {
    }

    public formatNumber(value) : string{
        if(value === void 0 || value == null || value === ""){
            return "";
        }

        let isString = typeof value === "string";
        let valueString:string = "" ,
        isNegative = false;

        if(!isString){
            valueString = value.toString();
        }else{
            valueString = <string>value;
        }

        if(valueString.substring(0,1) == '-'){
            isNegative = true;
            valueString = valueString.substring(1,valueString.length);
        }

        //格式化数据
        valueString = valueString.toString().replace(this.DIGIT_PATTERN, (m) => m.replace(this.MILLI_PATTERN, ','));
        //判断是否为负数
        valueString = isNegative ? '-' + valueString : valueString;

        return valueString;
    }
}