module.exports = {
  HTML: function (title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function (topics){
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
  }
}
