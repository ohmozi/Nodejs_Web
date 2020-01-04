// 파일 안에 민감한 정보를 넣어놓는것은 매우 위험함.
var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'oj950306!@',
  database : 'opentutorials'
});
db.connect();

module.exports = db;
