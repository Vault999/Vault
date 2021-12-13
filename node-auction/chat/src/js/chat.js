const socket = io();

const nickname = document.querySelector("#nickname");
const chatlist = document.querySelector(".chatting-list")
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container");

chatInput.addEventListener("keypress", (event)=>{
    if(event.keyCode === 13){                                                    //keycode 13 = 엔터키
        send();
    }
});

function send(){
    const param = {                                                               //객체형식으로 저장
        name : nickname.value,
        msg : chatInput.value
    }
    socket.emit("chatting", param);     
}

sendButton.addEventListener("click", send);

socket.on("chatting", (data)=>{                                              //메세지를 '수신'했을 때 item.makeLi();로 출력           
    const { name , msg, time } = data;
    const item = new  Limodel(name, msg, time);                             //Limodel 인스턴스화(new = 클래스 복제)
    item.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight)            //스크롤 항상 채팅 마지막으로 냅두기
});                                                                         //메세지를 '보냄'(받는건 다른문제)  //"chatting"은 채널이름과 같음 "from front"은 메세지

function Limodel(name, msg, time){                                          //
    this.name = name;
    this.msg = msg;
    this.time = time;

    this.makeLi = () => {                                                     //메서드 생성
        const li = document.createElement("li");                              //html 태그 삽입 후 innerHTML로 출력
        li.classList.add(nickname.value === this.name ? "sent" : "received")
        const dom = `<span class="profile">
                <span class="user">${this.name}</span>
                <img class="image" src="/연습폴더/생활코딩/coding.jpg" width="25px" alt="any">
            </span>
            <span class="message">${this.msg}</span>
            <span class="time">${this.time}</span>`;
        li.innerHTML = dom;
        chatlist.appendChild(li)
    }
}