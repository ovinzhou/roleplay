import { Component, OnInit ,Input ,SimpleChange, Injector,ReflectiveInjector } from '@angular/core';

import { Router , ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/api';
import * as PShared from 'primeng/components/common/shared';
import { flyIn } from 'core/animations/fly-in';
import { ContactsDataService } from '../../contacts-data.service';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';
import { CacheService } from 'core/services/cache.service';

@Component({
  selector: 'biz-list',
  templateUrl: './biz-list.component.html',
  styleUrls : ['./biz-list.component.scss'],
  animations: [
    flyIn
  ]
})
export class BizListComponent implements OnInit{
    selectedBiz: any;
    private bizList : any;
    private page : any;
    private totalRecords : string;
    private bizType : string;
    //过滤参数
    private filter : any;
    private searchKeyWord : string;
    selectedRelationType: string[] = [];
    private setLabel : boolean = false;
    private setPrincipals : boolean = false;
    private principalList : any;
    private principal : string;
    toolbarConfigs: any[];
    private emptyMessage : string;
    private first : number;
    private typeName : string = '商业圈';
    private bizItems : any;
    private clickItem : any;

    constructor(private contactsDataService : ContactsDataService,
                private router : Router,
                private route : ActivatedRoute,
                private popupService : PopupService,
                private titleService : Title,
                private cacheService : CacheService
                ) { 
    }

    ngOnInit() {
      //初始化selectedBiz
      this.selectedBiz = []
      this.principalList = [];
      this.searchKeyWord = '';
      this.bizItems = [
        {
          id:'all',
          name:'商业圈'
        },
        {
          id:'cuscomers',
          name:'客户'
        },
        {
          id:'prividers',
          name:'供应商'
        },
        {
          id:'partners',
          name:'合作伙伴'
        },
        {
          id:'shareholders',
          name:'股东'
        }
      ]
      //用来保存点击item之后的对象
      this.clickItem = this.bizItems[0];
      this.first = 0;
      this.page = {
        pageNum : 1,
        pageSize : 10
      }
      this.emptyMessage = '没有数据';
      this.titleService.setTitle("商业圈列表");
      this.toolbarConfigs = [
        {
          label: "添加",
          handler: this.createBusinesszoom.bind(this)
        },
        {
          label: "设置标签",
          handler: this.setLabelPopup.bind(this)
        },
        {
          label: "删除",
          handler: this.deleteBizs.bind(this)
        },
        
        // {
        //   label: "设置负责人",
        //   handler: this.setPrincipalsPopup.bind(this)
        // },
        {
          type: "search",
          handler: this.searchBiz.bind(this),
          align: "right"
        }
      ]

      this.filter = {
        'pageSize' : this.page.pageSize,
        'pageNum' : this.page.pageNum,
        'searchKeyWord' : this.searchKeyWord
      }
      this.bizList = [];
      this.typeName = "商业圈";
      this.bizType = 'all'
      this.selectedBiz = [];

      if(this.cacheService.get('bizFilter')){
        this.filter = this.cacheService.get('bizFilter');
        this.first = this.cacheService.get('bizFirst')?this.cacheService.get('bizFirst'):0;
        this.toolbarConfigs.map(i =>{

        if(!i.type){return;}

        if(i.type ==='search'){i.value = this.filter['searchKeyWord'];}

        });
      }
      this.cacheService.remove('bizFilter')
      this.cacheService.remove('bizFirst')
      this.getBizList(this.filter,this.bizType);
    }

    
    //分页
    paginate(event){
      //event.rows = Number of rows to display in new page
      //event.page = Index of the new page
      //event.pageCount = Total number of pages
      this.first = event.first;
      this.page.pageNum = event.page + 1;
      this.page.pageSize = event.rows;
      this.cacheService.put('bizFirst',this.first)  
      this.getPagingData();
    }


    createBusinesszoom(){
        // this.router.navigateByUrl("/home/contacts/biz/op/create");
         this.router.navigate(['../op/create'],{relativeTo: this.route});
    }


    loadData(event: LazyLoadEvent) {
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort in single sort mode
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec in single sort mode
        //multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
        //filters: Filters object having field as key and filter value, filter matchMode as value
        // this.contactsDataService.getUserData().then(users => this.users = users);
    }

    //格式化列表数据
    formatData(data){
      this.totalRecords = data.totalElements;
       //用来存储bizList
       let bizs = [];
       data.content.forEach(biz =>{
          let bizInfo = {
             identifyId : biz.identifyId,
             id : biz.id,
             name : biz.name,
             shortName:biz.shortName,
             principal : biz.principalName,
             relationType : biz.tags.join(','),
             entityRelId : biz.entityRelId
          }
          bizs.push(bizInfo);
       })
      this.bizList = bizs;
  }

  //往后台查询
  getBizList(filter,bizType){
        filter.searchKeyWord = filter.searchKeyWord.trim();
        if(bizType == 'all'){
          bizType = 'bizcricles';
        }
        this.contactsDataService.getBizList(JSON.stringify(filter),bizType)
        .then(data => {
          this.formatData(data)
        })
        .catch(oError => {
          this.popupService.showError(oError);
        })
     
  }

  //翻页
  getPagingData(){
    this.filter.searchKeyWord = this.searchKeyWord;
    this.filter.pageNum = this.page.pageNum;
    this.filter.pageSize =  parseInt(this.page.pageSize);
    this.getBizList(this.filter,this.bizType);

  }

  //修改biz
  editBiz(event){
    // this.router.navigateByUrl("/home/contacts/biz/op/edit/" + event.data.identifyId);
    this.cacheService.put('bizFilter',this.filter)
    this.router.navigate(['../op/edit/' + event.identifyId],{relativeTo: this.route});
  }

  //弹出设置标签窗口
  setLabelPopup(){
      this.selectedRelationType = [];
     if(this.selectedBiz.length == 0){
       return ;
     }
     this.setLabel = true;
  }

  //关闭弹窗
  close(){
    this.setLabel = false;
    this.setPrincipals = false;
  }

  //点击确定，往后台传数据
  batchSetLabel(){
    let bizList = {},ids = [];
    this.selectedBiz.forEach(biz => {
       ids.push(biz.identifyId);
    })
    bizList = {
      identityIds : ids,
      tags : this.selectedRelationType
    }
    this.contactsDataService.batchSetLabel(bizList)
    .then(() =>{
      this.selectedBiz = [];
      this.filter.pageNum = 1;
      this.getBizList(this.filter,this.bizType);
    })
    .catch(oError => {
      this.popupService.showError(oError);
    });
    this.setLabel = false;
  }

  deleteBizs() {
    if(this.selectedBiz.length == 0){
       return ;
    }
    this.popupService.confirm({
        header: '删除商业圈',
        message: '你确定要删除选中的主体吗',
        accept: () => {
           let ids = [],funcName = '',bizType = '';
           if(this.bizType == 'all'){
             bizType = '';
             this.selectedBiz.forEach(biz => {
               ids.push(biz.identifyId);
             })
             funcName = 'batchAllDeleteBizs';
           }else{
             this.selectedBiz.forEach(biz => {
               ids.push(biz.id);
             })
             bizType = this.bizType;
             funcName = 'batchDeleteBizs';
           }
           this.contactsDataService[funcName](this.bizType,ids.join(','))
           .then(() => {
             this.selectedBiz = [];
             this.filter.pageNum = 1;
             this.getBizList(this.filter,this.bizType);
           })
           .catch(oError => {
             this.popupService.showError(oError);
             this.selectedBiz = [];
           });
        }
    });
  }

  searchBiz(searchValue){
    //搜索默认第一页
    this.first = 0;
    this.searchKeyWord = searchValue;
    this.filter.searchKeyWord = this.searchKeyWord;
    this.filter.pageNum = 1;
    this.filter.pageSize =  parseInt(this.page.pageSize);
    this.getBizList(this.filter,this.bizType);
  }

  //设置负责人弹窗
  // setPrincipalsPopup(){
  //    if(!this.selectedBiz && this.selectedBiz.length == 0){
  //      return ;
  //    }
  //    this.setPrincipals = true;
  //   //如果负责人列表有值，就不查询
  //   if(this.principalList.length == 0 ){
  //      //加载负责人
  //     let principalList = []
  //     this.contactsDataService.getPrincipalList().then(data => {
  //       data.forEach(item => {
  //         principalList.push({
  //           id:item.id,
  //           text:item.nickName
  //         })
  //       });
  //       this.principalList = principalList;
  //    });
  //   }
  // }

  //点击确定后，往后台传参
  batchSetPrincipals(){
    let bizList = {} , ids = [];
    this.selectedBiz.forEach(biz => {
       ids.push(biz.identifyId)
    })
    bizList = {
      identityIds : ids,
      principal : this.principal
    }
    this.contactsDataService.batchSetPrincipal(bizList)
    .then(() =>{
      this.selectedBiz = [];
      this.filter.pageNum = 1;
      this.getBizList(this.filter,this.bizType);
    })
    .catch(oError => {
      this.popupService.showError(oError);
      this.selectedBiz = [];
    });
    this.setPrincipals = false;
  }

  //排序
  orderBy(event){
      this.filter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : this.page.pageNum,
        pageSize : parseInt(this.page.pageSize),
        orderItem : {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
      }
      this.getBizList(this.filter,this.bizType);
  }

  onClick(item){
    if(item.id != this.clickItem.id){
      this.clickItem = item;
      this.bizType = item.id;
      this.typeName = item.name;
      this.getBizList(this.filter,item.id);
    }
  }

}
