import { Injectable,Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {HttpClient} from "rp-dynamic-form/components/form/shared/http-client";
import { TokenService } from "../core/services/token.service";

import {BASE_URL} from '../core/constants/global-setting';

@Injectable()
export class ProcessHttpClient extends HttpClient {
    constructor(http:Http, private tokenService:TokenService) {
        super(http);
    }
    getHeaders():Headers {

        return new Headers({
            'Content-Type': 'application/json',
            'uuid': this.tokenService.getToken()
        });
    }
    assignOptions(options?: {}): any{
         return Object.assign({},
            {
                headers: this.getHeaders()
            },
            options);
    }
    get(url: any, options?: {}): Promise<any>{
        url = BASE_URL + url;
        return super.get(url,options);
    }
    
    post(url: any, body: any, options?: {}): Promise<any>{
        url = BASE_URL + url;
        return super.post(url,body,options);
    }
    put(url: any, body: any, options?: {}): Promise<any>{
        url = BASE_URL + url;
        return super.put(url,body,options);
    }
    delete(url: any, options?: {}): Promise<any>{
        url = BASE_URL + url;
        return super.delete(url,options);
    }
}
