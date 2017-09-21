import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import {CommonModule} from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ContactsDataService } from "./contacts-data.service";
import { ContactsComponent } from './index/contacts.component';
import { UserListComponent } from "./user/user-list/user-list.component";
import { BizListComponent } from './biz/biz-list/biz-list.component';
import { BizCreateComponent } from './biz/biz-create/biz-create.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { GroupCreateComponent } from './group/group-create/group-create.component';
import {ConfirmationService} from 'primeng/primeng';
import {contactsRoutes} from './contacts.routes';
import { BizComponent } from './biz/biz.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(contactsRoutes)
  ],
  declarations: [
    ContactsComponent,
    UserListComponent,
    UserCreateComponent,
    GroupCreateComponent,
    BizListComponent,
    BizCreateComponent,
    BizComponent,
    UserComponent,
    GroupComponent
  ],
  exports:[
    ContactsComponent
  ],
  providers: [
    ContactsDataService,
    ConfirmationService
  ],
})
export default class ContactsModule {
  
}