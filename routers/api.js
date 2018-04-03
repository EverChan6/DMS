var express = require('express');
var router = express.Router();

// 引入model模块，定义一个对象，通过操作对象的方式去操作数据库
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var User = require('../Models/User');
var Apply = require("../Models/Apply");
var Fix = require("../Models/Fix");
var Release = require("../Models/Release");

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
    var role = req.body.role;

    if(password == ''|| username==''){
        responseData.code = 2;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return
    }
    if(!/^[0-9]{11}$/.test(username))
    {
        responseData.code = 2;
        responseData.message = "用户名格式应为11位数字";
        res.json(responseData);
        return;
    }
    // 判断用户名是否已经注册
    User.findOne({
        username:username,
        password:password,
        role: role
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





//取通知
router.get("/getNotice", function(req, res, next)
{
    // console.log("收到前端发来的取通知请求。");
    Release.find({}, null, {limit: 5}, function(err, docs)
    {
        if(docs)
        {
            // console.log("已有的通知：")
            // console.log(docs);

            responseData.code = 4;
            responseData.message = "成功取到通知";
            responseData.data = docs;   //注意这里是一个对象数组，因为不止一条数据（一个对象
            res.json(responseData);
            return;
        }
        else if(err)
        {
            console.log(err);
        }
    });
});






// 申请
router.post("/studentRole/appLodForm", function(req, res, next)
{
    console.log("successfully accept data from 申请入宿.");
    console.log(req.body);
    var name = req.body.inputName,
        id = req.body.inputSID,
        college = req.body.college,
        gender = req.body.inputGender,
        dormitory = req.body.lodging,
        room = req.body.roomNum;

     // 判断用是否存在此申请记录
    Apply.findOne({
        sid:id
    },function (err,doc) {
        if(doc){
            responseData.code = 2;
            responseData.message = '重复申请（请想想您之前是不是干过这事';
            res.json(responseData);
            return;
        }

        // 保存申请表的信息到数据库中
        var apply = new Apply({
           //姓名
            name: name,
            // 学号
            sid: id,
            // 学院
            college: college,
            // 性别
            gender: gender,
            // 宿舍楼号
            dormitory: dormitory,
            // 房间号
            room: room
        });
        apply.save();

        responseData.code = 4;
        responseData.message = '申请成功！';
        res.json(responseData);
        return;
    });





    
});



//报修
router.post("/studentRole/fixForm", function(req, res, next)
{
    console.log("successfully accept data from 报修。");
    console.log(req.body);

    var building = req.body.building,
        details = req.body.details,
        id = req.body.fixId,
        name = req.body.fixName,
        item = req.body.item,
        phone = req.body.phone,
        remark = req.body.remark,
        room = req.body.roomNumber,
        spareDay = req.body.spareDay,
        spareTime = req.body.spareTime;

    Fix.findOne(
    {
        id: id,
        item: item,
        spareDay: spareDay,
        spareTime: spareTime
    }, function(err, doc)
    {
        if(doc)
        {
            responseData.code = 2;
            responseData.message = "重复报修！您可能此前已经报修过了。";
            res.json(responseData);
            return;
        }//end-if
        else
        {
            //保存报修表的信息到数据库中
            var fix = new Fix({
                //宿舍楼
                building: building,
                details: details,
                id: id,
                name: name,
                item: item,
                phone: phone,
                remark: remark,
                room: room,
                spareDay: spareDay,
                spareTime: spareTime
            });
            fix.save();

            responseData.code = 4;
            responseData.message = "报修成功！";
            res.json(responseData);
            return;
        }//end-else

    });//end-findOne

   
});//end-报修





//业务进度
router.post("/studentRole/myProgress", function(req, res, next)
{
    //取得当前用户，以便从数据库查看是否有该用户的操作记录
    var userInfo = JSON.parse(req.cookies.get('userInfo'));
    //存储返回给前端的数据
    var result = {"total": 0, "rows": []};    

    //取学号去数据库匹配申请记录
    Apply.findOne({sid: userInfo.username}, function(err, docs)
    {
        if(!err)
        {
            if(docs != "" && docs != null)
            {
                // console.log("数据库匹配到的申请记录：（业务进度）");
                // console.log(docs);
                result.rows.push({id: docs.sid, name: docs.name, dormitory: docs.dormitory, room: docs.room, item: "申请入住"});
                result.total = result.rows.length;

            }//end-if
            else if(docs == null || doc == "")
            {
                responseData.code = 2;
                responseData.message = '没有该用户的操作记录';
                res.json(responseData);
                return;
            }//end-elseif

        }//end-if(!err)
        else
        {
            responseData.code = 5;
            responseData.message = err;
            res.json(responseData);
            return;
        }//end-else
    });//end-Apply.findOne

    //取学号去数据库匹配报修记录
    Fix.find({id: userInfo.username}, function(err, doc)
    {
        if(!err)
        {
            if(doc != "" && doc != null)
            {
                // console.log("数据库匹配到的报修记录：（业务进度） ");
                // console.log(doc);
                for(let i = 0; i < doc.length; i ++)
                {
                    result.rows.push({id: doc[i].id, name: doc[i].name, dormitory: doc[i].building, room: doc[i].room,
                                        spareDay: doc[i].spareDay, spareTime: doc[i].spareTime, item: "报修" });
                }
                //更新total的值
                result.total = result.rows.length;
                //返回
                res.json(result);
                return;
            }
            else if(doc == null || doc == "")
            {
                //为了防止只有申请记录而没有报修记录时没有实际数据返回，所以在这里返回
                if(result.total > 0)    //有申请数据
                {
                    res.json(result);
                    return;
                }
                else
                {
                    responseData.code = 2;
                    responseData.message = "没有该用户的报修记录";
                    res.json(responseData);
                    return; 
                }
                
            }
        }
        else if(err)
        {
            responseData.code = 5;
            responseData.message = err;
            res.json(responseData);
            return;
        }
    });//end-Fix.find



});//end-业务进度



router.post("/del", function(req, res, next)
{
    console.log("收到前台的删除请求");
    console.log(req.body);
    //匹配数据库相应记录，然后删除
    if(req.body.item == "申请入住")
    {
        Apply.findOne({sid: req.body.id}, function(err, doc)
        {
            if(doc != "" && doc != null)    //成功匹配
            {
                //执行删除
                Apply.remove({sid: req.body.id}, function(err)
                {
                    if(!err)
                    {
                        responseData.code = 4;
                        responseData.message = "成功删除该项申请记录";
                        res.json(responseData);
                        return;
                    }
                    else
                    {
                        responseData.code = 2;
                        responseData.message = err;
                        res.json(responseData);
                        return;
                    }
                });
            }
            if(doc == "" || doc == null)
            {
                responseData.code = 2;
                responseData.message = "找不到该项纪录，无法删除";
                res.json(responseData);
                return;
            }
            if(err)
            {
                responseData = 2;
                responseData.message = err;
                res.json(responseData);
                return;
            }
        });
    }
    else if(req.body.item == "报修")
    {
        Fix.findOne({id: req.body.id, }, function(err, doc)
        {
            if(doc != "" && doc != null)        //成功匹配
            {
                Fix.remove({id: req.body.id, spareDay: req.body.spareDay, spareTime: req.body.spareTime}, function(err)    //删除
                {
                    if(!err)
                    {
                        responseData.code = 4;
                        responseData.message = "成功删除该项报修记录";
                        res.json(responseData);
                        return;
                    }
                    else
                    {
                        responseData.code = 2;
                        responseData.message = err;
                        res.json(responseData);
                        return;
                    }
                });
            }
            if(doc == "" || doc == null)
            {
                responseData.code = 2;
                responseData.message = "找不到该项报修记录";
                res.json(responseData);
                return;
            }
            if(err)
            {
                responseData.code = 2;
                responseData.message = err;
                res.json(responseData);
                return;
            }
        });

    }
    
});


router.post("/done", function(req, res, next)
{
    console.log("收到前台的完成确认");
    console.log(req.body);
    //匹配数据库相应记录，然后设置status字段为"已处理"

    //如果成功设置
    responseData.message = "成功设置为已处理";
    res.json(responseData);
    return;
});




// 返回数据
module.exports = router;