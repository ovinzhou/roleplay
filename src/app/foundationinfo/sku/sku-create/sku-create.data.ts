"use strict";
export const SelectItem = {
	// 生产方式
	productModeItems:[
		{id:'SELF_SUPPOR', text:'自制'},
		{id:'OUT_SOURCE', text:'委外'},
		{id:'PURCHASE', text:'采购'},
		{id:'IN_COMING', text:'来料'}
	],
	//交付方式
	handleModeItems:[
		{id:'MAKE_ORDER', text:'按单'},
		{id:'SPARE_PORT', text:'备品'},
		{id:'SPARE_ORDER', text:'按单和备品'}
	],
	//提前期
    leadTimeItems:[
        {id:'minute', text:'分钟'},
        {id:'hour', text:'小时'},
        {id:'day', text:'天'}
    ]
};

export const DetailData = {
	data:{
		id:'123123',
        code:'1110111',
        name:'铁盒——A43_白色_上黑',
        firstLevel:'原材料1',
        secondLevel: "原材料-1",
  		thirdlLevel: "原材料-1-1",
        sputype:'',
        handleMode:'SELF_SUPPOR',
        productMode:'MAKE_ORDER',
        mrpCalc:true,
        userGroupId:'111',
        typeId:'',
        measureType:111,
        spuMeasureId:111E001,
        spuAttrs:[
        	{
	          id: "1",  
	          spuId: "1", 
	          name:'颜色',
	          attrId: "40286a815b19dcad015b19e53698000b", 
	          forSkuEncode: true, 
	          sort: 1, 
	          values: [ 
	              {
	                  id: "40286a815b1ccd7b015b1ccf648b0002", 
	                  code: "12312321312", 
	                  value: "红色"
	              },
	              {
	                  id: "40286a815b1ccd7b015b1cd1018a000b",
	                  code: "111",
	                  value: "白色"
	              },
	              {
	                  id: "40286a815b1ccd7b015b1c23018a000b",
	                  code: "111",
	                  value: "蓝色"
	              }
	          ],
	          activeValues:[
	          	  {
	                  id: "40286a815b1ccd7b015b1cd1018a000b",
	                  code: "111",
	                  value: "白色"
	              },
	              {
	                  id: "40286a815b1ccd7b015b1c23018a000b",
	                  code: "111",
	                  value: "蓝色"
	              }
	          ]
      		},
      		{
	          id: "2",  
	          spuId: "1", 
	          name:'型号',
	          attrId: "40286a815b1123ad015b19e53698000b", 
	          forSkuEncode: false, 
	          sort: 1, 
	          values: [ 
	              {
	                  id: "40286a815b1ccd7b015b1ccf648b0002", 
	                  code: "12312321312", 
	                  value: "小号"
	              },
	              {
	                  id: "40286a815b1ccd7b015b1cd1018a000b",
	                  code: "111",
	                  value: "中号"
	              },
	              {
	                  id: "40286a815b1ccd7b015b1c23018a000b",
	                  code: "111",
	                  value: "大号"
	              }
	          ],
	          activeValues:[
	          	  {
	                  id: "40286a815b1ccd7b015b1ccf648b0002", 
	                  code: "12312321312", 
	                  value: "小号"
	              },
	              {
	                  id: "40286a815b1ccd7b015b1cd1018a000b",
	                  code: "111",
	                  value: "中号"
	              },
	          ]
      		}
        ],
        spuBoms:[],
        spuProcedures:[],
        comment:'',
        piffer:0.25,
        pifferComment:'这个是标准的皮费哦',
	}
}

