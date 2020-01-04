var db = require('./db.js');
var template = require('./templates.js');
var url = require('url');
var qs = require('querystring');

exports.author_list = function(reqeust, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, function(error1, authors){
      if(error1){
        throw error1;
      }
      var db_list = template.db_list(topics);
      var author_list = template.author_list(authors,
        `
          <form action="/process_author_create" method="POST">
          <p><input type="text" name="name" placeholder="name"></p>
          <P>
            <textarea name="profile" placeholder="profile"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
          </form>
        `);
      var html = template.HTML('', db_list,'<h2>Author List</h2>','',author_list);
      response.writeHead(200);
      response.end(html);
    })
  });
}

exports.process_author_create = function(request, response){
  var body = '';
  //***** event
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);    //event를 통해 post정보를 객체화 할 수 있다.
    db.query(`INSERT INTO author (name, profile) VALUES(?,?)`,
    [post.name, post.profile], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/author_list`});   // 작성한 글을 확인할 수 있도록 redirection
      response.end();
    });
  });
}

exports.author_update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  //console.log(queryData.author_id);
  //var fillteredId = path.parse(queryData.id).base;   // url공격을 막을수있다. 경로문제 해결
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, function(error1, authors){
      if(error1){
        throw error1;
      }
      db.query(`SELECT * FROM author WHERE id=?`, [queryData.author_id], function(error2, result){
        if(error2){
          throw error2;
        }
        //console.log(result[0].author_id);
        var title ='Author List'
        var db_list = template.db_list(topics);
        var author_list = template.author_list(authors,
          `
          <form action="/process_author_update" method="POST">
          <input type="hidden" name="id" value="${result[0].id}">
          <p><input type="text" name="name" placeholder="author_name" value="${result[0].name}"></p>
          <p><textarea name="profile" placeholder="profile">${result[0].profile}</textarea>
          <p><input type="submit" value="update"></p>
          </from>
          `);
        var html = template.HTML(title, db_list,'<h2>Author List</h2>','',author_list);
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

exports.process_author_update = function(request, response){
  var body = '';
  //***** event
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);    //event를 통해 post정보를 객체화 할 수 있다.
    //console.log(post.id);
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
    [post.name, post.profile, post.id], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/author_list`});   // 작성한 글을 확인할 수 있도록 redirection
      response.end();
    });
  });
}

exports.process_author_delete= function(request, response){
  var body = '';
  //***** event
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);    //event를 통해 post정보를 객체화 할 수 있다.
    //console.log(post.id);
    db.query(`DELETE FROM author WHERE id=?`,
    [post.id], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/author_list`});   // 작성한 글을 확인할 수 있도록 redirection
      response.end();
    });
  });
}
