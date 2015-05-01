var fs = require('fs');
var AWS = require('aws-sdk');
var accessKeyId =  process.env.AWS_ACCESS_KEY || "AKIAIU22SRC6UGYLX3VQ";
var secretAccessKey = process.env.AWS_SECRET_KEY || "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";

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

exports.upload = function(doc, cb) {
    
    var bucket = process.env.AWS_S3_IMG_BUCKET || 'tipslydev';
    var folder = 'avatar';

    var uploader = function(params){
        s3.putObject(params, function (err, res) {
            if (err) {
                // sails.log.error("Error uploading data: ", err);
                cb(err);
            } else {
                // sails.log.debug("Successfully uploaded data to " + bucket + "/" + doc.name);
                cb(null, res);
            }
        });
    };

    if(doc.path){
        fs.readFile(doc.path, function(err, file_buffer){
            var params = {
                Bucket: bucket,
                Key: doc.folder ? doc.folder + '/'+ doc.name : folder + '/'+ doc.name,
                Body: file_buffer,
                ACL: 'public-read',
                ContentType: 'image/png'
            };
            uploader(params);
        });
    }else{
        var params = {
                Bucket: bucket,
                Key: doc.folder ? doc.folder + '/'+ doc.name : folder + '/'+ doc.name,
                Body: doc.data,
                ACL: 'public-read',
                ContentType: 'image/png'
        };
        uploader(params);

    }
},

exports.delete = function(oldImg, cb){
    var bucket = process.env.AWS_S3_IMG_BUCKET || 'tipslydev';
    var params = {
        Bucket: bucket,
        Key: 'avatar/'+oldImg
    }
    console.log('Params is:', params);
    s3.deleteObject(params, function(err, data){
        if(err)
            sails.log.error('After s3 deleteObject err',err);
        else
            sails.log.debug('After s3 deleteObject data',data);
    });
}
