var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

function templatehtml(){
  return template = `
  <!doctype html>
  <html>
  <head>
    <title>ToDo List</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1>To DO LIST</a></h1>
    <h3>Not for spec, elevate yourself</h3>
    <form action="/add_todo" method="POST">
      <input type="text" name="todo" placeholder="something you have to do">
      <input type="submit" value="add">
    </form>
    <hr>
    <h2>ToDo\t\t</h2>
    <h2>Done</h2>


  </body>
  </html>
  `;
}

var app = http.createServer(function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === "/"){
    var html = templatehtml();

    response.writeHead(200);
    response.end(html);
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
