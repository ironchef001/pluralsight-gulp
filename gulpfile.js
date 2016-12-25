var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')();

gulp.task('vet', function () {
    console.log('vet gulp task.');
    log('Analyzing source with JSHint and JSCS');
    
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish',{verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function(){
    console.log('run styles...');
    log('Compling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(){
    var files = config.temp + '**/*.css';
    //del(files);
    return clean(files);    
});

/////////////////////////////
function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    //#following is del v1.1 implementation to use call back
    //del(path, done);
    //#del v2.0 api changed to use promise
    //ref: http://stackoverflow.com/questions/32770896/nodes-del-command-callback-not-firing
    return del(path);    
}

function log(msg){
    if(typeof(msg)=== 'object'){
        for (var item in msg){
            if (msg.hasOwnProperty(item)){
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else{
        $.util.log($.util.colors.yellow(msg));
    }
}