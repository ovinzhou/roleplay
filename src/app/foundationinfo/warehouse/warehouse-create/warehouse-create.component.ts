import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router , ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/primeng';
import { Location } from '@angular/common';
import { EntityDetailService } from 'core/entity/entity-detail.service';
import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';
import { UserLoginService } from 'core/user-login/user-login.service'
import { FoundationinfoService } from '../../foundationinfo-data.service';

@Component({
  selector: 'app-warehouse-create',
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.css']
})

export class WarehouseCreateComponent implements OnInit {

	  private data : any;
    private index : any = 1;
    private emptyMessage : string;
    private provinceList : any;
    private modifyContactList : any;
    private displayDialog : boolean = false;
    private addUserList : any;
    private contactList : any;
    private groupPage : any;
    private groupFilter : any;
    private groupSearchKeyWord : string = '';
    private groupUsers : any;
    private totalGroupRecords : string = "0";
    private groupFirst : number = 1;
    private contactId : any;
    private selectedUser : any;//选取的联系人
    private isUpdate : boolean = false;
    private tempString : any;
    private id : string;

    constructor(private entityDetailService : EntityDetailService,
                private route : ActivatedRoute,
                private router : Router,
                private popupService : PopupService,
                private titleService : Title,
                private userLoginService : UserLoginService,
                private service : FoundationinfoService,
                private location : Location
               ) { }

    ngOnInit() {
      //省份
      this.contactId = [];
      this.contactList = [];
      this.provinceList = [];
      this.addUserList = [];
      this.selectedUser = [];
      // Promise.resolve()
      //初始化表格没有数据时显示什么。
      this.emptyMessage = '没有数据.'
	  	this.titleService.setTitle('新增仓库');
      let addrInfo = {
        //地址类型
        selectedAddrType : [],
        //联系人数组
        contactList:[],
        citiesList:[],
        areaList : [],
        operation:'New',
        addressRange : 'CHINA',
        //当前省份
        province:'',
        //当前城市
        cities:'',
        //当前区县
        area:'',
        //从服务器获取的china所有省份
        activeProvince:[],
        //从服务器获取的对应城市的区县
        activeArea:[],
        //从服务器获取的对应省份下的城市
        activeCity:[],
        addressContent:[],
        //详细地址
        addrDetail:"",
        //主体地址
        mainaddress:"",
        //办公电话
        officeTel:"",
        //传真
        fax:"",
        //选取的联系人
        selectedUser:[],
      }
       this.data = addrInfo;
       this.route.params.subscribe(params => {
       var operation = params['operation'];
       if('edit' === operation){
        this.isUpdate = true;
        this.id = params['id']
        this.service.getWareHouseinfo(params['id']).then(data=>{
          var content = [];
          content = data.content.split(",")
          this.data = {
                citiesList:[],
                areaList : [],
                addressRange : data.range,
                //当前省份
                province:"",
                //当前城市
                cities:"",
                //当前区县
                area:"",
                //从服务器获取的china所有省份
                activeProvince : [],
                //从服务器获取的对应城市的区县
                activeArea:[],
                //从服务器获取的对应省份下的城市
                activeCity:[],
                addressContent:[],
                //详细地址
                addrDetail:"",
                //主体地址
                mainaddress:data.name,
                //办公电话
                officeTel:data.officeTel,
                //传真
                fax:data.fax,
                //选取的联系人
                selectedUser:[],
            }
             this.contactList = data.subjectStroageContactRps
                  if(data.range == 'CHINA'){
                 //回显省份 并查询下拉列表
                 if(content[0] != ''){
                   this.entityDetailService.getProvincesList().then(data => {
                      let provinceList = [];
                      data.forEach(item => {
                        provinceList.push({
                          id:item.provinceid,
                          text : item.province
                        })
                      })
                      this.provinceList = provinceList;
                      let province = this.provinceList.find(i => {
                        return i.text == content[0]
                      })
                      this.data.activeProvince = province ? [province] : [];
                      this.data.province = content[0];
                    });
                  }
                 if(content[1] != '' && data.provinceId != null){
                   //查询城市下拉列表
                   this.entityDetailService.getCitiesList(data.provinceId).then(data => {
                     let cityList = [];
                      data.forEach(item => {
                        cityList.push({
                          id:item.cityid,
                          text : item.city
                        })
                      })
                      this.data.citiesList = cityList;
                     
                      let city = this.data.citiesList.find(i => {
                        return i.text == content[1]
                      })

                      this.data.activeCity = city ? [city] : [];
                      this.data.cities = content[1];

                      
                   })
                   .catch((oError) => {
                     this.popupService.showError(oError);
                   })
                 }
                 if(content[2] != '' && data.cityId != null){
                    this.entityDetailService.getAreaList(data.cityId).then(data => {
                      let areaList = []
                        data.forEach(item => {
                          areaList.push({
                             id : item.id,
                             text : item.name
                          })
                      })
                      this.data.areaList = areaList;
                       console.log(this.data.areaList)
                      let area = this.data.areaList.find(i => {
                        return i.text == content[2]
                      })
                      this.data.activeArea = area ? [area] : [];
                      this.data.area = content[2];

                    })
                    .catch((oError) => {
                      this.popupService.showError(oError);
                    })
                  }
                 this.data.addrDetail = content[3];

              }else{
                 this.data.addrDetail = data.content;
              }
           }).catch(res => this.popupService.showError(res))

       }
    })
         console.log(this.data.areaList)
         if (this.isUpdate) {
           this.titleService.setTitle('修改仓库')
         }
  	  
         if(this.provinceList.length == 0){
         this.entityDetailService.getProvincesList()
         .then(data => {
           //因为后台存储的是中文。所以value,label 都存中文
           let province = [];
           data.forEach(item => {
             province.push({
               id:item.provinceid,
               text : item.province
             })
           })
           this.provinceList = province
         })
         .catch(() => {
           console.log('出错啦！！！');
         })
      }
    }

