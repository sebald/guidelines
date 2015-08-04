'use strict';

var gulp = require('gulp'),
    pages = require('gulp-gh-pages'),

    del = require('del'),
    scrollrack = require('scroll-rack');


// Config
var path = {
    files: 'docs/',
    dest: 'build'
}


/**
 * Clean up project.
 */
gulp.task('clean', function ( done ) {
    del([
        path.dest
    ], done);
});


/**
 * Generate documentation with ScrollRack.
 * Call with `--serve` to start local server.
 */
gulp.task('build', function ( done ) {
    scrollrack({
        files: path.files,
        dest: path.dest,
        nav: {
            order: ['typescript', 'angular', 'coding']
        },
        callback: done
    });
});


/**
 * Generate Github Pages
 */
gulp.task('release', ['build'], function () {
    gulp.src(path.dest + '/**/*')
        .pipe(pages());
});