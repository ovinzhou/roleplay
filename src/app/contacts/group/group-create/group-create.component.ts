import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { FormGroup} from '@angular/forms';
import { ContactsDataService } from '../../contacts-data.service';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'group-create',
  templateUrl: './group-create.component.html',
  styleUrls : ['./group-create.component.scss'],
  animations: [
  ]
})
export class GroupCreateComponent implements OnInit {
    private data : any ;
    private principalList: any;
    private operation : string;
    private genders : any;
    private groupType : string;
    private groupName : string;
    private groupId : string;
    private title : string;
    private activeItem : any;
    //负责人
    principal : string;

    constructor(private contactsDataService : ContactsDataService,
                private route : ActivatedRoute,
                private router : Router,
                private popupService : PopupService,
                private titleSerive : Title) { }

    ngOnInit() {
      this.groupType = this.router.isActive('/main/contacts/org' , false) ? 'org' : 'role';
      this.groupName = this.groupType  == 'org' ? '组织':'角色';

      this.route.params.subscribe(params => {
        this.operation = params['operation']; 
        this.groupId = params['groupId'];
      });
      this.activeItem = [];
      this.principalList = [];
      this.data = {};
      this.title = '添加' + this.groupName
      this.titleSerive.setTitle('添加' + this.groupName);
      //查询负责人列表
      this.contactsDataService.getPrincipalList().then(data => {
        let principalList = [];
        data.forEach(item => {
          principalList.push({
            text:item.nickName,
            id:item.id

          })
        });
        this.principalList = principalList;
      }).then(() => {
        if(this.operation){
          //判断是组织还是角色
          let groupFunc = this.groupType == 'org' ? 'getUnitInfo' : 'getRoleInfo';
          this.contactsDataService[groupFunc](this.groupId).then(groupInfo => {
             this.data = {
               description : groupInfo.description,
               parentId : groupInfo.parentId,
               id : groupInfo.id,
               groupName : groupInfo.name
             }
             let activeItem = this.principalList.find(item => {
               return item.id == groupInfo.principalInfo.id;
             })
             this.activeItem = activeItem ? [activeItem] : [];
             this.principal = groupInfo.principalInfo.id;
          })
          this.title = '修改' + this.groupName
          this.titleSerive.setTitle('修改' + this.groupName);
        }
      });
    }

    onSubmit(userForm){
      if(!userForm.form.valid){
         return;
      }

      if(!this.principal){
        return ;
      }

      //用来存放父Id
      let parentId;
      /**
        判断是否有父Id
      */
      if(this.groupId != 'entity'){
         if(!this.operation){
           parentId = this.groupId;
         }
      }
      //principalRelId 修改的时候后台需要的数据
      let groupInfo  = {
         id : this.data.id,
         name : this.data.groupName,
         principal : this.principal,
         description : this.data.description,
         parentId:this.data.parentId ? this.data.parentId : parentId
        
      }

      let groupFunc;
      //根据是create还是edit来进行操作
      if(!this.operation){
        //list/org/main
        // groupInfo[this.group == 'org' ? 'userGroupName' : 'userRoleName'] = this.data.groupName;
        groupFunc = this.groupType == 'org' ? 'addUnit' : 'addRole'
        this.contactsDataService[groupFunc](groupInfo).then(() => {
           this.router.navigate(['/main/contacts',this.groupType ,'userlist']);
        }).catch(oError =>{
          this.popupService.showError(oError);
        })
      }else{
        groupFunc = this.groupType == 'org' ? 'editUnit' : 'editRole';
        this.contactsDataService[groupFunc](this.data.id,groupInfo).then(() => {
            this.router.navigate(['/main/contacts', this.groupType ,'userlist']);
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

    refreshValue(event){
      this.principal = event.id;
    }
}
