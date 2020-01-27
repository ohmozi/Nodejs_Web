var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

app.get('/', function (req, res, next) {
  console.log(req.session);
  if(req.session.num === undefined){
    req.session.num = 1;
  } else{
    req.session.num ++;
  }
  res.send(`you viewed this page ${req.session.num} times`)
})

app.listen(3000, function(){
    console.log('3000!');
});
// 세션데이터는 기본적으로 메모리에 저장되므로 서버가 꺼지면 휘발된다.
// 따라서, 저장공간에 따로 파일 혹은 DB로 저장해야한다.
