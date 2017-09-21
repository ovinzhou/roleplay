import {Component,OnInit,Input} from '@angular/core';
import {trigger,state,style,animate,transition} from '@angular/core';


function percentageToOffset(n) {
  return Math.PI * 2 * 30 * (100 - n) / 100;
}

@Component({
    selector:'progresscircle',
    styleUrls:['./progress-circle.component.css'],
    template: `
    	<div class="progresscircle" (click)="onClick()">
		<div class="ptitle" [ngClass]="{'active': active}">{{ptitle}}</div>
        <svg width="120" height="120">
        <circle r="30" cy="60" cx="60" stroke-width="7" stroke="#D2D4D6" fill="none"/>
        <circle [@changeHeight]="validate(percentage)"  id="donut-graph" r="30" cy="60" cx="60" stroke-width="8" stroke="#009900" stroke-dasharray="188.5" fill="none"/>
      	</svg>
      	<span class="percentage" [ngClass]="{'zero-percentage': percentage==0, 'hundred-percentage': percentage>=100}">{{percentage}}%</span>
      	</div>
  	`,
  animations: [
    trigger('changeHeight', 
    Array.apply(null, {length: 101}).map(Number.call, Number).map(n => state(n.toString(), style({strokeDashoffset: percentageToOffset(n)})))
    .concat(
      transition('* => *', [animate('500ms ease-in')])
    ))
  ]
})
export class ProgressCircleComponent implements OnInit {

  /**
   * [Input 百分比]
   */
	@Input() percentage:any;
  /**
   * [Input 标题信息]
   */
	@Input() ptitle:string;
  /**
   * [Input 是否选中]
   */
	@Input() active:boolean;
  /**
   * [Input 单击事件回调]
   */
	@Input() callback:Function;

	constructor() {
  }

	ngOnInit(){
	}


	onClick(){
		this.callback();
	}

	validate(n: number): number {
	    if (n < 0) n = 0;
	    else if (n > 100) n = 100;
	    else n = Math.floor(n);
	    return n;
  	}


}