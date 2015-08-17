'use strict';

var gulp = require('gulp'),
    run = require('gulp-run'),

    del = require('del'),
    scrollrack = require('scroll-rack');


// Config
var path = {
    files: 'docs/',
    dest: 'build',
    assets: 'assets'
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
        assets: path.assets,
        nav: {
            order: ['typescript', 'angular', 'coding']
        },
        callback: done
    });
});


/**
 * Generate Github Pages
 */
gulp.task('release', function ( done ) {
    run('git subtree push --prefix ' + path.dest + ' origin gh-pages')
        .exec(done);
});