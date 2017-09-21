'use strict';


import {BASE_URL }  from '../core/constants/global-setting';

export const FOUNDATIONINFOURL  = {

	//upload file
	FILE           :`${BASE_URL}/foundation/file`,
	//spuType
	SPU_TYPE_LIST  : `${BASE_URL}/foundation/spu_types`,
	SPU_TYPE_DETAIL: `${BASE_URL}/foundation/spu_type/`,
	SPU_TYPE_DEL   : `${BASE_URL}/foundation/spu_type?ids=`,
	SPU_TYPE_ADD   : `${BASE_URL}/foundation/spu_type`,
	SPU_TYPE_UPDATE: `${BASE_URL}/foundation/spu_type`,

	//spuAttrbute
	SPU_ATTRBUTE_LIST   : `${BASE_URL}/foundation/spu_attrs`,
	SPU_ATTRBUTE_DETAIL : `${BASE_URL}/foundation/spu_attr/`,
	SPU_ATTRBUTE_DEL    : `${BASE_URL}/foundation/spu_attr?ids=`,
	SPU_ATTRBUTE_ADD    : `${BASE_URL}/foundation/spu_attr`,
	SPU_ATTRBUTE_UPDATE : `${BASE_URL}/foundation/spu_attr`,
	VALUE_DEL           : `${BASE_URL}/foundation/spu_attr/value?ids=`,

	//procedure
	PROCEDURE_LIST  	: `${BASE_URL}/foundation/procedures`,
	PROCEDURE_INFO  	: `${BASE_URL}/foundation/procedure/`,
	PROCEDURE_DEL   	: `${BASE_URL}/foundation/procedure?ids=`,
	PROCEDURE_ADD   	: `${BASE_URL}/foundation/procedure`,
	PROCEDURE_UPDATE	: `${BASE_URL}/foundation/procedure`,
	//查询工序组
	GET_PROCEDURE_GROUP : `${BASE_URL}/community/groups`,
	UNIT_SUB_LIST		: `${BASE_URL}/community/group/`,

	//wage
	WAGE_LIST  			: `${BASE_URL}/foundation/wages`,
	WAGE_DEL   			: `${BASE_URL}/foundation/wage?ids=`,
	WAGE_ADD   			: `${BASE_URL}/foundation/wage`,
	WAGE_UPDATE			: `${BASE_URL}/foundation/wage`,
	GET_WAGEINFO		: `${BASE_URL}/foundation/wage/`,
	//获取计件工序
	GET_PROCEDURE_LIST	: `${BASE_URL}/foundation/procedures/fees`,

	//spu
	SPU_LIST  			: `${BASE_URL}/foundation/spus`,
	SPU_DEL   			: `${BASE_URL}/foundation/spu?ids=`,
	SPU_ADD   			: `${BASE_URL}/foundation/spu`,
	SPU_UPDATE			: `${BASE_URL}/foundation/spu`,
	SPU_DETAIL			: `${BASE_URL}/foundation/spu/`,
	SPU_SKU_LIST		: `${BASE_URL}/foundation/spu/`,
	SPU_UPLOAD_STATUS	: `${BASE_URL}/foundation/import/`,

	//sku
	SKU_LIST  			: `${BASE_URL}/foundation/skus`,
	SKU_DEL   			: `${BASE_URL}/foundation/sku?codes=`,
	SKU_ADD   			: `${BASE_URL}/foundation/sku`,
	SKU_UPDATE			: `${BASE_URL}/foundation/sku`,
	SKU_DETAIL			: `${BASE_URL}/foundation/sku/`,


	//userGroup
	USERGROUP_LIST 		:`${BASE_URL}/community/groups_subs`,
	MEASURETYPE_LIST	:`${BASE_URL}/profile/types`,
	MEASURE_LIST		:`${BASE_URL}/profile/type/`,
	
	//charge
	CHARGE_LIST  : `${BASE_URL}/foundation/expenses`,
	CHARGE_DETAIL: `${BASE_URL}/foundation/expenses/`,	
	CHARGE_DEL   : `${BASE_URL}/foundation/expenses?ids=`,
	CHARGE_ADD   : `${BASE_URL}/foundation/expenses`,
	CHARGE_PUT	 : `${BASE_URL}/foundation/expenses/`,
	CHARGE_TYPE_LIST : `${BASE_URL}/foundation/expensestypes`,
	//仓库
	WAREHOUSE_LIST  : `${BASE_URL}/foundation/subjectstorages`,

	//联系人列表
	USER_LIST : `${BASE_URL}/community/not_in/users?ids=`,
	//新增仓库
	ADD_WARE_HOUSE : `${BASE_URL}/foundation/subjectstorage`,
	//删除仓库
	DEL_WARE_HOUSE : `${BASE_URL}/foundation/subjectstorages?ids=`,
	//获取仓库详情
	WARE_HOUSE_DETAIL : `${BASE_URL}/foundation/{id}/subjectstorage`,
	//修改仓库
	EDIT_WAR_HOUSE : `${BASE_URL}/foundation//{id}/subjectstorage`,
	//获取bom列表
	BOM_LIST : `${BASE_URL}/foundation/sku/tmpls`,
	//过滤原料的SPU
	GET_SPU_LIST : `${BASE_URL}/foundation/spus?`,
	//查看SPU的BOM结构
	CHECK_SPU_BOM_ORGANIZATION : `${BASE_URL}/foundation/sku/tmpl/{id}`,
	//新增BOM结构
	ADD_SPU_BOM : `${BASE_URL}/foundation/sku/tmpl`,
	//删除BOM列表数据
	DEL_SPU_BOM : `${BASE_URL}/foundation/sku/tmpl?ids=`,
	//查看BOM详情
	BOM_INFO : `${BASE_URL}/foundation/sku/tmpl/{id}`,
	//修改BOM
	UPDATE_BOM_INFO : `${BASE_URL}/foundation/sku/tmpl`,
}







