import {Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ProcessService } from  'process/process.service'; 
import { PopupService } from 'core/services/popup.service';
import {todoList } from 'process/mock/todo-list';
import { Title } from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

@Component({
    selector:'todo-list',
    templateUrl:'./todo-list.component.html',
    styleUrls:['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
 
    private emptyMessage : string  = '没有记录';
    private totalRecords : number  = 0;
    private first        : number  = 0;
    private query        : any     = {};
    private todoList :Array<any> = [];
    private toolbarConfigs : Array<any> = [];
    private view : string = "backlog";
    private processDetail : BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(
        private router : Router,
        private service: ProcessService,
        private popupService:PopupService,
        private titleService : Title){}

    ngOnInit(): void {
        this.titleService.setTitle('我的任务');
        this.toolbarConfigs = [
            {handler: this.getBackLog.bind(this),label:'我的待办',default: true},
            {handler: this.getDraft.bind(this),label:'我的草稿'},
            {handler: this.getProcessInstance.bind(this),label:'我的流程'},
            {handler: this.getfinishTask.bind(this),label:'我的已办'},
            {type: "search",handler: this.onQuery.bind(this),align: "right"}
        ];

        
        this.query = {
            searchKeyWord:'',
            pageNum:1,
            pageSize:10
        }

        this.setTodoList();
        
    }

    /**
     * [getBackLog 获取待办列表]
     */
    public getBackLog():void{
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.view = 'backlog';
        this.setTodoList();
    }

    public getfinishTask():void{
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.view = 'finished';
        this.setTodoList();
    }

    /**
     * [getDraft 获取草稿列表]
     */
    public getDraft():void{
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.view = 'draft';
        this.setTodoList();
    }

    /**
     * [getProcessInstance 获取我发起的流程实例列表]
     */
    public getProcessInstance():void{
        this.first = 0;
        this.query['pageNum']  = 1;
        this.query['pageSize'] = 10;
        this.view = 'processInstance';
        this.setTodoList();
    }

    /**
     * [onQuery 过滤查询]
     * @param {[type]} event [description]
     */
    public onQuery(event):void{
        this.first = 0;
        this.query['searchKeyWord'] = event;
        this.query['pageNum'] = 1;
        this.setTodoList();
    }

    /**
     * [handleTodo 处理代办]
     * @param {any} task [待办数据]
     */
    public handleTodo(task:any):void{


        if(task.processTypeId === 'tsgdslod'){
            this.router.navigateByUrl("main/business/selling/"+task.id+"/view?processStatus="+task.processStatus);
            return;
        }

        if(task.processStatus == 'DRAFT' || task.type == '表单'){
            this.router.navigateByUrl("main/process/start/"+task.processTypeId+'/tasks/'+task.id+'?status=draft');
        } else{
            this.router.navigateByUrl("main/process/start/"+task.processTypeId+'/tasks/'+task.id + "?readonly");
        }
    }

    /**
     * [onPage 列表分页]
     * @param {any} event [分页信息]
     */
    public onPage(event:any):void{

        this.query['pageNum']  = (event.first/event.rows)+1,
        this.query['pageSize'] = event.rows;
        this.first = event.first;

        this.setTodoList();

    }

    /**
     * [setTodoList 设置列表数据]
     * @param {any} filter [过滤条件]
     */
    public setTodoList(){
        var funcName = '';

        switch (this.view) {
            case "draft":
                funcName ='getTodoDrafts';
                break;
            case "processInstance":
                funcName = 'getTodoProcessInstances';
                break;
            case 'backlog':
                funcName = 'getTodoTasks';
                break;
            case 'finished':
                funcName = 'getTodoFinishTask';
                break;
        }
        this.service[funcName](this.query)
            .then(data =>{
                this.todoList = [...data['content']];
                this.totalRecords = data.totalElements;
                this.todoList.map(i =>{
                    i.timeout = i.timeout?'是':'否';
                });
            })
            .catch(res => this.popupService.showError(res));
    }

    /**
     * [terminationProcess 终止流程]
     * @param {string} processCode [流程code]
     */
    public terminationProcess(processCode :string) :void {
        var _this = this;
        this.popupService.confirm({
            header: '终止流程',
            message: '你确定要终止选中的流程吗',
            accept:function(){
                _this.service.termination(processCode,"")
                .then(()=>{
                    _this.setTodoList()
                })
                .catch(res => _this.popupService.showError(res));
            }
        });
    }

    /**
     * [deleteProcess 删除流程]
     * @param {string} processCode [流程code]
     */
    public deleteProcess(processCode :string) :void {
        var _this = this;
        this.popupService.confirm({
            header: '删除流程',
            message: '你确定要删除选中的流程吗',
            accept:function(){
                _this.service.delete(processCode)
                .then(()=>{
                    _this.setTodoList()
                })
                .catch(res => _this.popupService.showError(res));
            }
        });
    }

    /**
     * [deleteDraft 删除草稿]
     * @param {string} taskId [任务id]
     */
    public deleteDraft(taskId :string) :void {
        var _this = this;
        this.popupService.confirm({
            header: '删除草稿',
            message: '你确定要删除选中的草稿吗',
            accept:function(){
                _this.service.deleteDraft(taskId)
                .then(()=>{
                    _this.setTodoList()
                })
                .catch(res => _this.popupService.showError(res));
            }
        });
    }

    /**
     * [toDetail 查看详情]
     * @param {string} processCode   [流程code]
     * @param {string} processTypeId [流程类型]
     */
    public toDetail(processCode:string,processTypeId:string):void{
        if(processTypeId == 'tsgdslod'){
            this.processDetail.next({"processCode":processCode,"transType":processTypeId})
        } else{
            this.processDetail.next({"processCode":processCode,"transType":''})
        }
    }
}