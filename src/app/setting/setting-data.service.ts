import { Injectable }       from '@angular/core';
import { Http,Headers }       from '@angular/http';
import { HttpClientService } from 'core/services/http-client.service';
import { SETTING } from './setting-setting';

@Injectable()
export class SettingService {

	constructor(private httpClientService: HttpClientService) {}

    // 激活
    public getActivationData(data:Object):any{
    	return this.httpClientService.put(SETTING.ACTIVATION,data)
    };
    // 修改密码
    public modifyPass(passInfo): Promise <any> {
      return this.httpClientService.put(SETTING.MODIFY_PASSW_URL, passInfo);
    }
    // 个人信息
    public getUserInfo():any{
    	return this.httpClientService.get(SETTING.INFORMATIONINFO)
    };
    //获取图片验证码
    public getImageVerify(){
        return this.httpClientService.get(SETTING.GET_IMAGE_VERIFY);
    }
    //获取手机短信
    public sendVerifyCode(userCode ){
        return this.httpClientService.get(SETTING.GET_PHONE_VERIFICATION + userCode);  
    }
    //验证图片验证码是否正确
    public checkMobileImgVerifyCode(credentialsDto){
        return this.httpClientService.post(SETTING.LOGINVERIMG , credentialsDto);
    }
    //获取激活用户的信息
    public getActivationUserInfo(mobile){
        return this.httpClientService.get(SETTING.ACTIVATION_USERINFO + mobile);
    }

    //验证短信
    public checkMessage(data){
        return this.httpClientService.post(SETTING.ACTIVATION_MESSAGE + data.userCode + '/message' , data);
    }
    // 重置密码
    public resetPassword(data){
        return this.httpClientService.put(SETTING.RESETPASSWORD + "user" + "/" + data.userCode, data )       
    }
}