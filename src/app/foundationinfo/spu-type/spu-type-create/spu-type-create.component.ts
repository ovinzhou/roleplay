import { Component, OnInit} from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router';
import { FormGroup} from '@angular/forms';
import { Title }     from '@angular/platform-browser';
// the Service of FoundationinfoModule
import {FoundationinfoService} from '../../foundationinfo-data.service';
import { Location } from '@angular/common';
import { PopupService } from '../../../core/services/popup.service';

@Component({
  selector: 'spu-type-create',
  templateUrl: './spu-type-create.component.html',
  styleUrls: ['./spu-type-create.component.scss'],
})

export class SpuTypeCreateComponent implements OnInit{
	
	private spuType : Object ;
	private isUpdate: boolean =false;

	constructor(
			private router : Router,
			private route  : ActivatedRoute,
			private titleService: Title,
			private service:FoundationinfoService,
			private popupService:PopupService,
	        private location: Location){
	};


	ngOnInit(){

		this.spuType = {name:'',comment:''};
		
		this.route.params.subscribe(params => {
			this.titleService.setTitle('新增物料类型');
			var opertion = params['operation'],
				id   	 = params['id'];
			switch (opertion) {
				case 'addroot':
					this.spuType['parentId'] = null;
					break;
				case 'edit':
					this.titleService.setTitle('修改物料类型');
					this.isUpdate = true;
					this.service.getSpuType(id).then(spuType =>{
						this.spuType = spuType;
					}).catch(res =>this.popupService.showError(res));
					break;
				default:
					this.spuType['parentId'] = id;
					break;
			}

      	});
	};

	

	/**
	 * [onSubmit 提交表单数据]
	 * @param {any} spuTypeForm [表单]
	 */
	public onSubmit(spuTypeForm:any):void{

		if(!spuTypeForm.form.valid){
         	return;
      	}

      	if(this.isUpdate){
      		this.service.updateSpuType(this.spuType).then(data=>this.location.back())
      		.catch(res =>this.popupService.showError(res));
      	}else{
	      	this.service.addSpuType(this.spuType).then(data=>this.location.back())
	      	.catch(res=>this.popupService.showError(res));
      	}
	};


	/**
   * [onCancel click calcel button]
   */
    public onCancel():void{
		this.location.back();
    }
}