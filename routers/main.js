var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Release = require("../Models/Release");
var StayInfo = require("../Models/StayInfo");




//这个文件好像可以用来处理管理员行为，在managerRole.js里接口url应直接为：'/managerRole/xxx'


//至今不知道怎么访问这个页面。。参考Admin.js那个文件,前端$.ajax({url: "/",method: "get"}),html设置个<%= userInfo.username %>？？这样子吗
router.get('/',function (req,res,next) {
    console.log(userInfo);
    res.render('/',{
        userInfo:req.userInfo
    });
});



//把发表的通知存进数据库
router.post("/managerRole/release", function(req, res, next)
{
	console.log("success receive the release data from front end.");
	console.log(req.body);
	var title = req.body.inputTitle,
		auther = req.body.auther,
		contents = req.body.contents,
		time = req.body.time;

	//检查是否已经发过此条通知
	Release.findOne(
	{
		//前：数据库中对应的属性名；后：前台传来的request的对应属性值（内容
		title: title,
		auther: auther,
		contents: contents,
		time: time
	}, function(err, doc)
	{
		if(doc)
		{
			// res.json({"message":"已经发布过此条通知！"});
			res.json({});
			return;
		}
		//保存到数据库中
		var release = new Release(
		{
			title: title,
			auther: auther,
			contents: contents,
			time: time
		});
		release.save();
		res.json({});
		return;
	});

});



//把来访登记记录存进数据库


//从数据库调取数据（查询/统计)
router.post("/search", function(req, res, next)
{
	console.log("收到查询请求，准备返回数据。");
	//查询条件req.body
	console.log(req.body);
	console.log("***************");

	var params = {
		id: req.body.id,
		name: req.body.name,
		sex: req.body.sex,
		college: req.body.college,
		building: req.body.building,
		room: req.body.room,
		// limit: req.body.limit,
		// offset: req.body.offset			
	};

	//如果查询参数的值全是空的，则匹配所有
	if(params.id == "" && params.name == "" && params.sex == "" && params.college == "" && params.building == "" && params.room =="")
	{
		params = {};
	}

	console.log(params);

	//匹配数据库记录，并返回符合查询条件的数据记录
	StayInfo.find(params, function(err, doc)
	{
		console.log("doc: "+doc);
		if(doc != "" || doc != null)
		{
			var result = {rows: [], total: 0};
			for(let i = 0; i < doc.length; i ++)
			{
				result.rows.push({id: doc[i].id, name: doc[i].name, sex: doc[i].sex, college: doc[i].college,
									building: doc[i].building, room: doc[i].room,});
			}
			//更新数据条数
			result.total = result.rows.length;
			//给前端发送匹配数据
			res.json(result);
			console.log(result);
			return;
		}
		else if(err)
		{
			console.log("查询住宿信息失败");
			res.json({});
			return;
		}
		else
		{
			console.log("不知道发生了什么");
			res.json({});
			return;
		}
	});

});




// 返回数据
module.exports = router;