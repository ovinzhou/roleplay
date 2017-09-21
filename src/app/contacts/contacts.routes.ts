import { RouterModule } from "@angular/router";
import { ContactsComponent } from './index/contacts.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { BizListComponent } from './biz/biz-list/biz-list.component';
import { BizCreateComponent } from './biz/biz-create/biz-create.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { GroupCreateComponent } from './group/group-create/group-create.component';
import { BizComponent } from './biz/biz.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';

export const contactsRoutes = [
  	{
		// path:'contacts/:entityId',
		path:'',
		component:	ContactsComponent,
	    children: [
	    	{ path: '', redirectTo:'org',pathMatch:'full'},

	    	{ 
	    		path: 'user', 
	    		component:UserComponent ,
	    		data: { title: "成员" },
	    		children : [
		    	  	{ path: '', redirectTo:'list',pathMatch:'full'},
		    	  	{ path: 'list', component:UserListComponent},
		    	  	{ path: 'op/create', component:UserCreateComponent , data: { title: "添加用户" }  },
		    	  	{ path: 'op/:operation/:userId', component:UserCreateComponent , data: { title: "编辑用户" } },
	    		] 
	    	},

	    	{ 
    			path: 'org', 
	    		component:GroupComponent ,
	    		data: { title: "组织" },
	    		children : [
		    	  	{ path: '', redirectTo:'userlist',pathMatch:'full'},
		    	  	{ path:'userlist',component:UserListComponent},
		    	  	{ path: ':groupId/op/create', component:GroupCreateComponent ,data: { title: "添加组织" } },
		    	  	{ path: 'op/:operation/:groupId', component:GroupCreateComponent ,data: { title: "编辑组织" } }
	    		] 
	    	},

	    	{ 
	    		path: 'role', 
	    		component:GroupComponent ,
	    		data: { title: "角色" },
	    		children : [
		    	  	{ path: '', redirectTo:'userlist',pathMatch:'full'},
		    	  	{ path:'userlist',component:UserListComponent },
		    	  	{ path: ':groupId/op/create', component:GroupCreateComponent ,data: { title: "添加角色" } },
		    	  	{ path: 'op/:operation/:groupId', component:GroupCreateComponent ,data: { title: "编辑角色" } }
	    		] 
	    	},
	    	{ 
	    		path: 'biz', 
	    		component:BizComponent ,
	    		data: { title: "商业圈" },
	    		children : [
		    	  	{ path: '', redirectTo:'all',pathMatch:'full'},
		    	  	{ path: 'all', component:BizListComponent},
		    	  	{ path: 'op/create', component:BizCreateComponent ,data: { title: "添加商业圈" } },
		    	  	{ path: 'op/:operation/:bizId', component:BizCreateComponent , data: { title: "修改商业圈" } },
	    		] 
	    	}
	    ]
	}
];