    addConstacts(addr){
      console.log('添加联系人')
      this.addUserList = [];
      
      this.initGroupFilter();
      this.getPagingData();

      this.index++;
    }

    deleteContacts(addr){
      console.log('删除联系人')
      if(this.selectedUser.length == 0){
        this.popupService.alert("请至少选择一个联系人")
        return;
      }
      
      // this.selectedUser.forEach(selectAddr => {
      //   this.contactList.splice(selectAddr,1)
      // });


      this.selectedUser.map(s =>{
        this.contactList = this.contactList.filter(i=> { return i.id!=s.id});
      });



      this.selectedUser = [];
    }
    //初始化
    initGroupFilter(){
            this.groupPage = {
                    pageSize : 10,
                    pageNum : 1
                  }
            //this.groupFilter = '&pageSize=' + this.groupPage.pageSize + '&pageNum=' + this.groupPage.pageNum + '&searchKeyWord=' + this.groupSearchKeyWord
              
            this.groupFilter = {
              'pageSize' : this.groupPage.pageSize,
              'pageNum' : this.groupPage.pageNum,
              'searchKeyWord' : this.groupSearchKeyWord
            }
    }

    onSubmit(bizForm){
            //地址校验
            
           let addr =true;
           
              //校验国内的
              if(this.data.addressRange == 'CHINA' && (this.data.province == '' ||  this.data.cities == '' ||  this.data.area == '')){
                   addr = false
              }
           
              //校验联系人名称必填

              // this.data.contactList.map(item => {
              //   if(item.nickName == ''){
              //     addr = false;
              //     this.popupService.alert('联系人名称必填');
              //   };
              // })
              this.router.isActive('',true);
           
           if(!addr){
             return;
           }
          
           if(!bizForm.form.valid){
             return;
           }

           if (this.data.addrDetail == "") {
             return;
           }

           this.onSubmitAfterUpload();
        }
    onSubmitAfterUpload(){
        console.log('数据校验通过')
        this.contactId = [];
        this.contactList.map(item=>{
           this.contactId.push(item.id)
         })
        //配置参数
        let parameter = {
          content : String,
          name : String,
          fax : String,
          officeTel : String,
          range : String,
          type : String,
          userIds : []
        }

        var contentList = []
        contentList = [this.data.province,this.data.cities,this.data.area,this.data.addrDetail]
        parameter.name = this.data.mainaddress
        parameter.fax = this.data.fax
        parameter.officeTel = this.data.officeTel
        parameter.range = this.data.addressRange,
        parameter.type = this.data.addressRange
        if (this.data.addressRange === "CHINA") {
          this.tempString =  contentList.join(",");
          parameter.content = this.tempString;
        }else{
          parameter.content = this.data.addrDetail
        }
        
        parameter.userIds = this.contactId

        if (this.isUpdate) {
          this.service.updateWareHouse(this.id,parameter)
          .then(data=>this.location.back())
          .catch(res =>this.popupService.showError(res));
        }else{
          this.service.addWareHouse(parameter)
          .then(data=>this.location.back())
          .catch(res =>this.popupService.showError(res));
        }

        
    }

