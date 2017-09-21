import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'user-component',
  template:`<router-outlet></router-outlet>`,
})
export class UserComponent implements OnInit {

  constructor(){};

  ngOnInit() {};

}