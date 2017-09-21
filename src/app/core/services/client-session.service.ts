import { Injectable }       from '@angular/core';
import { CookieService } from "angular2-cookie/services/cookies.service";

@Injectable()
export class ClientSession {

    private token;

    constructor(
      private cookieService: CookieService
    ) {
        this.token = this.cookieService.get("token");
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

    refreshToken():string {
        return this.token = this.uuid();
    }

    cleanToken() {
        this.token = null;
    }

}