import { Component, OnInit ,Input ,SimpleChange, Injector,ReflectiveInjector,Renderer,AfterViewInit,OnDestroy } from '@angular/core';

import { TreeNode,Message } from 'primeng/primeng';
import { Router , ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/api';
import * as PShared from 'primeng/components/common/shared';

import { flyIn } from 'core/animations/fly-in';
import { PopupService } from 'core/services/popup.service';
import { ContactsDataService } from '../../contacts-data.service';
import { Title } from '@angular/platform-browser';
import { CacheService } from 'core/services/cache.service';
import { BreadcrumbService } from 'core/services/breadcrumb.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls : ['./user-list.component.scss'],
  animations: [
    flyIn
  ]
})
export class UserListComponent implements OnInit,AfterViewInit,OnDestroy {
    private documentClickListener: Function;

    private displayDialog: boolean = false;
    private users : any;
    private groupName : string;
    private showTypeName : string;
    private groupId : string;
    private entityId : string;
    principalList : any;
    selectedUser: any;
    private groupType : string;
    private query : any;
    private totalRecords : string;
    private totalGroupRecords : string;
    private emptyMessage : string;
    //过滤参数
    private filter : any;
    private searchKeyWord : string;
    //组织角色添加成员的时候的过滤条件
    private groupFilter : any;
    private groupSearchKeyWord : string = '';
    private groupPage : any;
    toolbarConfigs: any[];
    //组织/角色要添加的成员
    private addUserList : any [];
    private groupUsers: any[];
    private first : number;
    private groupFirst : number;
    private isShowTree : boolean  = true;
    private userListClass : string = "col-md-10";
    private isShowBorder : boolean;
    private entityInfo : any;
    private groupList : any;
    private showHeading : boolean = false;
    private selectedOrg : any;

    constructor(private contactsDataService : ContactsDataService,
                private router : Router,
                private injector: Injector,
                private route : ActivatedRoute,
                private popupService: PopupService,
                private breadcrumbService: BreadcrumbService,
                private renderer: Renderer,
                private titleService : Title,
                private cacheService : CacheService) { 
    }

    ngOnInit() {

      this.toolbarConfigs = [
        {
          label: "添加",
          handler: this.createUser.bind(this),
          iocn:"glyphicon glyphicon-plus",
        },
        {
          label: "删除",
          handler: this.deleteUsers.bind(this),
           iocn:"glyphicon glyphicon-minus",
        },
        {
          type: "search",
          handler: this.searchUsers.bind(this),
          align: "right"
        }
      ]

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
      //初始化selectUser
      this.selectedUser = [];
      this.addUserList = [];
      this.searchKeyWord = '';
      this.users = [];
      this.groupList = [];
      //用于组织添加时候的UserList列表
      this.groupUsers = []
      this.isShowBorder = true;
      this.query = {
        pageNum : 1,
        pageSize : 10
      }
      this.groupId = '';
      this.titleService.setTitle('用户列表');
      this.first = 0;
      this.groupFirst = 0;
      this.emptyMessage = '没有数据';

      this.filter = {
        'pageSize' : this.query.pageSize,
        'pageNum' : this.query.pageNum,
        'searchKeyWord' : this.searchKeyWord,
      }

      //根据路由判断的是组织还是角色
      if(this.router.isActive('main/contacts/org',false)){

        this.groupType = 'org';
        this.groupCommonFunc();
        this.groupName = '组织';

      }else if(this.router.isActive('main/contacts/role',false)){

        this.groupType = 'role';
        this.groupName = '角色'
        this.groupCommonFunc();

      }else if(this.router.isActive('main/contacts/user',false)){
        this.isShowTree = false;
        this.groupName = '所有成员';
        this.userListClass = 'col-md-12';
        this.isShowBorder = false;
        this.groupType = 'user';

      }else{
        //如果都不是的话，就默认走组织。
        this.groupType = 'org';
      }

      if(this.cacheService.get('userFilter')){
        this.filter = this.cacheService.get('userFilter');
        this.first = this.cacheService.get('userFirst')?this.cacheService.get('userFirst'):0;        
        this.toolbarConfigs.forEach(i =>{
        if(!i.type){return;}
        if(i.type ==='search'){i.value = this.filter['searchKeyWord'];}

        });
      }
      this.cacheService.remove('userFilter')
      this.cacheService.remove('userFirst')
      this.getUserListFunc(this.filter);  
    }

