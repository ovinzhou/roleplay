[TOC]



#### Dynamic-form directory
	dynamic-form/
		correlators/			//关联器
		data/					//本地测试数据
		fine-uploader/			//第三方文件上传控件
		initializer/			//初始化器/render
		jquery-ui/				//jquery-ui控件
		transtype-customized/	//流程类型定制开发,某流程类型协议以外的功能,代码里直接fggods001,只针对某流程界面
		validaters/				//校验器
		choice.js				//选择数据控件
		combobox.js				//下拉列表控件
		core.js					//jquery-ui核心
		datetime.js				//日期控件,封装jquery-ui/jquery.datetimepicker.full.js
		debug.html				//本地调试界面,传递data/xxx.json可以直接查看界面
		disabled.html			//查看流程详情界面,只读
		display.html			//流程发起界面
		field.js				//控件核心
		file-update.js			//文件上传控件
		grid.js					//grid组件,grid-layout核心
		image.js				//图片控件
		jquery-1.12.3.min.js
		label.js				//控件文字
		layout-column.js
		layout-flow.js
		layout-grid.js
		multi-step-choice.js	//多步选择控件,列可以定制
		number.js				//数字空间爱你
		rfd.css					//表单样式
		rfd.js					//表单入口,查询协议,构造界面,执行流程定制开发
		section.js				//段落控件
		show.html				//审批界面
		tasklog.html			//只读界面
		text.js					//文本框控件
		validater.js			//校验链逻辑封装,给控件绑定校验器链,具体校验逻辑在每个校验器中
		validationEngine.jquery.css		//校验样式
		widget.js				//jquery-widget核心
###本地调试
```html
<script>
			$(function(){
				$("body").rfd({debug:true,debugUrl:'data/zyjgrkykl.json'});//本地调试
			});
		</script>
```
