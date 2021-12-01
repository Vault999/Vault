var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "thdrn48",
  database: "opentutorials",
});
db.connect();

// 이 js파일을 외부에서 쓸 수 있도록 exports시키기
module.exports = db;
