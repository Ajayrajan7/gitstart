const AWS = require('aws-sdk');
var busboy = require('busboy');
var bodyParser = require('body-parser');
var express = require('express');
const BUCKET_NAME = 'domigsdfgs';
const IAM_USER_KEY = 'faesdgaergeargeg';
const IAM_USER_SECRET = 'savadfgerge';
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var app = express();
app.use(busboy()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine","ejs");

function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  s3bucket.createBucket(function () {
      var params = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: file.data
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log('error in callback');
          console.log(err);
        }
        console.log('success');
        console.log(data);
      });
  });
}

  app.get('/upload',function(req,res){
     res.render('forms/form');
  });
   app.post('/upload', function (req, res, next) {
    // This grabs the additional parameters so in this case passing in
    // "element1" with a value.
    const element1 = req.body.element1;

    var busboy = new busboy({ headers: req.headers });

    // The file upload has completed
    busboy.on('finish', function() {
      console.log('Upload finished');
      
      // Your files are stored in req.files. In this case,
      // you only have one and it's req.files.element2:
      // This returns:
      // {
      //    element2: {
      //      data: ...contents of the file...,
      //      name: 'Example.jpg',
      //      encoding: '7bit',
      //      mimetype: 'image/png',
      //      truncated: false,
      //      size: 959480
      //    }
      // }
      
      // Grabs your file object from the request.
      const file = req.files.element2;
      console.log(file);
      
      // Begins the upload to the AWS S3
      uploadToS3(file);
    });

    req.pipe(busboy);
  });
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
