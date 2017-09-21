'use strict';

import { BASE_URL } from '../../core/constants/global-setting';


export const ENTITY_URL  = {
	//获取主体信息
	GET_ENTITY_INFO: `${BASE_URL}/community/subject`,
	//编辑主体信息
	EDIT_ENTITY_INFO : `${BASE_URL}/community/subject`,
	//上传图片
	UPLOAD_FILE_URL : `${BASE_URL}/api/uploadAndShearImage`,
	//获取省份
	GET_PROVINCES_LIST : `${BASE_URL}/community/entity/provinces`,
	//获取城市级联
	GET_CIIES_LIST: `${BASE_URL}/community/entity/cities/`,
	//区县级联
	GET_AREA_LIST : `${BASE_URL}/community/entity/cityarea/`,
	//获取负责人列表
	PRINCIPAL_LIST :  `${BASE_URL}/community/tinyusers`,

}







