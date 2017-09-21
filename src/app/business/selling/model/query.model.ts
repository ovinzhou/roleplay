export class Query{
	searchKeyWord:string;
    pageNum:number;
    pageSize:number;

    	
	constructor() {
		this.pageNum = 1;
		this.pageSize = 10;
		this.searchKeyWord = '';
	}

	public toString():string{
		return 'pageNum='+this.pageNum+'&pageSize='+this.pageSize+'&searchKeyWord='+this.searchKeyWord;
	}
}