const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer"); //파일 업로드
const upload = multer();
const mysql = require('mysql');

var Users = [];
app.set('view engine', 'pug'); 
app.set("views", './views');

app.use(express.static('views'));  
///use 시작하는 모든 경로에 응답. get, post , 
app.use(bodyParser.json()); //post로 받은 json타입의 데이터
app.use(bodyParser.urlencoded({extended:false})); //객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용한다는 말(true) //false값 사용시 qs가 추가적인  보안이 가능하다는 말. true값이 qs모듈을 설치하지 않으면 false값 따로 설정해야함.
app.use(upload.array()); //배열에 업로드 ///어떤 배열로?

const port = 4500;
const host = '127.0.0.1';

require("dotenv").config();
var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.get('/', (req,res) => { //urlencoded 어떻게 사용?
    res.render('signup');
});

//postman에서 확인? information pug는 어디에 연결된거지?
app.post('/info', (req, res) => { // 받은데이터. 객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용 //?왜 info로 바꿔야 실행되지..?
    console.log("Get information success!")
    con.connect(function(err) {

        console.log("Database Connected!");
        var sQuery = `insert into jw (user_id, user_name, user_pw, user_repw) values ('${req.body.user_id}', '${req.body.user_name}', '${req.body.user_pw}', '${req.body.user_repw}')`;
    
    
        con.query(sQuery, (err, result, fields) => {
            if(err) throw err
            // else if(!req.body.id || !req.body.password){
            //     res.status("404")
            //     res.send("Invalid id or password")
            // }
            // else{
            //     Users.filter((user) =>{
            //         if(user.id === req.body.id){
            //             res.render('signup', {      
            //                 message: "User Alread Exists! Login or choose another user id"
            //             });
            //         }
            //     });
        
            //     let newUser = {id: req.body.id, password: req.body.password};
            //     Users.push(newUser)
            console.log(result);
        });
        
    });
    res.redirect('loginpage');
});
    //  con.end();

    // console.log(response)
    //get에서 받은 데이더를 /info 경로에 아래 res해준다.
    // res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
    // res.end(`이름 : ${response.user_name} \n아이디 : ${response.user_id} \n주소 : ${response.post} ${response.addr} ${response.detai}`)
    
   

app.get('/loginpage', (req, res) => {
    res.render('loginpage');
});

// app.post('')

app.listen(port, host, () => { //서버연결
    console.log(`application running at http://${host}:${port}/`)
});


///문제점. 비밀번호가 노출됐다고 나옴. //port바꿨을 때 나옴.. 크롬문제같다고함
///////////////////////재원work

