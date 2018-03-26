	


	// 标签页切换
	$(".navDiv li a").click(function(e)
	{
		e.preventDefault();
		$(this).tab("show");
	});

	$("#release").click(handler);





	//发布通知事件处理程序
	function handler()
	{
		

		//检查数据合法性
		var title = $("#inputTitle");
		var auther = $("#auther");
		var contents = $("#contents");
		if(title.val() == "" )
		{
			let span = "<span class='warningLetter'>标题不能为空</span>";
			if(title.parent().children("span"))
			{
				title.parent().children("span").remove();
			}
			title.parent().append(span);
			title.focus();
			return;
		}
		if(auther.val() == "")
		{
			let span = "<span class='warningLetter'>发布单位不能为空</span>";
			if(auther.parent().children("span"))
			{
				auther.parent().children("span").remove();
			}
			auther.parent().append(span);
			auther.focus();
			return;
		}
		if(contents.val() == "")
		{
			let span = "<span class='warningLetter'>内容不能为空</span>";
			//如果此前已经有警告内容，则移除
			if(contents.parent().children("span"))
			{
				contents.parent().children("span").remove();
			}
			//否则，提示警告
			contents.parent().append(span);
			//获取焦点
			contents.focus();
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
				console.log("success send the release data.");
				console.log("您发布了一项通知。");
				// alert("发布成功！");
				//清空输入
				title.val("");
				auther.val("");
				contents.val("");
			},
			error: function(e)
			{
				console.log(e.readyState+"/"+e.status+"/");
			}
		});




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