const express = require('express')
const fs = require('fs')
const ejs = require('ejs')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const client = mysql.createConnection({
  user: 'root',
  password: 'thdrn48', //본인의 db root 계정 비밀번호
  database: 'vault999' //본인의 db
})

// require("dotenv").config();
// const client = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });

const port = 3000;
const host = '127.0.0.1';

const app = express()

var Users = [];
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('views'));  ///use 시작하는 모든 경로에 응답. get, post ,
app.use(bodyParser.json()); //post로 받은 json타입의 데이터
app.use(bodyParser.urlencoded({extended:false})); //객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용한다는 말(true) //false값 사용시 qs가 추가적인  보안이 가능하다는 말. true값이 qs모듈을 설치하지 않으면 false값 따로 설정해야함.
// app.use(upload.array()); //배열에 업로드 ///어떤 배열로?

app.listen(port, host, () => { //서버연결
  console.log(`application running at http://${host}:${port}/`)
});


//=====================================================

app.get('/', (req, res)=>{
  res.render('main_page')
})

app.get('/signup', (req,res) => { //urlencoded 어떻게 사용?
  res.render('signup');
});

app.post('/signupinfo', (req, res) => { // 받은데이터. 객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용 //?왜 info로 바꿔야 실행되지..?
  console.log("Get signup information success!")
  client.connect(function(err) {

      console.log("Database Connected!");
      var sQuery = `insert into users (user_id, user_name, user_pw, user_repw) values ('${req.body.user_id}', '${req.body.user_name}', '${req.body.user_pw}', '${req.body.user_repw}')`;
  
  
      client.query(sQuery, (err, result, fields) => {
          if(err) throw err;

  res.redirect('loginpage');
  console.log("redirect login page!!!")
      });
  });
});

app.get('/loginpage', (req, res) => {
  res.render('loginpage');
});

app.post('/', (req, res) => {
  console.log("Get login information success!");
  client.connect(function(err) {
      console.log("Database Connected!");
      var sQuery = `SELECT * FROM users WHERE user_id = '${req.body.user_id}';`
      
      // and user_pw '${req.body.user_pw}';    
  
      client.query(sQuery, (err, result, fields) => {
          if(err) throw err;
          if (result[0]){ //sql 쿼리문을 req.body.user_id인자와 비교하는게 따로 있는거 같음..! 이런식으로 비교하면 안될듯!
                 ///// && !req.body.user_pw ===!sQuery어떻게 두개 한 번에?
                 console.log("login success!!!")
                
                 res.render('main_page')   
              }
          else {
        
              
              res.render('loginpage');
              // res.send("<script>alert('없는 아이디 입니다.');</script>");
              console.log("check user_id in database")
          }
          }); 
      });
  });
  
//======================================================

app.get('/board', function (req, res) {
  fs.readFile('./views/list.ejs', 'utf8', function (err, data) {
    client.query('select * from board', function (err, results) {
      if (err) {
        res.send(err)
      } else {
        res.send(ejs.render(data, {
          data: results
        }))
      }
    })
  })
})


app.get('/board/delete/:id', function (req, res) {
    client.query('delete from board where id=?', [req.params.id], function () {
      res.redirect('/board')
    })
  })

  

app.get('/board/insert', function (req, res) {
    fs.readFile('./views/insert.html', 'utf8', function (err, data) {
        res.send(data)
        })
    })

app.post('/board/insert', function (req, res) {
    const body = req.body
    
    client.query('insert into board (title, price, description, tag) values (?, ?, ?, ?);', [
        body.title,
        body.price,
        body.description,
        body.tag
    ], function() {
        res.redirect('/board')
    })
    })
      
app.get('/board/edit/:id', function (req, res) {
    fs.readFile('./views/edit.ejs', 'utf8', function (err, data) {
        client.query('select * from board where id = ?', [req.params.id], function (err, result) {
        res.send(ejs.render(data, {
            data: result[0]
        }))
      })
    })
  })

app.post('/board/edit/:id', function (req, res) {
    const body = req.body
    
    client.query('update board SET title=?, price=?, description=?, tag=? where id=?',[
        body.title, body.price, body.description, body.tag, req.params.id
    ], function () {
        res.redirect('/board')
    })
  })