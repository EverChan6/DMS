	


	// 标签页切换
	$(".navDiv li a").click(function(e)
	{
		e.preventDefault();
		$(this).tab("show");
	});


	//取得cookie信息
	$.ajax(
	{
		type: "get",
		url: "/getUsername",
		dataType: "json",
		success: function(result)
		{
			//渲染
			$(".showUser").prepend("欢迎你，"+result.username);
		},
		error: function(err)
		{
			console.log(err);
		}
	});




	$("#release").click(handler);
	//发布通知事件处理程序
	function handler()
	{
		//检查数据合法性
		var title = $("#inputTitle"),
			auther = $("#auther"),
			contents = $("#contents");
		if(title.val() == "" )
		{
			let span = "<span class='warningLetter'>标题不能为空</span>";
			check(title, span);
			return;
		}
		if(auther.val() == "")
		{
			let span = "<span class='warningLetter'>发布单位不能为空</span>";
			check(auther, span);
			return;
		}
		if(contents.val() == "")
		{
			let span = "<span class='warningLetter'>内容不能为空</span>";
			check(contents, span);
			//阻止表单提交
			return;
		}

		//打包数据（此处可考虑将processData函数放进公共的js文件中，记得的话就做
		var releaseData = processData("releaseForm");
		console.log(releaseData);


		//发送给后台（调用后台接口），后台存进数据库
		$.ajax(
		{
			type: "POST",
			url: "/managerRole/release",
			// data: releaseData,
			data:
			{
				inputTitle: title.val(),
				auther: auther.val(),
				contents: contents.val(),
				time: getTime()
			},
			dataType: "json",
			success: function(result)
			{
				console.log("您发布了一项通知。");
				// alert("发布成功！");
				//清空输入
				title.val("");
				auther.val("");
				contents.val("");

				//如有警告，去除警告文字
				checkWarn(title);
				checkWarn(auther);
				checkWarn(contents);

			},//end-success
			error: function(e)
			{
				console.log(e.readyState+"/"+e.status+"/");
			}//end-error
		});
	}//end-handler



	//来访登记表格
	$("#visitTable").bootstrapTable({
		method: "post",
		url: "/visit",
		contentType: "application/x-www-form-urlencoded",
		cache: false,
		pagination: true,
		pageSize: 10,
		pageNumber: 1,
		pageList: [5,10,20,50],
		sidePagination: "server",
		queryParams: visitParams,
		showColumns: true,
		showRefresh: true,
		showToggle: true,
		toolbar: "#toolbar",
		columns: [
		{
			align: "center",
			field: "index",
			title: "序号",
			formatter: runningFormatter
		},
		{
			align: "center",
			field: "name",
			title: "姓名"
		},
		{
			align: "center",
			field: "sex",
			title: "性别"
		},
		{
			align: "center",
			field: "reason",
			title: "来访事由"
		},
		{
			align: "center",
			field: "date",
			title: "来访日期"
		},
		{
			align: "center",
			field: "contact",
			title: "联系方式"
		}],
		onLoadSuccess: function(result)
		{
			console.log("来访信息加载成功");
		},
		onLoadError: function(error)
		{
			console.log(error);
		}
	});
	//打包查询条件
	function visitParams(params)
	{

		//序列化表单数据
		var queryData = processData("frmVisit");
		console.log(queryData);

		//增加两个请求时向服务端传递的参数
		queryData.limit = params.limit;
		queryData.offset = params.offset;

		return queryData;
	}
	
	//来访登记-点击登记
	$("#record").click(function()
	{
		$("#recordModal").modal("show");
		$("#recordModal").on("shown.bs.modal", function()
		{
			$("#name").focus();
		});

		//提交登记
		$("#record_ok").click(function()
		{
			let name = $("#name"),
				sex = $("#sex"),
				reason = $("#reason"),
				date = $("#date"),
				contact = $("#contact");
			//检查数据合法性
			if(name.val() == "")
			{
				let span = "<span class='warningLetter'>必填</span>";
				check(name, span);
				return;
			}
			if(date.val() == "")
			{
				let span = "<span class='warningLetter'>必填</span>";
				check(date, span);
				return;
			}
			if(!/^1[34578]\d{9}$/.test(contact.val()))
			{
				let span = "<span class='warningLetter'>手机号码格式不对</span>";
				check(contact, span);
				return;
			}
			//关闭模态窗
			$("#recordModal").modal("hide");
			//打包数据
			let recordData = processData("frmRecord");
			//把登记存进数据库
			$.ajax(
			{
				type: "post",
				url: "/record",
				data: recordData,
				dataType: "json",
				success: function(result)
				{
					console.log(result.message);
					//清空输入
					name.val("");
					sex.val("");
					reason.val("");
					date.val("");
					contact.val("");
					//清空警示
					checkWarn(name);
					checkWarn(date);
					checkWarn(contact);
				},
				error: function(error)
				{
					console.log(error);
				}
			});
		});
	});

	//来访登记-点击查询
	$("#find").click(function()
	{
		$("#visitTable").bootstrapTable(("refresh"));
	});

	//查询信息表格
	$("#searchTable").bootstrapTable({
		method: "post",
		url: "/search",
		contentType: "application/x-www-form-urlencoded",
		cache: false,
		pagination: true,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10,20,50,100,200],
		sidePagination: "server",
		queryParams: queryParam,
		showColumns: true,
		showRefresh: true,
		showToggle: true,
		columns: [
		{
			align: "center",
			field: "index",
			title: "序号",
			formatter: runningFormatter
		},
		{
			align: "center",
			field: "id",
			title: "学号"
		},
		{
			align: "center",
			field: "name",
			title: "姓名"
		},
		{
			align: "center",
			field: "sex",
			title: "性别"
		},
		{
			align: "center",
			field: "college",
			title: "学院"
		},
		{
			align: "center",
			field: "building",
			title: "宿舍楼"
		},
		{
			align: "center",
			field: "room",
			title: "房间号"
		},
		{
			field: "operate",
			title: "操作",
			align: "center",
			formatter: operateFormatter,
			events: "window.operateEvents"
		}],
		onLoadSuccess: function(result)
		{
			console.log("住宿信息加载成功");
		},
		onLoadError: function(e)
		{
			console.log("住宿信息加载失败");
			console.log(e);
		}
	});//end-bootstrapTable


	//打包查询条件
	function queryParam(params)
	{
		//序列化表单数据
		var queryData = processData("frmConditions");
		console.log(queryData);

		//增加两个请求时向服务端传递的参数
		queryData.limit = params.limit;
		queryData.offset = params.offset;

		return queryData;
	}


	//点击查询
	$("#query").click(function()
	{
		//检查数据合法性？应该可以不用吧，反正输入不合法就会查不到数据

		//刷新表格
		$("#searchTable").bootstrapTable(("refresh"));
	});

	

	//点击增加
	$("#add").click(function()
	{
		//检查数据合法性
		var id = $("#id"),
			name = $("#sname"),
			sex = $("#sex"),
			college = $("#college"),
			building = $("#building"),
			room = $("#room");
		if(id.val() == "")
		{
			let span = "<span class='warningLetter'>必填字段</span>";
 			check(id, span);
 			return;
		}
		if(!/^[0-9]{11}$/.test(id.val()))
		{
			let span = "<span class='warningLetter'>学号格式应为11位数字</span>";
 			check(id, span);
 			return;
		}
		if(name.val() == "")
		{
			let span = "<span class='warningLetter'>必填字段</span>";
 			check(name, span);
 			return;
		}
		if(sex.val() == "")
		{
			let span = "<span class='warningLetter'>必填字段</span>";
 			check(sex, span);
 			return;
		}
		if(!(sex.val() == "男" || sex.val() == "女"))
		{
			let span = "<span class='warningLetter'>性别应为“男”或“女”</span>";
 			check(sex, span);
 			return;
		}
		if(college.val() == "")
		{
			let span = "<span class='warningLetter'>请选择学院</span>";
 			check(college, span);
 			return;
		}
		if(building.val() == "")
		{
			let span = "<span class='warningLetter'>请选择宿舍楼号</span>";
 			check(building, span);
 			return;
		}
		if(room.val() == "")
		{
			let span = "<span class='warningLetter'>请填写房间号</span>";
			check(room, span);
 			return;
		}

		//存进数据库
		$.ajax(
		{
			url: "/add",
			type: "post",
			data: processData("frmConditions"),
			dataType: "json",
			success: function(result)
			{
				console.log(result.message);
				//清空输入
				if(result.code == 1)	//成功
				{
					//模拟重置按钮的点击行为以清空输入
					$("#reset").trigger("click");
					checkWarn(id);
					checkWarn(name);
					checkWarn(sex);
					checkWarn(college);
					checkWarn(building);
					checkWarn(room);

				}
			},
			error: function(e)
			{
				console.log(e);
			}
		});//end-ajax
	});//end-add


	//检查数据合法性
	function check(ele, span)
	{
		//如果此前已经有警告内容，则移除
		if(ele.parent().children("span"))
		{
			ele.parent().children("span").remove();
		}
		//否则，提示警告
		ele.parent().append(span);
		//获取焦点
		ele.focus();
		ele.select();
		// return;
	}

	//检查是否有警示文字
	function checkWarn(ele)
	{
		if(ele.parent().children("span"))
		{
			ele.parent().children("span").remove();
		}
	}

	function runningFormatter(value, row, index) 
	{
	    return index+1;
	}
	function operateFormatter(value, row, index)
	{
		return "<button id='edit' type='button' class='btn btn-primary btn-sm'><span class='glyphicon glyphicon-edit' aria-hidden='true'></span> 修改</button>"+
				"<button id='delete' type='button' class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> 删除</button>";
	}
	window.operateEvents = {
		'click #edit': function(e, value, row, index)
		{
			// console.log(value);		//这个value应该是button的value值
			console.log(row);
			console.log(index);			//要+1才能得到实际的

			$("#editModal").modal("show");
			$("#editModal").on("shown.bs.modal", function()
			{
				//填充信息
				$("#editId").val(row.id);
				$("#editName").val(row.name);
				if(row.sex == "男")
				{
					$("#editMale[value='男']").attr("checked","checked");
				}
				else if(row.sex == "女")
				{
					$("#editFemale[value='女']").attr("checked","checked");
				}
				$("#editCollege").val(row.college);
				$("#editBuilding").val(row.building);
				$("#editRoom").val(row.room);
			});

			//提交修改
			$("#edit_ok").click(function()
			{
				//关闭模态窗
				$("#editModal").modal("hide");
				//打包数据
				let editData = processData("frmEdit");
				//把修改存进数据库
				$.ajax(
				{
					type: "post",
					url: "/edit",
					data: editData,
					dataType: "json",
					success: function(result)
					{
						alert(result.message);
					},
					error: function(e)
					{
						console.log(e);
					}
				});
			});

		},
		'click #delete': function(e, value, row, index)
		{
			var v = confirm("确定删除此人信息吗？");
			if(v == true)	//确定
			{
				//把此人信息发给后台，后台从数据库删除信息
				$.ajax(
				{
					type: "post",
					url: "delete",
					data: row,
					dataType: "json",
					success: function(result)
					{
						alert(result.message);
						//刷新表格
						$("#searchTable").bootstrapTable(("refresh"));
					},
					error: function(e)
					{
						console.log(e);
					}
				});
			}//end-if

		}//end-click #delete
	};



	//查看申请、报修
	$("#handleTable").bootstrapTable(
	{
		method: "post",
		url: "/handle",
		contentType: "application/x-www-form-urlencoded",
		cache: false,
		pagination: true,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10,20,50,100,200],
		sidePagination: "server",
		queryParams: function(params)
		{
			var handleData = {};
			handleData.limit = params.limit;
			handleData.offset = params.offset;
			return handleData;
		},
		showColumns: true,
		showRefresh: true,
		showToggle: true,
		columns: [
		{
			align: "center",
			field: "index",
			title: "序号",
			formatter: runningFormatter
		},
		{
			align: "center",
			field: "id",
			title: "学号"
		},
		{
			align: "center",
			field: "name",
			title: "姓名"
		},
		{
			align: "center",
			field: "item",
			title: "报修项目"
		},
		{
			align: "center",
			field: "building",
			title: "宿舍楼"
		},
		{
			align: "center",
			field: "room",
			title: "房间号"
		},
		{
			align: "center",
			field: "phone",
			title: "联系方式"
		},
		{
			align: "center",
			field: "details",
			title: "详细"
		},
		{
			align: "center",
			field: "spareDay",
			title: "空闲日期"
		},
		{
			align: "center",
			field: "spareTime",
			title: "空闲时间"
		},
		{
			align: "center",
			field: "remark",
			title: "备注"
		}],
		onLoadSuccess: function(result)
		{
			console.log("成功加载报修信息");
		},
		onLoadError: function(error)
		{
			console.log(error);
		}

	});
























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



	//获取发布时间（年.月.日）
	function getTime()
	{
		// 获取当前日期
		var date = new Date();

		// 获取当前月份
		var nowMonth = date.getMonth() + 1;

		// 获取当前是几号
		var strDate = date.getDate();

		// 添加分隔符“.”
		var seperator = ".";

		// 对月份进行处理，1-9月在前面添加一个“0”
		if (nowMonth >= 1 && nowMonth <= 9) {
		   nowMonth = "0" + nowMonth;
		}

		// 对几号进行处理，1-9号在前面添加一个“0”
		if (strDate >= 0 && strDate <= 9) {
		   strDate = "0" + strDate;
		}

		// 最后拼接字符串，得到一个格式为(yyyy.MM.dd)的日期
		var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;

		return nowDate;

	}