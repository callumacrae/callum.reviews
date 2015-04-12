'use strict';

const express = require('express');
const app = express();
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

app.use(express.static('app'));

let collection;

let mongoConnect = Promise.promisify(MongoClient.connect);
let mongoPromise = mongoConnect('mongodb://localhost:27017/reviews')
	.then(function (db) {
		collection = db.collection('reviews');
	});

function findPromise(find) {
	let findFn = collection.find(find);
	return Promise.promisify(findFn.toArray.bind(findFn)).call();
}

app.get('/api', function (req, res) {
	findPromise()
		.then(function (days) {
			let obj = {};

			for (let day of days) {
				obj[day.date] = day.dicks;
			}

			res.send(obj);
		});
});

app.post('/api', function (req) {
	console.log('%s says you are a dick', req.ip);

	let date = moment().format('Do MMMM');

	findPromise({ date: date })
		.then(function (days) {
			if (days.length) {
				collection.update({ date: date }, {
					$inc: { dicks: 1 }
				});
			} else {
				collection.insert({
					date: date,
					dicks: 1
				});
			}
		});
});

let serverPromise = Promise.promisify(app.listen.bind(app))(4000)

Promise.join(mongoPromise, serverPromise)
	.then(function () {
		console.log('Server started');
	})
	.catch(function () {
		console.log('Failed to start :(');
		process.exit(1);
	});
