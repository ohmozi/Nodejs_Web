var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/templates.js');
var path = require('path');
var mysql = require('mysql');

var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'oj950306!@',
  database : 'opentutorials'
});
db.connect();

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if(pathname === '/'){ // Q.현재는 간단한 패스를 갖기 때문에 이렇게 가능한 것 같은데 나중엔 어떻게 처리하는거지?
      // 쿼리스트링이 없다면 welcome으로
      if(queryData.id === undefined){
        //**** 파일시스템으로써 데이터 관리
        /*
        fs.readdir('./data', function(err, filelist){
          var title = 'Home'
          var description = 'hello, node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
          `
            <a href="/create">create</a>
            <h2>${title}</h2><p>${description}</p>
          `, '');
          response.writeHead(200);
          response.end(html);
        });
        */
        //**** 파일시스템으로써 데이터 관리

        //**** DB로써 데이터 관리
        db.query(`SELECT * FROM topic`, function(error, topics){
          var title = 'Welcome';
          var description = 'Hello,Node.js';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>`,
            );
          response.writeHead(200);
          response.end(html);
        });
        //**** DB로써 데이터 관리
      } else {
        //**** 파일시스템으로써 데이터 관리
        /*
        fs.readdir('./data', function(err, filelist){
          var fillteredId = path.parse(title).base;   // url공격을 막을수있다. 경로문제 해결
          fs.readFile(`data/${fillteredId}`, 'utf8', function(err, description){
            var list = template.list(filelist);
            var html = template.HTML(title, list,
            `
              <a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="/process_delete" method="post" onsubmit="delete complete!">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
              <h2>${title}</h2><p>${description}</p>
            `, '');
            response.writeHead(200);
            response.end(html);
          });
        });
        */
        //**** 파일시스템으로써 데이터 관리

        //**** DB로써 데이터 관리
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){
            throw error;
          }
          db.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id = author.id WHERE topic.id=?`,
            [queryData.id], function(error2, topics2){
            if(error2){
              throw error2;
            }
            var title = topics2[0].title;
            var author = topics2[0].name;
            var description = topics2[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              <h2>${title}</h2>
              <p>${description}</p>
              <p>by ${author} </p>
              `,
              `<a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="/process_delete" method="post" onsubmit="delete()">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>
              <script>
              function delete(){
                alert("delete complete!!");
              }
              </script>`
              );
            response.writeHead(200);
            response.end(html);
          });
        });
        //**** DB로써 데이터 관리
      }
    } else if(pathname === '/create'){
      //**** 파일시스템으로써 데이터 관리
      /*
      fs.readdir('./data', function(err, filelist){
        var title = 'WEB - create'
        var list = template.list(filelist);
        var html = template.HTML(title, list,
        `
          <form action="/process_create" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <P>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
      });
      */
      //**** 파일시스템으로써 데이터 관리

      //**** DB로써 데이터 관리
      db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM author`, function(error2, authors){
          var title = "create"
          var list = template.list(topics);
          var html = template.HTML(title, list,
          `
            <form action="/process_create" method="POST">
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
          `, '');
          response.writeHead(200);
          response.end(html);
        });
      });
      //**** DB로써 데이터 관리
    } else if(pathname === '/process_create'){
        var body = '';
        //***** event
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);    //event를 통해 post정보를 객체화 할 수 있다.
          // console.log(post)
          // var title = post.title;
          // var description = post.description;
          db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?,?,NOW(),?)`,
          [post.title, post.description, post.author], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});   // 작성한 글을 확인할 수 있도록 redirection
            response.end();
          });
          /*
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){  // 입력을 파일로서 저장한다.
            response.writeHead(302, {Location: `/?id=${title}`});   // 작성한 글을 확인할 수 있도록 redirection
            response.end();
          });
          */
        });
        //***** event
      } else if(pathname === '/update'){
        //var fillteredId = path.parse(queryData.id).base;   // url공격을 막을수있다. 경로문제 해결
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){
            throw error;
          }
          db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(errors, result){
            if(errors){
              throw errors;
            }
            db.query(`SELECT * FROM author`, function(error2, authors){
              if(error2){
                throw error2;
              }
              console.log(result[0].author_id);
              var list = template.list(topics);
              var html = template.HTML(result[0].title, list,
                `
                  <form action="/process_update" method="POST">
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
                ` <a href="/create">create</a>
                  <a href="/update?id=${result[0].id}">update</a>`
                );
              response.writeHead(200);
              response.end(html);
            });
          });
        });
        /*
        fs.readdir('./data', function(err, filelist){
          var fillteredId = path.parse(title).base;   // url공격을 막을수있다. 경로문제 해결
          fs.readFile(`data/${fillteredId}`, 'utf8', function(err, description){
            var list = template.list(filelist);
            var html = template.HTML(title, list,
            `
              <a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="/process_update" method="POST">
              <input type="hidden", name="id", value="${title}">    <!-- 수정시 제목도 수정가능하므로 기존의 제목을 숨겨서 보내기-->
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>  <!-- 업데이트시 기존의 내용을 보여주기 -->
              <P>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
              </form>
            `, '');
            response.writeHead(200);
            response.end(html);
          });
        });
        */
      } else if(pathname ==='/process_update'){
        var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          // var id = post.id;
          // var title = post.title;
          // var description = post.description;
          db.query(`UPDATE topic SET title=?, description=?, created=NOW(), author_id=? WHERE id=?`,
            [post.title, post.description, post.author, post.id], function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${post.id}`});   // 작성한 글을 확인할 수 있도록 redirection
              response.end();
            })
          /*
          fs.rename(`data/${old_title}`, `data/${new_title}`, function(err){  // 제목이 바뀔 수 도있으므로 이름 변경 후
            fs.writeFile(`data/${new_title}`, description, 'utf8', function(err){   //내용 변경
              response.writeHead(302, {Location: `/?id=${new_title}`});   // 작성한 글을 확인할 수 있도록 redirection
              response.end();
            });
          });
          */
        });
      } else if(pathname === '/process_delete'){
        var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          //var id = post.id;
          //var fillteredId = path.parse(id).base;   // url공격을 막을수있다. 경로문제 해결
          db.query(`DELETE FROM topic WHERE id=?`,[post.id], function(error,result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});   // 작성한 글을 확인할 수 있도록 redirection
            response.end();
          });
          /*
          fs.unlink(`./data/${fillteredId}`, function(err){
            response.writeHead(302, {Location: `/`});   // 작성한 글을 확인할 수 있도록 redirection
            response.end();
          });
          */
        });
      } else{ // 잘못된 경로의 경우 not found출력
      response.writeHead(404);
      response.end("Not found");
    }
});
app.listen(3000);
