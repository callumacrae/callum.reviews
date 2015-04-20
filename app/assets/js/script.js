/* global Chartist */

'use strict';

const angryEmoji = '&#x1F620;';

let button = document.querySelector('button');
button.addEventListener('click', function () {
	this.innerHTML = `${angryEmoji} Thanks for your feedback ${angryEmoji}`;

	let lastDate = localStorage.getItem('last-dick');
	if (lastDate < Date.now() - 9e5) {
		localStorage.setItem('last-dick', Date.now());

		fetch('/api', { method: 'post' })
			.then(res => res.json())
			.then(drawGraph);
	}
});

fetch('/api')
	.then(res => res.json())
	.then(drawGraph);

function drawGraph(data) {
	let labels = data.map((day) => day.date);
	let series = data.map((day) => day.dicks);

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
}
