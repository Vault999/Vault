// var css = require("./lib/css.css")

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8"> 
      <title>WEB1 - ${title}</title>
      <link rel="stylesheet" type="text/css" href="./css.css">
    </head> 
    <body>
      <h1><a href="/" id="main"> Test template!</a></h1>
      <div>
      ${list}
      </div>
      ${control}
      ${body}
    </body>
    </html>
    `;
  }
  
}