import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { FormGroup} from '@angular/forms';
import {TreeNode} from 'primeng/primeng';
import { ContactsDataService } from '../../contacts-data.service';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'biz-create',
  templateUrl: './biz-create.component.html',
  styleUrls : ['./biz-create.component.scss'],
  animations: [
  ]
})
export class BizCreateComponent implements OnInit {
    private data : any ;
    private operation : string;
    private isAddr : boolean;
    private addressList : any;
    private modifyContactList : any;
    private modifyAddressList : any;
    private index : any = 1;
    private principalList : any;
    private principal : string;
    private emptyMessage : string;
    //省份级联
    private provinceList : any;
    selectedRelationType: any = [];
    //用于存放已勾选的标签
    private existRelationType : any = [];
    private activeItem : any;
    private defaultAddr : any;

    constructor(private contactsDataService : ContactsDataService,
                private route : ActivatedRoute,
                private router : Router,
                private popupService : PopupService,
                private titleService : Title) { 
      
    }

    ngOnInit() {
      this.route.params.subscribe(params => {this.operation = params['operation']});
      this.isAddr = false;
      //用于记录默认地址
      this.defaultAddr = {};
      //用于记录删除的联系人
      this.modifyContactList = [];
      //用于存储修改的主体地址
      this.modifyAddressList = [];
      this.principalList = [];
      //初始化省份级联
      this.provinceList = [];
      this.addressList = [];
      this.data = {};
      //初始化表格没有数据时显示什么。
      this.emptyMessage = '没有数据.';
      this.titleService.setTitle('添加商业圈');
      //负责人回显作用
      this.activeItem = [];
      //加载负责人
      this.contactsDataService.getPrincipalList().then(data => {
        let principalList = []
        data.forEach(item => {
          principalList.push({
            text:item.nickName,
            id:item.id

          })
        });
        this.principalList = principalList;
      }).then(() => {
        //判断是否是修改。
        if(this.operation){
          this.route.params
          .switchMap(params => this.contactsDataService.getBizInfo(params['bizId']))
          .subscribe(data => {
            this.data = {
               bizName : data.name,
               shortName : data.shortName,
               id : data.id,
               identifyId : data.identifyId
            }
            //回显标签
            this.selectedRelationType = data.tags;
            //将已在后台的标签保存，在提交的时候做操作
            this.existRelationType = data.tags.slice(0);
            let activeItem = this.principalList.find(item => {
              return item.id == data.principal;
            })
            //回显
            this.activeItem = activeItem ? [activeItem] : [];
            this.principal = data.principal;
            //初始化主体地址
            data.addresses.forEach(item => {
              this.isAddr = true;
              let addrInfo = {
                id: '',
                fax: '',
                officeTel : '',
                addressRange : '',
                addressName : '',
                province:'',
                cities:'',
                citiesList:[],
                areaList:[],
                area:'',
                addrDetail:'',
                selectedAddrType:[],
                contactList : [],
                activeProvince:[],
                activeArea:[],
                activeCity:[],
                default:false,
                defaultName : '设为默认'
              };
              addrInfo.id = item.id;
              addrInfo.fax = item.fax;
              addrInfo.officeTel = item.officeTel;
              addrInfo.addressRange = item.range;
              addrInfo.addressName  = item.name;

              if(item.range == 'CHINA'){
                 //回显省份 并查询下拉列表
                 item.addressContent = item.content.split(',');
                 if(item.addressContent[0] != ''){
                   this.contactsDataService.getProvincesList().then(data => {
                     let provinceList = [];
                      data.forEach(item => {
                        provinceList.push({
                          id:item.provinceid,
                          text : item.province
                        })
                      })
                      this.provinceList = provinceList;
                      let province = this.provinceList.find(i => {
                        return i.text == item.addressContent[0]
                      })
                      addrInfo.activeProvince = province ? [province] : [];
                      addrInfo.province = item.addressContent[0];
                    });
                  }
                 if(item.addressContent[1] != '' && item.provinceId != null){
                   //查询城市下拉列表
                     this.contactsDataService.getCitiesList(item.provinceId).then(data => {
                       let cityList = [];
                        data.forEach(item => {
                          cityList.push({
                            id:item.cityid,
                            text : item.city
                          })
                        })
                        addrInfo.citiesList = cityList;
                        let city = addrInfo.citiesList.find(i => {
                          return i.text == item.addressContent[1]
                        })
                        addrInfo.activeCity = city ? [city] : [];
                        addrInfo.cities = item.addressContent[1];

                     })
                     .catch((oError) => {
                       this.popupService.showError(oError);
                     })
                 }
                 if(item.addressContent[2] != '' && item.cityId != null){
                      this.contactsDataService.getAreaList(item.cityId).then(data => {
                          let areaList = []
                          data.forEach(item => {
                            areaList.push({
                               id : item.id,
                               text : item.name
                            })
                        })
                        addrInfo.areaList = areaList;
                        let area = addrInfo.areaList.find(i => {
                          return i.text == item.addressContent[2]
                        })
                        addrInfo.activeArea = area ? [area] : [];
                        addrInfo.area = item.addressContent[2];

                      })
                      .catch((oError) => {
                        this.popupService.showError(oError);
                      })
                  }
                 addrInfo.addrDetail = item.addressContent.slice(3,item.addressContent.length).join(',')
              }else{
                 addrInfo.addrDetail = item.content;
              }
              addrInfo.contactList = item.contacts;
              addrInfo.contactList.forEach(value => {
                 // value.mobile = value.contactMobile;
                 // value.email = value.contactEmail;
                 value.nickName = value.name;

              })
              addrInfo.selectedAddrType=item.type.split(',');
              if(item.addressMain == 'MAIN'){
                addrInfo.default = true;
                addrInfo.defaultName = '默认地址';
                this.defaultAddr = addrInfo;
              }
              this.addressList.push(addrInfo);
            });
          });
          this.titleService.setTitle('修改商业圈');
        }
      });
    }
    onSubmit(bizForm){
       //标签校验,负责人必填校验
       if(this.selectedRelationType.length == 0 || !this.principal){
          return;
       }
       //校验是否有默认地址
       if(this.defaultAddr && !this.defaultAddr.default && this.addressList.length > 0){
         this.popupService.alert('请选择一个默认地址');
         return;
       }
       //地址校验
       let addr =true;
       this.addressList.forEach(address => {
          //校验国内的
          if(address.addressRange == 'CHINA' && (address.province == '' ||  address.cities == '' ||  address.area == '')){
               addr = false
          }

          if(address.selectedAddrType.length == 0 ){
            addr = false;
          }
          // let is
          //校验联系人名称必填

          address.contactList.map(item => {
            if(item.nickName == ''){
              addr = false;
              this.popupService.alert('联系人名称必填');
            };
          })


       })
       if(!addr){
         return;
       }

       if(!bizForm.form.valid){
         return;
       }


       //格式化地址
       this.addressList.forEach(addr => {
          if(addr.operation){
            return;
          }
          addr.operation = "Modify";
          this.modifyAddressList.push(addr);
       })

       this.modifyAddressList.forEach(modifyAddr => {
         if(modifyAddr.operation != 'Delete'){
            if(modifyAddr.selectedAddrType.length > 0 ){
              modifyAddr.type = modifyAddr.selectedAddrType.join(',');
            }
            modifyAddr.addressMain = modifyAddr.default ? 'MAIN' : 'COMMON'
            //判断是国内还是国外
            if(modifyAddr.addressRange == 'CHINA'){
              modifyAddr.content = modifyAddr.province + ',' + modifyAddr.cities + ',' + modifyAddr.area + ',' + modifyAddr.addrDetail;
            }else{
              modifyAddr.content = modifyAddr.addrDetail;

            }
            modifyAddr.range = modifyAddr.addressRange;
            modifyAddr.name = modifyAddr.addressName;
            delete modifyAddr.areaList;
            delete modifyAddr.citiesList;
            modifyAddr.contactList.forEach(contact =>{
               if(!contact.operation){
                 contact.operation = 'Modify';
               }
               contact.name = contact.nickName;
            })
            //添加已经删除的联系人
            this.modifyContactList.forEach(delItem => {
              modifyAddr.contactList.push(delItem);
            })
            modifyAddr.contacts = modifyAddr.contactList;
         }
       })
       let modifiedBizInfo = {
         id:this.data.id,
         identifyId : this.data.identifyId,
         name : this.data.bizName,
         shortName : this.data.shortName,
         tags : [],
         principal : this.principal,
         addresses : this.modifyAddressList
       }

       //給后台传值需要加上operation，查看是否是添加还是修改
       this.selectedRelationType.forEach(type => {
         let exist = this.existRelationType.includes(type);
         if(exist){
            modifiedBizInfo.tags.push({
              operation : 'Modify',
              type : type
            })
         }else{
            modifiedBizInfo.tags.push({
              operation : 'New',
              type : type
            })
         }
       })
       // 查看是删除的标签数据
       this.existRelationType.forEach(type => {
         let exist = this.selectedRelationType.includes(type);
         if(!exist){
           modifiedBizInfo.tags.push({
              operation : 'Delete',
              type : type
            })
         }
       })
       this.contactsDataService.addBizInfo(modifiedBizInfo).then(() =>{
          this.router.navigateByUrl("/main/contacts/biz/all");
          // this.router.navigate(['../all'],{relativeTo: this.route});
       }).catch(oError => {
          this.popupService.showError(oError);
       })

    }

