const countDownTimer = function (id, date) { 
    var duedate = new Date(date); // 전달 받은 일자 
    var second = 1000; 
    var minute = second * 60; 
    var hour = minute * 60; 
    var day = hour * 24; 
    var timer; 
    
    function showRemaining() { 
            var now = new Date(); 
            var timeleft = duedate - now; 

            if (timeleft < 0) { 
                clearInterval(timer); //남은시간 < 0, setInterval 함수 종료
                document.getElementById(id).textContent = '해당 경매가 종료 되었습니다!'; 
                return; 
            } 
            var days = Math.floor(timeleft / day); 
            var hours = Math.floor((timeleft % day) / hour); 
            var minutes = Math.floor((timeleft % hour) / minute); 
            var seconds = Math.floor((timeleft % minute) / second); 

            //document.getElementById(id).textContent = date.toLocaleString() + "까지 : "; 
            document.getElementById(id).textContent = days + '일'; 
            document.getElementById(id).textContent += hours + '시간'; 
            document.getElementById(id).textContent += minutes + '분'; 
            document.getElementById(id).textContent += seconds + '초'; 
    } 
    timer = setInterval(showRemaining, 1000); //setInterval 1초(1000)단위로 함수 반복실행
} 
var dateObj = new Date(); 
dateObj.setDate(dateObj.getDate() + 1);

countDownTimer('remainingtime', '12/15/2021 00:00 AM'); // 시간을 표시하려면 01:00 AM과 같은 형식을 사용

