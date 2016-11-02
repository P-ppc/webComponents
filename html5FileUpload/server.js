var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer({dest: 'upload_tmp/'});

app.use(express.static('.'));


app.post('/', upload.single('formFile'), function (req, res) {
    console.log(req.file);
    res.send('success');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
