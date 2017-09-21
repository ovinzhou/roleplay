import { Injectable }       from '@angular/core';

@Injectable()
export class TokenService {

    private token;

    constructor() {
    	this.token = window.localStorage.getItem('roleplay_token');
    }

    private uuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    getToken():string {
        return this.token;
    }

    setToken():void{
    	window.localStorage.setItem('roleplay_token',this.getToken());
    }

    refreshToken():string {
    	this.setToken();
        return this.token = this.uuid();
    }

    cleanToken() {
        this.token = null;
        window.localStorage.removeItem('roleplay_token');
    }

}