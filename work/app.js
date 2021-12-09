const express = require('express');
const app = express();
const fs = require('fs');
const router = express.Router();
const ejs = require('ejs');
const mysql = require('mysql');
require("dotenv").config();
const bodyParser = require('body-parser');
const { connect } = require('http2');
const session = require('express-session');

const client = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const port = 3300;
const host = '127.0.0.1';

app.use(session({
  secure: false,
  secret: 'sdfsdf',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge:(1000 * 60 * 30)}
}));

// var Users = [];
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('views'));
app.use(bodyParser.json()); //post로 받은 json타입의 데이터
app.use(bodyParser.urlencoded({extended:false})); //객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용한다는 말(true) //false값 사용시 qs가 추가적인  보안이 가능하다는 말. true값이 qs모듈을 설치하지 않으면 false값 따로 설정해야함.
// app.use(upload.array()); //배열에 업로드 ///어떤 배열로?

app.listen(port, host, () => { 
  console.log(`application running at http://${host}:${port}/`)
});

//=====================================================



app.get('/landing', (req, res)=>{
  res.render('landing');
});

app.get('/', (req, res)=>{
  // res.render('landing');
  res.render('main_page', {loginState:req.session.loginState, loginedId:req.session.loginedId}); 
  // console.log(req.session.loginState);
  // console.log(req.session.loginedId);
});

app.post('/logout', (req, res) => {
  delete req.session.loginState;
  delete req.session.loginedId;
  console.log("logout!")
  res.redirect('/') //res.send('<script>window.location.href = "/"; </script>'); 
});

app.get('/signup', (req,res) => {
  res.render('signup_page');
});

app.post('/signupinfo', (req, res) => {
  console.log("Get signup information success!")
  
  client.connect(function(err) {
    console.log("Database Connected!");

      const signupQuery = `INSERT INTO users (user_id, user_name, user_pw, user_repw) VALUES ('${req.body.user_id}', '${req.body.user_name}', '${req.body.user_pw}', '${req.body.user_repw}')`;
      const signIdChkQuery = `SELECT user_id FROM users WHERE user_id='${req.body.user_id}';`;
      
      client.query(signIdChkQuery, (err, result, fields) => {
        if(err) throw err;

        if(result[0]) {
          // client.end();
          res.send('<script>alert("이미 있는 아이디입니다 다시 입력해주세요"); window.location.href = "/signup"; </script>');
        } else {
          client.query(signupQuery, (err, result, fields) => {
            if(err) throw err;
            console.log(result);
          });

        // client.end();
        res.redirect('/login'); //render/redirect/
        }        
      });
  });
});

app.get('/login', (req, res) => {
  res.render('login_page', {loginState:req.session.loginState, id:req.session.loginedId});
});

app.post('/login', (req, res) => {
  console.log("Get login information success!");
  
  client.connect(function(err) {
    console.log("Database Connected!");
      
    const loginIdChkQuery = `SELECT * FROM users WHERE user_id = '${req.body.user_id}';`;
    client.query(loginIdChkQuery, (err, result, fields) => {
      if(err) throw err;

      if(req.body.user_id=='') {
        // client.end();
        res.send("<script>alert('아이디를 입력하세요.');window.location.href='/login';</script>");
      } else if(!result[0]) {
        // res.render('login_page');
        // client.end();
        res.send("<script>alert('없는 아이디입니다.');window.location.href='/login';</script>");
        console.log("check user_id in database");
        } else {
          if(result[0].user_pw === req.body.user_pw) {
            console.log("login success!!!");
            req.session.loginState = 'okay';
            req.session.loginedId = result[0].user_id;
            // client.end();
            // res.redirect('/');
            res.render("main_page", {loginState:req.session.loginState, id:req.session.loginedId})
          } else {
            // client.end();
            res.send("<script>alert('틀린비밀번호 입니다.');window.location.href='/login';</script>");
            console.log("check user_id in database");
            }
          }
    });
    // client.end();
  });
});
  
//======================================================

app.get('/explore', function (req, res) {
  fs.readFile('./views/explore_page.ejs', 'utf8', function (err, data) {
    client.query('select * from board', function (err, results) {
      if (err) {
        res.send(err)
      } else {
        res.send(ejs.render(data, {
          data: results, loginState:req.session.loginState, loginedId:req.session.loginedId
        }))
      }
    })
  })
})

app.get('/mypage', function (req, res) {
  fs.readFile('./views/mypage.ejs', 'utf8', function (err, data) {
    client.query('select * from board', function (err, results) {
      if (err) {
        res.send(err)
      } else {
        res.send(ejs.render(data, {
          data: results, loginState:req.session.loginState, id:req.session.loginedId}
        ))
        }
      }
    )
  })
})


app.get('/board/delete/:id', function (req, res) {
    client.query('delete from board where id=?', [req.params.id], function () {
      res.redirect('/board')
    })
  })

  

app.get('/board/create', function (req, res) {
    fs.readFile('./views/createitem_page.ejs', 'utf8', function (err, data) {
        res.send(data)
        })
    })

app.post('/board/create', function (req, res) {
  
    const body = req.body;
    
    client.query('insert into board (title, price, description, tag) values (?, ?, ?, ?);', [
      body.title,
      body.price,
      body.description,
      body.tag
      ], function() {
        res.redirect('/board');
      }
    );
});

    
app.get('/board/edit/:id', function (req, res) {
    fs.readFile('./views/edit_page.ejs', 'utf8', function (err, data) {
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
    }
  )

})

app.get('/board/page/:id', function (req, res) {
  fs.readFile('./views/board_page.ejs', 'utf8', function (err, data) {
      client.query('select * from board where id = ?', [req.params.id], function (err, result) {
      res.send(ejs.render(data, {
          data: result[0]
      }))
    })
  })
})

app.post('/board/page/:id', function (req, res) {
const body = req.body

client.query('update board SET title=?, price=?, description=?, tag=? where id=?',[
  body.title, body.price, body.description, body.tag, req.params.id
  ], function () {
      res.redirect('/board')
  }
)

})