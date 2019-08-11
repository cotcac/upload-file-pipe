var express = require('express');
var inspect = require('util').inspect;
var app = express();
var Busboy = require('busboy');

const path = require('path'),
      os = require('os'),
      fs = require('fs');

app.use(express.static('public'));//add this line so you can access static file

// home with form upload
app.get('/', function (req, res) {
   res.sendFile(__dirname+'/public/upload.html');
});
// post upload
app.post('/upload', function(req, res, next){
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    var saveTo = path.join(__dirname +"/public/upload",path.basename(filename));
    // /hdd/node/movies/upload/public/upload/lat-mat.jpg
    console.log("[save to]", saveTo);
    
      file.pipe(fs.createWriteStream(saveTo));
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  });
  busboy.on('finish', function() {
    console.log('Done parsing form!');
    res.writeHead(200, { 'Connection': 'close' });
    res.end("That's all folks!");
  });
  req.pipe(busboy);

})
//end goodbye

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});