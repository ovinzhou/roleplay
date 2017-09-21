import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {TreeModule,TreeNode} from 'primeng/primeng';

import { LazyLoadEvent } from 'primeng/components/common/api';
import * as PShared from 'primeng/components/common/shared';

import { ContactsDataService } from '../contacts-data.service';
import { PopupService } from 'core/services/popup.service';
import { ROLEPLAY_ERROR } from 'core/constants/roleplay-error';

@Component({
  selector: 'contacts',
  template:`<router-outlet></router-outlet>`
})

export class ContactsComponent implements OnInit{
    private orgs: TreeNode[];
    private groupName : string = '组织';
    private bizInfoList : TreeNode[];
    //是否显示组织角色面板
    private showHeading  = false;
    private group : string;
    private entityId : string ;
    private entityInfo : any;
    private searchKey : string;
    groupId : string;
    users : any;
    private groupList : any;

    constructor(private contactsDataService : ContactsDataService,
                private router : Router,
                private route : ActivatedRoute,
                private popupService : PopupService) { }

    ngOnInit() {
      this.entityInfo = [
         {
           label : '富榕',
           type : 'entity',
           data : 'entity',
           "expanded": true,
           expandedIcon : 'fa-folder-open',
           collapsedIcon : 'fa-folder',
           children:[]
         }
      ]
      this.groupList = [];

      this.group = 'org';
      this.route.params.subscribe(params => {
        //获取子路由的参数
        if(this.route.firstChild && this.route.firstChild.firstChild){
          this.route.firstChild.firstChild.params.subscribe(params => {
            this.group = params['group'];
          })
        }
        this.groupName = this.group == 'org' ? '组织' : '角色';
        let funcName = this.group == 'org' ? 'getOrgData' : 'getRoleData';
        this.getgroupList(funcName,this.group);
        //用户过滤的数据
        this.getFilterGrouoName(this.group);
      });

      this.bizInfoList = [
        {
          label: '商业圈',
          type: 'biz',
          data: 'all',
          expandedIcon : 'fa-folder-open',
          collapsedIcon : 'fa-folder',
          children:[
            {
              label: '客户',
              type: 'biz',
              data: 'cuscomers',
              expandedIcon : 'fa-folder-open',
              collapsedIcon : 'fa-folder',
            },
            {
              label: '供应商',
              type: 'biz',
              data: 'prividers',
              expandedIcon : 'fa-folder-open',
              collapsedIcon : 'fa-folder',
            },
            {
              label: '合作伙伴',
              type: 'biz',
              data: 'partners',
              expandedIcon : 'fa-folder-open',
              collapsedIcon : 'fa-folder',
            },
            {
              label: '股东',
              type: 'biz',
              data: 'shareholders',
              expandedIcon : 'fa-folder-open',
              collapsedIcon : 'fa-folder',
            }
          ]
        }
      ];
    }

    //点击树形触发事件
    nodeSelect(event) {
      
      if(event.node.type == 'role'){
        this.router.navigateByUrl("/home/contacts/group/role/" +  event.node.id + "/userlist");
      }else if(event.node.type == 'entity'){
        let groupType = this.groupName == '组织' ? 'org' : 'role';
        this.router.navigateByUrl("/home/contacts/group/" + groupType + "/main/userlist");
      }else if(event.node.type == 'org'){
        this.router.navigateByUrl("/home/contacts/group/org/" +  event.node.id + "/userlist");
      }else if(event.node.type == 'biz'){
        this.router.navigateByUrl("home/contacts/biz/" + event.node.data);
      }else if(!event.node.type){

        //暂时处理页面没有type的时候，不知道是怎么出现的,type没有没定义.
        window.location.reload();
      }
    }

    //显示组织角色下拉列表
    toggleHeading() {
      this.showHeading = !this.showHeading;
    }

    //设置tree样式
    setStyles() {
      let styles = {
        'margin-right': '100px',
        'margin-left': '10px',
        'width': '100%',
        'border': 'none',
        'background-color': 'white'
      };
      return styles;
    }

    selectOrg(){
      this.getgroupList('getOrgData','org');
       // this.contactsDataService.getOrgData().then(orgs => this.orgs = orgs);
       // this.router.navigate(['/home/contacts',{id: +new Date()}, 'user' ,'list' , this.group , 'main']);
       this.router.navigateByUrl("/home/contacts/group/org/main/userlist");
       this.groupName = '组织';
       this.showHeading = false;
       //用于判断是org还是role，如果切换到org,this.groupList赋值为orgList 用于搜索组织
       if(this.groupList && this.groupList[0].type == 'role'){
          this.getFilterGrouoName('org');
        }
    }

    selectRole(){
        this.getgroupList('getRoleData','role');
        this.router.navigateByUrl("/home/contacts/group/role/main/userlist");
        this.groupName = '角色';
        this.showHeading = false;
        //用于判断是org还是role，如果切换到role,this.groupList赋值为roleList 用于搜索角色
        if(this.groupList && this.groupList[0].type == 'org'){
          this.getFilterGrouoName('role');
        }

    }

    //获取groupList
    getgroupList(funcName,group){
      this.contactsDataService[funcName]().then(orgs => {
        this.formatGroupList(orgs,group);
        this.entityInfo[0].children = orgs;
      });
    }

    onInput(event){
      if(event.target.value ==''){
        this.entityInfo[0].children = this.entityInfo[0].backupEntityItems;
        delete this.entityInfo[0].backupEntityItems;
        
      }else{

        let filterList = this.groupList.slice(0);

        filterList = filterList.filter(item => {
           return item.name.includes(event.target.value)
        })

        filterList.forEach(item => {
          // let name = this.groupName = '组织' ? 'userGroupName' : 'userRoleName';
          let type = this.groupName == '组织' ? 'org' : 'role';
          item.label = item.name;
          item.type = type;
          item.expandedIcon = 'fa-folder-open';
          item.collapsedIcon = 'fa-folder';
        })
        if(!this.entityInfo[0].backupEntityItems){
          this.entityInfo[0].backupEntityItems = this.entityInfo[0].children;
        }
        this.entityInfo[0].children = filterList;
      }
    }

    nodeExpand(event){
      //如果类型是entity 不做任何操作
      if(event.node.type != 'entity'){
        event.node.children = [];
        let funcName = event.node.type == 'org' ? 'getUnitSubList' : 'getRoleSubList'
        this.contactsDataService[funcName](event.node.id)
            .then(data => {
              this.formatGroupList(data,event.node.type);
              event.node.children = data;
            })
            .catch(oError => {
              this.popupService.alert(ROLEPLAY_ERROR[oError.headers.get('roleplay-error-code')]||'系统异常');
            })
      }
    }

    formatGroupList(data,group){
      data.forEach(item => {
        item.expandedIcon = 'fa-folder-open';
        item.collapsedIcon = 'fa-folder';
        // item.leaf = false;
        item.leaf = !item.hasNextLevel;
        item.label = item.name;
        if(group == 'org'){
          item.type = 'org';
        }else if(group == 'role'){
          item.type = 'role';
        }
      })
    }

    getFilterGrouoName(group){
      let filterNumFunc = group == 'org' ? 'getUnitListSameLevel' : 'getRoleListSameLevel';
      this.contactsDataService[filterNumFunc]().then(data => {
        data.forEach(item => {
          item.type = group;
        })
        this.groupList = data;
      }).catch(oError => {
         this.popupService.alert(ROLEPLAY_ERROR[oError.headers.get('roleplay-error-code')]||'系统异常');
      })
    }
}
