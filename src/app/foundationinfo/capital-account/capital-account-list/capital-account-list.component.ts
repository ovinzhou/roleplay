import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router'
import { PopupService } from 'core/services/popup.service';
import { flyIn } from 'core/animations/fly-in';
import { Title } from '@angular/platform-browser';
import { dataList } from '../data-list'

@Component({
  selector   : 'capital-account-list',
  templateUrl   : 'capital-account-list.component.html',
  styleUrls: ['./capital-account-list.component.scss'],
  animations : [flyIn]
})

export class CapitalAccountListComponent implements OnInit {

	private toolbarConfigs     : any[];
	private inventoryList      : Array<any> = [];
	private totalRecords       : number     = 0;
  private financeAccountList : any;
  private accountData        : any;
  private page               : any;
  private emptyMessage       : string = '没有记录';
  private searchKeyWord      : any;
  private filter             : any;
  private selectedDatas      : any;

	constructor(

    private router       : Router,
		private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title){}

	ngOnInit(){
    this.titleService.setTitle('资金账户列表');
		this.toolbarConfigs = [
      {
      	handler: this.onQuery.bind(this),
      	type:'all'
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      },
      {
        label: "删除",
        handler: this.onDel.bind(this),
        align: "right",
        icon: "glyphicon glyphicon-minus",
      },
      {
        label: "添加",
        handler: this.onAdd.bind(this),
        align: "right",
        icon:'glyphicon glyphicon-plus'
      },
    ];
    
    this.page = {
      pageNum:1,
      pageSize:10
    }

    this.financeAccountList = [];
    this.route.params.subscribe(()=>{
      this.accountData = dataList.data;
    })
	}

  private setChargeData(){
    // this.service.getCharge(encodeURIComponent(JSON.stringify(this.filter)))
    // .then(data=>{
    //   this.formatData(data);
    //   this.totalRecords = data.totalElements
    // })
    // .catch(res => this.popupService.showError(res))
  }

  private formatData(data):any{

    data.content = data.content===null?[]:data.content;
    let chargeList = [];
    data.content.forEach(item => {
      chargeList.push({
        id:item.id,
        chargename : item.name,
        chargetype : item.typeName,
        describe:item.comment
      })
    })
    this.accountData = chargeList;
  };
/**
 * [anAdd 添加]
 */
  public onAdd(){
    this.router.navigate(['../add'],{relativeTo: this.route});   
  }
 /**
  * [onQuery 查询]
  */
  public onQuery(searchKeyWord):void{
    this.searchKeyWord = searchKeyWord;
    this.initFilter();
    this.setChargeData();
  };

  private initFilter():void{
    this.filter = {
      searchKeyWord : this.searchKeyWord,
      pageNum : this.page.pageNum,
      pageSize : this.page.pageSize,

    };
  };
/**
 * [onSort 排序]
 */
  public onSort(event):void{
    this.filter = {
      searchKeyWord : this.searchKeyWord,
      pageNum : this.page.pageNum,
      pageSize : parseInt(this.page.pageSize),
      orderItem : {
        columnName : event.field,
        asc : event.order == '1' ? true : false
      }
    }
    this.setChargeData();
  };
/**
 * [onDel 删除]
 */
  public onDel():void{
    // if(!this.beforeDoActionCheck()){
    //   return;
    // }

    // var ids = [];
    // this.selectedDatas.map(item=>{ids.push(item.id)});

    // this.popupService.confirm({
    //   header:'系统提示',
    //   message:'确定要删除这些数据吗？',
    //   accept:()=>{
    //     this.service.delCharge(ids.toString()).then(() =>{
    //       this.setChargeData();
    //     })      
    //   }  
    // });
  };
/**
 * 删除之前的判断
 */
  public beforeDoActionCheck ():boolean{
    if(!this.selectedDatas || this.selectedDatas.length === 0){
      this.popupService.alert({
        header:'系统提示',
        message:'请至少选中一条数据,以便进行您需要的操作!'
      })
      return false;
    }
    return true;
  }
/**
 * 翻页
 */
  public paginate(event):void{
    // this.first = event.first;
    this.page.pageNum = event.page + 1;
    this.page.pageSize = event.rows;
    this.initFilter();
    this.setChargeData();
    // this.cacheService.put('chargecache',this.first)    
  }
  
/**
 * [onEdit 修改]
 */
  public onEdit(chargeCreate:Object):void{
    // this.cacheService.put('chargefilter',this.filter)
    this.router.navigate(['../edit',chargeCreate['id']],{relativeTo: this.route});
  }; 
}

