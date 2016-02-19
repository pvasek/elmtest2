var gulp = require("gulp");
var fs = require("fs");
var del = require("del");
var ts = require('gulp-typescript');
var shell = require('gulp-shell')

gulp.task('clean', function () {
    return del([
        './dist/ts/**/*'
    ]);
});

gulp.task('ts', ['clean'], function() {
    console.log('loading tsconfig project...')
    var tsProject = ts.createProject('tsconfig.json');
    console.log('tsconfig loaded')
  
    return tsProject
        .src()
        .pipe(ts(tsProject))
        .pipe(gulp.dest('./dist/ts'));
});

gulp.task('test:watch', ['test'], function() {
    gulp.watch(['**/*.ts'], ['test']);
});


gulp.task('test', ['ts'], shell.task([
  'tape ./dist/ts/**/__tests__/* | faucet',
]));
