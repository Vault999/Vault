// var css = require("./lib/css.css")

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8"> 
      <title>WEB1 - ${title}</title>
      <link rel="stylesheet" type="text/css" href="./css.css">
    </head> 
    <body>
      <h1><a href="/" id="main"> NFT upload page!</a></h1>
      <div>
      ${list}
      </div>
      ${control}
      ${body}
    </body>
    </html>
    `;
  }
  
  ,list:function(topics){
    var list = '<div>';  // 여기서 처음에 ul로 만들었기 때문에 리스트가 됐구나. div로 만들어서 응용하자
    var i = 0;
    while(i < topics.length){
      list = list + `<a href="/?id=${topics[i].id}">${topics[i].title}</a><br>`;  // 근데 어떻게 여기서 topics라는 배열에 sql이 연결되는거지? 이부분 모르겠다
      i = i + 1;
      list = list+'</div>';
    }
    // list = list+'</div>';  여기서 작동하면 하나의 div안에 모두가 담기고 위에서 작동하면 각 개별적으로 div구성 가능
    return list;
  }
  
  
  ,authorSelect:function(authors, author_id){   //author_id라는 두번째 파라미터값 
      var tag = ''; 
      var i = 0;
      while(i < authors.length){
        var selected = '';
        if(authors[i].id === author_id){   // 조건문으로 두번째 파라미터를 이용하여  (11강참고)
          selected = ' selected';
        }
        tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
        i++; 
      }
      return `
        <select name="author">
          ${tag}
        </select>
      `
      // return값에 `를 줘서 이런 어떤 형태?로 준다.    
  }
}
