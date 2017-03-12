var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});

router.get('/reg', function(req, res, next) {
	console.log("11111");
   console.log(req);
  res.render('reg', { title: '用户注册' });
});

router.post('/reg', function(req, res) {
	console.log("bbbbbbb");
//检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的口令不一致');
    res.json({ title: '用户注册' })
    return res.redirect('/reg');
  }
//   //生成口令的散列值
//   var md5 = crypto.createHash('md5');
//   var password = md5.update(req.body.password).digest('base64');
//   var newUser = new User({
//     name: req.body.username,
//     password: password,
//   });
// //检查用户名是否已经存在
//   User.get(newUser.name, function(err, user) {
//     if (user)
//       err = 'Username already exists.';
//     if (err) {
//       req.flash('error', err);
//       return res.redirect('/reg', { title: '用户注册' });
//     }
// //如果不存在则新增用户
//     newUser.save(function(err) {
//       if (err) {
//         req.flash('error', err);
//         return res.redirect('/reg', { title: '用户注册' });
//       }
//       req.session.user = newUser;
//       req.flash('success', '注册成功');
//       res.redirect('/', { title: '首页' });
//     });
//   });
});
// router.post('/reg', function(req, res, next) {
// 	console.log('reg');
// var user = {
//     "id": 2,
//     "pic": "http://www.361y.cn:8080/Files/1427792890690.jpg",
//     "username": "test"
// }

// res.json(user);
// //res.jsonp({status:'json'}); 
 
// });
module.exports = router;

