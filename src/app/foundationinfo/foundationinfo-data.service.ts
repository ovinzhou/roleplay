import { Injectable }       from '@angular/core';
import { Http }       from '@angular/http';

import { HttpClientService } from '../core/services/http-client.service';

import { FOUNDATIONINFOURL } from '../foundationinfo/foundationinfo-setting';


@Injectable()
export class FoundationinfoService {

	constructor(private httpClientService: HttpClientService) {}

	// 产品类型
	public getSpuTypes(filter:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_TYPE_LIST+'?query='+filter);
	};

	public getSpuType(id:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_TYPE_DETAIL+id);
	};

	public getLazySpuTypes(typeId:string):any{
	  	return this.httpClientService.get(FOUNDATIONINFOURL.SPU_TYPE_LIST+'?parentId='+typeId);
	};

	public addSpuType(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.SPU_TYPE_ADD, data);
	};

	public delSpuType(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.SPU_TYPE_DEL+ids);
	};


	public updateSpuType(data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.SPU_TYPE_UPDATE,data);
	};



	// 产品属性
	public getSpuAttrs(filter:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_ATTRBUTE_LIST+'?query='+filter);
	};

	public getSpuAttr(id:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_ATTRBUTE_DETAIL+id);
	};

	public addSpuAttr(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.SPU_ATTRBUTE_ADD, data);
	};

	public delSpuAttr(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.SPU_ATTRBUTE_DEL+ids);
	};

	public updateSpuAttr(data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.SPU_ATTRBUTE_UPDATE,data);
	};
	public delValue(ids):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.VALUE_DEL+ids);
	}
	// 工序
	public getProcedures(filter:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.PROCEDURE_LIST+'?query='+filter);
	};

	public getProcedureInfo(id):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.PROCEDURE_INFO + id);
	};

	public addProcedure(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.PROCEDURE_ADD, data);
	};

	public delProcedure(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.PROCEDURE_DEL+ids);
	};

	public updateProcedure(data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.PROCEDURE_UPDATE,data);
	};

	//查询一级工序组
	public getProcedureGroup(){
		return this.httpClientService.get(FOUNDATIONINFOURL.GET_PROCEDURE_GROUP);
	}

	//获取下级工序组
	public getUnitSubList(groupId){
        return this.httpClientService.get(FOUNDATIONINFOURL.UNIT_SUB_LIST + groupId + '/subs');
    }

	// 工价
	public getWages(filter:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.WAGE_LIST+'?query=' + filter)
	};

	public addWage(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.WAGE_ADD, data);
	};

	public delWage(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.WAGE_DEL+ids);
	};

	public updateWage(data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.WAGE_UPDATE,data);
	};

	public getWageInfo(id):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.GET_WAGEINFO + id)
	};

	//获取计件工序的列表
	public getFEESProcedureList():any{
		return this.httpClientService.get(FOUNDATIONINFOURL.GET_PROCEDURE_LIST)
	}

	//SPU
	public getSpus(filter:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_LIST+'?query='+filter);
	};

	public getSpu(id:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_DETAIL+id);
	};

	public addSpu(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.SPU_ADD, data);
	};

	public delSpu(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.SPU_DEL+ids);
	};

	public updateSpu(data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.SPU_UPDATE,data);
	};

	/**
	 * [batchImportSpu 批量导入SPU]
	 * @param  {Object} data [description]
	 * @return {any}         [description]
	 */
	public batchImportSpu(data:Object,type:string):any{
		return this.httpClientService.postFileUpLoad(FOUNDATIONINFOURL.SPU_ADD+'/'+type,data);
	};

	/**
	 * [getBatchImportSpuStatus 得到上传状态]
	 * @param  {string} taskId [description]
	 * @return {any}           [description]
	 */
	public getBatchImportSpuStatus(taskId:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_UPLOAD_STATUS+taskId);
	};

	/**
	 * [getImportErrorData 下载导入时的错误数据]
	 * @param  {string} type   [导入类型]
	 * @param  {string} taskId [任务ID]
	 * @return {any}           [description]
	 */
	public getImportErrorData(type:string,taskId:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_UPLOAD_STATUS+type+'/'+taskId);
	};


	/**
	 * [uploadFile 上传SPU图片]
	 * @param {any} data [图片数据]
	 */
	public uploadFile(data:any){
		return this.httpClientService.postFileUpLoad(FOUNDATIONINFOURL.FILE,data);
	};



    //费用
    public getCharge(filter:Object):any{
    	return this.httpClientService.get(FOUNDATIONINFOURL.CHARGE_LIST+'?pageRequest='+filter)

    };
    public getChargeinfo(id):any{
    	return this.httpClientService.get(FOUNDATIONINFOURL.CHARGE_DETAIL+id)

    };
    
    public addCharge(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.CHARGE_ADD, data)

    };   

    public updateCharge(id:string,data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.CHARGE_PUT+id, data)

    };   

    public delCharge(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.CHARGE_DEL+ids);
    };

    public getChargetypes(filter:Object):any{
    	return this.httpClientService.get(FOUNDATIONINFOURL.CHARGE_TYPE_LIST)

    };
    
	public updateSpuStatus(id:string,status:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.SPU_UPDATE+'/'+id,status);
	};

	/**
	 * [getSkusBySpu 通过SPU ID 批量生成SKU]
	 * @param {string} id     [spuId]
	 * @param {string} filter [过滤条件 扩展属性]
	 */
	public getSkusBySpu(id:string,filter:string){
		return this.httpClientService.get(FOUNDATIONINFOURL.SPU_SKU_LIST+id+'/skus?request='+filter);
	};

	/**
	 * [addSkusBySpu 通过SPU ID　保存批量生成的SKU]
	 * @param {string} id   [spuId]
	 * @param {Array<any>}   data [sku集合]
	 */
	public addSkusBySpu(id:string,data:Array<any>){
		return this.httpClientService.post(FOUNDATIONINFOURL.SPU_SKU_LIST+id+'/skus',data);

	};

	//SKU
	public getSkus(filter:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SKU_LIST+'?query='+filter);
	};

	public getSku(code:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.SKU_DETAIL+code);
	};

	public addSku(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.SKU_ADD, data);
	};

	public delSku(codes:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.SKU_DEL+codes);
	};

	public updateSku(data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.SKU_UPDATE,data);
	};

	public updateSkuStatus(code:string,status:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.SKU_UPDATE+'/'+code,status);
	};

	public getMeasureTypes():any{
		return this.httpClientService.get(FOUNDATIONINFOURL.MEASURETYPE_LIST);
	};

	public getMeasuresByType(code:string):any{
		return this.httpClientService.get(FOUNDATIONINFOURL.MEASURE_LIST + code);
	};

	//获取sku的外箱/内箱
	public getSkuBoxList(filter:Object){
		let queryString = this.initQueryParams(filter);
		queryString += "&type=" + filter['type'];
		return this.httpClientService.get( FOUNDATIONINFOURL.SKU_LIST + '/details' + queryString);
	}

	//获取所有组织
	public getUserGroups():any{
		return this.httpClientService.get(FOUNDATIONINFOURL.USERGROUP_LIST);
	};
	
	//倉庫
	public getWarehouseList(filter:Object){
		let queryString = this.initQueryParams(filter);
		return this.httpClientService.get(FOUNDATIONINFOURL.WAREHOUSE_LIST + queryString);
	}

	//拿取过滤掉已选取的联系人列表
	public getNotExistUserList(userIdList:string,filter:Object){
		let queryString = '&pageNum=' + filter['pageNum'] + '&pageSize=' + filter['pageSize'] 
						+  '&searchKeyWord=' + filter['searchKeyWord'];
		if(filter['orderItem']){
			queryString += '&orderItem.columnName=' + filter['orderItem']['columnName']
						+ '&orderItem.asc=' + (filter['orderItem']['asc']);
		}
		return this.httpClientService.get(FOUNDATIONINFOURL.USER_LIST + userIdList + queryString);
	}

	//添加仓库
	public addWareHouse(data:Object):any{
		return this.httpClientService.post(FOUNDATIONINFOURL.ADD_WARE_HOUSE, data);
	};

	//删除仓库
	public delWareHouse(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.DEL_WARE_HOUSE + ids);
    };

    //获取仓库详情
    public getWareHouseinfo(id):any{
    	return this.httpClientService.get(FOUNDATIONINFOURL.WARE_HOUSE_DETAIL.replace("{id}",id))

    };

    //修改仓库详情
    public updateWareHouse(id:string,data:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.EDIT_WAR_HOUSE.replace("{id}",id), data)

    }; 

    //获取BOM列表
    public getBomList(filter:Object){
    	if (!filter['detail']) {
    		filter['detail'] = false
    	}
		let queryString = '?pageNum=' + filter['pageNum'] + '&pageSize=' + filter['pageSize'] 
						+  '&searchKeyWord=' + filter['searchKeyWord'] + '&details=' +  filter['detail'] + '&id=' +  filter['id'];
		if(filter['orderItem']){
			queryString += '&orderItem.columnName=' + filter['orderItem']['columnName']
						+ '&orderItem.asc=' + (filter['orderItem']['asc']);
		}
		return this.httpClientService.get(FOUNDATIONINFOURL.BOM_LIST + queryString);
	}

	//获取过滤掉原料的SPU
    public getSpuList(filter:string,spuIdString:string){

		// let queryString = 'pageNum=' + filter['pageNum'] + '&pageSize=' + filter['pageSize'] 
		// 				+  '&searchKeyWord=' + filter['searchKeyWord'] + '&types=' +  filter['types'];
		// if(filter['orderItem']){
		// 	queryString += '&orderItem.columnName=' + filter['orderItem']['columnName']
		// 				+ '&orderItem.asc=' + (filter['orderItem']['asc']);
		// }
		return this.httpClientService.get(FOUNDATIONINFOURL.GET_SPU_LIST+'query='+filter);
	}

	//查看spu的BOM结构
    public checkSpuBomOrganization(id):any{
    	return this.httpClientService.get(FOUNDATIONINFOURL.CHECK_SPU_BOM_ORGANIZATION.replace("{id}",id))

    };
    //新增BOM结构
    public addSpuBom(filter:Object):any{
    	return this.httpClientService.post(FOUNDATIONINFOURL.ADD_SPU_BOM,filter)
    };

    //查看BOM详情
     public getBomInfo(id):any{
    	return this.httpClientService.get(FOUNDATIONINFOURL.BOM_INFO.replace("{id}",id))

    };

    //修改BOM详情
    public updateBom(filter:Object):any{
		return this.httpClientService.put(FOUNDATIONINFOURL.UPDATE_BOM_INFO, filter)
    }; 

    //删除BO
	public delSpuBom(ids:string):any{
		return this.httpClientService.delete(FOUNDATIONINFOURL.DEL_SPU_BOM + ids);
    };
    
    public initQueryParams(filter):any{
		let queryString = '?pageNum=' + filter['pageNum'] + '&pageSize=' + filter['pageSize'] 
						+  '&searchKeyWord=' + filter['searchKeyWord'];
		if(filter['orderItem']){
			queryString += '&orderItem.columnName=' + filter['orderItem']['columnName']
						+ '&orderItem.asc=' + (filter['orderItem']['asc']);
		}
		return queryString
	}

}