    setStyles(){
     let styles = {
          'width':'250px',
          'height':'300px'

        };
        return styles;
    }


    addAddr(){
      this.isAddr = true;
      let addrInfo = {
        selectedAddrType : [],
        contactList:[],
        selectedUser:[],
        citiesList:[],
        areaList : [],
        operation:'New',
        addressRange : 'CHINA',
        province:'',
        cities:'',
        area:'',
        activeProvince:[],
        activeArea:[],
        activeCity:[],
        default:false,
        defaultName:'设为默认'

      }
      if(this.addressList.length == 0){
        addrInfo.default = true;
        addrInfo.defaultName = '默认地址';
      }
      this.addressList.push(addrInfo);
      if(addrInfo.default){
        this.defaultAddr = this.addressList[0];
      }
      this.modifyAddressList.push(addrInfo);
      //如果省份级联没有数据就加载
      if(this.provinceList.length == 0){
         this.contactsDataService.getProvincesList()
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
         .catch(oError => {
           this.popupService.showError(oError);
         })
      }
    }

    deleteAddr(index ,addr){
      if(addr.default){
        this.defaultAddr = {};
      }
      this.addressList.splice(index,1);
      if(addr.operation != 'New'){
        this.modifyAddressList.push({
          id:addr.id,
          operation : 'Delete'
        })
      }
    }

