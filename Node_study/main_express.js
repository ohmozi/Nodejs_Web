var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/templates.js');
var path = require('path');
var db = require('./lib/db.js');
var topic = require('./lib/topic');
var author = require('./lib/author');
var login = require('./lib/login');
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

app.get('/', function (request, response, next) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(queryData.id === undefined){
    topic.home(request, response );
  } else {
    topic.page(request, response);
  }
})
app.get('/create', function (request, response, next) {
  topic.create(request, response);
})
app.get('/process_create', function (request, response, next) {
  topic.process_create(request, response);
})
app.get('/update', function (request, response, next) {
  topic.update(request, response);
})
app.get('/process_update', function (request, response, next) {
  topic.process_update(request, response);
})
app.get('/process_delte', function (request, response, next) {
  topic.process_delte(request, response);
})
//************  author part
app.get('/author_list', function (request, response, next) {
  author.author_list(request, response);
})
app.get('/process_author_create', function (request, response, next) {
  author.process_author_create(request, response);
})
app.get('/author_update', function (request, response, next) {
  author.author_update(request, response);
})
app.get('/process_author_update', function (request, responses, next) {
  author.process_author_update(request, response);
})
app.get('/process_author_delete', function (request, response, next) {
  author.process_author_delete(request, response);
})
//*********** login part
app.get('/login', function (request, response, next) {
  author.login(request, response);
})
app.get('/process_login', function (request, response, next) {
  author.process_login(request, response);
})
app.get('/join', function (request, response, next) {
  author.join(request, response);
})
app.get('/process_join', function (request, response, next) {
  author.process_join(request, response);
})
app.get('/process_logout', function (request, response, next) {
  author.process_logout(request, response);
})
app.use(function(req, res, next){
  res.status(404).send("sorry cant find that!");
})
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send("Something broke!");
})
app.listen(3000, function(){
    console.log('3000!');
});
