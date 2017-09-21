import { Injectable }       from '@angular/core';
import { Http }       from '@angular/http';

import { HttpClientService } from '../services/http-client.service';
import { ENTITY_URL } from './entity-setting';
@Injectable()
export class EntityDetailService {
    
    constructor(private httpClientService: HttpClientService) {}

    //获取主体信息
    getEntityInfo(){
        return this.httpClientService.get(ENTITY_URL.EDIT_ENTITY_INFO)
    }

    //修改主体信息
    editEntityInfo(data){
         return this.httpClientService.post(ENTITY_URL.GET_ENTITY_INFO,data);
                       
    }

    //获取城市信息
    getCitiesList(province){
        return this.httpClientService.get(ENTITY_URL.GET_CIIES_LIST + province)
    }

    //获取地区信息
    getAreaList(cityId){
        return this.httpClientService.get(ENTITY_URL.GET_AREA_LIST + cityId)
    }

    //获取省份级联
    getProvincesList(){
        return this.httpClientService.get(ENTITY_URL.GET_PROVINCES_LIST)
    }

    //获取负责人列表
    getPrincipalList(){
        return this.httpClientService.get(ENTITY_URL.PRINCIPAL_LIST)
    }

    //LOGO
    uploadAvatar(data){
        return this.httpClientService.postFileUpLoad(ENTITY_URL.UPLOAD_FILE_URL,data)
    }

}