const express = require('express');
const path = require('path');
const { getConnection } = require('./dbcon');
const mysql = require('./dbcon')
const fs = require('fs')
const ejs = require('ejs')
const bodyParser = require('body-parser')

const app = express();

const host = '127.0.0.1';
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.urlencoded({
//   extended: false
// }))

app.get('/', (req, res)=>{
    res.render('main_page')
})


app.get('/board', function (req, res) {
  fs.readFile('./views/list.ejs', 'utf8', function (err, data) {
    client.query('select * from MusicList', function (err, results) {
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

app.get('/test', (req, res)=>{
  const sql = "SELECT * FROM musiclist"
      mysql.getConnection((err,connection)=>{   // getConnction 
         if(err) throw err;
         connection.query(sql, (err, result, fields)=>{
             if(err) throw err;
             console.log(result);
         });
          connection.release();  // 반환한다. 서버만 켜져있고, data는 썼으면 반환하는 개념
      });
})


// app.get('/', (req, res)=>{
//     const sql = "SELECT * FROM musiclist"
//         mysql.getConnection((err,connection)=>{   // getConnction 
//            if(err) throw err;
//            connection.query(sql, (err, result, fields)=>{
//                if(err) throw err;
//                console.log(result);
//            });
//             connection.release();  // 반환한다. 서버만 켜져있고, data는 썼으면 반환하는 개념
//         });
// })


app.listen(port, host, () =>{
    console.log(`Apllication running at http://${host}:${port}/`);
})