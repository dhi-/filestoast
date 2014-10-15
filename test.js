/**
 * Created by ganaraj on 15/10/14.
 */
var filestoast = require('./index');


var dir = '**/*.js';


function onProcessingComplete(files){
    console.log(files);
}


filestoast
    .process(dir)
    .then(onProcessingComplete);