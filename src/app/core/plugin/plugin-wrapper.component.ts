import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router , RouterOutletMap, Params } from '@angular/router';

@Component({
    selector: 'plugin-wrapper',
    template: require('./plugin-wrapper.component.html')
})
export class PluginWrapperComponent {
	pluginUrl: string;
	safePluginUrl: any;

    constructor(
    	private route: ActivatedRoute,
    	private _sanitizer: DomSanitizer
    ) {
		this.route.params
		.map((params: Params) => params['pluginUrl'])
    	.subscribe(pluginUrl => this.safePluginUrl = this._sanitizer.bypassSecurityTrustResourceUrl(pluginUrl));
    }
}