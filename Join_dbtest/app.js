const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer"); //파일 업로드
const upload = multer();
const mysql = require('mysql');
const router = require('./routes')

// var Users = [];
app.set('view engine', 'pug'); 
app.set("views", './views');

app.use(express.static('views'));  
///use 시작하는 모든 경로에 응답. get, post , 
app.use(bodyParser.json()); //post로 받은 json타입의 데이터
app.use(bodyParser.urlencoded({extended:false})); //객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용한다는 말(true) //false값 사용시 qs가 추가적인  보안이 가능하다는 말. true값이 qs모듈을 설치하지 않으면 false값 따로 설정해야함.
app.use(upload.array()); //배열에 업로드 ///어떤 배열로?

const port = 3300;
const host = '127.0.0.1';

require("dotenv").config();
var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.get('/', (req,res) => {
    res.render('mainhome');
});




        console.log("Database Connected!");
        var signQuery = `INSERT INTO joindbtest (user_id, user_name, user_pw, user_repw) VALUES ('${req.body.user_id}', '${req.body.user_name}', '${req.body.user_pw}', '${req.body.user_repw}');`;
        var idChkQuery = `SELECT user_id FROM joindbtest WHERE user_id'${req.body.user_id}';`
    
        con.query(idCHKQuery, (err, result, fields) => {
            if(err) throw err;
            console.log(result[0]);
        
            if(idChkQuery.length != 0) {
                res.render("signup", {message:"존재하는 아이디입니다"});
                con.end();
            } else {
                con.query(signQuery, (err, result, fields) => {
                    res.redirect('loginpage');
                    console.log("redirect login page!!!")
                    con.end();
                });
            }   
        });


            if(err) throw err;
            console.log(result[0]);

                res.redirect('loginpage');
                console.log("redirect login page!!!")
                con.end();


    //         if(request.body.user_pw 
    //             else if(!req.body.user_pw || !req.body.user_repw ){
    //             // res.status("404")
    //             res.send("<script>")
    //         }
    //         else{
    //             Users.filter((user) =>{
    //                 if(user.id === req.body.id){
    //                     res.render('signup', {      
    //                         message: "User Alread Exists! Login or choose another user id"
    //                     });
    //                 }
    //             });
        
    //             let newUser = {id: req.body.id, password: req.body.password};
    //             Users.push(newUser)
    //         console.log(result);
    //     });
        
    // });

    // 이것들의 써야하는 의미는 무엇인가..
    // res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
    // res.end(`이름 : ${response.user_name} \n아이디 : ${response.user_id} \n주소 : ${response.post} ${response.addr} ${response.detai}`)

    
    
app.get('/loginpage', (req, res) => {
    res.render('loginpage');
});

app.post('/logininfo', (req, res) => {
    console.log("Get login information success!");
    
    con.connect(function(err) {
        console.log("Database Connected!");
        var sQuery = `SELECT * FROM joindbtest WHERE user_id='${req.body.user_id}';`
        console.log(req.body.user_id);
        // and user_pw '${req.body.user_pw}';    
    
        con.query(sQuery, (err, result, fields) => {
            if(err) throw err;
            console.log(result[0]);

            if(!result[0]) {
                // res.send("<script>alert('없는 아이디 입니다.');</script>");
                // 변수값하나를 바꿔서 저장시킨다음에
                res.render("loginpage", {message:"iderror"});
                console.log('there are success');
                con.end();
                // res.redirect("./login");
            } else {
                res.redirect('mainhome');
                console.log("redirect login page!!!")
            }
            // if (req.body.user_id === result[0]){ //sql 쿼리문을 req.body.user_id인자와 비교하는게 따로 있는거 같음..! 이런식으로 비교하면 안될듯!
            //        ///// && !req.body.user_pw ===!sQuery어떻게 두개 한 번에?
            //     res.render('loginpage');
            //     res.send('존재하지 않는 아이디입니다.');
            //     console.log("check user_id in database")
            // } else {
            // res.redirect('mainhome');
            // console.log("login success!!!")
            // }
            // res.redirect('mainhome');
            // console.log("redirect login page!!!")
        });
        con.end();
    });
});

app.listen(port, host, () => { //서버연결
    console.log(`application running at http://${host}:${port}/`)
});
///문제점. 비밀번호가 노출됐다고 나옴. //port바꿨을 때 나옴.. 크롬문제같다고함
///////////////////////재원work