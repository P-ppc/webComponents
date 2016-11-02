var fs = require("fs");
var path = require("path");
var express = require('express');
var app = express();
var session = require("express-session");
var multer = require('multer');
var upload = multer({dest: 'upload_tmp/'});

app.use(express.static('.'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

var createRandomStr = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
}

var mergeFile = function (pathList, baseName, baseMimeType) {
    // 合并
    console.log(`文件合并中, 共${pathList.length}个文件`);
    for (let i = 0; i < pathList.length; i++) {
        console.log(`file index: ${i}, file path: ${pathList[i]}`); 
        var data = fs.readFileSync(pathList[i]);
        fs.writeFileSync(`upload_tmp/${baseName}`, data, {flag: 'a'});
        fs.unlinkSync(pathList[i]);
    }
};

app.post('/', upload.single('formFile'), function (req, res) {
    var fileSession = req.session.files;
    var fileFlag = req.body.fileFlag || createRandomStr();
    if (!fileSession) {
        fileSession = req.session.files = {};
    }
    if (!fileSession[fileFlag]) {
        var thisFile = fileSession[fileFlag] = {};
        thisFile.baseName = req.body.baseName;
        thisFile.baseMimeType = req.body.baseMimeType;
        thisFile.pathList = [];
    }
    fileSession[fileFlag].pathList.push(req.file.path);
    let respData = { 
        code: 0,
        fileFlag: fileFlag
    };
    res.send(respData);
    if (req.body.finish != undefined) {
        mergeFile(fileSession[fileFlag].pathList, fileSession[fileFlag].baseName, fileSession[fileFlag].baseMimeType);
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
