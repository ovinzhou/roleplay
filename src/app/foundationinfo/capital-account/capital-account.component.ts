import { Component } from '@angular/core';
import { flyIn } from 'core/animations/fly-in';

@Component({
  selector   : 'capital-account',
  template   : `<router-outlet></router-outlet>`,
  animations : [flyIn]
})

export class CapitalAccount {

}

