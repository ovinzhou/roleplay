import { Component, OnInit,Injectable,AfterViewInit,Renderer } from '@angular/core';
import { Router , ActivatedRoute ,Params} from '@angular/router';

import { BusinessDataService }  from 'business/business-data.service';
import { SellingService } 		from  'business/selling/selling-data.service';
import { PopupService } 		from 'core/services/popup.service';



import { Title } 	from '@angular/platform-browser';
import { BASE_URL } from 'core/constants/global-setting';



@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls:['./order-detail.component.css'],

})
export class OrderDetailComponent{

}