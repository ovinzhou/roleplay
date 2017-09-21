'use strict';

import {BASE_URL }  from '../core/constants/global-setting';

export const SETTING  = {	
	//个人信息
	INFORMATIONINFO : `${BASE_URL}/community/currentuser`,	
	//激活
	ACTIVATION : `${BASE_URL}/user`,
	// 修改密码
    MODIFY_PASSW_URL : `${BASE_URL}/`,
	//获取图片验证码
    GET_IMAGE_VERIFY : `${BASE_URL}/loginVerImg`,
    //获取手机验证码
     GET_PHONE_VERIFICATION : `${BASE_URL}/getPasscode/`,
    //验证图片
    LOGINVERIMG : `${BASE_URL}/loginVerImg`,
    //获取激活用户的信息
    ACTIVATION_USERINFO: `${BASE_URL}/user/`,
    //验证短信
    ACTIVATION_MESSAGE : `${BASE_URL}/`,
    //重置密码
    RESETPASSWORD:`${BASE_URL}/`,
}