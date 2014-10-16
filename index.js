var fs = require('vinyl-fs');
var map = require('map-stream');
var parse = require('acorn/acorn_loose').parse_dammit;
var q = require('q');

var files = [];
var acorn_options = {
    ecmaVersion: 6,
    allowReturnOutsideFunction: true,
    locations: true
};

function withEachFile(file,next){
    storeFile(file);
    next(null,file);
}


function storeFile(file){
    if(file._contents){
        var contentString = file._contents.toString();
        try{
            files.push({
                path: file.path,
                content: contentString,
                ast: parse(contentString, acorn_options)
            });
        }
        catch(c){
            //console.warn(file.path);
        };
    }
}



module.exports.process = function(glob){
    var defer = q.defer();
    var r = fs.src(glob);
    r.pipe(map(withEachFile));
    function onAllRead(){
        defer.resolve(files);
    }
    r.on('end',onAllRead);
    return defer.promise;
};