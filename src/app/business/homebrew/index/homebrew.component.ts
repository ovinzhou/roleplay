import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router';
import { processingList } from  'homebrew/mock/processing-list';
// 自制模块公用数据服务
import { BusinessDataService }    from 'business/business-data.service';
import { PopupService } from 'core/services/popup.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'homebrewInfo',
  templateUrl: './homebrew.component.html',
  styleUrls: ['./homebrew.component.scss'],
})
export class HomebrewInfoComponent implements OnInit {

	private toolbarConfigs : Array<any> = [];
	private totalRecords   : number     = 0;
  private first : number = 0;
	private emptyMessage    : string  = '没有记录';
	private processingList : Array<any> = [];
  private query        : any  = {};
  private view :string = 'all';

	constructor(
		private router : Router,
    private service: BusinessDataService,
		private route : ActivatedRoute,
    private popupService: PopupService,
    private titleService : Title){}

  ngOnInit(){
    this.titleService.setTitle('自制列表');
  	this.toolbarConfigs = [
      {
        handler: this.onQuery.bind(this),
        type:'all'
      },
      {
        label:'生产中',
        handler: this.getWaitStorage.bind(this)
      },
      {  
        type: "search",
        handler: this.onQuery.bind(this),
        align: "right"
      }
    ];

    this.query = {
      searchKeyWord:'',
      pageNum:1,
      pageSize:10
    };

    this.setDataList();
    

  }


  /**
   * [onQuery 查询过滤]
   * @param {[type]} event [查询关键字]
   */
  private onQuery(event):void{
    this.view ='all';
    this.first = 0;
    this.query['pageNum']  = 1;
    this.query['pageSize'] = 10;
    this.query['searchKeyWord'] = event;
    this.setDataList();
  };


  /**
   * [getWaitStorage 得到待入库数据]
   */
  private getWaitStorage():void{
    this.first = 0;
    this.query['pageNum']  = 1;
    this.query['pageSize'] = 10;
    this.service.getWaitStorage(this.query)
        .then(data =>{
          this.processingList = [...data['content']];
          this.totalRecords = data['totalElements'];
          // this.processingList.map(i =>{
          //    i.deliveryDate = i.deliveryDate.substr(0,10);
          // });
        }).catch(res =>this.popupService.showError(res));
  };


  /**
   * [accept 验收]
   * @param {[type]} rowData [单击行数据]
   */
  private accept(rowData):void{

    // window.localStorage.setItem('extra',JSON.stringify({
    //   itemCode:rowData.code,
    //   itemId:rowData.id,
    //   transCode:rowData.orderNo
    // }));

    // window.localStorage.setItem('stuff',JSON.stringify({
    //   'fgspiw.fgtrns001':rowData.orderNo
    // }));

	  // this.router.navigateByUrl("main/process/launch/tsfgboin");


    let dynaParams:any = {};


    dynaParams.context = JSON.stringify({
      itemCode:rowData.code,
      itemId:rowData.id,
      transCode:rowData.orderNo
    });

    this.router.navigate(['main/process/start/tsfgboin'],{
      queryParams: dynaParams,
    });
  };

  /**
   * [onPage 列表分页]
   * @param {[type]} event [分页信息]
   */
  private onPage(event):void{
      this.first = event.first;
      this.query['pageNum']  = (event.first/event.rows)+1,
      this.query['pageSize'] = event.rows;
      this.setDataList();

  };


  /**
   * [setDataList 设置列表数据]
   */
  public setDataList():void{
    this.service.getItems(this.query)
        .then(data =>{
            this.processingList = [...data['content']];
            this.totalRecords = data['totalElements'];
            // this.processingList.map(i =>{
            //   if(i.deliveryDate)
            //     i.deliveryDate = i.deliveryDate.substr(0,10);
            // });
          })
        .catch(res =>this.popupService.showError(res));
  };



 	

}
