"use strict";
export const spuType  = {
	data: [  
            {  
                "data":{  
                    "name":"原料",
                    "comment":"最基本的原材料",
                    "type":"Folder",
                    "id":1,
                    "parentId":null
                },
                "leaf": false,
                "children":[
                    {  
                        "data":{  
                            "name":"五金",
                            "comment":"55kb",
                            "type":"Folder",
                            "id":1,
                            "parentId":1,
                        },
                    },
                    {  
                        "data":{  
                            "name":"布&皮",
                            "comment":"20kb",
                            "type":"Folder",
                            "id":1,
                            "parentId":1,
                        },
                    }
                ]
            },
            {  
                "data":{  
                    "name":"半成品",
                    "comment":"还需在生产的物料",
                    "type":"Folder",
                    "id":1
                },
                "leaf": false,
                
            },
            {  
                "data":{  
                    "name":"产成品",
                    "comment":"。。。。",
                    "type":"Folder",
                    "id":1
                },
                "leaf": false,
               
            },
            {  
                "data":{  
                    "name":"商品",
                    "comment":"。。。。",
                    "type":"Folder",
                    "id":1
                },
                "leaf": true,
               
            }
        ]

}