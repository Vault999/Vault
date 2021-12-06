const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path')

//Init app
const app = express();

// ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

//public folder
app.use(express.static('./views'))

const port = 3000;

app.listen(port, () =>{
    console.log('Server is running at : http://127.0.0.1:3000')
})

app.get('/', ()=>{
    res.render('main_page');
})