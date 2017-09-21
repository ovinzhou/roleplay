import { RouterModule } from '@angular/router';

import { HomebrewInfoComponent } from  'homebrew/index/homebrew.component';


export const hombrewInfoRoutes = [
	{
		path:'',
		component:HomebrewInfoComponent,
	    children: [

	    ]
	}
]