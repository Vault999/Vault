// 회원가입 폼 
const signup = (req,res) =>{
    res.render('signup')
}

// 회원가입 처리 함수
const singupinfo = (req,res) => {
    console.log("Get signup information success!")
    con.connect(function(err) {

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
            
    });
}

// 로그인 폼

// 로그인 처리 함수

module.exports = {
    signup,
    singupinfo
}