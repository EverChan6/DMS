var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Release = require("../Models/Release");
var StayInfo = require("../Models/StayInfo");
var Visit = require("../Models/Visit");



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
router.post("/record", function(req, res, next)
{
	console.log("即将处理登记来访信息");
	console.log(req.body);
	//保存到数据库中
	var visit = new Visit(
	{
		name: req.body.name,
		sex: req.body.sex,
		reason: req.body.reason,
		date: req.body.date,
		contact: req.body.contact
	});
	visit.save();
	res.json({message: "成功登记来访信息"});
	return;

});


//查询来访记录
router.post("/visit", function(req, res, next)
{
	console.log("收到查询来访信息请求");
	console.log(req.body);
	let param = {
		name: req.body.visitName,
		sex: req.body.visitSex,
		date: req.body.visitDate
	};
	//筛选查询条件
	for(let key in param)
	{
		if(param[key] == "")
			delete param[key];
	}
	delete param.limit;
	delete param.offset;
	console.log(param);

	//调取信息
	Visit.find(param, function(err, doc)
	{
		var result = {"total": 0, "rows": []};
		if(doc != "" && doc != null)	//存在该查询条件下的记录
		{
			for(let i = 0; i < doc.length; i ++)
			{
				result.rows.push({name: doc[i].name, sex: doc[i].sex, reason: doc[i].reason,
									date: doc[i].date, contact: doc[i].contact});
			}
			//更新数据数量
			result.total = result.rows.length;
			res.json(result);
			return;
		}
		if(err)
		{
			console.log("发生错误");
			res.json(result);
			return;
		}
		if(doc == "" || doc == null)
		{
			console.log("数据是空的");
			res.json(result);
			return;
		}
		
	});

});

//从数据库调取数据（查询信息)
router.post("/search", function(req, res, next)
{
	// console.log("收到查询请求，准备返回数据。");
	// //查询条件req.body
	// console.log(req.body);
	// console.log("***************");


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

	if(params.id == "")delete params.id;
	if(params.name == "")delete params.name;
	if(params.sex == "")delete params.sex;
	if(params.college == "")delete params.college;
	if(params.building == "")delete params.building;
	if(params.room == "")delete params.room;

	//最终的查询条件
	// console.log(params);

	//匹配数据库记录，并返回符合查询条件的数据记录
	StayInfo.find(params, function(err, doc)
	{
		// console.log("doc: "+doc);
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
			// console.log(result);
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


//增加住宿信息，存进数据库
router.post("/add", function(req, res, next)
{
	//返回信息
	var responseData = {
		code: 0,		//0默认失败，1表示成功
		message: ""
	};
	console.log("收到增加住宿信息请求");
	console.log("前台发来的增加数据");
	console.log(req.body);

	//检查是否已经以及存在此人信息
	StayInfo.findOne(
	{
		//前：数据库中对应的属性名；后：前台传来的request的对应属性值（内容
		id: req.body.id
	}, function(err, doc)
	{
		if(doc)
		{
			responseData.message = "已经存在此人住宿信息，请检查是否要修改";
			res.json(responseData);
			return;
		}
		//如果不存在则保存到数据库中
		var stayInfo = new StayInfo(
		{
			id: req.body.id,
			name: req.body.name,
			sex: req.body.sex,
			college: req.body.college,
			building: req.body.building,
			room: req.body.room
		});
		stayInfo.save();	//存入数据库
		responseData.code = 1;
		responseData.message = "成功增加住宿信息";
		res.json(responseData);
		return;
	});

});


router.post("/edit", function(req, res, next)
{
	var responseData = {
		message: ""
	};
	// console.log("收到修改数据的请求");
	// console.log(req.body);
	//对比哪些数据修改了
	StayInfo.update({id: req.body.editId}, {"$set": {"name": req.body.editName, "sex": req.body.editSex,
					"college": req.body.editCollege, "building": req.body.editBuilding, "room": req.body.editRoom }},
					 function(err)
					{
						if(err)
						{
							console.log(err);
							responseData.message = "出现错误，无法更新！";
							res.json(responseData);
							return;
						}
						else
						{
							responseData.message = "成功更新数据！";
							res.json(responseData);
							return;
						}
						
					});
	
});


router.post("/delete", function(req, res, next)
{
	var responseData = {
		message: ""
	};
	console.log("收到删除数据请求");
	console.log(req.body);
	//从数据库删除该项记录
	StayInfo.remove({id: req.body.id}, function(err){
		if(!err)
		{
			responseData.message = "成功删除该项记录";
			res.json(responseData);
			return;
		}
		else
		{
			responseData.message = err;
			res.json(responseData);
			return;
		}
	});

});


// 返回数据
module.exports = router;