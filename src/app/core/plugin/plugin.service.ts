import { Injectable }       from '@angular/core';
import { Router } from '@angular/router';

import { PluginExtension } from './plugin-extension.model'

function loadPlugin(url,chunkId, callback) {
		// const originalPathPrefix = __webpack_require__.p;
		// if(url !== void 0) {
		// 	__webpack_require__.p = url;
		// }
		// __webpack_require__.e(chunkId, callback);
		// __webpack_require__.p = originalPathPrefix;

		if(__webpack_require__.cc[chunkId] === 0){
			return callback.call(null, __webpack_require__);
		}
			

		// an array means "currently loading".
		if(__webpack_require__.cc[chunkId] !== undefined) {
			__webpack_require__.cc[chunkId].push(callback);
		} else {
			// start chunk loading
			__webpack_require__.cc[chunkId] = [callback];
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.charset = 'utf-8';
			script.async = true;

			script.src = url + "/" + chunkId + ".chunk.js";
			head.appendChild(script);
		}
};

@Injectable()
export class PluginService {
    
    constructor(private router: Router) {}

   

    public loadExtensionList(extensions: PluginExtension[]) {
    	// pluginUrl = "http://127.0.0.1:9999/src/plugin/";
    	// pluginId = "contacts-plugin";
    	// routePath = 'contacts/:entityId';
    	// moduleId = "./src/app/contacts/contacts.module.ts";

    	let routesFromExtensions = extensions.map(function(extension: PluginExtension){
    		let pluginUrl = `${extension.pluginServer}/${extension.pluginPath}`;
    		return {
    			path: extension.routePath,
				loadChildren: function() {
			         return new Promise(function(resolve) {
					    loadPlugin(pluginUrl,extension.pluginId,function (require) {
					      resolve(require(extension.moduleId)['default'])
					    });
			         });
			    }
    		}
    	})
    	this.router.resetConfig([
			...routesFromExtensions,
			...this.router.config
		]);
    }
}