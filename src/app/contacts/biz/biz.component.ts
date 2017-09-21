import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'biz-component',
  template:`<router-outlet></router-outlet>`,
})
export class BizComponent implements OnInit {

  constructor(){};

  ngOnInit() {};

}