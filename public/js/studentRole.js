

	// 标签页切换
	$(".navDiv li a").click(function(e)
	{
		e.preventDefault();
		$(this).tab("show");
	});


	// 轮播图
	$('.carousel').carousel({
	  pause: "false"
	});


 	// 提交申请入住宿舍表单
 	// $("#appLodForm").on("submit",function()
 	$("#btnAppLod").on("click", function()
 	{
 		var name = $("#inputName"),
 			sid = $("#inputSID"),
 			college = $("#selectCollege"),
 			gender = $("#inputGender"),
 			lodging = $("#selectLodging"),
 			room = $("#roomNum");

 		//检查数据合法性
 		if(name.val() == "")
 		{
 			let span = "<span class='warningLetter'>姓名不能为空</span>";
 			if(name.parent().children("span"))
			{
				name.parent().children("span").remove();
			}
 			name.parent().append(span);
 			name.focus();
 			return;
 		}
 		if(sid.val() == "")
 		{
 			let span = "<span class='warningLetter'>学号不能为空</span>";
 			if(sid.parent().children("span"))
 			{
 				sid.parent().children("span").remove();
 			}
 			sid.parent().append(span);
 			sid.focus();
 			return;
 		}
 		if(!/^[0-9]{11}$/.test(sid.val()))
 		{
 			let span = "<span class='warningLetter'>学号格式应为11位数字</span>";
 			if(sid.parent().children("span"))
 			{
 				sid.parent().children("span").remove();
 			}
 			sid.parent().append(span);
 			sid.select();
 			return;
 		}
 		if(college.val() == "")
 		{
 			let span = "<span class='warningLetter'>请选择所在学院</span>";
 			if(college.parent().children("span"))
			{
				college.parent().children("span").remove();
			}
 			college.parent().append(span);
 			college.focus();
 			return;
 		}


 		//打包数据
 		var appLodFormData = processData("appLodForm");
 		console.log(appLodFormData);

 		//发送给后台
 		$.ajax({
 			type: "post",
 			url: "api/studentRole/appLodForm",
 			data: appLodFormData,
 			dataType: "json",
 			cache: false
 			// success: function(result){
 			//
 			// },
 			// error: function(XMLHttpRequest, textStatus, errorThrown) {
    //             console.log(XMLHttpRequest.status);		//200
    //             console.log(XMLHttpRequest.readyState);	//4
    //             console.log(textStatus);
    //         }
 		});


 		alert("提交成功!");
		//清空输入
		name.val("");
		sid.val("");
		college.val("");
		room.val("");
		//如果有警示文字，去掉
		if(name.parent().children("span"))
		{
			name.parent().children("span").remove();
		}
		if(sid.parent().children("span"))
		{
			sid.parent().children("span").remove();
		}
		if(college.parent().children("span"))
		{
			college.parent().children("span").remove();
		}
		//切换到“业务进度”标签页
		$(".navDiv li:last-child a").trigger("click");
		
		

 		// return false;	//阻止刷新页面
 	});



 	// 提交报修表单
 	$("#fixForm").on("submit",function()
 	{
 		var building = $("#selectBuilding"),
 			room = $("#roomNumber"),
 			id = $("#fixId"),
 			name = $("#fixName"),
 			item = $("#item"),
 			phone = $("#phone"),
 			details = $("#details"),
 			spareDay = $("#spareDay"),
 			remark = $("#remark");

 		//打包数据
 		var fixFormData = processData("fixForm");
 		console.log(fixFormData);

 		//发送给后台
 		$.ajax(
 		{
 			type: "post",
 			url: "api/studentRole/fixForm",
 			data: fixFormData,
 			dataType: "json",
 			success: function(result)
 			{
 				console.log("success send the fix data.");
 			}
 		});

 		alert("报修成功！");
 		//清空输入
 		building.val("");
 		room.val("");
 		id.val("");
 		name.val("");
 		item.val("");
 		phone.val("");
 		details.val("");
 		remark.val("");

 		//切换到“业务进度”标签页
		$(".navDiv li:last-child a").trigger("click");


 		return false;	//阻止刷新页面
 	});


 	//报修标签页-在宿舍时间
 	(function()
 	{
 		var dd = new Date();
 		var y = dd.getFullYear();	//获取年份
 		var m = dd.getMonth()+1;	//获取月份（月份从0-11为一月到十二月）
 		var d = dd.getDate();		//获取日期
 		var w = dd.getDay();		//获取星期几(0-6对应为星期日到星期六)

 		var html = "";
 		for(let i = 1; i < 10; i ++)
 		{
 			let day = m+"月"+(d+i)+"日"+"("+getWeekday((w+i)%7)+")";
 			html += "<option value='"+day+"'>"+day+"</option>";
 		}
 		//插入到文档里
 		$("#spareDay").append(html);
 	})();




 	//业务进度表格
 	$("#myProgress").bootstrapTable(
 	{
 		method: 'post',
        contentType: "application/x-www-form-urlencoded",
        // url: '/medicine/selectStock',
        cache: false,						//是否使用缓存
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        showToggle:true,                    //是否显示详细视图和列表视图
 		rowStyle: rowStyles
 	});




 	//表格行样式
 	function rowStyles(row, index)
 	{
 		if(row.progress == "已处理")
 		{
 			return {classes : "success"};
 		}
 		else if(row.progress == "处理中")
 		{
 			return {classes : "warning"};
 		}
 	}



 	//表格列格式化
	function runningFormatter(value, row, index)//序号,从0开始
	{
		return index+1;
	}

 	//转换星期几
 	function getWeekday(w)
 	{
 		var weekday = "";
 		switch(w)
 		{
 			case 0:
 				weekday = "星期日";
 				break;
 			case 1:
 				weekday = "星期一";
 				break;
 			case 2:
 				weekday = "星期二";
 				break;
 			case 3:
 				weekday = "星期三";
 				break;
 			case 4:
 				weekday = "星期四";
 				break;
 			case 5:
 				weekday = "星期五";
 				break;
 			case 6:
 				weekday = "星期六";
 				break;
 			default:
 				weekday = "系统错误，无法读取日期！";
 				break;
 		}
 		return weekday;
 	}




 	//工具函数：处理表单数据以转成JSON格式字符串
	function processData(frmName)
	{
		//序列化获得表单数据(即查询条件)
		var frmData = $('#'+frmName).serializeArray();

		//将序列化数据转为对象
		var frmObject = {};
		for(var item in frmData)
		{
			frmObject[frmData[item].name] = frmData[item].value;
		}



		return frmObject;
	}
