const express = require("express");
let app = express();
const multer = require("multer");
const upload = multer();

app.use(express.static('HTML'));

app.set('view engine', 'pug'); 
app.set("views", './HTML');

const port = 3000;
const host = '127.0.0.1';

app.get('/1', (req, res)=> {
    res.render('page1')
});

app.get('/2', (req, res)=> {
    res.render('page2')
});

app.get('/3', (req, res)=> {
    res.render('page3')
});

app.get('/4', (req, res)=> {
    res.render('page4')
});

app.get('/5', (req, res)=> {
    res.render('page5')
});

app.listen(port, host, () => {
    console.log(`application running at http://${host}:${port}/`)
});