    ngAfterViewInit() {
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
          this.showHeading = false;
        });
    }

    ngOnDestroy() {
        //remove event listener
        if(this.documentClickListener) {
            this.documentClickListener();
        }
    }

    paginate(event,type){

      if(type == 'addGroupUser'){
        this.groupFirst = event.first;
        this.groupPage.pageNum = event.page + 1;
        this.groupPage.pageSize = event.rows;
      }else{      
        this.first = event.first;
        this.query.pageNum = event.page + 1;
        this.query.pageSize = event.rows;
        this.cacheService.put('userFirst',this.first)  
      }
      this.getPagingData(type);
    }


    createUser(){
      if(this.groupId == ''){
        this.router.navigateByUrl("/main/contacts/user/op/create");
         // this.router.navigate(['../op/add'],{relativeTo: this.route});

      }else{
        this.addUserList = [];
        // this.displayDialog = true;
        this.groupPage = {
          pageSize : 10,
          pageNum : 1
        }
        this.groupFilter = {
          'pageSize' : this.groupPage.pageSize,
          'pageNum' : this.groupPage.pageNum,
          'searchKeyWord' : this.groupSearchKeyWord
        }
        this.getNotUserListByGroupFunc(this.groupId,this.groupFilter)
      }
    }
    
    deleteUsers() {
        if(this.selectedUser.length == 0){
          return;
        }
        this.popupService.confirm({
          header: '删除用户',
          message: '你确定要删除选中的用户吗',
          accept: () => {
             let ids = [];
             this.selectedUser.forEach(user => {
               ids.push(user.userId);
             })
             if(this.groupId == '' || this.groupId == 'main'){

               this.contactsDataService.batchDeleteUsers(ids.join(','))
               .then(() => {
                  this.selectedUser = [];
                  this.getUserListFunc(this.filter);
               })
               .catch(oError => {
                  this.selectedUser = [];
                  this.popupService.showError(oError);
               });
             }else{
               let funcName = this.groupType == 'org'  ? 'ADD_USERS_BY_ORG' : 'ADD_USERS_BY_ROLE',
               users  = {
                 operation : 'Delete',
                 userId : ids
               }
               this.contactsDataService.addUserByGroup(funcName,this.groupId,users)
               .then(() => {
                 this.selectedUser = [];
                 this.getUserListFunc(this.filter);
               })
               .catch(oError => {
                  this.selectedUser = [];
                  this.popupService.showError(oError);
               });
             }
          }
        });
        
    }

    editUser(event){
      this.cacheService.put('userFilter',this.filter)
      this.router.navigateByUrl("/main/contacts/user/op/edit/" + event.userId);
    }

    addGroup(){
      let grouoId = this.groupId == '' ? 'entity' : this.groupId
      this.router.navigate(['../' , grouoId , 'op','create'],{relativeTo: this.route});
    }


    deleteGroup(){
      this.popupService.confirm({
            header: this.groupType == 'org' ? '删除组织' : '删除角色',
            message: '你确定要删除吗?',
            accept: () => {
                if(this.groupId != 'list'){
                  let groupFunc = this.groupType == 'org' ? 'deleteUnit' : 'deleteRole'
                  this.contactsDataService[groupFunc](this.groupId).then(() => {
                    this.groupCommonFunc();
                    this.showHeading = false;
                  }).catch((oError) => {
                   this.popupService.showError(oError);
                  })
                }
            }
        });
    }

    editGroup(){
      if(this.groupId != ''){
        // this.router.navigateByUrl("/home/contacts/group/" + this.groupType +"/op/edit/" + this.groupId);
        this.router.navigate(['../' , 'op','edit' , this.groupId],{relativeTo: this.route});
      }
    }

    

    getPagingData(type){
       if(type == 'listUser'){
         this.filter.searchKeyWord = this.searchKeyWord;
         this.filter.pageNum = this.query.pageNum;
         this.filter.pageSize = this.query.pageSize;
         this.getUserListFunc(this.filter);
       }else{
         this.groupFilter.searchKeyWord = this.groupSearchKeyWord;
         this.groupFilter.pageNum = this.groupPage.pageNum;
         this.groupFilter.pageSize = this.groupPage.pageSize;
         this.getNotUserListByGroupFunc(this.groupId,this.groupFilter);
       }

    }

   /*
    * 格式化用户数据，data.
    * type 判断是列表用户，还是group用于添加的用户
   */
    formatData(data,type){
      let userList = [];
      if(type == 'listUser'){
        this.totalRecords = data.totalElements;
         data.content.forEach(user =>{
          let roleList = [],orgList = [];
            user.userGroups.forEach(group => {
               orgList.push(group.name);
            })

            user.userRoles.forEach(role => {
              roleList.push(role.name)
            })
            let userInfo = {
               userId : user.id,
               name : user.nickName,
               mobile:user.mobile,
               email : user.email,
               status : user.status != 'Disabled' ? '已启用' : '已禁用',
               roles : roleList.join(','),
               orgs : orgList.join(',')
            }
            userList.push(userInfo);
         })
        this.users = userList;
      }else{
        this.totalGroupRecords = data.totalElements;
        data.content.forEach(user =>{
            let userInfo = {
               userId : user.id,
               name : user.nickName,
               mobile:user.mobile,
               email : user.email,
            }
            userList.push(userInfo);
         })
        this.groupUsers = userList;
        if(!this.displayDialog){
          this.displayDialog = true;
        }
      }
      
  }

  //
  getUserListFunc(filter){
    filter.searchKeyWord = filter.searchKeyWord.trim();
    if(this.groupType == 'user' || this.groupId == 'entity' || this.groupId == ''){
        this.contactsDataService.getUseListData(encodeURIComponent(JSON.stringify(filter)))
        .then(users => {
          this.formatData(users,'listUser')
        })
        .catch(oError => {
          this.popupService.showError(oError);
        })
      }else{
        let groupFunc = this.groupType == 'org' ? 'GET_BY_ORG_USERS_LIST' : 'GET_BY_ROLE_USERS_LIST'
        this.contactsDataService.getUserListByGroup(groupFunc,this.groupId,encodeURIComponent(JSON.stringify(filter)))
        .then(users => {
          this.formatData(users,'listUser')
        })
        .catch(oError => {
          this.popupService.showError(oError);
        })
      }
  }

  //组织中，查询不存在的userList
  getNotUserListByGroupFunc(groupId,filter){
      filter.searchKeyWord = filter.searchKeyWord.trim();
      let groupFunc = this.groupType == 'org' ? 'GET_ORG_NOT_USERLIST' : 'GET_ROLE_NOT_USERLIST'
      this.contactsDataService.getUserListNotGroup(groupFunc,groupId,encodeURIComponent(JSON.stringify(filter)))
      .then(users => {
        this.formatData(users,'addGroupUser')
      })
      .catch(oError => {
        this.popupService.showError(oError);
      })
      
  }

  setTextOverFlowStyle(){
    let style = {
      'text-overflow' : 'ellipsis',
      'overflow': 'hidden',
      'white-space': 'nowrap'
    };
    return style;
  }

  searchUsers(searchValue){
    //搜索默认第一页
    this.first = 0;
    this.searchKeyWord = searchValue;
    this.filter.searchKeyWord = this.searchKeyWord;
    this.filter.pageNum = 1;
    this.filter.pageSize = parseInt(this.query.pageSize);
    this.getUserListFunc(this.filter);
  }

  orderBy(event,type){
    if(type == 'addGroupUser'){
      this.groupFilter = {
        searchKeyWord : this.groupSearchKeyWord,
        pageNum : this.groupPage.pageNum,
        pageSize : parseInt(this.groupPage.pageSize),
        orderItem : {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
      }
      this.getNotUserListByGroupFunc(this.groupId,this.groupFilter);
    }else{
      this.filter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : this.query.pageNum,
        pageSize : parseInt(this.query.pageSize),
        orderItem : {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
      }
      this.getUserListFunc(this.filter);
    }
  }

  //用于组织/角色弹出后选择
  onRowSelect(event){
    let isExist = false;
    //遍历addUserList中是否有选中的 有的话就删除 没有就添加
    this.addUserList.forEach(user => {
       if(user.userId == event.data.userId){
          isExist = true;
          let index = this.addUserList.indexOf(user);
          //删除符合的数据
          this.addUserList.splice(index,1)
       }
    })
    if(!isExist){
      this.addUserList.push(event.data);
    }
  }

  chooseConfirm(){
    let addGroupUserFunc = this.groupType == 'org' ? 'ADD_USERS_BY_ORG' : 'ADD_USERS_BY_ROLE',
    userIds = [],
    users = {
      operation : 'New',
      userId : []
    };
    userIds = this.addUserList.map(user => {
      return user.userId;
    })
    users.userId = userIds;
    this.contactsDataService.addUserByGroup(addGroupUserFunc,this.groupId,users)
        .then(() => {
           this.getUserListFunc(this.filter);
        })
        .catch(oError => {
          this.popupService.showError(oError);
        })
    this.displayDialog = false;
  }

  close(){
    this.displayDialog = false;
  }

  groupSearchUsers(){
    //搜索默认第一页
    this.groupFirst = 0;
    this.groupFilter.searchKeyWord = this.groupSearchKeyWord;
    this.groupFilter.pageNum = 1;
    this.groupFilter.pageSize =  parseInt(this.groupPage.pageSize);
    this.getNotUserListByGroupFunc(this.groupId,this.groupFilter);
  }

  removeSeletedItem(index){
    this.addUserList.splice(index,1);
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

  //点击树形触发事件
  nodeSelect(event) {
    if(event.node.type == 'entity'){
      this.groupId = '';
      this.groupName = this.groupType == 'org' ? '组织' : '角色'
      this.getUserListFunc(this.filter);
    }else{
      this.groupId = event.node.id;
      // this.groupName = event.node.label
      this.getUserListFunc(this.filter);
    }
  }

  //展开后查询子组织/角色
  nodeExpand(event){
    //如果类型是entity 不做任何操作
    if(event.node.type != 'entity'){
      event.node.children = [];
      let funcName = this.groupType == 'org' ? 'getUnitSubList' : 'getRoleSubList'
      this.contactsDataService[funcName](event.node.id)
          .then(data => {
            this.formatGroupList(data);
            event.node.children = data;
          })
          .catch(oError => {
            this.popupService.showError(oError);
          })
    }
  }

  //获取组织/角色跟组织/角色搜索
  groupCommonFunc(){
    let funcName = this.groupType == 'org' ? 'getOrgData' : 'getRoleData';
    this.getGroupList(funcName);
    //用户过滤的数据
      this.getFilterGrouoName();
  }

  //获取组织/角色跟组织/角色搜索
  getGroupList(funcName){
    this.contactsDataService[funcName]().then(orgs => {
      this.formatGroupList(orgs);
      this.entityInfo[0].children = orgs;
    });
  }

  //用于用户组织/角色的搜索
  getFilterGrouoName(){
    let filterNumFunc = this.groupType == 'org' ? 'getUnitListSameLevel' : 'getRoleListSameLevel';
    this.contactsDataService[filterNumFunc]().then(data => {
      data.forEach(item => {
        item.type = this.groupType;
      })
      this.groupList = data;
    }).catch(oError => {
       this.popupService.showError(oError);
    })
  }

  formatGroupList(data){
    data.forEach(item => {
      item.expandedIcon = 'fa-folder-open';
      item.collapsedIcon = 'fa-folder';
      // item.leaf = false;
      item.leaf = !item.hasNextLevel;
      item.label = item.name;
    })
  }

  //显示组织角色下拉列表
  toggleHeading() {
    this.showHeading = !this.showHeading;
  }

  //搜索组织/角色
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
}
