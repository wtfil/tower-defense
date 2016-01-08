var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var watchify = require('watchify');
var ghPages = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var server = require('http-server');

var files = {
    js: {
        src: './public/src/index.js',
        dest: './public/build/index.js',
        name: 'index.js',
        destFolder: './public/build'
    }
};

gulp.task('js', function () {
    return browserify(files.js.src)
        .transform('babelify')
        .bundle()
        .pipe(source(files.js.name))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(files.js.destFolder));
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

gulp.task('server', function (cb) {
	var port = process.env.NODE_PORT || 3000;
	server.createServer().listen(port, cb);
	gutil.log('Server started at ' + gutil.colors.green('http://127.0.0.1:' + port));
});

gulp.task('deploy', ['js'], function () {
	return gulp.src('./public/**/*').pipe(ghPages());
});

gulp.task('dev', ['server', 'js-watch']);
