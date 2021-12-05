const express = require('express')
const fs = require('fs')
const ejs = require('ejs')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const client = mysql.createConnection({
  user: 'root',
  password: 'thdrn48', //본인의 db root 계정 비밀번호
  database: 'musiclist' //본인의 db
})

const app = express()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
  extended: false
}))

app.listen(52273, function () {
  console.log('Server is running at : http://127.0.0.1:52273')
})

app.get('/', (req, res)=>{
  res.render('main')
})

app.get('/board/write', (req, res)=>{
  res.render('write')
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


app.get('/board/delete/:id', function (req, res) {
    client.query('delete from MusicList where id=?', [req.params.id], function () {
      res.redirect('/board')
    })
  })

  

app.get('/board/insert', function (req, res) {
    fs.readFile('./views/insert.html', 'utf8', function (err, data) {
        res.send(data)
        })
    })

app.post('/board/insert', function (req, res) {
    const body = req.body
    
    client.query('insert into MusicList (name, artist, genre) values (?, ?, ?);', [
        body.name,
        body.artist,
        body.genre
    ], function() {
        res.redirect('/board')
    })
    })
      
app.get('/board/edit/:id', function (req, res) {
    fs.readFile('./views/edit.ejs', 'utf8', function (err, data) {
        client.query('select * from MusicList where id = ?', [req.params.id], function (err, result) {
        res.send(ejs.render(data, {
            data: result[0]
        }))
        })
    })
    })

app.post('/board/edit/:id', function (req, res) {
    const body = req.body
    
    client.query('update MusicList SET name=?, artist=?, genre=? where id=?',[
        body.name, body.artist, body.genre, req.params.id
    ], function () {
        res.redirect('/board')
    })
    })

    const multer = require("multer");
    const path = require("path");
    
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/images/");
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
      },
    });
    
    var upload = multer({ storage: storage });