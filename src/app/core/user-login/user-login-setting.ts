'use strict';

import { BASE_URL } from 'core/constants/global-setting';


export const USER_LOGIN_URL  = {
	//获取图片验证码
    GET_IMAGE_VERIFY : `${BASE_URL}/loginVerImg`,
    //获取手机验证码
     GET_PHONE_VERIFICATION : `${BASE_URL}/getPasscode/` ,

     //验证图片
     LOGINVERIMG : `${BASE_URL}/loginVerImg`,

}







