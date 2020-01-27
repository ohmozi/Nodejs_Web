var db = require('./db.js');
var template = require('./templates.js');
var url = require('url');
var qs = require('querystring');
var cookie = require('cookie'); //쿠키를 파싱할 수 있음

function authIsSession(request, response){
  //세션으로 접근하자
    if(request.session.is_logined){
      return true;
    } else{
      return false;
    }
}

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
  if(authIsSession(request, response)){
    authStatusUI = `${request.session.nickname} | <a href="/login/process_logout">logout</a>`;
  }
  return authStatusUI;
}

exports.home = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello,Node.js';
    var list = template.db_list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2><p>${description}</p>
      <img src="/images/window.png" style="display:block; margin-top:10px;">`,
      `<a href="/topic/create">create</a>`,
      '',
      authStatusUI(request, response));
    response.send(html);
  });
}

exports.page = function(request, response){
  console.log(request.params.pageId);
  // var _url = request.url;
  // var queryData = url.parse(_url, true).query;
  // var pathname = url.parse(_url, true).pathname;
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id = author.id WHERE topic.id=?`,
      [request.params.pageId], function(error2, topics2){
      if(error2){
        throw error2;
      }
      var title = topics2[0].title;
      var author = topics2[0].name;
      var description = topics2[0].description;
      var list = template.db_list(topics);
      var html = template.HTML(title, list,
        `
        <h2>${title}</h2>
        <p>${description}</p>
        <p>by ${author} </p>
        `,
        `<a href="/topic/create">create</a>
        <a href="/topic/update/${request.params.pageId}">update</a>
        <form action="/topic/process_delete" method="post" onsubmit="delete();">
          <input type="hidden" name="id" value="${request.params.pageId}">
          <input type="submit" value="delete">
        </form>
        <script>
        function delete(){
          alert("delete complete!!");
        }
        </script>`,
        '',
        authStatusUI(request, response));
      response.send(html);
    });
  });
}

exports.create = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, function(error2, authors){
      var title = "create"
      var list = template.db_list(topics);
      var html = template.HTML(title, list,
      `
        <form action="/topic/process_create" method="POST">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          ${template.authorSelect(authors)}
        </p>
        <P>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
        </form>
      `, '','',
      authStatusUI(request, response));
      response.send(html);
    });
  });
}

exports.process_create = function(request, response){
  if(authIsSession(request, response) === false){   // 로그인 안 되어있으면 생성, 업데이트, 삭제 불가
    response.end('login required!');
    return false;
  }

  // express body-parser를 이용한 form 데이터 처리
  var post = request.body;
  db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?,?,NOW(),?)`,
    [post.title, post.description, post.author], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/topic/${result.insertId}`});   // 작성한 글을 확인할 수 있도록 redirection
      response.end();
    });
}

exports.update = function(request, response){
  // var _url = request.url;
  // var queryData = url.parse(_url, true).query;
  // var pathname = url.parse(_url, true).pathname;
  //var fillteredId = path.parse(queryData.id).base;   // url공격을 막을수있다. 경로문제 해결
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id=?`,[request.params.pageId], function(errors, result){
      if(errors){
        throw errors;
      }
      db.query(`SELECT * FROM author`, function(error2, authors){
        if(error2){
          throw error2;
        }
        //console.log(result[0].author_id);
        var list = template.db_list(topics);
        var html = template.HTML(result[0].title, list,
          `
            <form action="/topic/process_update" method="POST">
            <input type="hidden", name="id", value="${result[0].id}">    <!-- 수정시 제목도 수정가능하므로 기존의 제목을 숨겨서 보내기-->
            <p><input type="text" name="title" placeholder="title" value="${result[0].title}"></p>  <!-- 업데이트시 기존의 내용을 보여주기 -->
            <p>
              ${template.authorSelect(authors, result[0].author_id)}
            </P>
            <P>
              <textarea name="description" placeholder="description">${result[0].description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
          `,
          ` <a href="/topic/create">create</a>
            <a href="/topic/update?id=${result[0].id}">update</a>`,
          '',
          authStatusUI(request, response));
        response.send(html);
      });
    });
  });
}

exports.process_update = function(request, response){
  if(authIsSession(request, response) === false){   // 로그인 안 되어있으면 생성, 업데이트, 삭제 불가
    response.end('login required!');
    return false;
  }

  var post = request.body;
  // var id = post.id;
  // var title = post.title;
  // var description = post.description;
  db.query(`UPDATE topic SET title=?, description=?, created=NOW(), author_id=? WHERE id=?`,
    [post.title, post.description, post.author, post.id], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/topic/${post.id}`});   // 작성한 글을 확인할 수 있도록 redirection
      response.end();
    })
}

exports.process_delete = function(request, response){
  if(authIsSession(request, response) === false){   // 로그인 안 되어있으면 생성, 업데이트, 삭제 불가
    response.end('login required!');
    return false;
  }

  var post = request.body;
  //var id = post.id;
  //var fillteredId = path.parse(id).base;   // url공격을 막을수있다. 경로문제 해결
  db.query(`DELETE FROM topic WHERE id=?`,[post.id], function(error,result){
    if(error){
      throw error;
    }
    response.writeHead(302, {Location: `/`});   // 작성한 글을 확인할 수 있도록 redirection
    response.end();
  });
}
