var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var template = require("./lib/template.js");

// === mysql 연결  nodejs.mysql.js 참고하기 ./lib.db.js
var db = require("./lib/db.js")

// === topic code정리하기
var topic = require("./lib/topic.js")



var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query; // 메타데이터가 queryData에 객체형식으로 담겨지게 됌.
  var pathname = url.parse(_url, true).pathname; // 메타데이터가 queryData에 객체형식으로 담겨지게 됌.

  if (pathname === "/") {
    // == main 페이지
    if (queryData.id === undefined) {
      // == page 본문내용
      topic.home(request, response);    // topic에 home function에 req, res
      //=== page 본문내용
    }
    // == main 페이지

    // === 상세보기 페이지
    else {
      topic.page(request, response);
    }
  }
  // === 상세보기 페이지

  // === 글생성 페이지
  else if (pathname === "/create") {
    topic.create(request, response);
  }
  // === 글생성 페이지

  // ===== 글 생성 기능
  else if (pathname === "/create_process") {
    topic.creat_process(request, response);
  }
  // ===== 글 생성 기능

  // ===== 글 수정 기능
  else if (pathname === "/update") {
    topic.update(request, response);
  }
  // ===== 글 수정 기능

  // ===== 글 수정 제출
  else if (pathname === "/update_process") {
    topic.update_process(request, response);
  }
  // ===== 글 수정 제출

  // ===== 글 삭제
  else if (pathname === "/delete_process") {
    topic.delete(request,response);
  }
  // ===== 글 삭제
  else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);


// ** MySQL 에서의 JOIN. 관계형db의 핵심!!

// SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id;
// -- topic table을 왼쪽에 넣고 오른쪽에다가 author table을 나란히 붙힌다
// -- 그리고 이때 topic의 author_id값과 author의 id값이 같다고 관계를 맺어줌
