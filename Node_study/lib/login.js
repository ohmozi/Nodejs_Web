var db = require('./db.js');
var template = require('./templates.js');
var url = require('url');
var qs = require('querystring');

exports.login = function(request, response){
  var html = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - login</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1>로그인</h1>
    <form action="process_login" method="post">
      <p><input type="text" name="email" placeholder="email"</p>
      <p><input type="password" name="password" placeholder="password"</p>
      <p><input type="submit" value="로그인"><a href="/join">회원가입<a href="/">돌아가기</p>
    </form>
  </body>
  </html>
  `
  response.writeHead(200);
  response.end(html);
}

exports.process_login = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body)
    db.query(`SELECT password FROM user WHERE email=? `, [post.email], function(error, result){
      if(result[0].password == post.password){
        response.writeHead(302, {Location: '/'});
        response.end();
      } else{
        response.writeHead(302, {Location: '/login'});
        response.end();
      }
    });
  });
}

exports.join = function(request, response){
  var html = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - join</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1>회원가입</h1>
    <form action="process_join" method="post">
      <p><input type="text" name="email" placeholder="email"</p>
      <p><input type="password" name="password" placeholder="password"</p>
      <p><input type="text" name="name" placeholder="name"</p>
      <p><input type="password" name="age" placeholder="age"</p>
      <p><input type="submit" value="가입"><a href="/">돌아가기</p>
    </form>
  </body>
  </html>
  `
  response.writeHead(200);
  response.end(html);
}

exports.process_join = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body)
    db.query(`INSERT INTO user(email, password, name, age) VALUES(?,?,?,?) `,
      [post.email, post.password, post.name, post.age], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: '/login'});
      response.end();
    });
  });

}
// where부터 체크하는 부분 로그인 시작
