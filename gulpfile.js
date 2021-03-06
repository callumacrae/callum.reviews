'use strict';

const gulp = require('gulp');
const myth = require('gulp-myth');
const babel = require('gulp-babel');

gulp.task('css', function () {
	gulp.src('./app/assets/css/styles.css')
		.pipe(myth())
		.pipe(gulp.dest('./app/assets/build'));
});

gulp.task('js', function () {
	gulp.src('./app/assets/js/script.js')
		.pipe(babel())
		.pipe(gulp.dest('./app/assets/build'));
});

// This task is for development only
gulp.task('run', function (done) {
	// devDependencies required in tasks
	const nodemon = require('nodemon');
	const chalk = require('chalk');

	function doneOnce() {
		done();
		doneOnce = function () {};
	}

	nodemon('--watch api ./api --port 3025')
		.on('start', function () {
			console.log(chalk.grey('App has started'));
			doneOnce();
		})
		.on('restart', function () {
			console.log(chalk.grey('App restarting'));
		})
		.on('crash', function () {
			console.log(chalk.grey('App has crashed'));
		});
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['build', 'run'], function () {
	const browserSync = require('browser-sync');

	let files = [
		'./app/index.html',
		'./app/assets/build/*.js',
		'./app/assets/build/*.css'
	];

	browserSync.init(files, {
		proxy: 'http://localhost:3025/'
	});

	gulp.watch('./app/assets/css/*.css', ['css']);
	gulp.watch('./app/assets/js/*.js', ['js']);
});
