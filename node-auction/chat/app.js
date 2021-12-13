//서버를 구동해주는 js 파일

const express = require("express");                                                 //node_modules를 조회하여 기능을 쓰게해줌.
const http = require("http");
const app = express();                                                              //express를 실행한 값을 담아줌
const path = require("path");                                                       //path 명령어를 통해 url을 편하게 만듦
const server = http.createServer(app);
const socketIO = require("socket.io");
const moment = require("moment");
const io = socketIO(server);                                                        //socket에 server를 담아줌

// console.log(__dirname); //C:\work\NODE.JS\연습폴더\chat 를 표시함
//path.join 운영체제마다 '/'나 '\'로 경로 표현방식이 달라 사용해줌
app.use(express.static(path.join(__dirname,"src")));                                //express의 static 기능은 기준폴더를 지정할 수 있음.
const PORT = process.env.PORT || "3000";

io.on("connection", (socket)=>{                                                    //connection이 이루어지면 생성되는 객체를 socket에 담아줌
    socket.on("chatting",(data)=>{                                                 //채팅아이디를 적어주고 data로 메세지를 받아옴
        const { name, msg } = data;                                                //프론트에서 가져온 data임
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth()+1;
        let day = today.getDate();
        let hours = today.getHours();
        let minutes = today.getMinutes();
        io.emit("chatting",{                                                       //서버에서 프론트로 메세지를 '보냄' //프론트에서 '수신'하는 방법도 별도 지정 필요
            name,                                                                  //객체분리하여 저장 후 사용
            msg,
            time: (year + "-" + month + "-" + day + " " + hours + ":" + minutes)   //time은 값이 없어 moment로 따로 불러와 인스턴스 적용하고 format 기능으로 ("YYYY-MM-DD HH:MM:SS")양식설정
        });                  
    });
});

server.listen(PORT, ()=>{
    console.log(`server is runnig ${PORT}`);
});