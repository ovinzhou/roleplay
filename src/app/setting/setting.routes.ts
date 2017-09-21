import { RouterModule } from '@angular/router';
import { SettingComponent } from './index/setting.component'

// 忘记密码
import { ConfirmCodeComponent } from './forget-pwd/confirm-code/confirm-code.component'
import { ResetPasswordComponent } from './forget-pwd/reset-password/reset-password.component'

export const settingRoutes = [
  	{
		path:'',
		component:SettingComponent,		
	    children: [
	        // 确认账号
	        {
				path:'confirmcode',
				component:ConfirmCodeComponent
		    },
		    // 重置密码
		    {
				path:'resetpassword/:userCode',
				component:ResetPasswordComponent,
		    },		    
        ]
    }
   
];