var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var watchify = require('watchify');

var files = {
    js: {
        src: './public/src/index.js',
        dest: './public/build/index.js'
    }
};

gulp.task('js', function () {
    return browserify(files.js.src)
        .transform('babelify')
        .bundle()
        .pipe(fs.createWriteStream(files.js.dest))
});

gulp.task('js-watch', function () {
    var bundler = watchify(browserify(files.js.src, {debug: true}));

    bundler.transform('babelify');
    bundler.on('update', rebundle);

    function onError(e) {
        gutil.log(gutil.colors.red(e.message));
    }

    function rebundle() {
        var start = Date.now();

        return bundler.bundle()
          .on('error', onError)
          .on('end', function () {
              var time = Date.now() - start;
              gutil.log('Building \'' + gutil.colors.green(files.js.src) + '\' in ' + gutil.colors.magenta(time + ' ms'));
          })
          .pipe(fs.createWriteStream(files.js.dest));
    }
    rebundle();
});

gulp.task('deploy', ['js'], function () {
	return gulp.src('./public/**/*').pipe(ghPages());
});

gulp.task('dev', ['js-watch']);
