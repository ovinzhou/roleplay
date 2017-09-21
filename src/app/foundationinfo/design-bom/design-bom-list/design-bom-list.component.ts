import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CacheService} from 'core/services/cache.service';
import {FoundationinfoService} from '../../foundationinfo-data.service';
import {PopupService} from '../../../core/services/popup.service';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {design} from '../design-datas'

@Component({
    selector: 'design-bom-list',
    templateUrl: './design-bom-list.component.html',
    styleUrls: ['./design-bom-list.component.css']
})
export class DesignBomListComponent implements OnInit {

    private selectedDatas: any[];
    private toolbarConfigs: any[];
    private bomList: any[];
    private emptyMessage: string = '没有记录';
    private page: any;
    private query: any;
    private filter: any;
    private searchKeyWord: string = '';
    private totalRecords: string = '';
    private first: number = 0;
    private idsList: any[];

    //查看bom结构相关
    private bomOrganizationList: any;  //查看bom结构的list
    private isShowBomOranizationDetail: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: FoundationinfoService,
                private popupService: PopupService,
                private cacheService: CacheService,
                private location: Location,
                private titleService: Title) {
    }

    ngOnInit() {
        this.bomOrganizationList = [];
        this.titleService.setTitle('BOM列表');
        this.toolbarConfigs = [
            {
                handler: this.onQuery.bind(this),
                type: 'all'
            },
            {
                type: "search",
                handler: this.onQuery.bind(this),
                align: "right"
            }, {
                label: "删除",
                handler: this.onDel.bind(this),
                align: "right",
                icon: 'glyphicon glyphicon-trash'
            },
            {
                label: "添加",
                handler: this.onAdd.bind(this),
                align: "right",
                icon: 'glyphicon glyphicon-plus'
            }
        ]

        this.selectedDatas = [];
        this.page = {
            pageNum: 1,
            pageSize: 10,
        }

        this.filter = {
            'pageSize': this.page.pageSize,
            'pageNum': this.page.pageNum,
            'searchKeyWord': this.searchKeyWord,
            'detail': false
        }

        this.route.params.subscribe(() => {
            if ( this.cacheService.get('bomfilter')) {  
              this.filter = this.cacheService.get('bomfilter');
              this.first = this.cacheService.get('bomfirst')?this.cacheService.get('bomfirst'):0;
              this.cacheService.remove('bomfilter');
              this.cacheService.remove('bomfirst');
            }
            this.getBomList()
        });  
    }

    getBomList() {
        this.service.getBomList(this.filter)
            .then(data => {
                this.totalRecords = data.totalElements;
                this.bomList = data.content;
            })
            .catch(res => {
                this.popupService.alert(res)
            })
    }

    //查询
    onQuery(searchValue) {
        this.searchKeyWord = searchValue.trim();
        this.initFilter()
        this.getBomList()
    }

    //添加
    onAdd() {
        this.router.navigate(['../add'], {relativeTo: this.route});
    }

    //删除
    onDel() {
        this.idsList = [];
        this.selectedDatas.map(item => {
            this.idsList.push(item.id)
        })
        this.service.delSpuBom(encodeURIComponent(JSON.stringify(this.idsList)))
            .then(() => {
                this.idsList = [];
                this.getBomList();
            })
    }

    private initFilter(): void {
        this.filter = {
            searchKeyWord: this.searchKeyWord,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,

        };
    };

    onPage(event) {
        this.first = event.first;
        this.page.pageNum = event.page + 1;
        this.page.pageSize = event.rows;
        this.initFilter()
        this.getBomList()

        this.cacheService.put('bomfirst',this.first) 
    }

    //编辑
    onEdit(rowData) {
        this.cacheService.put('bomfilter',this.filter)

        this.router.navigate(['../edit', rowData['id']], {relativeTo: this.route});
    }

    //查看BOM结构
    checkOrganization(rowData) {
        this.service.checkSpuBomOrganization(rowData.id)
            .then(data => {
                this.bomOrganizationList = [];

                var recursion = function (data) {
                    data.map(item => {

                        if (item.subTmpl) {
                            if (item.subTmpl.spuResponses) {
                                item['data'] = item.subTmpl.spuResponses[0];
                                item.data['num'] = item.tmplInfo.bom.qty
                                item["expanded"] = true
                                item.data['type'] = item.data.firstLevel + '>' + item.data.secondLevel + '>' + item.data.thirdLevel;

                            }
                            if (item.subTmpl.child) {
                                item['children'] = item.subTmpl.child
                                recursion(item.subTmpl.child)
                            }
                        } else {
                            if (item.spuResponses) {
                                item['data'] = item.spuResponses[0];
                                item.data['num'] = item.tmplInfo.bom.qty
                                item["expanded"] = true
                                item.data['type'] = item.data.firstLevel + '>' + item.data.secondLevel + '>' + item.data.thirdLevel;
                                if (item.child) {
                                    item['children'] = item.child
                                    recursion(item.child)
                                }
                            }
                        }
                    })
                }

                if (!data.child) {
                    data['data'] = data.spuResponses[0];
                    data.data['type'] = data.data.firstLevel + '>' + data.data.secondLevel + '>' + data.data.thirdLevel;
                    data['children'] = []
                    data.tmplInfo.bom.qty = data.tmplInfo.bom.qty.substring(1, data.tmplInfo.bom.qty.length - 1)
                    data.data['num'] = data.tmplInfo.bom.qty
                    var tempData = []
                    tempData.push(data)
                    this.bomOrganizationList = tempData;
                } else {
                    var tempData = []
                    tempData.push(data)
                    recursion(tempData)
                    this.bomOrganizationList = tempData;
                }

                this.isShowBomOranizationDetail = true;
                console.log(this.bomOrganizationList)
            })

    }
}
