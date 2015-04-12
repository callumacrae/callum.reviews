/* global Chartist */

'use strict';

let button = document.querySelector('button');
button.addEventListener('click', function () {
	this.innerHTML = '&#x1F620; Thanks for your feedback &#x1F620;';

	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/api');
	xhr.send();
});

let xhr = new XMLHttpRequest();
xhr.open('GET', '/api');
xhr.responseType = 'json';

xhr.onload = function () {
	let labels = [];
	let series = [];

	for (let day in xhr.response) {
		if (xhr.response.hasOwnProperty(day)) {
			labels.push(day);
			series.push(xhr.response[day]);
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
};

xhr.send();
