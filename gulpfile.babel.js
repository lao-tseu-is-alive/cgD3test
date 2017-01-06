/**
 * Created by cgil on 1/5/17.
 * gulpfile using ES6
 */
/* eslint-disable no-console */
'use strict';

import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import del from 'del';
import gulp from 'gulp';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const dirs = {
    dest_dev: 'src',
    dest_prod: 'dist',
    src: 'src',
};

const jsEntryPoint = 'init.js';
const jsBundleFilename = 'app.js';
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

const babelOptionsDev = {
    comments: true,
    compact: false,
    minified: false,
    plugins: ['transform-es2015-modules-commonjs'],
    presets: ['es2015'],
};

const babelOptionsProd = {
    comments: false,
    compact: true,
    minified: true,
    plugins: ['transform-es2015-modules-commonjs'],
    presets: ['es2015'],
};


function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
}

gulp.task(
    'clean:dev', () => del(
        [
            `${sassPaths.dest_dev}/*`,
            `${jsPaths.dest_dev}/${jsBundleFilename}`,
            `${jsPaths.dest_dev}/${jsBundleFilename}.map`,
            `${jsPaths.dest_dev}/temp`,
        ]));


gulp.task(
    'clean:prod', () => del(
        [
            `${dirs.dest_prod}/js/*`,
            `${dirs.dest_prod}/css/*`,
        ]));

gulp.task(
    'sass:dev', () => gulp.src(sassPaths.src)
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

// Transpile all ES6 javascript file and put results in bundle
gulp.task(
    'scripts:dev', ['clean:dev'], () => {
        const bundler = browserify(`${jsPaths.dest_dev}/${jsEntryPoint}`);

        bundler.transform(babelify.configure(babelOptionsDev))
               .on('error', (err) => console.error(err));
        bundler.bundle()
               .on('error', (err) => console.error(err))
               .pipe(source(`${jsBundleFilename}`))
               .pipe(buffer())
               .pipe(sourcemaps.init({loadMaps: true}))
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest(`${jsPaths.dest_dev}`));
    }
);

gulp.task(
    'scripts:prod', ['clean:prod'], () => {
        const bundler = browserify(`${jsPaths.dest_dev}/${jsEntryPoint}`);

        bundler.transform(babelify.configure(babelOptionsProd));
        bundler.bundle()
               .on('error', (err) => console.error(err))
               .pipe(source(`${jsBundleFilename}`))
               .pipe(buffer())
               .pipe(sourcemaps.init({loadMaps: true}))
               .pipe(uglify())
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest(`${jsPaths.dest_prod}`));
    });


// Allow to see all babel transpiling files in temp directory
gulp.task(
    'babel-compile-commonjs', ['clean:dev'], () =>
        gulp.src(jsPaths.src)
            .pipe(babel(babelOptionsDev))
            .pipe(gulp.dest(`${jsPaths.dest_dev}/temp`))
);


gulp.task(
    'watch', () => {
        gulp.watch(jsPaths.src, ['scripts:dev']);
        gulp.watch(sassPaths.src, ['sass:dev']);
    });

gulp.task(
    'default', ['clean:prod', 'scripts:prod', 'sass:prod'], () => {
        console.log(`# preparing your bundle  in ${dirs.dest_prod} folder`);
    });