'use strict';

const argv = require('minimist')(process.argv.slice(2));
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

app.get('/api', sendData);
function sendData(req, res) {
	collection.find().toArray(function (err, days) {
		if (err) {
			return res.status(500).send(err);
		}

		res.send(days);
	});
}

app.post('/api', function (req, res) {
	console.log('%s says you are a dick', req.ip);

	let date = moment().format('Do MMMM');
	collection.update({ date: date }, { $inc: { dicks: 1 }}, { upsert: true }, function () {
		sendData(req, res);
	});
});

let serverPromise = Promise.promisify(app.listen.bind(app))(argv.port || 3000);

Promise.join(mongoPromise, serverPromise)
	.then(function () {
		console.log('Server started');
	})
	.catch(function () {
		console.log('Failed to start :(');
		process.exit(1);
	});
