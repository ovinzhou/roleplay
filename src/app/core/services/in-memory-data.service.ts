import {InMemoryDbService} from "angular-in-memory-web-api";
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let users = [
            {
                "name": "张三",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "李四",
                "group": "测试部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":2
            },
            {
                "name": "王五",
                "group": "设计部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":3
            },
            {
                "name": "小明",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "张三1",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "李四1",
                "group": "运营部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":6
            },
            {
                "name": "王五1",
                "group": "pu组",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":7
            },
            {
                "name": "小明1",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "张三2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":2
            },
            {
                "name": "李四2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":2
            },
            {
                "name": "王五2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":2
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1
            },
            {
                "name": "小明2",
                "group": "研发部",
                "mobile": "13424242498",
                "email": "yangdong@126.com",
                "groupId":1,
                  "value":'Audi'
            }
        ];


        let departments = [
            {
                "label": "Documents",
                "id_" : "1",
                "data": "Documents Folder",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "expanded": true,
                "children": [{
                        "label": "Work",
                        "id_" : "11",
                        "data": "Work Folder",
                        "expandedIcon": "fa-folder-open",
                        "collapsedIcon": "fa-folder",
                          "expanded": true,
                        "children": [{"label": "Expenses.doc", "icon": "fa-file-word-o", "data": "Expenses Document"}, {"label": "Resume.doc", "icon": "fa-file-word-o", "data": "Resume Document"}]
                    },
                    {
                        "label": "Home",
                        "data": "Home Folder",
                        "id_" : "12",
                        "expandedIcon": "fa-folder-open",
                        "collapsedIcon": "fa-folder",
                        "children": [{"label": "Invoices.txt", "icon": "fa-file-word-o", "data": "Invoices for this month"}]
                    }]
            },
            {
                "label": "Pictures",
                "id_" : "2",
                "type" : 'biz',
                "data": "Pictures Folder",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "expanded": true,
                "children": [
                    {"label": "barcelona.jpg", "icon": "fa-file-image-o","type" : 'biz', "data": "Barcelona Photo","id_" : "21",},
                    {"label": "logo.jpg", "icon": "fa-file-image-o", "type" : 'biz',"data": "PrimeFaces Logo" ,"id_" : "22",},
                    {"label": "primeui.png", "icon": "fa-file-image-o", "type" : 'biz',"data": "PrimeUI Logo"}]
            },
            {
                "label": "Movies",
                "id_" : "3",
                "data": "Movies Folder",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "expanded": true,
                "children": [{
                        "label": "Al Pacino",
                        "data": "Pacino Movies",
                        "id_" : "31",
                        "children": [{"label": "Scarface", "icon": "fa-file-video-o", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "fa-file-video-o", "data": "Serpico Movie"}]
                    },
                    {
                        "label": "Robert De Niro",
                        "id_" : "32",
                        "data": "De Niro Movies",
                        "children": [{"label": "Goodfellas", "icon": "fa-file-video-o", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "fa-file-video-o", "data": "Untouchables Movie"}]
                    }]
            }
        ];

        

        let login = [];

        return {
            users: users,
            departments: departments,
            login: login
        };
    }
}
