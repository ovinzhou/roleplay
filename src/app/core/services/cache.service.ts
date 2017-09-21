import { Injectable }       from '@angular/core';

@Injectable()
export class CacheService {

    private data;

    constructor() {
        this.data = {};
    }

    /**
     * [clear 清除数据]
     */
    private clear():void{
        this.data = {};
    }

    /**
     * [put 缓存数据]
     * @param {[type]} sKey [description]
     * @param {[type]} oVal [description]
     */
    public put(sKey,oVal):void{
        this.data[sKey]  = oVal;
    }

    /**
     * [remove 删除缓存数据]
     * @param {[type]} sKey [description]
     */
    public remove(sKey):void{
        delete this.data[sKey];
    }

    /**
     * [get 获取缓存数据]
     * @param {[type]} sKey [description]
     */
    public get(sKey):any{
        return this.data[sKey];
    }

    

}