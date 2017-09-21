import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { Title }     from '@angular/platform-browser';
import { Router , ActivatedRoute ,Params } from '@angular/router';

// the Service of FoundationinfoModule
import {FoundationinfoService} from '../../foundationinfo-data.service';

import { SelectItem,DetailData } from './sku-create.data';
import { PopupService } from 'core/services/popup.service';
import { BASE_URL } from 'core/constants/global-setting';


@Component({
  selector: 'spu-upload',
  templateUrl: './spu-upload.component.html',
  styleUrls: ['./spu-upload.component.scss']
})
export class SpuUploadComponent implements OnInit {

  private data: any;

  private formData : any;

  private importStatusInfo : any;

  private progress:any;

  private progressInfo: Object;

  private curTaskId:string;

  constructor(
    private router : Router,
    private route : ActivatedRoute, 
    private popupService: PopupService,
    private titleService: Title,
    private service:FoundationinfoService,
    private location: Location){
   };

  ngOnInit() {
    this.data = {};
    this.importStatusInfo = {};
    this.progress = 0;
    this.progressInfo = {
      READY:25, FILE_DONE:50,PRASE_DONE:75,IMPORT_DONE:100,IMPORT_ERROR:90
    };
  }

  public onFileChange(event):void{

    if(!this.checkFileSize(event)){
      return;
    }

    let fileReader = new FileReader(),
        formData   = new FormData(),
        that       = this;

    fileReader.onload = function(loadReader : any){
      that.data.files = loadReader.target.result;
    }

    fileReader.readAsDataURL(event.target.files[0]);

    formData.append('file', event.target.files[0]);

    this.formData = formData;

    this.service.batchImportSpu(this.formData,'spu')
        .then(taskInfo =>{
          var tast = this;
          this.curTaskId = taskInfo.taskId;
          var IntervalStatus = setInterval(function(){

            tast.service.getBatchImportSpuStatus(taskInfo.taskId)
            .then(data=>{

              if(data.status === 'IMPORT_ERROR' || data.status === 'IMPORT_DONE'){
                clearInterval(IntervalStatus);
                
              }
              tast.progress = tast.progressInfo[data.status];


              tast.importStatusInfo = data;
              
            }).catch(res => this.popupService.showError(res))
          },1000);

        }).catch(res => this.popupService.showError(res));
  };


  public checkFileSize(event):boolean{
    
    if (!event.target.files[0].name) return false;

    if (event.target.files[0].size > 3 * 1024 * 1024) {
        this.popupService.alert('文件最大为3M');
        return false;
    }

    return true;
  }


  /**
   * [downloadErrorData 下载错误数据]
   */
  public downloadErrorData():void{
    window.open(BASE_URL+'/foundation/import/spu/'+this.curTaskId);
  }


}