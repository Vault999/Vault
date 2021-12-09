// const express = require("express");
// const router = express.Router();

// function popMypage(){
  // var mypage = document.getElementById("mypage"); //선언 안해도 잘찾음 왜? 한개밖에 없어서? 꼭 선언해야하나?
  // var display = getComputedStyle(mypage).display; 
  /*getComputedStyle():인자로 전달받은 요소의 모든 CSS 속성값을 담은 객체를 회신*/

//   if (display == "none"){
//       mypage.style.display = "block";
//   }
//   else{
//       mypage.style.display = "none";
//   }
// };  

// module.exports = popMypage();

function popMypage(){
  // var mypage = document.getElementById("mypage"); //선언 안해도 잘찾음 왜? 한개밖에 없어서? 꼭 선언해야하나?
  var display = getComputedStyle(mypage).display; 
  
  /*getComputedStyle():인자로 전달받은 요소의 모든 CSS 속성값을 담은 객체를 회신*/

  if (display == "none"){
      mypage.style.display = "block";
  }
  else{
      mypage.style.display = "none";
  }
}    