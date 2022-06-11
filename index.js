// ==UserScript==
// @name         Check time num
// @namespace    https://greasyfork.org/ru/users/901750-gooseob
// @version      0.1
// @description  Check the transport time num in the timetable
// @author       GooseOb
// @match        https://*.btrans.by/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btrans.by
// @grant        none
// ==/UserScript==

(function() {
	const table = Object.assign(document.querySelector('.timetable'), {
		getCeilsContent: selector => Array.from(table.querySelectorAll(selector))
			.slice(1)
			.map(el => el.textContent)
	});

	const hours = table.getCeilsContent('.timetable-ceil-hour').map(Number);
	hours.last = hours[hours.length];

	const NOT_FOUND = 'Time not found (Час ня знойдзены)';

	window.getTimeNum = (time, isWeekend = false) => {
		let [h, m] = time.split(':').map(Number);
		const hoursNum = hours.indexOf(h);
		if (
			hoursNum === -1 ||
			h > hours.last ||
			m > 60
		) return NOT_FOUND;
		const minutes = table.getCeilsContent(
			`.timetable-ceil-day-minutes.week${isWeekend ? 'ends' : 'days'}`
		).map(item => item.split(' ').map(Number));
		let num = 0;
		let i = 0;
		while (true) {
			if (hoursNum === i) {
				const currMinutes = minutes[i];
				for (let j = 0; j < currMinutes.length; j++) {
					num++;
					if (currMinutes[j] === m) return num;
				};
				return NOT_FOUND;
			} else num += minutes[i].length;
			i++;
		};
	};
})();