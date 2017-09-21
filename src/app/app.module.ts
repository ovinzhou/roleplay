import { NgModule, ApplicationRef,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ng2-bootstrap/components/alert';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule,JsonpModule } from '@angular/http';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './core/services/in-memory-data.service'
import { SharedModule } from './shared/shared.module';
import CoreModule from './core/core.module';
import { AppComponent } from './app.component';
import appRoutes from './app.routes';

import { ContactsDataService } from './contacts/contacts-data.service';
@NgModule({
  imports: [
    // system module
    BrowserModule,
    RouterModule,
    HttpModule,
    JsonpModule,
     // InMemoryWebApiModule.forRoot(InMemoryDataService, {delay: 500}),
     // common module
    SharedModule,
    CoreModule,

    // biz module
    appRoutes,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    CookieService,
    ContactsDataService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
}
