const multer = require('multer')
const upload = multer({dest: './views/img'}) //dest : 저장 위치

router.post('/upload',upload.single('img'),(req,res) => {
    res.json(req.file)
    console.log(req.file)
})