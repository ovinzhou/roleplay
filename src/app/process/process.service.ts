import { Injectable } from '@angular/core';
import { HttpClientService } from 'core/services/http-client.service';
import { PROCESS_SETTING } from './process.setting';

import { tsgdslodForm }  from './mock/tsgdslod';



@Injectable()
export class ProcessService{

    constructor(private httpClientService:HttpClientService){}

    public start(transTypeId:string,extra:any):any{
        let url = PROCESS_SETTING.URL.START.replace("{processTypeId}",transTypeId);
        if(extra !== void 0){
            if(typeof extra === "string" && extra !== "" ){
                url += "?extra=" + extra;
            }else if(extra instanceof Object){
                let params:string = "";
                Object.keys(extra).forEach( key => {
                    params += `${key}=${extra[key]}&`
                })

                if(params.length > 0){
                    if(params[params.length - 1] == '&'){
                        params = params.slice(0,params.length - 1);
                    }
                     url += "?" + params;
                }
            }
            
        }
        return this.httpClientService.get(url); 
    }

    
    /**
     * 获取临时订单    
     * @param  {string} transTypeId 流程类型
     * @param  {string} tempOrderId 临时订单ID
     * @return {any}                [description]
     */
    public getTempOrderForm(transTypeId:string,tempOrderId:string):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.START.replace("{processTypeId}",transTypeId)+'?preOrderId='+tempOrderId);
    };

    public load(transCode:string):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.START.replace("{processTypeId}",transCode)); 
    }

    public loadToDo(taskId:string):any {
        let url = PROCESS_SETTING.URL.DOTASK.replace("{taskId}",taskId); 
        return this.httpClientService.get(url);
    }

    /**
     * [doTask 处理待办]
     * @param  {string} taskId [description]
     * @return {any}           [description]
     */
    public doTask(taskId:string):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.DOTASK.replace('{taskId}',taskId));
    }

    /**
     * [submit 表单提交]
     * @param  {string} processTypeId [流程类型]
     * @param  {string} taskId        [任务ID]
     * @param  {any}    formData      [表单数据]
     * @return {any}                  [description]
     */
    public submit(processTypeId:string,taskId:string,formData:any):any{

        return this.httpClientService.post(
            PROCESS_SETTING.URL.SUBMIT
            .replace("{processTypeId}",processTypeId)
            .replace("{taskId}",taskId?taskId:''),formData)
    };

    /**
     * [draft 保存草稿]
     * @param  {string} processTypeId [流程类型]
     * @param  {string} taskId        [任务ID]
     * @param  {any}    formData      [description]
     * @return {any}                  [description]
     */
    public draft(processTypeId:string,taskId:string,formData:any):any{
        return this.httpClientService.post(
            PROCESS_SETTING.URL.SAVEDRAFT
            .replace("{processTypeId}",processTypeId)
            .replace("{taskId}",taskId),formData)
    };


    /**
     * [approve 同意]
     * @param  {string} taskId   [任务ID]
     * @param  {any}    formData [表单数据]
     * @return {any}             [description]
     */
    public approve(taskId:string,formData:any):any{
        return this.httpClientService.post(
            PROCESS_SETTING.URL.APPROVE
            .replace("{taskId}",taskId),formData)
    }

    /**
     * [disapprove 不同意]
     * @param  {string} taskId   [任务ID]
     * @param  {any}    formData [表单数据]
     * @return {any}             [description]
     */
    public disapprove(taskId:string,formData:any):any{
        return this.httpClientService.post(
            PROCESS_SETTING.URL.DISAPPROVE
            .replace("{taskId}",taskId),formData)
    }

    /**
     * [getCurrency 币种]
     * @return {any} [description]
     */
    public getCurrency():any{
        return this.httpClientService.get(PROCESS_SETTING.URL.CURRENCY);
    }

    /**
     * [getTaskLogs 获取任务日志]
     * @param {string} processCode [流程code]
     * @return {any}  [任务日志列表]
     */
    public getTaskLogs(processCode:string):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.LOG.replace("{processCode}",processCode));
    }

    /**
     * [getFormByProcessCode 根据流程code获取表单数据]
     * @param {string} processCode [流程code]
     * @return {any}  [表单数据]
     */
    public getFormByProcessCode(processCode:string):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.FORMBYPROCODE.replace("{processCode}",processCode));
    }

    /**
     * [terminationProcess 终止流程]
     * @param {string} processCode       [流程code]
     * @param {string} terminationReason [终止理由]
     */
    public termination(processCode:string,terminationReason:string):any{
        return this.httpClientService.post(PROCESS_SETTING.URL.TERMINATION.replace("{processCode}",processCode).replace("{terminationReason}",terminationReason),null);
    }

    /**
     * [delete 删除流程]
     * @param {string} processCode       [流程code]
     */
    public delete(processCode:string):any{
        return this.httpClientService.delete(PROCESS_SETTING.URL.DELETE.replace("{processCode}",processCode));
    }

    /**
     * [delete 删除草稿]
     * @param {string} taskId       [任务ID]
     */
    public deleteDraft(taskId:string):any{
        return this.httpClientService.delete(PROCESS_SETTING.URL.DELETEDRAFT.replace("{taskId}",taskId));
    }

    /**
     * [getTodoTasks 查询待办任务列表]
     * @param  {any} filter [过滤条件]
     * @return {any}        [任务列表]
     */
    public getTodoTasks(filter:any):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.TODOTASKS
            +'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
    }

    /**
     * [getTodoDrafts 查询草稿列表]
     * @param  {any} filter [过滤条件]
     * @return {any}        [草稿列表]
     */
    public getTodoDrafts(filter:any):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.DRAFT
            +'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
    }

    /**
     * [getTodoProcessInstances 我发起的流程实例列表]
     * @param  {any} filter [过滤条件]
     * @return {any}        [流程实例列表]
     */
    public getTodoProcessInstances(filter:any):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.PROCESSINSTANCE
            +'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
    }

    public getTodoFinishTask(filter:any):any{
        return this.httpClientService.get(PROCESS_SETTING.URL.FinishTask
            +'?pageNum='+filter['pageNum']
            +'&pageSize='+filter['pageSize']
            +'&searchKeyWord='+filter['searchKeyWord']);
    }
}