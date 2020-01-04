var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/templates.js');
var path = require('path');
var db = require('./lib/db.js');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if(pathname === '/'){ // Q.현재는 간단한 패스를 갖기 때문에 이렇게 가능한 것 같은데 나중엔 어떻게 처리하는거지?
      // 쿼리스트링이 없다면 welcome으로
      if(queryData.id === undefined){
        topic.home(request, response );
      } else {
        topic.page(request, response);
      }
    } else if(pathname === '/create'){
      topic.create(request, response);
    } else if(pathname === '/process_create'){
      topic.process_create(request, response);
    } else if(pathname === '/update'){
      topic.update(request, response);
    } else if(pathname ==='/process_update'){
      topic.process_update(request, response);
    } else if(pathname === '/process_delete'){
      topic.process_delete(request, response);
    }
//************  author part
      else if(pathname === '/author_list'){
      author.author_list(request, response);
    } else if(pathname === '/process_author_create'){
      author.process_author_create(request, response);
    } else if(pathname === '/author_update'){
      author.author_update(request, response);
    } else if(pathname === '/process_author_update'){
      author.process_author_update(request, response);
    } else if(pathname === '/process_author_delete'){
      author.process_author_delete(request, response);
    } else{ // 잘못된 경로의 경우 not found출력
      response.writeHead(404);
      response.end("Not found");
    }
});
app.listen(3000);
