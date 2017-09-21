import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'group-component',
  template:`<router-outlet></router-outlet>`,
})
export class GroupComponent implements OnInit {

  constructor(){};

  ngOnInit() {};

}