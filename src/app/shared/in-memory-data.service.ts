import {InMemoryDbService} from "angular-in-memory-web-api";
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let profileSummary = {
            id: 'test',
            avatar: {
                id: 'testAvatarId',
                url: 'http://placekitten.com/g/40/40'
            },
            username: 'Vito Liu',
            title: 'UE设计师',
            gender: 'gender',
            cellphone: '18088888888'
        };

        let profileDetail = {
            id: 'test',
            avatar: {
                id: 'testAvatarId',
                url: 'http://placekitten.com/g/40/40'
            },
            username: 'Vito Liu',
            title: 'UE设计师',
            gender: 'gender',
            cellphone: '18088888888',
            email: 'ttt@tt.com',
            wechatAccount: 'wx111',
            birthday: 1234567890,
            department: {
                id: 'testDepartmentId',
                name: '开发部'
            },
            position: {
                id: 'testPositionId',
                name: '码农'
            }
        };

        let messages = [];
        let contacts = [];
        let organizations = [{
            id: 'current',
            name: '福瑞登',
            description: '深圳福瑞登信息技术有限公司',
            industry: '互联网/计算机',
            district: '深圳市',
            scale: '300-100人',
            howManyUsers: 66,
        }];

        let menus = [
            {
                groupId: '1',
                groupName: '组织管理',
                children: [
                    {id: '1_1', name: '用户', type: '', action: 'UsersComponent'},
                    {id: '1_2', name: '权限', type: '', action: 'PermissionSetsComponent'},
                ]
            },
            {
                groupId: '2',
                groupName: '系统管理',
                children: [
                    {id: '2_1', name: '插件管理', type: '', action: 'PluginsComponent'}
                ]
            }
        ];

        let users = [{
            id: '1',
            displayName: '贝正',
            cellphone: '13888888888',
            username: 'beizheng',
            role: '码农',
            department: '业务部',
            avatarId: '',
            avatarUrl: '',
            gender: '',
            birthday: '',
            age: '',
            province: '',
            city: '',
            signature: '',
            enabled: true,
            createdAt: 1234567890,
        }, {
            id: '2',
            displayName: '甘怡',
            cellphone: '13888888888',
            username: 'ganyi',
            role: '美工',
            department: '采购部',
            avatarId: '',
            avatarUrl: '',
            gender: '',
            birthday: '',
            age: '',
            province: '',
            city: '',
            signature: '',
            enabled: true,
            createdAt: 1234567890,
        }, {
            id: '3',
            displayName: '海亮',
            cellphone: '13888888888',
            username: 'hailiang',
            role: '测试',
            department: '',
            avatarId: '',
            avatarUrl: '',
            gender: '',
            birthday: '',
            age: '',
            province: '',
            city: '',
            signature: '',
            enabled: true,
            createdAt: 1234567890,
        }];

        let roles = [
            {
                id: '1',
                code: 'ROLE1',
                name: '设计师',
            },
            {
                id: '2',
                code: 'ROLE2',
                name: '工程师',
            },
            {
                id: '3',
                code: 'ROLE3',
                name: '运营专员',
            },
            {
                id: '4',
                code: 'ROLE4',
                name: '美工',
            },
        ];

        let departments = [
            {
                id: '1',
                code: 'DEP1',
                name: '业务部',
            },
            {
                id: '2',
                code: 'DEP2',
                name: '采购部',
            },
            {
                id: '3',
                code: 'DEP3',
                name: '生产部',
            },
            {
                id: '4',
                code: 'DEP4',
                name: '总经办',
            },
        ];

        let genders = [{name: '男', code: 'MALE'}, {name: '女', code: 'FEMALE'}];

        let plugins = [
            {
                id: '1',
                name: 'Dashboard',
                group: '',
                description: '主菜单展示。',
                version: '1.0',
                authorName: 'x',
                updateDate: 1234567890,
                downloadCounter: 123,
                score: 3,
                stopable: false,
                uninstallable: true,
                started: true,
                isInstalled: true,
            },
            {
                id: '2',
                name: '用户管理',
                group: '',
                description: '可对用户进行新增、编辑、查看、禁止、删除等管理。',
                version: '1.0',
                authorName: 'x',
                updateDate: 1234567890,
                downloadCounter: 123,
                score: 3,
                stopable: false,
                uninstallable: true,
                started: true,
                isInstalled: true,
            },
            {
                id: '3',
                name: '关于Rolepaly团队',
                group: '',
                description: '可查看Roleplay团队成员信息。',
                version: '1.0',
                authorName: 'x',
                updateDate: 1234567890,
                downloadCounter: 123,
                score: 2,
                stopable: true,
                uninstallable: false,
                started: false,
                isInstalled: true,
            },
            {
                id: '4',
                name: '关于Rolepaly团队2',
                group: '',
                description: '可查看Roleplay团队成员信息。',
                version: '1.0',
                authorName: 'x',
                updateDate: 1234567890,
                downloadCounter: 123,
                score: 2,
                stopable: true,
                uninstallable: false,
                started: true,
                isInstalled: true,
            },
        ];

        let store = {
            plugins: [
                {
                    id: '1',
                    name: '人力资源管理',
                    group: '',
                    description: 'ttt。',
                    version: '1.0',
                    authorName: 'x',
                    updateDate: 1234567890,
                    downloadCounter: 123,
                    score: 3,
                    stopable: false,
                    uninstallable: true,
                    started: true,
                    isInstalled: true,
                },
                {
                    id: '2',
                    name: '管理人员测评工具',
                    group: '',
                    description: 'x。',
                    version: '1.0',
                    authorName: 'x',
                    updateDate: 1234567890,
                    downloadCounter: 32,
                    score: 3,
                    stopable: false,
                    uninstallable: true,
                    started: true,
                    isInstalled: true,
                },
                {
                    id: '3',
                    name: '企业人才地图',
                    group: '',
                    description: 'xx。',
                    version: '1.0',
                    authorName: 'x',
                    updateDate: 1234567890,
                    downloadCounter: 123,
                    score: 2,
                    stopable: true,
                    uninstallable: false,
                    started: true,
                    isInstalled: false,
                },
            ]
        };

        let login = [];

        let permissionSets = [
            {
                id: '1',
                name: '系统管理员',
            },
            {
                id: '2',
                name: '应用插件管理员',
            },
            {
                id: '3',
                name: '流程插件管理员',
            },
            {
                id: '4',
                name: '物料BOM管理员',
            },
            {
                id: '5',
                name: '人事管理',
            },

        ];

        return {
            messages: messages,
            contacts: contacts,
            myProfileSummary: profileSummary,
            myProfileDetail: profileDetail,
            menus: menus,
            organizations: organizations,
            users: users,
            roles: roles,
            departments: departments,
            genders: genders,
            plugins: plugins,
            store: store,
            login: login,
            permissionSets: permissionSets,
        };
    }
}
