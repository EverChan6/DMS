var express = require('express');
var router = express.Router();

//localhost:8089/admin/user
router.get('/user',function (req,res,next) {
    res.send('Admin-User');
});
// 返回数据
module.exports = router;