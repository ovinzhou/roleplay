'use strict';

import { BASE_URL } from '../core/constants/global-setting';


export const CONTACTS_URL  = {
	//用户
	GET_USERS_LIST         : `${BASE_URL}/community/users`,
	GET_BY_ORG_USERS_LIST  : `${BASE_URL}/community/group_user/`,
	GET_BY_ROLE_USERS_LIST : `${BASE_URL}/community/role_user/`,
	GET_USER_INFO          : `${BASE_URL}/community/user/`,
	EDIT_USER_INFO         : `${BASE_URL}/community/user/`,
	ADD_USER_INFO          : `${BASE_URL}/community/user`,
	BATCH_DELETE_USERS     : `${BASE_URL}/community/users`,
	SET_USER_STATUS        : `${BASE_URL}/community/user/`,
	INFORMATIONINFO 	   : `${BASE_URL}/community/currentuser`,	
	//角色
	ROLE_LIST : `${BASE_URL}/community/roles`,
	ADD_ROLE_URL : `${BASE_URL}/community/role`,
	GET_ROLE_INFO : `${BASE_URL}/community/role/`,
	EDIT_ROLE : `${BASE_URL}/community/role/`,
	DELETE_ROLE : `${BASE_URL}/community/role/`,
	GET_ROLE_LIST_SAME_LEVel : `${BASE_URL}/community/roles_subs`,
	ROLE_SUB_LIST:`${BASE_URL}/community/role/`,
	GET_ROLE_NOT_USERLIST:`${BASE_URL}/community/role_user_not/`,
	ADD_USERS_BY_ROLE:`${BASE_URL}/community/role/`,
	//组织
	UNIT_LIST : `${BASE_URL}/community/groups`,
	UNIT_SUB_LIST:`${BASE_URL}/community/group/`,
	ADD_ORG_URL : `${BASE_URL}/community/group`,
	DELETE_ORG : `${BASE_URL}/community/group/`,
	GET_ORG_INFO : `${BASE_URL}/community/group/`,
	EDIT_ORG : `${BASE_URL}/community/group/`,
	GET_ORG_LIST_SAME_LEVEl : `${BASE_URL}/community/groups_subs`,
	GET_ORG_NOT_USERLIST:`${BASE_URL}/community/group_user_not/`,
	ADD_USERS_BY_ORG:`${BASE_URL}/community/group/`,
	//负责人列表
	PRINCIPAL_LIST :  `${BASE_URL}/community/tinyusers`,

	//商业圈
	GET_BIZ_INFO : `${BASE_URL}/community/bizcricle/`,
	ADD_BIZ_INFO : `${BASE_URL}/community/bizcricle`,
	BATCH_DELETE_BIZS : `${BASE_URL}/community/entity/entityinfo/dels`,
	DELETE_BIZ_ALL : `${BASE_URL}/community/bizcricle`,
	GET_BIZ_LIST : `${BASE_URL}/community/`,
	GET_PROVINCES_LIST : `${BASE_URL}/community/entity/provinces`,
	GET_CITIES_LIST: `${BASE_URL}/community/entity/cities/`,
	GET_AREALIST : `${BASE_URL}/community/entity/cityarea/`,
	BATCH_SET_LABEL : `${BASE_URL}/community/bizcricle/tags`,
	BATCH_SET_PRINCIPAL : `${BASE_URL}/community/bizcricle/principal`,
	BIZ_COMMON_URL : `${BASE_URL}/community/`,

	UPLOAD_FILE_URL : `${BASE_URL}/api/uploadAndShearImage`

}







