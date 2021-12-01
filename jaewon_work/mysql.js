var mysql = require('mysql'); //mysql이란 모듈을 mysql이란 변수를 통해 사용할 수 있다
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
var connection = mysql.createConnection({ //mysql이라는 모듈에 들어있는 cre~라는 method를 호출. 그 메소드의 인자로 객체를 줌
  host     : 'localhost',  
  user     : 'root',
  password : 'thdrn48',
  database : 'opentutorials'
});
  
connection.connect();
// connection에 담긴 객체에 connect라는 method를 호출하면 접속이 될것이다

// mysql 데이터를 가져오는 함수
// 0. connection에 query라는 method를 호출
// 1. 첫번째 인자로 '~' 문을 sql에 db에 전송되서 실행이 끝난다음에
// 2. 두번째 인자인 callback이 호출 {callback 함수의 본문!} 
// 2-1. 그 callback의 첫번째 인자로는 error가 , 두번째는 sql결과가 담기게 약속되어 있음
connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});
  
connection.end();