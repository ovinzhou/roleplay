import { Component, OnInit,OnChanges,Input ,SimpleChange, Injector,ReflectiveInjector } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls : ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit,OnChanges{

	@Input() configList: any[];

  @Input() customClasses: string;

  private activeViewLabelItem: any = null;
  private fetchTotalCallback: any = null;

	private leftGroup: any[];
	private rightGroup: any[];

  private isShowViewLabel: boolean = false;

  private clearSearchValueCallback: Function;

  constructor() { 
  }

  ngOnInit() {
   
  }

  ngOnChanges() {
      this.configList.forEach((configItem) => {
      if(configItem.type === void 0){
        configItem.type = "button";
      }

      if(configItem.default !== void 0 && configItem.default){
        this.activeViewLabelItem = configItem;
      }

      if(configItem.type === "all"){
        this.fetchTotalCallback = configItem.handler;
        this.isShowViewLabel = true;
      } else if(configItem.type === "search"){
        this.clearSearchValueCallback = ((configItem) => {
          return () => configItem.value = ""
        })(configItem);
      }
    })

    this.leftGroup = this.configList.filter((configItem) => {
      // 默认靠左
      return (configItem.align === void 0) || (configItem.align === "left");
    });

    this.rightGroup = this.configList.filter((configItem) => {
      return (configItem.align === "right");
    });
  }

  private fetchTotal() {
    if(this.fetchTotalCallback){
      this.fetchTotalCallback.call(null,"");
    }

    if(this.clearSearchValueCallback){
      this.clearSearchValueCallback();
    }

    this.activeViewLabelItem = null;
  }

  /**
   * [onKeydown Enter key]
   * @param {[type]} configItem [search Item]
   */
  private onKeydown(configItem){

    if(event['keyCode'] === 13 && event['key'] === 'Enter'){
      configItem.handler.call(null,configItem.value);
    }

  }
}
