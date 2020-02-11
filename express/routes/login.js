var express = require('express');
var db = require('../lib/db.js');
var router = express.Router();
var login = require('../lib/login');
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

router.use(passport.initialize());  //app.use대신 router.use로 현재파일이 라우터임을 보이자
router.use(passport.session());

passport.serializeUser(function(user, done){    //로그인에 성공했을때 세션에 정보를 저장하는 역할
  console.log('serializedUser', user);
  // console.log(user.email);
  done(null, user.email);    //두번째 인자에는 식별자를 넣어줘라 ->세션에 식별자가 추가됨
});
passport.deserializeUser(function(id, done){    //페이지에 들어갈때마다 로그인한 유저인지 아닌지 확인하는 역할  필요한 정보를 조회할때 필요한 부분
  console.log('deserializeUser', id);
  db.query(`SELECT * FROM user WHERE email=? `, [id], function(error, result){
    // console.log('deserialize db', result[0]);
    done(null, result[0]);    //실제 db에서 가져오는것
  });
});

// var authData={
//   email : 'goadsjfkas@naver.com',
//   password : '1111',
//   nickname :'ozi'
// };

passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    }, function (username, password, done){
      //이거 나오기전에 deserialize가 되네??
      console.log('LocalStrategy', username, password);
      db.query(`SELECT EXISTS (select * from user where email=?) as success`, [username], function(err, succ){

        if(succ[0].success === 1){    //이메일이 존재
          console.log(1);
          db.query(`SELECT * FROM user WHERE email=? `, [username], function(error, result){
            console.log("db" , result[0]);
            // console.log("db" , result[0].email);
            if(password === result[0].password){    //비밀번호가 맞음
              console.log(2);
              return done(null, result[0]);
              // return done(null, authData);
            } else{                                 //비밀번호가 다름
              console.log(3);
              return done(null, false, {
                message: 'incorrect password'
              });
            }

          });
        } else {    //이메일이 없음
          console.log(4);
          return done(null, false, {
            message: 'incorrect username'
          });
        }

      });
    }
));

//**** login part
router.get("/login", function(req, res){
  login.login(req, res);
});

// router.post("/process_login", function(req, res){
//   login.process_login(req, res);
// });

router.post("/process_login",
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/login'
  })
);

router.get("/join", function(req, res){
  login.join(req, res);
});

router.post("/process_join", function(req, res){
  login.process_join(req, res);
});

router.get("/process_logout", function(req, res){
  login.process_logout(req, res);
});

module.exports = router;
