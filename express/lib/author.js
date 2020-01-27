var db = require('./db.js');
var template = require('./templates.js');
var url = require('url');
var qs = require('querystring');
var cookie = require('cookie'); //쿠키를 파싱할 수 있음

function authIsOwner(request, response){
  var isOwner = false;
  //쿠키에 접근하자
  var cookies = {}
  if(request.headers.cookie){
    cookies = cookie.parse(request.headers.cookie);
  }
  console.log(cookies);
  if(cookies.email ==='go@naver.com' && cookies.password ==='1212'){
    isOwner = true;
  }
  return isOwner;
}
function authStatusUI(request, response){
  var authStatusUI = '<a href="/login/login">login</a>'
  if(authIsOwner(request, response)){
    authStatusUI = '<a href="/login/process_logout">logout</a>'
  }
  return authStatusUI;
}

exports.author_list = function(request, response){
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
          <form action="/author/process_author_create" method="POST">
          <p><input type="text" name="name" placeholder="name"></p>
          <P>
            <textarea name="profile" placeholder="profile"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
          </form>
        `);
      var html = template.HTML('', db_list,'<h2>Author List</h2>','',author_list, authStatusUI(request, response));
      response.send(html);
    })
  });
}

exports.process_author_create = function(request, response){
  if(authIsOwner(request, response) === false){   // 로그인 안 되어있으면 생성, 업데이트, 삭제 불가
    response.send('login required!');
    return false;
  }

  var post = request.body;    //event를 통해 post정보를 객체화 할 수 있다.
  db.query(`INSERT INTO author (name, profile) VALUES(?,?)`,
  [post.name, post.profile], function(error, result){
    if(error){
      throw error;
    }
    response.redirect('/author/author_list');
  });
}

exports.author_update = function(request, response){
  // var _url = request.url;
  // var queryData = url.parse(_url, true).query;
  // var pathname = url.parse(_url, true).pathname;
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
      db.query(`SELECT * FROM author WHERE id=?`, [request.params.authorId], function(error2, result){
        if(error2){
          throw error2;
        }
        //console.log(result[0].author_id);
        var title ='Author List'
        var db_list = template.db_list(topics);
        var author_list = template.author_list(authors,
          `
          <form action="/author/process_author_update" method="POST">
          <input type="hidden" name="id" value="${result[0].id}">
          <p><input type="text" name="name" placeholder="author_name" value="${result[0].name}"></p>
          <p><textarea name="profile" placeholder="profile">${result[0].profile}</textarea>
          <p><input type="submit" value="update"></p>
          </from>
          `);
        var html = template.HTML(title, db_list,'<h2>Author List</h2>','',author_list,authStatusUI(request, response));
        response.send(html);
      });
    });
  });
}

exports.process_author_update = function(request, response){
  if(authIsOwner(request, response) === false){   // 로그인 안 되어있으면 생성, 업데이트, 삭제 불가
    response.send('login required!');
    return false;
  }
  var post = request.body;   //event를 통해 post정보를 객체화 할 수 있다.
  //console.log(post.id);
  db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
  [post.name, post.profile, post.id], function(error, result){
    if(error){
      throw error;
    }
    response.redirect('/author/author_list');
  });
}

exports.process_author_delete= function(request, response){
  if(authIsOwner(request, response) === false){   // 로그인 안 되어있으면 생성, 업데이트, 삭제 불가
    response.send('login required!');
    return false;
  }

  var post = request.body;   //event를 통해 post정보를 객체화 할 수 있다.
  //console.log(post.id);
  db.query(`DELETE FROM author WHERE id=?`,
  [post.id], function(error, result){
    if(error){
      throw error;
    }
    response.redirect('/author/author_list');
  });
}
