import { Injectable,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClientService } from "core/services/http-client.service";
import { BASE_URL } from 'core/constants/global-setting';
import { TokenService } from "core/services/token.service";
import { PopupService } from 'core/services/popup.service';
import { ROLEPLAY_ERROR } from 'core/constants/roleplay-error';
import { USER_LOGIN_URL } from './user-login-setting'
import { Http, Headers } from "@angular/http";

@Injectable()
export class UserLoginService {
  private loginUrl = `${BASE_URL}/login`;
  public isLoggedIn: boolean = false;
  public redirectUrl: string = "home/contacts";

  public loginNotifier = new EventEmitter();

  constructor(
      private httpClient: HttpClientService,
      private tokenService :TokenService,
      private popupService: PopupService
  )  {
  }

  public login(data): Promise<any> {
      // console.log(`${username} login with password: ${password}`);

      return this.httpClient.post(this.loginUrl,
          data,
          {
              headers: this.httpClient.createHeader(this.tokenService.refreshToken())
          })
          .then((response) => { 
              this.isLoggedIn = true;
              // this.cookieService.put("token", this.tokenService.getToken());
              this.tokenService.setToken();
              this.loginNotifier.emit({login: true});
              window.localStorage.setItem("userId",response.userId);
              window.localStorage.setItem('baseUrl',BASE_URL);
              return response.status;
            },(error) => {
              this.isLoggedIn = false;
              this.popupService.showError(error);
              this.tokenService.cleanToken();
              return Promise.reject(error);
            });
  }

  // public sendVerification(cellphone): Promise<any> {
  //     let url = `${this.sendPasscodeUrl}/${cellphone}`;
  //     return this.httpClient.get(url,
  //         {
  //             headers: this.httpClient.createHeader(this.clientSession.refreshToken())
  //         });
  // }

  public logout(): void {
      this.tokenService.cleanToken();
      this.isLoggedIn = false;

      console.log("user login service logout...");
  }

  //获取图片验证码
  public getImageVerify(){
    return this.httpClient.get(USER_LOGIN_URL.GET_IMAGE_VERIFY);
  }


  //获取手机短信
  public sendVerifyCode(userCode,verifycode){
    return this.httpClient.get(USER_LOGIN_URL.GET_PHONE_VERIFICATION + userCode);  
  }

  //验证图片验证码是否正确
  public checkMobileImgVerifyCode(credentialsDto){
    return this.httpClient.post(USER_LOGIN_URL.LOGINVERIMG , credentialsDto);
  }

}
