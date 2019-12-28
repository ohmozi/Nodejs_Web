var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
  return template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="create">create</a>
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  /*
  var list = `
  <ol>  <!-- 파일이 추가되거나 변경될 때 빠르게 수정이 가능하도록 변경이 필요하다 -->
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JavaScript">JavaScript</a></li>
  </ol>`;
  */
  // ***** 리스트의 동적 코딩
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  // ***** 리스트의 동적 코딩
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    var title = queryData.id
    console.log(pathname);
    if(pathname === '/'){ // Q.현재는 간단한 패스를 갖기 때문에 이렇게 가능한 것 같은데 나중엔 어떻게 처리하는거지?
      //쿼리스트링이 없다면 welcome으로
      if(queryData.id === undefined){
        fs.readdir('./data', function(err,filelist){
          var title = 'Home'
          var description = 'hello, node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      } else{
        fs.readdir('./data', function(err,filelist){
          fs.readFile(`data/${title}`,'utf8', function(err,description){
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(err,filelist){
        var title = 'WEB - create'
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/process_create" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <P>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `);
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname === '/process_create'){
      var body='';
      //***** event
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);    //event를 통해 post정보를 객체화 할 수 있다.
        console.log(post)
        var title = post.title;
        var description = post.description;
      });
      //***** event
      response.writeHead(200);
      response.end("Success");
    } else{ // 잘못된 경로의 경우 not found출력
      response.writeHead(404);
      response.end("Not found");
    }
});
app.listen(3000);
