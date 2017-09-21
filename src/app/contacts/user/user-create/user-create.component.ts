import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { FormGroup} from '@angular/forms';
import { TreeNode} from 'primeng/primeng';
import { ContactsDataService } from '../../contacts-data.service';
import { DomSanitizer} from '@angular/platform-browser';
import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';
import { Title } from '@angular/platform-browser';
import { UserLoginService } from 'core/user-login/user-login.service';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls : ['./user-create.component.scss'],
  animations: [
  ]
})
export class UserCreateComponent implements OnInit {
    private orgs: TreeNode[];
    private displayDialogOrg: boolean = false;
    private displayDialogRole: boolean = false;
    private data : any ;
    private operation : string;
    //用来存放已存在的角色
    private roles : any[] = [];
     //用来存放已存在的组织
    private units : any[] = [];
    //存放已选择的组织或角色
    private selectedItems : any[]=[];
    private genders : any;
    //用来标识是否显示弹出框
    private dialogTitle  :string ;
    private groupType : string;
    private title : string;
    private statusName : string;
    private status : string;
    //用于存储图片数据
    private formData : any;
    //显示顶部按钮
    private isShowButton : boolean = false;
    uploadedFiles: any[] = [];
    private modifyUnitList : any;
    private modifyRoleList : any;
    private modifySelectItem : any;
    private isUpda : boolean = false;
    private detailUserImage : string = 'assets/img/defaule_user_image.png';
    
