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
		id:'',
        code:'',
        name:'',
        sputype:'',
        handleMode:'',
        mrpCalc:'',
        userGroupId:'',
        typeId:'',
        measureType:'',
        spuMeasureId:'',
        productMode:'',
        spuAttrs:[],
        spuBoms:[],
        spuProcedures:[],
        comment:'',
        piffer:'',
        pifferComment:''
    }
}

