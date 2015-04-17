/* global Chartist */

'use strict';

let button = document.querySelector('button');
button.addEventListener('click', function () {
	this.innerHTML = '&#x1F620; Thanks for your feedback &#x1F620;';

	let lastDate = localStorage.getItem('last-dick');
	if (lastDate < Date.now() - 9e5) {
		localStorage.setItem('last-dick', Date.now());

		fetch('/api', { method: 'post' });
	}
});

fetch('/api')
	.then(res => res.json())
	.then(function (data) {
		let labels = [];
		let series = [];

		for (let day in data) {
			if (data.hasOwnProperty(day)) {
				labels.push(day);
				series.push(data[day]);
			}
		}

		new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [ series ]
		}, {
			low: 0,
			height: 400,
			fullWidth: true,
			chartPadding: {
				right: 40
			}
		});
	});
