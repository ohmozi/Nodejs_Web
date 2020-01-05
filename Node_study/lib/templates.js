module.exports = {
  HTML: function (title, db_list, body, control, author_list){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <p><a href="/author_list">author</a></p>
      ${db_list}
      ${control}
      ${body}
      ${author_list}
    </body>
    </html>
    `;
  },db_list:function (topics){
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
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    // ***** 리스트의 동적 코딩
    return list;
  },authorSelect:function (authors, author_id){
    var tag = '';
    var i =0;
    while(i < authors.length){
      var selected = '';
      if( authors[i].id === author_id){
        selected = 'selected';
      }
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `;
  },author_list:function(authors, form){
    var list = `
    <table>
      <tr>
        <td>name</td>
        <td>profile</td>
        <td>update</td>
        <td>delete</td>
      </tr>
    `;
    var i = 0;
    while(i < authors.length){
      list += `
      <tr>
        <td>${authors[i].name}</td>
        <td>${authors[i].profile}</td>
        <td><a href="/author_update?author_id=${authors[i].id}">update</a></td>
        <td>
          <form action="/process_author_delete" method="post" onsubmit="delete()">
            <input type="hidden" name="id" value="${authors[i].id}">
            <input type="submit" value="delete">
          </form>
        </td>
      </tr>`;
      i++;
    }
    list += `
    </table>
    <script>
      function delete(){
        alert("delete complete!!");
      }
    </script>
    <style>
      table{
        border-collapse:collapse;
      }
      td{
        border:1px solid black;
      }
    </style>`;
    list += form;
    return list;
  }
}
