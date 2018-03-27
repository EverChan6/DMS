
	// 轮播图
	$('.carousel').carousel({
	  pause: "false"
	});



	// 标签页切换
	$(".navDiv li a").click(function(e)
	{
		e.preventDefault();
		$(this).tab("show");
	});



// 暂且放过你，哼！
$(".navDiv li:last-child a").click(function(){
	$("#myProgress").bootstrapTable({
 		// $.ajax(
 		// {
	 		method: 'get',
	        url: 'api/studentRole/myProgress',
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8",
	        cache: false,						//是否使用缓存
	        showColumns: true,                  //是否显示所有的列
	        showRefresh: true,                  //是否显示刷新按钮
	        showToggle:true,                    //是否显示详细视图和列表视图
	 		rowStyle: rowStyles,
	 		
 			onLoadSuccess: function(result)
 			{
 				console.log("success rendering data.");
 				//如果没有响应操作记录或者服务器内部错误
 				if(result.code == 2)
 				{
 					console.log(result.message);
 				}
 				//取到数据，并成功渲染
 				else if(result.code == 4)
 				{
 					console.log(result.message);

 					//最不济的方案就是这样子啦(在这里渲染数据)
 					var $tbody = $("#myProgress tbody");
 					if($tbody.children().first().val() == "")
 					{
 						$tbody.children().first().remove();
 					}
 					let tr = "<tr><td></td><td>"+result.data.id+"</td><td>"+result.data.name+"</td><td>"+result.data.dormitory
 								+"</td><td>"+result.data.room+"</td><td></td><td></td></tr>";
 					$tbody.append(tr);
 				}
 			},
 			onLoadError: function(e)
 			{
 				console.log("some error occur: "+e.statusText);
 			}

 		});//end-ajax



 	});//end-bootstrapTable










	//点击具体通知
	$(".notice").on("click", showNotice);
	function showNotice(e)
	{
		var event = e || window.e;
		var target = event.target || event.srcElement;
		console.log(target);

		//取得点击通知的标题
		var title = target.innerText;
		console.log(title);

		//先把原来的保存下来，以便恢复
		var $home = $("#home");
		var $ph = $("#home .panel-heading");
		var $pb = $("#home .panel-body");
		var $preHeading = $ph.html();	//原来的panel-heading（HTML片段
		var $preBody = $pb.html();		//原来的panel-body（HTML片段
	

		//替换标签标题
		$ph.html("<h4 class='panel-title'><a href='#' id='return'><返回</a></h4>");

		//替换标签内容
		$pb.html("您点击了第几个通知");

		

		//点击返回，则回到上一页
		$("#return").click(function()
		{
			//听说如果是表单，go会保留表单数据，而back不会（好像会刷新页面
			// history.go(-1);

			//要的效果应该是回到上一个面板，就首页通知，上面那个不行！
			$ph.html($preHeading);
			$pb.html($preBody);
			//重新注册点击事件。。。
			$(".notice").on("click", showNotice);

		});


	};
	

	



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
 			cache: false,
 			success: function(result)
 			{
 				if(result.code == 2)
 				{
 					alert(result.message);
 				}
 				else if(result.code == 4)
 				{
 					alert(result.message);
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
 				}
 			
 			},//end-success
 			error: function(XMLHttpRequest, textStatus, errorThrown) 
 			{
                console.log(XMLHttpRequest.status);		//200
                console.log(XMLHttpRequest.readyState);	//4
                console.log(textStatus);
            }//end-error
 		
 		});//end-ajax


 	});



 	// 提交报修表单
 	// $("#fixForm").on("submit",function()
 	$("#btnFix").click(function()
 	{
 		let building = $("#selectBuilding"),
 			room = $("#roomNumber"),
 			id = $("#fixId"),
 			name = $("#fixName"),
 			item = $("#item"),
 			phone = $("#phone"),
 			details = $("#details"),
 			spareDay = $("#spareDay"),
 			remark = $("#remark");

 		//检查数据合法性
 		if(building.val() == "")
 		{
 			let span = "<span class='warningLetter'>请选择所在宿舍楼</span>";
 			if(building.parent().children("span"))
			{
				building.parent().children("span").remove();
			}
 			building.parent().append(span);
 			building.focus();
 			return;		//阻止提交表单
 		}//end-if
 		if(room.val() == "")
 		{
 			let span = "<span class='warningLetter'>房间号不能为空</span>";
 			if(room.parent().children("span"))
			{
				room.parent().children("span").remove();
			}
 			room.parent().append(span);
 			room.focus();
 			return;
 		}//end-if
 		if(id.val() == "")
 		{
 			let span = "<span class='warningLetter'>学号不能为空</span>";
 			if(id.parent().children("span"))
			{
				id.parent().children("span").remove();
			}
 			id.parent().append(span);
 			id.focus();
 			return;
 		}//end-if
 		if(!/^[0-9]{11}$/.test(id.val()))
 		{
 			let span = "<span class='warningLetter'>学号格式应为11位数字</span>";
 			if(id.parent().children("span"))
 			{
 				id.parent().children("span").remove();
 			}
 			id.parent().append(span);
 			id.select();
 			return;
 		}//end-if
 		if(phone.val() == "")
 		{
 			let span = "<span class='warningLetter'>联系电话不能为空</span>";
 			if(phone.parent().children("span"))
			{
				phone.parent().children("span").remove();
			}
 			phone.parent().append(span);
 			phone.focus();
 			return;
 		}//end-if
 		if(!/^1[34578]\d{9}$/.test(phone.val()))
 		{
 			let span = "<span class='warningLetter'>电话号码格式不对</span>";
 			if(phone.parent().children("span"))
 			{
 				phone.parent().children("span").remove();
 			}
 			phone.parent().append(span);
 			phone.select();
 			return;
 		}




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
 				if(result.code == 2)
 				{
 					alert(result.message);
 				}//end-if
 				else if(result.code == 4)
 				{
 					console.log("success send the fix data.");
 					alert(result.message);
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
	 			}//end-elseif
 				
 			},//end-success
 			error: function(XMLHttpRequest, textStatus, errorThrown) 
 			{
                console.log(XMLHttpRequest.status);		
                console.log(XMLHttpRequest.readyState);	
                console.log(textStatus);
            }//end-error

 		});//end-ajax

 		return false;

 	});//end-btnFix


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
		// return JSON.stringify(frmObject);
	}
