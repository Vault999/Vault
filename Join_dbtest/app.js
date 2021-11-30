const express = require("express") //서버 생성
const app = express() //서버 생성
const bodyParser = require("body-parser") //post로 받은 데이터로 파라미터를 추출
const multer = require("multer") //파일 업로드
const upload = multer(); //파일 업로드

app.use(express.static('views')) //정적파일 - 직접 값에 변화를 주지 않는 이상 변하지 안흔ㄴ 파일 / ''dir밑에 있는 데이터들을 웹 브라우저의 요청에 따라 서비스 제공/ views밑에 파일만 제공하기에 보안적 이점이 있다.  
///use 시작하는 모든 경로에 응답. get, post , 
app.use(bodyParser.json()); //post로 받은 json타입의 데이터
var urlencodedParser = bodyParser.urlencoded({extended:true}) //객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용한다는 말(true) //false값 사용시 qs가 추가적인  보안이 가능하다는 말. true값이 qs모듈을 설치하지 않으면 false값 따로 설정해야함.
app.use(upload.array()) //배열에 업로드 ///어떤 배열로?


var Users = [];
app.set('view engine', 'pug'); 
app.set("views", './views');

const port = 3000;
const host = '127.0.0.1';

app.get('/', (req,res) => { //경로로 들어갔을 때 signuppug를 렌더링해준다.
    res.render('signup' , 
    // {message: "please signup"} //메세지 따로 안뜸. 확인해볼 것.
    ) 
})

//postman에서 확인? information pug는 어디에 연결된거지?
app.post('/info', urlencodedParser, (req, res) => { // 받은데이터 /info경로로 나오고. 객체 형태로 전달된 데이터내에서 또다른 중접된 객체를 허용
    console.log(req.body) //받은 데이터 아래 콘솔로그에 나옴.
    var response = { //pugbody에서 받은 값들.
        user_name: req.body.user_name,
        user_id: req.body.user_id,
        password: req.body.password,
        post: req.body.post,
        addr: req.body.addr,
        detai: req.body.detai
    };
    // console.log(response)
    //get에서 받은 데이더를 /info 경로에 아래 res해준다.
    res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
    res.end(`이름 : ${response.user_name} \n아이디 : ${response.user_id} \n주소 : ${response.post} ${response.addr} ${response.detai}`)
    
    // res.redirect('information')
});

app.listen(port, host, () => { //서버연결
    console.log(`application running at http://${host}:${port}/`)
});


///문제점. 비밀번호가 노출됐다고 나옴. //port바꿨을 때 나옴.. 크롬문제같다고함