    constructor(private contactsDataService : ContactsDataService,
                private route : ActivatedRoute,
                private router : Router,
                private sanitizer : DomSanitizer,
                private popupService:PopupService,
                private titleService : Title,
                private userLoginService : UserLoginService) { 
      
    }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.operation = params['operation'];
      });
      this.title = '编辑用户'
      this.data = {};
      this.modifyUnitList = [];
      this.modifyRoleList = [];
      this.modifySelectItem = [];
      this.statusName = '';
      if(!this.operation){
         this.data = {
           gender: 'MAN'
         }
         this.title = '添加用户'
         this.titleService.setTitle('添加用户');
      }else{
        this.isUpda = true;
        this.titleService.setTitle('编辑用户');
        this.route.params
        .switchMap((params) => this.contactsDataService.getUserInfo(params['userId']))
        .subscribe(user => {
           this.data = {
              gender : user.gender,
              nickName : user.nickName,
              mobile : user.mobile,
              email : user.email,
              userCode : user.code,
              englishName : user.englishName,
              officePhone : user.officePhone,
              userId : user.id,
              files : user.photo == 'assets/img/defaule_user_image.png' ? user.photo : BASE_URL + user.photo ,
              userPictureSrc : user.photo
           }
           this.statusName = user.status != 'Disabled' ? '禁用' : '启用';
           this.status = user.status != 'Disabled' ? 'Disabled' : 'Enabled';
           this.roles = user.userRoles;
           this.units = user.userGroups;
        });
        
      }

    }

    onSubmit(userForm){
      //判断填写表单是否有错，有错直接返回
       if(!userForm.form.valid){
         return;
       }
       if(this.formData){
          this.contactsDataService.uploadAvatar(this.formData).then(data =>{
           this.data.userPictureSrc = data.resourceURI;
           this.onSubmitAfterUpload();
          }).catch(oError => {
             this.popupService.showError(oError);
          });
       }else{
          this.onSubmitAfterUpload();
       }
    }

    onSubmitAfterUpload(){
      let userInfo = {
        'englishName':this.data.englishName,
        'gender':this.data.gender,
        'officePhone':this.data.officePhone,
        'email':this.data.email,
        'mobile':this.data.mobile,
        'nickname':this.data.nickName,
        'code':this.data.userCode,
        'id' : this.data.userId,
        'photo' :this.data.userPictureSrc,
        'userRoles' : this.roles,
        'userGroups' : this.units,
        'invite':this.data.notice
       }
       let groupFunc = this.operation == 'edit' ? 'editUserInfo' : 'addUserInfo',
           isSelf = false;
       //判断是否是修改自己的信息
       if(this.operation == 'edit'){
           this.contactsDataService.getSelfInfo().then(data => {
               isSelf = data.id == this.data.userId ? true : false;
           }).then(() => {
               this.contactsDataService.editUserInfo(this.data.userId,userInfo).then(() => {
                  //如果修改的是自己的
                  if(isSelf){
                    this.userLoginService.loginNotifier.emit({login:true});
                  }
                  this.router.navigate(['/main/contacts','org' ,'userlist']);

               }).catch(oError => {
                  this.popupService.showError(oError);
               })
           })
       }else{
         //如果没有上传的话，保存默认图片路径
         if(!this.formData){
           userInfo.photo = this.detailUserImage;
         }
          this.contactsDataService.addUserInfo(userInfo).then(() => {
              this.router.navigate(['/main/contacts','org' ,'userlist']);
          }).catch(oError =>{
              this.popupService.showError(oError);
          })
       }
    }

    setStyles(){
     let styles = {
          'width':'250px',
          'height':'300px'

        };
        return styles;
    }

    addRole(){
       this.groupType = 'role';
       this.getgroupList('getRoleData','role');
       this.dialogTitle = "角色"
       this.displayDialogRole = true;
       this.selectedItems = this.roles.slice(0);
     }
     
     addUnits(){
       this.groupType = 'org'
       this.getgroupList('getOrgData','org');
       this.dialogTitle = "组织"
       this.displayDialogOrg = true;
       this.selectedItems = this.units.slice(0);
     }

    nodeSelect(event) {
       var isExist = this.selectedItems.find((value) => {
            return value.id == event.node.id;
        })
        if(!isExist){
          if(this.groupType == 'org'){
            this.selectedItems.push({
              id:event.node.id,
              name:event.node.label
            });  
          }else{
            this.selectedItems.push({
              id:event.node.id,
              name:event.node.label
            });
          }
        }
    }

    removeSeletedUnit(index,unit){
       this.units.splice(index,1);
    }

    removeSeletedRole(index,role){
       this.roles.splice(index,1);
    }

    removeSeletedItem(index,item){
       this.selectedItems.splice(index,1);
    }

    chooseConfirm(){
      if(this.dialogTitle == '组织'){
        this.units = this.selectedItems;
      }else{
        this.roles = this.selectedItems;
      }
      this.displayDialogOrg = false;
      this.displayDialogRole = false;
    }

    close(){
      this.displayDialogOrg = false;
      this.displayDialogRole = false;
    }

    //获取groupList
    getgroupList(funcName,group){
      this.contactsDataService[funcName]().then(orgs => {
        this.formatGroupList(orgs,group);
        this.orgs = orgs
      });
    }

    //设置用户状态
    setUserStatus(){
       this.contactsDataService.setUserStatus(this.data.userId,this.status).then(data =>{
         this.statusName = data.status != 'Disabled' ? '禁用' : '启用';
         this.status = data.status != 'Disabled' ? 'Disabled' : 'Enabled';
       }).catch(oError => {
         this.popupService.showError(oError);
       })
    }

    onFileChange(event){
      //将上传的图片回显
      let fileReader = new FileReader(),
      that = this;
      //加载图片为流
      fileReader.onload = function(loadReader : any){
         that.data.files = loadReader.target.result;
      }
      fileReader.readAsDataURL(event.target.files[0]);
      //formData 是后台需要的图片数据
      let formData: FormData = new FormData(); 
      formData.append('file', event.target.files[0]);
      this.formData = formData;
    };

    toReturn(){
      window.history.go(-1);
    }

    nodeExpand(event){ 
      event.node.children = [];
      let funcName = event.node.type == 'org' ? 'getUnitSubList' : 'getRoleSubList'
      this.contactsDataService[funcName](event.node.id)
          .then(data => {
            this.formatGroupList(data,event.node.type);
            event.node.children = data;
          })
          .catch(oError => {
            this.popupService.showError(oError);
          })
    }

    formatGroupList(data,group){
      data.forEach(item => {
        item.expandedIcon = 'fa-folder-open';
        item.collapsedIcon = 'fa-folder';
        item.leaf = !item.hasNextLevel;
        item.label = item.name;
        if(group == 'org'){
          item.type = 'org';
        }else if(group == 'role'){
          item.type = 'role';
        }
      })
    }
}
