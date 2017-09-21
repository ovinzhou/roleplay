import { RouterModule } from "@angular/router";

import { PluginWrapperComponent } from './plugin-wrapper.component'

const pluginWrapperRoutes = [
  	{
		path:'pluginWrapper/:pluginUrl',
		component:	PluginWrapperComponent,
	}
];
export default RouterModule.forChild(pluginWrapperRoutes);