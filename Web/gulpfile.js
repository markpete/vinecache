var gulp = require('gulp'),
    tsc = require('gulp-tsc'),
    seq = require('run-sequence'),
    //mainBowerFiles = require('main-bower-files'),
    del = require('del');

var paths = {
    ts: {
        src: [
            'scripts/ts/*.ts'
        ],
        dest: 'public/javascripts'
    }
};

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('zip', function () {
    var appFiles = ['views/**/*','public/**/*','routes/**/*', 'bin/**/*', 'main.js', 'package.json'];
    return gulp.src(appFiles, {base: "."})
        .pipe(plugins.zip('vineCache.zip'))
        .pipe(gulp.dest('deployment'));
});

// Default
gulp.task('default', ['build']);

// Clean
gulp.task('clean', function (cb) {
    del([paths.ts.dest + '/*.js', paths.ts.dest + '/*.js.map'], cb);
});

// Build
gulp.task('build', ['buildTS']);

gulp.task('buildTS', function () {
    return gulp
        .src(paths.ts.src)
        .pipe(tsc({
            module: "CommonJS",
            sourcemap: true,
            emitError: false,
            target: "ES5"
        }))
        .pipe(gulp.dest(paths.ts.dest));
});

// Deploy - Rebuild and Zip
gulp.task('deploy', function (cb) {
    seq('rebuild', 'zip', cb);
});

// Rebuild - Clean & Build
gulp.task('rebuild', function (cb) {
    seq('clean', 'build', cb);
});

// Watch
gulp.task('watch', function () {
    gulp.watch(paths.ts.src, ['build']);
});