'use strict';

export  class SpuAttrbute{
	
	public id:string;
	public name:string;
	public values:Array<any>;
	public comment:string;

	constructor() {
		this.id ='';
		this.name ='';
		this.values = [];
		this.comment = '';
	}
}