    setTextOverFlowStyle(){
    let style = {
      'text-overflow' : 'ellipsis',
      'overflow': 'hidden',
      'white-space': 'nowrap'
    };
    return style;
    }

    //添加联系人取消
    close(){
    this.displayDialog = false;
    }

    //移除添加联系人/已选
    removeSeletedItem(index){
    this.addUserList.splice(index,1);
    }

    //联系人列表的搜索
    groupSearchUsers(){
      //搜索默认第一页
      this.groupFirst = 0;
      this.groupFilter.searchKeyWord = this.groupSearchKeyWord.trim();
      this.groupFilter.pageNum = 1;
      this.groupFilter.pageSize =  parseInt(this.groupPage.pageSize);
      this.getPagingData();
    }

    //翻页
    paginate(event,type){
    this.groupFirst = event.first;
    this.groupPage.pageNum = event.page + 1;
    this.groupPage.pageSize = event.rows;
    this.getPagingData();
    }

    onKeydown(configItem){
      if (event["key"] == "Enter") {
        this.groupSearchUsers();
      }
    }

    //获取联系人列表
    getPagingData(){
     this.groupFilter.searchKeyWord = this.groupSearchKeyWord.trim();
     this.groupFilter.pageNum = this.groupPage.pageNum;
     this.groupFilter.pageSize = this.groupPage.pageSize;
     //this.groupFilter = '&pageSize=' + this.groupPage.pageSize + '&pageNum=' + this.groupPage.pageNum + '&searchKeyWord=' + this.groupSearchKeyWord
     this.contactList.map(item=>{
       this.contactId.push(item.id)
     })
     var contactIdString : string;
     contactIdString = this.contactId.join(",");

     this.getNotUserListByGroupFunc(contactIdString,this.groupFilter);
    }

    //过滤掉已经选取的联系人列表
    getNotUserListByGroupFunc(contactId,groupFilter){
      this.service.getNotExistUserList(contactId,groupFilter).then(data=>{
      this.formatData(data);
      this.displayDialog = true;
    });
    }

    //格式化数据
    formatData(data){
        this.totalGroupRecords = data.totalElements;
        data.content = data.content === null?[]:data.content;
        this.groupUsers = data.content;
    }

    //确定选择联系人
    chooseConfirm(){
      if (this.addUserList.length === 0) {
          this.popupService.alert("请至少选择一个联系人")
        return;
      };

      this.addUserList.map(item=>{
        this.contactList.push(item)
      })
      console.log(this.contactList)
      this.displayDialog = false;
    }

    /**
    * [onCancel 取消]
    */
    public onCancel():void{
    this.location.back(); 
    };

refreshValue(type,event , addr){
      switch (type) {
        case "province":
          if(addr.province != event.text){
            addr.citiesList = [];
            addr.areaList = [];
            addr.cities = '';
            addr.area = '';
            addr.activeArea = [];
            addr.activeCity = [];
          }
          addr.province = event.text;
          this.entityDetailService.getCitiesList(event.id)
          .then(data => {
            let cityList = [];
            data.forEach(item => {
              cityList.push({
                id:item.cityid,
                text : item.city
              })
            })
            addr.citiesList = cityList;
          })
          .catch((oError) => {
             this.popupService.showError(oError);
          })
          break;
        case "city":
          if(addr.cities != event.text){
            addr.areaList = [];
            addr.area = '';
            addr.activeArea = [];
          }
          addr.cities = event.text;
          this.entityDetailService.getAreaList(event.id)
          .then(data => {
             let areaList = [];
             data.forEach(item => {
               areaList.push({
                 id : item.id,
                 text : item.name
               })
             })
             addr.areaList = areaList;
          })
          .catch((oError) => {
             this.popupService.showError(oError);
          })
          break;
        case "area":
          addr.area = event.text;
          break;
        default:
          break;
      }
      
    }
}
