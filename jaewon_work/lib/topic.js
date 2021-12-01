// API를 여러개 적용할 거기 때문에
// exports 를 사용
// 하나만 적용시킬땐 module.exports

var db = require("./db.js")                 // 아래 코드에 적용되어있는 모듈 가져오고 경로 설정
var template = require("./template.js");    // 아래 코드에 적용되어있는 모듈 가져오고 경로 설정
var template2 = require("./template2.js"); 
var url = require("url");
var qs = require("querystring");

// == page 본문내용
exports.home = function(request, response){ // main에 topic.home에 req한 후 res
    db.query(`SELECT * FROM topic`, function (error, topics) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(topics); // template.js에 있는 list property의함수
        var html = template2.HTML(
            title,
            list, // template.js에 있는 객체들
            `<h2>${title}</h2>${description}`, // template.js에 있는 body부분
            `<a href="/create">create</a>` // template.js에 있는 cotrol부분
        );
        response.writeHead(200); // 이 안에 들어가는 숫자는 statuscode. 검색해볼것
        response.end(html);
    });
}

//=== 상세보기 페이지
exports.page=function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // 메타데이터가 queryData에 객체형식으로 담겨지게 됌.
    var pathname = url.parse(_url, true).pathname; // 메타데이터가 queryData에 객체형식으로 담겨지게 됌.
  
    db.query(`SELECT * FROM topic`, function (error, topics) {
        // 0. 먼저 topic을 가져오고
        if (error) throw error;
        db.query(
        `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id =?`,
        [queryData.id],
        function (error2, topic) {
            // 1. 이후에 topic의 각 상세내용을 가져온다
            if (error2) throw error2; // ㄴ *중요*  앞 인자에 topic.id 값을 변수로 설정하는것보다 ?로 설정하고, ?의 값이 무엇인지를 2번째 인자로 배열에 담아서 준다 (5강 7분)
            // 2. 그다음에 웹페이지를 구성하는 코드 / 여기부터 본문
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(
            title,
            list,
            `
                <h2>${title}</h2>
                ${description} 
                <p> by ${topic[0].name} </p>   
                `, // body, control을 구분하는 ,
            ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

// == creat page
exports.create = function(requset, response){
    db.query(`SELECT * FROM topic`, function (error, topics) {
        db.query(`SELECT * FROM author`, function (error2, authors) {
          //추후에 추가
          var title = "Create !!";
          var list = template.list(topics);
          var html = template.HTML(
            title,
            list, //밑에 form은 /crearte_process로 post 방식으로
            `
                <form action="/create_process" method="post">    
                  <p><input type="text" name="title" placeholder="title"></p>
                  <p>
                    <textarea name="description" placeholder="description"></textarea>
                  </p>
                  <p>
                    ${template.authorSelect(authors)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `, // body, control을 구분하는 ,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
    });
}

// == creat_process page
exports.creat_process = function(request, response){
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      db.query(
        `
              INSERT INTO topic (title, description, created, author_id) 
                VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author], // post,author.는 template author의 return값 author와 같은 값
        function (error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` }); // 삽인된 행에대한 id를 getting하는 가져오는 방법. result라는 id에다 property로 id값을 주겠다
          response.end(); // ㄴ stauts code 302 : found ! 검색해볼것
        }
      );
    });    
}


// == update page
exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // 메타데이터가 queryData에 객체형식으로 담겨지게 됌.

    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) throw error;
        db.query(
          `SELECT * FROM topic WHERE id =?`,
          [queryData.id],
          function (error2, topic) {
            if (error2) throw error;
  
            db.query(`SELECT * FROM author`, function (error2, authors) {
              var list = template.list(topics);
              var html = template.HTML(
                topic[0].title,
                list,
                `
                    <form action="/update_process" method="post">
                      <input type="hidden" name="id" value="${topic[0].id}">  
                      <p><input type="text" name="title" placeholder="title" value="${
                        topic[0].title
                      }"></p>
                      <p>
                        <textarea name="description" placeholder="description">${
                          topic[0].description
                        }</textarea>
                      </p>
                      <p>
                        ${template.authorSelect(authors, topic[0].author_id)}
                      </p>
                      <p>
                        <input type="submit">
                      </p>
                    </form>
                    `,
                `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
              );
              response.writeHead(200);
              response.end(html);
            });
          }
        );
    });    
}


// == update page
exports.update_process = function(request, response){
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);

      db.query(
        `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id],
        function (error, result) {
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        }
      );
    });
}

// == delete page
exports.delete = function(request, response){
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      db.query(
        `DELETE FROM topic WHERE id = ?`,
        [post.id],
        function (error, result) {
          if (error) throw error;
          response.writeHead(302, { Location: `/` });
          response.end();
        }
      );
    });
}