/**
 * Created by cgil on 1/5/17.
 * gulpfile using ES6
 */
/* eslint-disable no-console */
'use strict';

import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';

/* NOT used for now
import uglify from 'gulp-uglify';
*/
const dirs = {
    dest: 'dist',
    src: 'src',
};
const jsPaths = {
    dest: `${dirs.dest}/js/`,
    src: `${dirs.src}/js/**.js`,
};
const sassPaths = {
    dest: `${dirs.dest}/css/`,
    src: `${dirs.src}/sass/**/*.scss`,
};

gulp.task(
    'clean', () => del(
        [
            `${dirs.dest}/*`,
        ]));


gulp.task(
    'sass', () => gulp.src(sassPaths.src)
                      .pipe(plumber())
                      .pipe(sourcemaps.init())
                      .pipe(
                          sass.sync({outputStyle: 'compressed'})
                              .on('error', sass.logError))
                      .pipe(
                          autoprefixer(
                              {
                                  browsers: ['> 1%',
                                      'last 2 versions',
                                      'Firefox ESR'],
                              }))
                      .pipe(sourcemaps.write('.'))
                      .pipe(gulp.dest(sassPaths.dest)));

gulp.task(
    'scripts', () => {
        console.log(`# saving min scripts : ${jsPaths.dest} directory`);

        return gulp.src(jsPaths.src)
                   .pipe(plumber())
                   .pipe(sourcemaps.init())
                   .pipe(
                       babel(
                           {
                               comments: false,
                               compact: true,
                               minified: true,
                               presets: ['es2015'],
                           }))
                   .pipe(concat('all.js'))
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest(jsPaths.dest));
    });

gulp.task(
    'watch', () => {
        gulp.watch(`${jsPaths.src}/**.js`, ['scripts']);
    });

gulp.task(
    'default', ['clean', 'scripts', 'sass'], () => {
        console.log('# running default');
    });