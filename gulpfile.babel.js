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
    dest_dev: 'src',
    dest_prod: 'dist',
    src: 'src',
};

const jsFilename = 'completeapp.js'
const jsPaths = {
    dest_dev: `${dirs.dest_dev}/js/`,
    dest_prod: `${dirs.dest_prod}/js/`,
    src: `${dirs.src}/js/**.js`,
};
const sassPaths = {
    dest_dev: `${dirs.dest_dev}/css/`,
    dest_prod: `${dirs.dest_prod}/css/`,
    src: `${dirs.src}/sass/**/*.scss`,
};

gulp.task(
    'clean:dev', () => del(
        [
            `${sassPaths.dest_dev}/*`,
            `${jsPaths.dest_dev}/${jsFilename}`,
            `${jsPaths.dest_dev}/${jsFilename}.map`,
        ]));


gulp.task(
    'clean:prod', () => del(
        [
            `${dirs.dest_prod}/*`,
        ]));

gulp.task(
    'sass:dev', () => gulp.src(sassPaths.src)
                          .pipe(plumber())
                          .pipe(sourcemaps.init())
                          .pipe(
                              sass.sync({outputStyle: 'nested'})
                                  .on('error', sass.logError))
                          .pipe(
                              autoprefixer(
                                  {
                                      browsers: ['> 1%',
                                          'last 2 versions',
                                          'Firefox ESR'],
                                  }))
                          .pipe(sourcemaps.write('.'))
                          .pipe(gulp.dest(sassPaths.dest_dev)));

gulp.task(
    'sass:prod', () => gulp.src(sassPaths.src)
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
                           .pipe(gulp.dest(sassPaths.dest_prod)));

gulp.task(
    'scripts:dev', () => gulp.src(jsPaths.src)
                   .pipe(plumber())
                   .pipe(sourcemaps.init())
                   .pipe(
                       babel(
                           {
                               comments: true,
                               compact: false,
                               minified: false,
                               presets: ['es2015'],
                           }))
                   .pipe(concat(`${jsFilename}`))
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest(jsPaths.dest_dev)));


gulp.task(
    'scripts:prod', () => {
        console.log(`# saving min scripts : ${jsPaths.dest_prod} directory`);

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
                   .pipe(concat(`${jsFilename}`))
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest(jsPaths.dest_prod));
    });

gulp.task(
    'watch', () => {
        gulp.watch(jsPaths.src, ['scripts:dev']);
        gulp.watch(sassPaths.src, ['sass:dev']);
    });

gulp.task(
    'default', ['clean', 'scripts', 'sass'], () => {
        console.log('# running default');
    });