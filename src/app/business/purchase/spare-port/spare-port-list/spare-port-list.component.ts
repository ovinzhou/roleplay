import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopupService } from 'core/services/popup.service';
import { PurchaseDataService } from "../../purchase-data.service"
import { charge } from '../manufacture-cost.data';
import { Title } from '@angular/platform-browser';
import { UtilsService } from 'core/services/utils.service'

@Component({
  selector   : 'spare-port-list',
  templateUrl: './spare-port-list.component.html',
  styleUrls  : ['./spare-port-list.component.scss']
})

export class SparePortListComponent implements OnInit {

  private filter          : any;
  private totalRecords    : any;
  private page            : any;  
  private sparePortList      : any;
  private data            : any;
  private toolbarConfigs  : any[];
  private selectedDatas   : any[];  
  private query           : any;  
  private searchKeyWord   : string = '';
  private emptyMessage    : string = '没有记录';
  private first : number;
  //备品采购明细弹出层
  private display : boolean = false;
  private detailTotalRecords : number = 0;
  private detailFirst : number = 0;
  private detailFilter : any;
  private detailQuery : any;
  private detailList : any;
  private selectedDetailDatas : any [];
  private skuCode : string = '';

  constructor(
    private service : PurchaseDataService,
    private router       : Router,
    private route        : ActivatedRoute,
    private popupService : PopupService,
    private titleService : Title,
    private utilsService : UtilsService
  ){};
  ngOnInit(){
    this.titleService.setTitle('备品采购列表');
    this.toolbarConfigs = [
      {
        handler: this.all.bind(this),
        type:'all'
      },
      {
        label: "待入库",
        handler: this.onTsfbktca.bind(this)
      },
      {
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      },
      {
        label: "采购",
        handler: this.onTsgdpsst.bind(this),
        align:'right',
        icon:'glyphicon glyphicon-plus'
      }
    ]
    this.query = {
      pageNum:1,
      pageSize:10,
      type:true
    }
    this.detailQuery = {
      pageNum:1,
      pageSize:10
    }
    this.first = 0 ;
    
    this.initFilter('');
    this.route.params.subscribe(() => {
       this.setSparePortData();
    });

  };

  public onQuery(searchKeyWord){
    this.first = 0;
    this.searchKeyWord = searchKeyWord.trim();
    this.query['pageNum'] = 1;
    // this.cacheService.put('spuListQueryFirst',0);
    //
    this.initFilter('');
    this.setSparePortData();
  }

  //查看详情
  public onDetail(rowData){
    this.skuCode = rowData['code'];
    this.initFilter('detail');

    this.setSparePortDetailList();

  }
  //获取数据，设置数据
  public setSparePortData(){
    this.service.getSparePortList(this.filter).then(data=>{
       this.formatData(data,'');
    });
  }
  //初始化分页参数
  public initFilter(type){
    if(type == ''){
      this.filter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : this.query.pageNum,
        pageSize : this.query.pageSize,
        type:this.query['type']

      }
      if(this.query['orderItem']){
        this.filter['orderItem'] = this.query['orderItem'];
      }

    }else{
      this.detailFilter = {
        searchKeyWord : this.searchKeyWord,
        pageNum : this.detailQuery.pageNum,
        pageSize : this.detailQuery.pageSize,
      };

      if(this.detailQuery['orderItem']){
        this.detailFilter['orderItem'] = this.detailFilter['orderItem'];
      }
    }
  }

  public formatData(data,type){
    if(type == ''){
      this.totalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      let sparePortList = [];
      data.content.forEach(item => {
        sparePortList.push({
          code:item.code,
          name:item.name,
          type:item.firstLevel + '>' + item.secondLevel + '>' + item.thirdLevel,
          unit : item.measureName,
          inventory:this.utilsService.formatNumber(item.stock),
          safetyStock  : this.utilsService.formatNumber(item.safeStock),
          inventory_compare:item.stock,
          safetyStock_compare  : item.safeStock,
          purchase : this.utilsService.formatNumber(item.purchase)
        })
      })
      this.sparePortList = sparePortList;
    }else{
      this.detailTotalRecords = data.totalElements;
      data.content = data.content === null?[]:data.content;
      this.detailList = data.content;
      this.detailList.forEach(item => {
        item.qty = this.utilsService.formatNumber(item.qty);
      })
      this.display = true;
    }
  }

  //备品采购
  public onTsgdpsst(){
    this.router.navigateByUrl('main/process/start/tsgdpsst');
  }

  public onTsfbktca(){
    this.query['type'] = false;
    this.initFilter('');
    this.setSparePortData();
  }


  //分页
  public paginate(event,type){
    if(!type){
      this.first = event.first;
      this.query.pageNum = event.page + 1;
      this.query.pageSize = event.rows;
      this.initFilter('')
      this.setSparePortData();
    }else{
      this.detailFirst = event.first;
      this.detailQuery.pageNum = event.page + 1;
      this.detailQuery.pageSize = event.rows;
      this.initFilter('detail');
      this.setSparePortDetailList();
    }
  }

  /**
   * [onSort sort action]
   * @param {[object]} event [sorting info]
   */
  public onSort(event,type):void{
      if(!type){
        this.query['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('');
        this.setSparePortData();
      }else{
        this.detailQuery['orderItem'] = {
          columnName : event.field,
          asc : event.order == '1' ? true : false
        }
        this.initFilter('detail');
        this.setSparePortDetailList();
      }
  };

  public setSparePortDetailList(){
    this.service.getSparePortPopupNumber(this.detailFilter,this.skuCode).then(data => {
      this.formatData(data,'detail');
    }).catch(oError => {
      this.popupService.showError(oError);
    })
  }

  public all(searchKeyWord){
    this.searchKeyWord = searchKeyWord;
    this.query['type'] = true;
    this.query['pageNum'] = 1
    this.first = 0;
    this.query['status'] = '';
    this.initFilter('');
    this.setSparePortData();
  }

}