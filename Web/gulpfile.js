var gulp = require('gulp'),
    tsc = require('gulp-tsc'),
    seq = require('run-sequence'),
    del = require('del');

var paths = {
    ts: {
        src: [
            'scripts/ts/*.ts'
        ],
        dest: 'public/javascripts'
    }
};

// Default
gulp.task('default', ['build']);

// Clean
gulp.task('clean', function (cb) {
    del([paths.ts.dest + '/*.js', paths.ts.dest + '/*.js.map'], cb);
});

// Build
gulp.task('build', function () {
    return gulp
        .src(paths.ts.src)
        .pipe(tsc({
            module: "CommonJS",
            sourcemap: true,
            emitError: false
        }))
        .pipe(gulp.dest(paths.ts.dest));
});

// Rebuild - Clean & Build
gulp.task('rebuild', function (cb) {
    seq('clean', 'build', cb);
});

// Watch
gulp.task('watch', function () {
    gulp.watch(paths.ts.src, ['build']);
});