var gulp = require('gulp');
var loadTask = require('lmn-gulp-tasks');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');

gulp.task('scss', loadTask('scss', {
	src: './app/assets/sass/styles.scss',
	dest: './app/assets/build',
	minify: false
}));

gulp.task('js', function () {
	gulp.src('./app/assets/js/script.js')
		.pipe(babel())
		.pipe(gulp.dest('./app/assets/build'));
});

gulp.task('build', ['scss', 'js']);

gulp.task('default', ['build'], function () {
	var files = [
		'./app/index.html',
		'./app/assets/build/*.js',
		'./app/assets/build/*.css'
	];

	browserSync.init(files, {
		proxy: 'http://localhost:4000/'
	});

	gulp.watch('./app/assets/sass/*.{sass,scss}', ['scss']);
	gulp.watch('./app/assets/js/*.js', ['js']);
});
