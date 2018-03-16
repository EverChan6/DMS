var express = require('express');
var router = express.Router();

// 引入model模块，定义一个对象，通过操作对象的方式去操作数据库
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var User = require('../Models/User');
var Apply = require("../Models/Apply");
var Fix = require("../Models/Fix");

// 统一返回格式
var responseData;

router.use( function (req,res,next) {
    responseData = {
        code: 0,
        message:''
    };
    next();
});


// 用户注册
// 注册逻辑
// 数据验证
router.post('/user/register',function (req,res) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var mobile = req.body.mobile;
    var email = req.body.email;
    // 判断用户名是否为空
    if( username == ''){
        responseData.code = 2;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    // 判断密码是否为空
    if( password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    // 判断两次密码是否一致
    if( password != repassword){
        responseData.code = 2;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }
    // 判断用户名是否已经注册
    User.findOne({
        username:username
    },function (err,doc) {
        if(doc){
            responseData.code = 3;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        // 保存用户注册的信息到数据中
        var user = new User({
            username: username,
            password: password
        });
        user.save();
        responseData.code = 4;
        responseData.message = '注册成功';
        res.json(responseData);
        return;
    });


});


// 用户登录
router.post('/user/login',function (req,res) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;

    if(password == ''|| username==''){
        responseData.code = 2;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return
    }
    if(!/^[0-9]{11}$/.test(username))
    {
        responseData.code = 2;
        responseData.message = "用户名格式应为11位数字"；
        res.json(responseData);
        return;
    }
    // 判断用户名是否已经注册
    User.findOne({
        username:username,
        password:password
    },function (err,doc) {
        if(doc){
            responseData.code = 4;
            responseData.message = '登录成功';
            responseData.userInfo = {
                _id: doc._id,
                username: doc.username
            };
            req.cookies.set('userInfo',JSON.stringify({
                _id: doc._id,
                username: doc.username
            }));
            res.json(responseData);
            return
        }
        responseData.code = 2;
        responseData.message = '用户名和密码不存在';
        res.json(responseData);
        return
    });
});



// 申请
router.post("/studentRole/appLodForm", function(req, res, next)
{
    console.log("successfullly accept data from 申请入宿.");
    console.log(req.body);

    // 保存申请表的信息到数据库中
    var apply = new Apply({
       //姓名
        name: req.body.inputName,
        // 学号
        sid: req.body.inputSID,
        // 学院
        college: req.body.college,
        // 性别
        gender: req.body.inputGender,
        // 宿舍楼号
        dormitory: req.body.lodging,
        // 房间号
        room: req.body.roomNum
    });
    apply.save();
});



//报修
router.post("/studentRole/fixForm", function(req, res, next)
{
    console.log("successfullly accept data from 报修。");
    console.log(req.body);

    //保存报修表的信息到数据库中
    var fix = new Fix({
        //宿舍楼
        building: req.body.building,
        details: req.body.details,
        id: req.body.fixId,
        name: req.body.fixName,
        item: req.body.item,
        phone: req.body.phone,
        remark: req.body.remark,
        room: req.body.roomNumber,
        spareDay: req.body.spareDay,
        spareTime: req.body.spareTime
    });
    fix.save();
});





//业务进度
router.get("/studentRole/myProgress", function(req, res, next)
{
    console.log("render process table...");
    var db = req.db;
    var apply = db.get("applies");
    apply.find({}, {}, function(e, docs)
    {
        console.log(docs);
        res.render("studentRole/myProgress", {

        });
    });

    //取学号去数据库匹配，如果申请表有这个记录，就渲染到表格
});


// 返回数据
module.exports = router;