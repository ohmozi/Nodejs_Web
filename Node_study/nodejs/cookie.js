var http = require("http");
var cookie = require("cookie");
http.createServer(function(req, res){
  console.log(req.headers.cookie);
  var cookies = {};
  if( req.headers.cookie != undefined){
    var cookies = cookie.parse(req.headers.cookie);  // 던져주는 쿠키의 객체화 이를통해 객체처럼 접근가능하게 사용
  }
  console.log(cookies);
  res.writeHead(200, {
    'Set-Cookie' : [
      'yummy_cookie=choco',
      'tasty_cookie=lemon',
      `permanent_cookie=longlong; Max-Age=${60*4}`,
      'Secure=scure; Secure',  //https로 보낼때만 이 쿠키를 전송한다
      'httponly=only; HttpOnly',
      'path=path; path=/cookie',
      'Domain=domain; Domain=naver.com'
    ]
  });
  res.end("cookie!!");
}).listen(3000);
// npm install cookie --save
// session cookies
// permanent cookies 만료일, 만료시간을 넣으면 설정된다
// Secure는 웹브라우저와 웹서버가 https로 통신하는 경우 쿠키를 서버로 전송하는 옵션
// javascript를 이용하여 session값을 훔쳐가려는 사례가 많기 때문에 자바스크립트로는 값을 못읽도록 httpOnly 플래그를 on 한다.
// path는 어떤 특정 디렉토리에서만 쿠키가 활성화 되도록 원할때 사용하는 옵션
// domain 어떤 서브 도메인에서도 살아남을 수 있는 설정
