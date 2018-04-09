
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

	initTable();

	// 我的业务进度表格
	function initTable(){

			$("#myProgress").bootstrapTable({
				method: "post",
		        url: "api/studentRole/myProgress",
		        contentType: "application/x-www-form-urlencoded",
		        cache: false,						//是否使用缓存
		        pagination: true,					//启用分页
		 		pageNumber: 1,						//初始化加载第一页，默认第一页
		 		pageSize: 10,						//每页的记录行数
		 		pageList: [10,20,50],				//可供选择的每页行数
		 		sidePagination: "server",			//服务端分页
		        queryParams: function(params){		//查询参数
		        	var queryData = {};
		        	//增加两个请求时向服务端传递的参数
		        	queryData.limit = params.limit;
		        	queryData.offset = params.offset;
		        	return queryData;
		        },			
		        showColumns: true,                  //是否显示所有的列
		        showRefresh: true,                  //是否显示刷新按钮
		        showToggle:true,                    //是否显示详细视图和列表视图
		 		// rowStyle: rowStyles,				//行样式		
		 		columns: [
		 		{
		 			field: "index",
		 			title: "序号",
		 			align: "center",
		 			formatter: runningFormatter
		 		},
		 		{
		 			field: "id",
		 			title: "学号",
		 			align: "center"
		 		},
		 		{
		 			field: "name",
		 			title: "姓名",
		 			align: "center"
		 		},
		 		{
		 			field: "dormitory",
		 			title: "宿舍楼",
		 			align: "center"
		 		},
		 		{
		 			field: "room",
		 			title: "房间号",
		 			align: "center"
		 		},
		 		{
		 			field: "spareDay",
		 			title: "日期",
		 			align: "center"
		 		},
		 		{
		 			field: "spareTime",
		 			title: "时间",
		 			align: "center"
		 		},
		 		{
		 			field: "item",
		 			title: "业务项目",
		 			align: "center"
		 		},
		 		{
		 			field: "operation",
		 			title: "操作",
		 			align: "center",
		 			formatter: operateFormatter,
		 			events: 'window.operateEvents'
		 		}],
		 		onLoadSuccess: function(result)
		 		{
		 			console.log("成功加载业务进度表格");
		 		},
		 		onLoadError: function(err)
		 		{
		 			console.log("error: "+err);
		 		}
	 		});//end-bootstrapTable


	}//end-initTable	



	//表格序号列
	function runningFormatter(value, row, index)//序号,从0开始
	{
		return index+1;
	}
	//表格操作列
	function operateFormatter(value, row, index)
	{
		return "<button id='del' type='button' class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> 删除</button>"+
				"<button id='done' type='button' class='btn btn-primary btn-sm'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> 完成</button>";
	}




	//从数据库取出全部通知,此处只渲染五条标题及时间
	$.ajax(
	{
		type: "get",
		url: "api/getAllNotices",
		dataType: "json",
		success: function(result)
		{
			if(result.code == 4)
			{
				// console.log(result.message);					//服务端返回的信息

				//注意这是个全局变量，因为后面点击具体通知的时候会用到
				data = result.data;								//要渲染的数据（包括标题、发布单位、时间和内容

				//这里渲染首页最新通知
				showHome(data);

				//这里渲染全部历史通知公告
				showHistory(data);




			}//end-if

		},
		error: function(e)
		{
			console.log(e.status);
		}
	});//end-ajax



	function showHome(data)
	{
		let $anotice = $(".notice");					//取得a标签，以渲染标题
		// console.log($anotice);
		let $span = $(".time");							//取得span标签，以渲染时间
		// console.log($span);

		//轮播图的h3和p
		let $h3 = $(".carousel-caption h3");
		// console.log($h3);
		let $p = $(".carousel-caption p");
		// console.log($p);

		//不用了，后台已经按照降序查找最近的记录了
		//将数组反序（因为要先显示最新的
		// data.reverse();

		for(let i = 0; i < 5; i ++)						//首页只显示5条
		{
			// console.log($anotice[i].innerText);		//jQuery .text()方法前面一定是个dom对象才能用。
			$anotice[i].innerText = data[i].title;		//通知的标题
			$span[i].innerText = data[i].time;			//通知的发布时间

			//轮播图的h3和p
			if(i < 3)			//因为轮播图只显示3张
			{
				$h3[i].innerText = data[i].title;
				$p[i].innerText = data[i].time;
			}
			
		}//end-for

	}

	
	function showHistory(data)
	{
		var histories = "";
		for(let i = 0; i < data.length; i ++)
		{
			//拼接
			histories += '<li><a href="#" class="notice">'+data[i].title+'</a><span class="time">'+data[i].time+'</span></li>'
		}
		console.log(histories);
		//插入DOM
		$("#allNotices .panel-body ul").append(histories);
	}





	//点击具体通知
	$(".notice").on("click", showNotice);
	function showNotice(e)
	{
		//取得事件源
		var event = e || window.e;
		var target = event.target || event.srcElement;
		// console.log("target: "+target);


		//取得点击通知的标题
		// var title = target.text();
		var title = target.innerText;
		// console.log("title: "+title);

		//先把原来的保存下来，以便恢复
		var $home = $("#home");
		var $ph = $("#home .panel-heading");
		var $pb = $("#home .panel-body");
		var $preHeading = $ph.html();	//原来的panel-heading（HTML片段
		var $preBody = $pb.html();		//原来的panel-body（HTML片段
	

		//取得具体通知的内容，放进html标签里
		for(let i = 0; i < data.length; i ++)
		{
			if(title == data[i].title)	//匹配
			{
				$("#showTitle").text(data[i].title);
				$("#showContents").text(data[i].contents);
				$("#showAuther").text(data[i].auther);
				$("#showTime").text(data[i].time);
			}
		}
		var $nh = $(".newHeading").html();						//渲染新的面板标题
		var $nb = $("#showNotice").html();						//渲染新的面板内容：具体通知内容

		//替换标签标题
		$ph.html($nh);

		//替换标签内容
		$pb.html($nb);

		

		//点击返回，则回到上一页
		$("#return").click(back);
		function back()
		{
			console.log("这是back里的return函数");
			//听说如果是表单，go会保留表单数据，而back不会（好像会刷新页面
			// history.go(-1);

			//要的效果应该是回到上一个面板，就首页通知，上面那个不行！
			$ph.html($preHeading);
			$pb.html($preBody);


			//重新注册点击事件
			//这是从首页点击具体通知后返回首页
			$(".notice").on("click", showNotice);
			$("#more").on("click", showAllNotices);
			
			//这是从（更多里的）全部通知点击具体通知后返回全部通知
			$("#return").on("click", back);
		}


	};//end-showNotice
	


	



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
 			check(name, span);
 			return;
 		}
 		if(sid.val() == "")
 		{
 			let span = "<span class='warningLetter'>学号不能为空</span>";
 			check(sid, span);
 			return;
 		}
 		if(!/^[0-9]{11}$/.test(sid.val()))
 		{
 			let span = "<span class='warningLetter'>学号格式应为11位数字</span>";
 			check(sid, span);
 			return;
 		}
 		if(college.val() == "")
 		{
 			let span = "<span class='warningLetter'>请选择所在学院</span>";
 			check(college, span);
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
					checkWarn(name);
					checkWarn(sid);
					checkWarn(college);
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


 	});//end-提交申请



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
 			check(building, span);
 			return;		//阻止提交表单
 		}//end-if
 		if(room.val() == "")
 		{
 			let span = "<span class='warningLetter'>房间号不能为空</span>";
 			check(room, span);
 			return;
 		}//end-if
 		if(id.val() == "")
 		{
 			let span = "<span class='warningLetter'>学号不能为空</span>";
 			check(id, span);
 			return;
 		}//end-if
 		if(!/^[0-9]{11}$/.test(id.val()))
 		{
 			let span = "<span class='warningLetter'>学号格式应为11位数字</span>";
 			check(id, span);
 			return;
 		}//end-if
 		if(phone.val() == "")
 		{
 			let span = "<span class='warningLetter'>联系电话不能为空</span>";
 			check(phone, span);
 			return;
 		}//end-if
 		if(!/^1[34578]\d{9}$/.test(phone.val()))
 		{
 			let span = "<span class='warningLetter'>电话号码格式不对</span>";
 			check(phone, span);
 			return;		//阻止提交表单
 		}



 		//打包数据
 		var fixFormData = processData("fixForm");
 		// console.log(fixFormData);

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
 					alert(result.message);
			 		//清空输入
			 		$("#btnReset").trigger("click");
			 		//去除警示文字
			 		checkWarn(building);
			 		checkWarn(room);
			 		checkWarn(id);
			 		checkWarn(phone);

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




 	//增加警示文字
	function check(ele, span)
	{
		//如果有警示文字，则去除
		if(ele.parent().children("span"))
		{
			ele.parent().children("span").remove();
		}
		//否则，提示警示
		ele.parent().append(span);
		//获取焦点
		ele.focus();
		//选择文本
		ele.select();
		return;
	}


	//清除警示文字
	function checkWarn(ele)
	{
		//如果有警示文字，则去除
		if(ele.parent().children("span"))
		{
			ele.parent().children("span").remove();
		}
	}






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



 	window.operateEvents = {

 		'click #del': function(e, value, row, index){	
 			console.log("您点击了删除按钮");

 			var boolValue = confirm("确定删除吗？");

 			//选择确定删除
 			if(boolValue == true)
 			{
 				//取得当前行的信息
	 			console.log(row);
	 			//在数据库里删除该记录
	 			$.ajax(
	 			{
	 				method: "post",
	 				url: "api/del",
	 				data: row,
	 				dataType: "json",
	 				success: function(result)
	 				{
	 					alert(result.message);
	 				},
	 				error: function(result)
	 				{
	 					console.log(result.message);
	 				}
	 			});
 			}
 			else    //选择取消
 			{
 				
 			}


 		},
 		'click #done': function(e, value, row, index){


 			//把该项记录在数据库记录的status字段设置为"已处理"，本来应该是"未处理"
 			$.ajax(
 			{
 				method: "post",
 				url: "api/done",
 				data: row,
 				dataType: "json",
 				success: function(result)
 				{
 					console.log(result.message);
 					//把删除跟完成按钮变成已处理
 					e.target.parentNode.innerHTML = "<span>已处理</span>";
 				},
 				error: function(error)
 				{
 					console.log(error);
 				}

 			});

 			//然后把这个td里的内容变成文字“已处理”


 		}

 	};

 	
 	




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




 	//工具函数：处理表单数据
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
