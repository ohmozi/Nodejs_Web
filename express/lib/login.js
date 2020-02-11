var db = require('./db.js');
var template = require('./templates.js');
// var url = require('url');
// var qs = require('querystring');
var express = require('express');
var session = require('express-session')

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
    <form action="/login/process_login" method="post">
      <p><input type="text" name="email" placeholder="email"</p>
      <p><input type="password" name="password" placeholder="password"</p>
      <p><input type="submit" value="로그인"><a href="/login/join">회원가입<a href="/">돌아가기</p>
    </form>
  </body>
  </html>
  `
  response.send(html);
}

exports.process_login = function(request, response){
  // express body-parser를 이용한 form 데이터 처리
  var post = request.body;
  // console.log(request.body);
  // 아이디 자체가 존재하지 않거나 틀리면 어떻게 처리하는가?************************ 해결하고싶다
  db.query(`SELECT EXISTS (select * from user where email=?) as success`,[post.email],function(err, succ){
    // console.log(succ[0].success);
    if(succ[0].success === 1){    //이메일이 존재하는지 확인
      db.query(`SELECT * FROM user WHERE email=? `, [post.email], function(error, result){
        if(result[0].password === post.password){
          // console.log(request.session);
          request.session.is_logined = true;
          request.session.nickname = result[0].name;  //닉네임은 입력받으면 사용가능

          // response.cookie('email', post.email);
          // response.cookie('password', post.password);
          // response.cookie('nickname', 'ozi');   //=> 쿠키여러개 만드려면 배열 못하나?

          request.session.save(function(){
            response.redirect(302, '/');
          });

          // response.writeHead(302, {
          //   'Set-Cookie' : [
          //     `email=${post.email}`,
          //     `password=${post.password}`,
          //     `nickname=ozi`
          //   ], Location: '/'});
        } else{
          response.redirect(302, '/login/login');  //알람을 띄우고싶은데 어떻게하지?
        }
      });
    } else {    //이메일자체가 존재하지 않다면
      response.send("Email does not exist!");
    }
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
    <form action="/login/process_join" method="post">
      <p><input type="text" name="email" placeholder="email"</p>
      <p><input type="password" name="password" placeholder="password"</p>
      <p><input type="text" name="name" placeholder="name"</p>
      <p><input type="password" name="age" placeholder="age"</p>
      <p><input type="submit" value="가입"><a href="/">돌아가기</p>
    </form>
  </body>
  </html>
  `
  response.send(html);
}

exports.process_join = function(request, response){
  var post = request.body;
  db.query(`INSERT INTO user(email, password, name, age) VALUES(?,?,?,?) `,
    [post.email, post.password, post.name, post.age], function(error, result){
    if(error){
      throw error;
    }
    response.redirect('/login/login');
  });
}

exports.process_logout = function(request, response){
  console.log("before");
  request.session.destroy(function(err){
    // response.clearCookie('email');
    // response.clearCookie('password');
    // response.clearCookie('nickname');
    response.redirect(302, '/');
  });
  console.log("after");

  // response.cookie('email', '', {magAge:0});
  // response.cookie('password', '', {magAge:0});
  // response.cookie('nickname', '', {magAge:0});   //=> 쿠키여러개 만드려면 배열 못하나?
  // response.redirect(302, '/');
  // response.writeHead(302, {
  //   'Set-Cookie' : [
  //     `email=; Max-Age=0`,
  //     `password=; Max-Age=0`,
  //     `nickname=; Max-Age=0`
  //   ], Location: '/'});
  // response.end();
}
