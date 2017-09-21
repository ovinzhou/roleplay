import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params } from '@angular/router';
import { TreeNode } from 'primeng/primeng';
// the Service of BasicDataModule
import { FoundationinfoService } from '../../foundationinfo-data.service';
import { Location } from '@angular/common';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'procedure-create',
  templateUrl: './procedure-create.component.html',
  styleUrls: ['./procedure-create.component.scss']
})
export class ProcedureCreateComponent implements OnInit {

  private data         : any;
  private title        : string;
  private selectedValus: any;
  private emptyMessage : string = '没有记录';
  private isUpdate     : boolean = false;
  private isShowProcedureGroup     : boolean = false;
  private chargeTypeList : any;
  //计费类型
  private activeItem : any;
  //工序组
  private orgs: TreeNode[];
  //选择的工序组
  private procedureGroup : any;
  private modifyGroup : any;


	constructor(
      private router : Router,
      private route : ActivatedRoute, 
      private service:FoundationinfoService,
      private location: Location,
      private popupService:PopupService,
      private titleService : Title){
	};

	ngOnInit() {
    this.titleService.setTitle('新增工序');
    this.data = {id:'',proName:'',billing:'TIME',comment:''};
    this.activeItem = [
    ];
    this.orgs = [];
    this.procedureGroup = {}
    this.modifyGroup = {}
    this.chargeTypeList = [
      {
        id:'TIME',
        text:'计时工资'
      },
      {
        id:'FEES',
        text:'计件工资'
      }
    ];
    this.route.params.subscribe(params => {
        var operation = params['operation'];
        if('viewdetail' === operation){
          this.isUpdate = true;
          this.service.getProcedureInfo(params['id']).then(data => {
            this.data = {
              id:data.id,
              proName : data.name,
              comment:data.comment,
              billing : data.billing
            }
            this.chargeTypeList.map(i =>{
               if(i.id === data['billing'])
                  this.activeItem = [i];
            });
            let procedureGroup = {
              id:data.userGroupId,
              name:data.userGroupName
            }
            this.procedureGroup = procedureGroup;
            this.modifyGroup = procedureGroup;

          }).catch(oError => {
             this.popupService.showError(oError);
          })
        }
    })
  };

  /**
   * [onAddValue add procedure value]
   */
  public onAddValue():void{
    var toAddNew = true;

    //检测是否为null
    this.data.values=this.data.values === null?[]:this.data.values;

    this.data.values.map(item=>{
      //如果检测到属性值编码和属性值为空，则不需要添加新的对象
      if(item.valueCode ==='' && item.attrValue === ''){
         toAddNew = false;
      };
    });

    if(toAddNew){
      this.data.values.push({valueCode:'',attrValue:''});
    }else{
      console.log('已经存在!');
    }
  };

  /**
   * [onDelValue del procedure value]
   */
  public onDelValue():void{
    this.selectedValus.map(item=>{
      this.data.values = this.data.values.filter( n => n !== item);
      this.selectedValus = this.selectedValus.filter(n => n != item);
    });

    console.log(this.selectedValus);
  };
  /**
   * [selectOrg 选择工序组]
   */
  public selectOrg():void{
  };
  /**
   * [onSubmit 提交表单数据]
   * @param {any} procedureForm [表单]
   */
  public onSubmit(procedureForm:any):void{
    // console.log(this.data);
    if(!procedureForm.form.valid || !this.data.billing){
      return;
    };
    
    let procedureInfo = {
      id:this.data.id,
      name:this.data.proName,
      comment : this.data.comment,
      userGroupId : this.procedureGroup.id,
      billing : this.data.billing
    },
    funcName = this.isUpdate ? 'updateProcedure' : 'addProcedure';

    this.service[funcName](procedureInfo).then(data =>this.location.back())
    .catch(oError => alert(JSON.parse(oError._body).errorMessage)
    )

  };
  /**
   * [onCancel click calcel button]
   */
  public onCancel():void{
    this.location.back(); 
  };

  /**
   * [refreshValue 处理方式/生产方式/是否参与MRP计算选择下拉数据]
   * @param {string} key   [description]
   * @param {any}    value [选择的数据]
   */
  public refreshValue(event):void {
    // this.data[key] = value.id;
     this.data.billing = event.id;
  }
 /**
  * [removed 处理方式/生产方式/是否参与MRP计算清空下拉数据]
  * @param {string} key   [description]
  * @param {any}    value [删除的数据]
  */
  public removed(event):void {
    this.data.billing = null;
  }

  public onProcedureGroup():void {
    this.isShowProcedureGroup = true;
    this.modifyGroup = this.procedureGroup;
    if(this.orgs.length == 0){
      this.service.getProcedureGroup().then(data =>{
        this.formatGroupList(data);
        this.orgs = data;
      }).catch(oError => {
        this.popupService.showError(oError);
      })
    }
  }

    public nodeExpand(event):void{ 
      event.node.children = [];
      this.service.getUnitSubList(event.node.id)
          .then(data => {
            this.formatGroupList(data);
            event.node.children = data;
          })
          .catch(oError => {
            this.popupService.showError(oError);
          })
    }

    //格式化树形列表
    public formatGroupList(data):void{
      data.forEach(item => {
        item.expandedIcon = 'fa-folder-open';
        item.collapsedIcon = 'fa-folder';
        item.leaf = !item.hasNextLevel;
        item.label = item.name;
        
      })
    }

  //设置树形样式
  public getStyles():Object{
   let styles = {
        'width':'250px',
        'height':'300px'

      };
      return styles;
  }

    //移除已选择的
    public removeSeletedItem():void{
       this.modifyGroup = {};
    }

   public  nodeSelect(event) :void {
       this.modifyGroup = {
         id:event.node.id,
         name : event.node.name
       }
    }

    public close():void{
      this.isShowProcedureGroup = false;
      this.modifyGroup = {};
    }

    public chooseConfirm():void{
      this.procedureGroup = this.modifyGroup;
      this.isShowProcedureGroup = false;
    }
}
