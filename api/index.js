'use strict';

const express = require('express');
const app = express();
const moment = require('moment');

const MongoClient = require('mongodb').MongoClient;

app.use(express.static('app'));

let url = 'mongodb://localhost:27017/reviews';
MongoClient.connect(url, function (err, db) {
	if (err) {
		throw err;
	}

	let collection = db.collection('reviews');

	app.get('/api', function (req, res) {
		collection.find().toArray(function (err, days) {
			if (err) {
				throw err;
			}

			let obj = {};

			for (let day of days) {
				obj[day.date] = day.dicks;
			}

			res.send(obj);
		});
	});

	app.post('/api', function (req) {
		console.log('%s says you are a dick', req.ip);

		var date = moment().format('Do MMMM');

		collection.find({ date: date }).toArray(function (err, days) {
			if (err) {
				throw err;
			}

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

	let server = app.listen(4000, function () {
		let host = server.address().address;
		let port = server.address().port;

		console.log('Example app listening at http://%s:%s', host, port);
	});
});
