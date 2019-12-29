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
  },list:function (filelist){
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
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    // ***** 리스트의 동적 코딩
    return list;
  }
}
