import { Component, OnInit,Injectable,AfterViewInit,Renderer } from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router';
import { processingList } from  'homebrew/mock/processing-list';

import { BusinessDataService }  from 'business/business-data.service';
import { SellingService } 		from  'business/selling/selling-data.service';
import { PopupService } 		from 'core/services/popup.service';



import { Title } 	from '@angular/platform-browser';
import { Query } 	from 'business/selling/model/query.model';
import { BASE_URL } from 'core/constants/global-setting';


@Injectable()
@Component({
  selector: 'spuList-width-img',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductListComponent implements OnInit,AfterViewInit {


	private tempOrderId   : string;

	private spuList    		: Array<any> = [];
	private skuList		    : Array<any> = [];
	private outerLlit       : Array<any> = [];
	private orderItemList	: Array<any> = [];
	private tempOrderItemList:Array<any> = [];

	private skuListQuery    : Query = new Query();
	private spuListQuery	: Query = new Query();

	private skuListSelectorVisible : boolean = false;
	private orderItemVisible 	   : boolean = false;

	private allTempOrderItemChecked : boolean = false;

	private spuListToolbarConfigs  : Array<any> = [];

	private spu_view_type	: string = '';

	private currentSpu : any ;
	private scrollListener:Function


	constructor(
		private router : Router,
        private route : ActivatedRoute,
        private popupService:PopupService,
        private titleService:Title,
         public renderer: Renderer,
        private service:SellingService){
	}

	ngAfterViewInit() {

		let scrollBody = document.body.querySelector(".content.gray-bg");

        if(scrollBody){

            this.scrollListener = this.renderer.listen(scrollBody, 'scroll', (e) => {

            var scrollTop = e.target.scrollTop;
            var scrollHeight = e.target.scrollHeight;
            var windowHeight = document.body.clientHeight;

            if((scrollTop+windowHeight)-scrollHeight===-16){
            	return;
            }

            if(scrollTop >= 130 && document.getElementById('orderItemInfo')!=null){

            	document.getElementById('orderItemList').style['max-height']=windowHeight/2+100+'px';

        		document.getElementById('orderItemInfo').style['position'] = 'relative';
        		document.getElementById('orderItemInfo').style['top'] = (scrollTop-120)+'px';

	        	}else if (scrollTop < 130 && document.getElementById('orderItemInfo')!=null){
	        		
	        		document.getElementById('orderItemInfo').style['position'] = '';
	        		document.getElementById('orderItemInfo').style['top'] ='';
	        		document.getElementById('orderItemList').style['max-height']=windowHeight/2+'px'
	        	}
            });
        }
    }

	ngOnInit(){

		
		this.titleService.setTitle("物料列表");

		this.spuListQuery.pageSize =24;
		this.skuListQuery.pageSize = 6;

		//查询产成品列表数据
		this.setSpuList();
		//查询外箱数据
		this.setOuterLlit();
		//初始化视图工具栏
		this.initToolbarConfigs();
		//查询临时订单信息
		this.getTempOrderInfo();
	}

	/**
	 * 过滤查询
	 */
	private onQuerySpuList(searchKeyWord:string):void{

		if(searchKeyWord){
			this.spuListQuery.searchKeyWord = searchKeyWord;
		}else{
			this.spuListQuery.searchKeyWord = '';
		}
		this.setSpuList();
	};

	/**
	 * 查询所有产成品
	 */
	private onQuerySpuList_ALL():void{
		this.spuListQuery.searchKeyWord = '';
		this.spu_view_type = undefined;
		this.setSpuList();
	}

	/**
	 * 查询所有绒盒
	 */
	private onQuerySpuList_Flocked():void{
		this.spu_view_type = '绒盒';
		this.spuListQuery.pageSize = 24;
		this.setSpuList();
	};

	/**
	 * 查询所有铁盒
	 */
	private onQuerySpuList_Tinbox():void{
		this.spu_view_type = '铁盒';
		this.spuListQuery.pageSize = 24;
		this.setSpuList();
	};

	/**
	 * 查询所有包盒
	 */
	private onQuerySpuList_PackagBox():void{
		this.spu_view_type = '包盒';
		this.spuListQuery.pageSize = 24;
		this.setSpuList();
	};

	/**
	 * 查询所有纸盒
	 */
	private onQuerySpuList_Carton():void{
		this.spu_view_type = '纸盒';
		this.spuListQuery.pageSize = 24;
		this.setSpuList();
	};

	/**
	 * 图片 ---上一张
	 * @param {number} item 当前产成品
	 */
	private img_go_prev(item):void{

		if(item.currentImgIndex === 0 || item.imgs.length===0){
			return;
		}

		item.currentImgIndex=item.currentImgIndex-1;
	};

	/**
	 * 图片 --- 下一章
	 * @param {number} item 当前产成品
	 */
	private img_go_next(item):void{
		if(item.currentImgIndex==item.imgs.length-1 || item.imgs.length===0){
			return;
		}
		item.currentImgIndex=item.currentImgIndex+1;
	};

	/**
	 *SPU 加载更多
	 */
	private spuListloadingMore():void{
		this.spuListQuery.pageSize = this.spuListQuery.pageSize+12;
		this.setSpuList();
	};

	/**
	 * sku加载更多
	 */
	private skuListloadingMore():void{
		this.skuListQuery.pageSize = this.skuListQuery.pageSize + 6;
		this.setSkuList();
	};

	/**
	 * 打开sku选择器
	 * @param {any} spu物料
	 */
	private onOpenSkuListSelector(spu):void{
		this.skuListQuery.pageSize=6;
		this.tempOrderItemList = this.orderItemList.slice();
		this.currentSpu = spu;
		this.setSkuList();
	};

	/**
	 * 关闭sku选择器
	 */
	private onCloseSkuListSelector():void{
		this.skuListSelectorVisible = false;
		this.tempOrderItemList = this.orderItemList.slice();
	};

	


	/**
	 * 修改SKU数量
	 * @param {any} sku 商品
	 */
	private onSkuqtyChange(sku:any):void{

		if(sku.qty>0 && !this.checkIsExit(sku,this.tempOrderItemList)){
			this.tempOrderItemList.push(sku);
		}else{
			this.tempOrderItemList.map(t =>{
				if(t.code === sku.code){
					t.qty = sku.qty;
				}
			});
		}

		if(sku.qty === 0 || sku.qty === null){
			this.tempOrderItemList = this.tempOrderItemList.filter(t => sku.code != t.code);
		}
	};

	/**
	 * 修改订单数量
	 * @param {string} option 操作 加(add)或者减(subtract)
	 * @param {any}    sku   
	 * 
	 */
	private changeSkuQty(option:string,sku:any):void{

		if(!sku.qty){
			sku.qty = 0;
		}

		if(option === 'add'){
			sku.qty += 1;
		}else{
			if(sku.qty>=1){
				sku.qty -=1;
			}
		};

		if(sku.qty>0 && !this.checkIsExit(sku,this.tempOrderItemList)){
			this.tempOrderItemList.push(sku);
		}else{
			this.tempOrderItemList.map(t =>{
				if(t.code === sku.code){
					t.qty = sku.qty;
				}
			});
		}

		if(sku.qty === 0 || sku.qty === null){
			this.tempOrderItemList = this.tempOrderItemList.filter(t => sku.code != t.code);
		}
	};

	/**
	 * 查询SKU
	 */
	private onQuerySkuList():void{
		this.setSkuList();
	};

	/**
	 * 选择SKU并加入订单
	 */
	private onSelectedSkus():void{
		this.orderItemList = this.tempOrderItemList.slice();

		if(this.tempOrderId){
			this.updateTempOrderItem(false);
		}else{
			this.service.createTempOrder()
				.then(data=>{
					this.tempOrderId = data.id;
					this.updateTempOrderItem(false);
				})
				.catch(res => this.popupService.showError(res))
		}
		this.skuListSelectorVisible = false;


		this.setConfigBageNum();
	};


	/**
	 * 修改临时订单明细
	 */
	public updateTempOrderItem(shortcut:boolean):void{
		this.service.updateTempOrderItem(this.tempOrderId,this.orderItemList)
				.then(data =>{
					if(shortcut){
						this.router.navigateByUrl("main/business/selling/create?tempOrderId="+this.tempOrderId);
					}
				})
				.catch(res =>this.popupService.showError(res));
	};


	/**
	 * 删除临时订单明细
	 */
	public removeTempOrderItem():void{
		this.orderItemList.map(o =>{
			if(o.checked){
				this.service.delTempOrderItem(this.tempOrderId,o.code)
					.then(data =>{
						this.orderItemList = this.orderItemList.filter(i=> i.code != o.code);
						this.tempOrderItemList = this.tempOrderItemList.filter(i=> i.code != o.code);
						this.setConfigBageNum();
					})
					.catch(res =>this.popupService.showError(res));
			}
		});
		
	};

	/**
	 * 选中临时订单明细项
	 */
	public selectedTempOrderItem():void{

		var  num = 0;
		this.orderItemList.map(o =>{
			if(o.checked){
				num +=1;
			}
		})

		if(num === this.orderItemList.length){
			this.allTempOrderItemChecked = true;
		}else{
			this.allTempOrderItemChecked = false;
		}

	};

	/**
	 * 删除某个临时订单明细
	 * @param {any} item 删除项
	 */	
	public removeTempOrderItem_one(item):void{
		this.service.delTempOrderItem(this.tempOrderId,item.code)
			.then(data =>{
				this.orderItemList = this.orderItemList.filter(i=> i.code != item.code);
				this.tempOrderItemList = this.tempOrderItemList.filter(i=> i.code != item.code);
				this.setConfigBageNum();
			})
			.catch(res =>this.popupService.showError(res));
	};


	/**
	 * 选中全部临时订单明细
	 */
	public selectedAllTempOrderItem():void{
		this.orderItemList.map(t =>{
			t.checked = this.allTempOrderItemChecked;
		});
	};


	/**
	 * 快捷下单
	 * 选择SKU，加入订单，并创建一个新的订单
	 */
	private onSelectorSkusAndCreateOrder():void{

		if(this.tempOrderItemList.length === 0){
			this.popupService.alert({header:'系统提示',message:'您还为选择任何商品,请选择商品!'});
			return;
		}
		this.orderItemList = this.tempOrderItemList.slice();

		if(this.tempOrderId){
			this.updateTempOrderItem(true);
			
		}else{
			this.service.createTempOrder()
				.then(data=>{
					this.tempOrderId = data.id;
					this.updateTempOrderItem(true);
					
				})
				.catch(res => this.popupService.showError(res))
		}
	};

	/**
	 * 选择外箱
	 * @param {any} sku 商品
	 */
	private onSelectedSkuOuter(sku):void{
		this.outerLlit.map(o =>{
			if(sku.outerCode === o.code){
				sku.outerCarton = o.name;
				o.skuAttrs.map(i=>{
					if(i.name === "尺寸"){
						sku.outerSize = i.value.value;
					}
					if(i.name === "装箱量"){
						sku.outerQty = i.value.value;
					}
				})
			} 
		});

		if(sku.outerCtn && sku.outerQty){
			sku.qty = sku.outerCtn * sku.outerQty;
		}

		if(sku.qty>0 && !this.checkIsExit(sku,this.tempOrderItemList)){
			this.tempOrderItemList.push(sku);
		}else{
			this.tempOrderItemList.map(t =>{
				if(t.code === sku.code){
					t.qty = sku.qty;
				}
			});
		}
	};


	/**
	 * 修改SKU件数
	 */
	private onSkuCtnChange(sku):void{
		if(sku.outerCtn && sku.outerQty){
			sku.qty = sku.outerCtn * sku.outerQty;
		}

		if(sku.qty>0 && !this.checkIsExit(sku,this.tempOrderItemList)){
			this.tempOrderItemList.push(sku);
		}else{
			this.tempOrderItemList.map(t =>{
				if(t.code === sku.code){
					t.qty = sku.qty;
				}
			});
		}
	};


	/**
	 * 查询SPU数据
	 */
	private setSpuList():void{
		var filter = '?first=原料,半成品,备品';

		if(this.spu_view_type){
			filter = filter+'&third='+this.spu_view_type
		}
		this.service.getProducts(filter,this.spuListQuery)
			.then(data =>{
				this.spuList = [...data['content']];
				this.spuList.map(p =>{
					p.imgs = [];
					p.currentImgIndex = 0;
					if(p['spuFiles']){
						p['spuFiles'].map(f =>{
							p.imgs.push(BASE_URL+f);
						})
					}
				});
			})
			.catch(res => this.popupService.showError(res));
	};

	/**
	 * 查询SKU数据
	 */
	private setSkuList():void{
		this.service.getProduct_Skus(this.currentSpu.id,this.skuListQuery).then(data =>{

			this.skuList = [...data['content']];
			this.skuList.map(p =>{

				p.imgs = [];
				p.currentImgIndex = 0;
				if(p['skuFiles']){
					p['skuFiles'].map(f =>{
						p.imgs.push(BASE_URL+f);
					})
				}

				//还没加入订单，但是填写了数量以及包装信息的数据
				this.tempOrderItemList.map(t =>{
					this.skuList.map(s =>{
						if(s.code === t.code){
							s.qty = t.qty;
							s.outerCarton = t.outerCarton;
							s.outerCode = t.outerCode;
							s.outerCtn = t.outerCtn;
							s.outerQty = t.outerQty;
							s.outerSize =t.outerSize;
						}
					});
				});

				//已经加入订单的数据
				this.orderItemList.map(o =>{
					this.skuList.map(s =>{
						if(s.code === o.code){
							s.qty = o.qty;
							s.outerCarton = o.outerCarton;
							s.outerCode = o.outerCode;
							s.outerCtn = o.outerCtn;
							s.outerQty = o.outerQty;
							s.outerSize = o.outerSize;
						}
					});
				})
			});
			this.skuListSelectorVisible = true;

		}).catch(res => this.popupService.showError(res));
	};

	/**
	 * 设置外箱数据
	 */
	private setOuterLlit():void{
		this.service.getSkusByType('外箱',new Query())
			.then(data =>{
				this.outerLlit =  data['content'];
			})
			.catch(res =>this.popupService.showError(res));
	};

	/**
	 * 校验sku对象是否存在sku数组里
	 * @param  {any}  sku  商品对象
	 * @param  {any}  skus 商品对象数组
	 * @return {boolean}      存在或者不存在
	 */
	private checkIsExit(sku,skus):boolean{
		var isExit = false;
			skus.map(s =>{
				if(sku.code === s.code){
					isExit = true;
					return;
				}
			});
			return isExit;
	};

	/**
	 * 查看SPU详情
	 * @param {any} spu 选中的商品
	 */
	private goSpuDetail(spu):void{
		this.router.navigateByUrl('main/foundationinfo/spu/edit/'+spu.id);
	};

	/**
	 * 查看SKU详情
	 * @param {any} sku 选中的商品
	 */
	private goSkuDetail(sku):void{
		this.router.navigateByUrl('main/foundationinfo/sku/edit/'+sku.code);
	};


	/**
	 * 设置订单数量
	 */
	private setConfigBageNum(){
		this.spuListToolbarConfigs[this.spuListToolbarConfigs.length-1].badgeNum = this.orderItemList.length;
	};


	/**
	 * 初始化工具栏
	 */
	private initToolbarConfigs():void{
		this.spuListToolbarConfigs = [
            {
                handler: this.onQuerySpuList_ALL.bind(this),
                type:'all'
            },
            {
            	label:'绒盒',
                handler: this.onQuerySpuList_Flocked.bind(this),
            },
            {
            	label:'铁盒',
                handler: this.onQuerySpuList_Tinbox.bind(this),
            },
            {
            	label:'包盒',
                handler: this.onQuerySpuList_PackagBox.bind(this),
            },
            {
            	label:'纸盒',
                handler: this.onQuerySpuList_Carton.bind(this),
            },
            {
                type: "search",
                handler: this.onQuerySpuList.bind(this),
                align: "right",
            },
            {
            	label:'下单',
                handler: this.onSelectorSkusAndCreateOrder.bind(this),
                align: "right",
                badgeNum:this.orderItemList.length
            },
        ];
	};

	/**
	 * 获取临时订单信息
	 */
	private getTempOrderInfo():void{
		this.service.getTempOrder().then(data =>{
			if(data !== null){
				//临时订单ID
				this.tempOrderId = data.id;
				//临时订单明细
				this.orderItemList = data.items;
				this.orderItemList.map(i =>{

					i.name = i.item.name;
					i.code = i.item.code;
					i.imgs = [];
					i.currentImgIndex = 0;
					//包装信息
					if(i.carton){
						i.outerCarton = i.carton.outerCarton;
						i.outerCode = i.carton.outerCode;
						i.outerCtn = i.carton.outerCtn;
						i.outerQty = i.carton.outerQty;
						i.outerSize = i.carton.outerSize;
					}
					//图片
					if(i.item.skuFiles){
						if(i.item.skuFiles.length>0){
							i.imgs.push(BASE_URL+ i.item.skuFiles[0]);
						}
					}
					
				});

				this.tempOrderItemList = this.orderItemList;

				this.setConfigBageNum();

				console.log(this.orderItemList);
			}
		})
		.catch(res => this.popupService.showError(res));
	}



}