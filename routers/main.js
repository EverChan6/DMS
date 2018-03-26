var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Release = require("../Models/Release");




//这个文件好像可以用来处理管理员行为，在managerRole.js里接口url应直接为：'/managerRole/xxx'


//至今不知道怎么访问这个页面。。参考Admin.js那个文件
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





// 返回数据
module.exports = router;