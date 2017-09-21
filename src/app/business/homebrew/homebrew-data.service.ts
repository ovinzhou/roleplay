import { Injectable }       from '@angular/core';
import { Http }       from '@angular/http';

import { HttpClientService } from 'core/services/http-client.service';

import { HOMEBREWINFOURL } from './homebrew-setting';


@Injectable()
export class HombrewInfoService {

	constructor(private httpClientService: HttpClientService) {

	}

	public getItems(filter:any):any{
		return this.httpClientService.get(HOMEBREWINFOURL.ITEMS
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	}


	public getWaitStorage(filter:any):any{
		return this.httpClientService.get(HOMEBREWINFOURL.WAITSTORAGE
			+'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
	}


}