    addConstacts(addr){

      addr.contactList.push(
        {
          operation: 'New',
          id: 'fake_' + this.index,
          //用于校验
          nickName:''
        }
      ) 
      this.index++;
    }

    deleteContacts(addr){
      if(addr.selectedUser.length == 0){
        return;
      }
      addr.selectedUser.forEach(selectAddr => {
         addr.contactList.forEach(value => {
           if(value.id == selectAddr.id){
             let index = addr.contactList.indexOf(value);
             //删除符合的数据
             addr.contactList.splice(index,1);
             //如果是New  不直接删除， 如果不是就往modifyContactList中添加
             if(value.operation != 'New'){
               this.modifyContactList.push({
                 id:value.id,
                 operation : 'Delete'
               });
             }
           }
           return value.id == selectAddr.id
         })
      });
    }

    // getCitiesList(province,addr){
    //   if(province == ''){
    //     addr.cities = '';
    //     addr.citiesList = [];
    //     addr.area = '';
    //     addr.areaList = [];
    //   }
    //   let provinceId = '';
    //   //根据中文遍历出provinceId,查询城市
    //   this.provinceList.forEach(item => {
    //      if(item.value == province){
    //         provinceId = item.provinceid;
    //         return provinceId;
    //      }
    //   })
    //   this.contactsDataService.getCitiesList(provinceId)
    //   .then(data => {

    //     data.forEach(item => {
    //       item.value = item.city
    //       item.label = item.city
    //     })
    //     addr.citiesList = data;
    //     //默认选中第一个
    //     if(addr.citiesList.length > 0){
    //       addr.cities = addr.citiesList[0].value;
    //       this.getAreaList(addr.cities,addr);
    //     }
    //   })
    //   .catch(() => {
    //      console.log('出错啦！！！');
    //   })
    // }

    // getAreaList(city,addr){
    //   let cityId = '';
    //   addr.citiesList.forEach(item => {
    //      if(item.value == city){
    //         cityId = item.cityid;
    //         return cityId;
    //      }
    //   })
    //   this.contactsDataService.getAreaList(cityId)
    //   .then(data => {
    //      data.forEach(item => {
    //         item.value = item.name
    //         item.label = item.name
    //      })
    //      addr.areaList = data;
    //      if(addr.areaList.length > 0){
    //         addr.area = addr.areaList[0].value;
    //      }
    //   })
    //   .catch(() => {
    //      console.log('出错啦！！！');
    //   })
    // }

    toReturn(){
      window.history.go(-1);
    }


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
          this.contactsDataService.getCitiesList(event.id)
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
          .catch(oError => {
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
          this.contactsDataService.getAreaList(event.id)
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

    setPrincipal(event){
      this.principal = event.id;
    }

    onChange(){
      //如果省份级联没有数据就加载
      if(this.provinceList.length == 0){
         this.contactsDataService.getProvincesList()
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
         .catch(oError => {
           this.popupService.showError(oError);
         })
      }
    }

    public setDefaultAddr(index , addr){
      this.defaultAddr.default = false;
      this.defaultAddr.defaultName = '设为默认';
      addr.default = true;
      addr.defaultName = '默认地址';
      this.defaultAddr = addr;
    }
}
