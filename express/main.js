/*
express, route, bodyParser
라우팅방식, 시멘틱 URL, body방식으로 파싱하던 것을 bodyparser 미들웨어를 이용한 방법적용
session.
Q.
로그인 세션체크 유동적으로 변경필요
DB체크할 때 id가 애초에 존재하지 않을 경우 에러처리 어떻게?
set-cookie할때 반복해서 말고 배열 혹은 딕셔너리로 가능한지?
*/

var express = require("express");
var app = express();
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)    //세션정보를 파일로서 저장하기  추후에 디비로 저장필요 혹은 캐싱
// var template = require("./lib/templates.js")
var topic = require('./lib/topic');
var bodyParser = require("body-parser");
var helmet = require("helmet");
var topicRouter = require('./routes/topic');
var authorRouter = require('./routes/author');
var loginRouter = require('./routes/login');
// var compression = require("conpression");  gzip방식으로 압축을 해서 보내는 미들웨어

//미들웨어가 들어오는 위치
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(compression())
app.use(express.static('public'));
app.use(helmet());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',    //별도의 파일로 관리해서 보안을 유지해야한다.
  resave: false,
  saveUninitialized: true, //서버가 세션이 필요하던 안필요하든 구동시킨다 - 서버에 부담이될수있다.
  store:new FileStore()
}));
app.use('/topic', topicRouter);   //topic으로 들어오는 주소를 토픽라우터를 이용하겠다.
app.use('/author', authorRouter);
app.use('/login', loginRouter);

//미들웨어가 들어오는 위치

app.get("/", function(req, res){
  topic.home(req, res);   //홈에 대해서 topic lib에서 제외하면 require('./lib/topic') 제거해도됨
  // if(req.session.num === undefined){
  //   req.session.num = 1;
  //   req.session.is_logined = true;
  //   req.session.nickname = 'ozizoiz';
  // } else{
  //   req.session.num++;
  // }
  // // res.send(`${req.session.num}`);
});

app.use(function(req, res, next){
  res.status(404).send("sorry page is not found!");
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, function(){
  console.log("App listening on port 3000!")
});
