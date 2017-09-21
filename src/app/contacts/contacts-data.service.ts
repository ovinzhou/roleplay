import { Injectable }       from '@angular/core';
import { Http }       from '@angular/http';

import {  CONTACTS_URL } from './contacts-setting';
import { HttpClientService } from '../core/services/http-client.service';

@Injectable()
export class ContactsDataService {
    
    private userInfo = '3';
    constructor(private httpClientService: HttpClientService) {}

    //获取orgList
    getOrgData() {
        return this.httpClientService.get(CONTACTS_URL.UNIT_LIST) 
    }

    //获取roleList
    getRoleData() {
        return this.httpClientService.get(CONTACTS_URL.ROLE_LIST)
    }

    /*
       用户信息相关
    */
    //获取所有用户List
    getUseListData(filter){
        return this.httpClientService.get(CONTACTS_URL.GET_USERS_LIST + '?pageRequest=' + filter)
    }

    //获取用户信息
    getUserInfo(userId){
        return this.httpClientService.get(CONTACTS_URL.GET_USER_INFO + userId)
    }

    //添加用户信息
    addUserInfo(data){
        return this.httpClientService.post(CONTACTS_URL.ADD_USER_INFO, data);
    }

    //编辑用户信息
    editUserInfo(userId,data){
        return this.httpClientService.put(CONTACTS_URL.EDIT_USER_INFO + userId, data);
    }

    //批量删除用户
    batchDeleteUsers(ids){
        // return this.httpClientService.delete(CONTACTS_URL.batchDeleteUsers + encodeURIComponent(ids));
        return this.httpClientService.delete(CONTACTS_URL.BATCH_DELETE_USERS + '?ids=' + ids);
    }

    //获取group的所有userList
    getUserListByGroup(groupUrl, groupId , filter){
        return this.httpClientService.get(CONTACTS_URL[groupUrl] + groupId + '/users/?pageRequest=' + filter)
    }

    //获取group的不存在的userList
    getUserListNotGroup(groupUrl, groupId , filter){
        return this.httpClientService.get(CONTACTS_URL[groupUrl] + groupId + '/users/?pageRequest=' + filter)
    }

    addUserByGroup(groupUrl,groupId,data){
        return this.httpClientService.put(CONTACTS_URL[groupUrl] + groupId + '/users', data);
    }

    //设置用户状态
    setUserStatus(userId,status){
        return this.httpClientService.put(CONTACTS_URL.SET_USER_STATUS + status + '/' + userId, {})
    }

    //查找自己信息

    getSelfInfo(){
        return this.httpClientService.get(CONTACTS_URL.INFORMATIONINFO);
    }

    /**
        获取负责人列表
    */
    getPrincipalList(){
        return this.httpClientService.get(CONTACTS_URL.PRINCIPAL_LIST)
    }

    //获取下级组织列表
    getUnitSubList(groupId){
        return this.httpClientService.get(CONTACTS_URL.UNIT_SUB_LIST + groupId + '/subs')
    }

    //添加组织
    addUnit(data){
        return this.httpClientService.post(CONTACTS_URL.ADD_ORG_URL,data);
    }

    //删除组织
    deleteUnit(unitId){
         return this.httpClientService.delete(CONTACTS_URL.DELETE_ORG + unitId);
    }

    //修改
    editUnit(orgId,data){
         return this.httpClientService.put(CONTACTS_URL.EDIT_ORG + orgId,data);
    }

    //获取组织信息
    getUnitInfo(unitId){
        return this.httpClientService.get(CONTACTS_URL.GET_ORG_INFO + unitId)
    }

    //获取所有组织 父子同级
    getUnitListSameLevel(){
        return this.httpClientService.get(CONTACTS_URL.GET_ORG_LIST_SAME_LEVEl)
    }

    //添加角色
    addRole(data){
        return this.httpClientService.post(CONTACTS_URL.ADD_ROLE_URL,data);
    }

    //获取角色信息
    getRoleInfo(roleId){
        return this.httpClientService.get(CONTACTS_URL.GET_ROLE_INFO + roleId)
    }

    //修改角色
    editRole(roleId,data){
         return this.httpClientService.put(CONTACTS_URL.EDIT_ROLE + roleId,data);
    }

    //删除角色
    deleteRole(roleId){
         return this.httpClientService.delete(CONTACTS_URL.DELETE_ROLE + roleId);
    }

    //获取下级角色列表
    getRoleSubList(groupId){
        return this.httpClientService.get(CONTACTS_URL.ROLE_SUB_LIST + groupId + '/subs')
    }

    //获取所有角色 父子同级
    getRoleListSameLevel(){
        return this.httpClientService.get(CONTACTS_URL.GET_ROLE_LIST_SAME_LEVel)
    }

    //获取商业圈信息
    getBizInfo(bizId){
        return this.httpClientService.get(CONTACTS_URL.GET_BIZ_INFO + bizId)
    }

    //获取城市信息
    getCitiesList(province){
        return this.httpClientService.get(CONTACTS_URL.GET_CITIES_LIST + province)
    }

    //获取地区信息
    getAreaList(cityId){
        return this.httpClientService.get(CONTACTS_URL.GET_AREALIST + cityId)
    }

    //根据商圈类型获取列表
    getBizList(filter,bizType){
        return this.httpClientService.get(CONTACTS_URL.GET_BIZ_LIST + bizType + '?pageRequest=' + filter)
    }

    //获取省份级联
    getProvincesList(){
        return this.httpClientService.get(CONTACTS_URL.GET_PROVINCES_LIST)
    }

    //添加修改biz
    addBizInfo(data){
        return this.httpClientService.post(CONTACTS_URL.ADD_BIZ_INFO,data)
    }

    //批量删除商业圈下的信息 >> 即客户，供应商，合作伙伴，股东
    batchDeleteBizs(type,ids){
        // return this.httpClientService.delete(CONTACTS_URL.batchDeleteUsers + encodeURIComponent(ids));
        return this.httpClientService.delete(CONTACTS_URL.BIZ_COMMON_URL + type + '?ids=' + ids);
    }
    //删除商业圈信息
    batchAllDeleteBizs(type,ids){
        // return this.httpClientService.delete(CONTACTS_URL.batchDeleteUsers + encodeURIComponent(ids));
        return this.httpClientService.delete(CONTACTS_URL.DELETE_BIZ_ALL+ '?identityIds=' + ids);
    }

    //批量设置标签
    batchSetLabel(data){
        return this.httpClientService.put(CONTACTS_URL.BATCH_SET_LABEL,data)
    }

    //批量设置负责人
    batchSetPrincipal(data){
        return this.httpClientService.put(CONTACTS_URL.BATCH_SET_PRINCIPAL,data)
    }

    //上传用户头像
    uploadAvatar(data){
        return this.httpClientService.postFileUpLoad(CONTACTS_URL.UPLOAD_FILE_URL,data)
    }

}