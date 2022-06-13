// ==UserScript==
// @name         Check time num
// @namespace    https://greasyfork.org/ru/users/901750-gooseob
// @version      1.0
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
	const lastHour = hours[hours.length];

	const NOT_FOUND = 'Time not found (Час ня знойдзены)';

	const getMinutes = isWeekend => table.getCeilsContent(
		`.timetable-ceil-day-minutes.week${isWeekend ? 'end' : 'day'}s`
	).map(item => item.split(' ').map(Number));

	const getTimeArr = (hours, minutes) => {
		const timeList = hours.reduce((acc, hour, i) => {
			acc[hour] = minutes[i];
			return acc;
		}, {});
		const timeArr = [];
		for (const hour in timeList) timeList[hour].forEach(minutes => {
			timeArr[timeArr.length] = hour + ':' + minutes;
		});
		return timeArr;
	};

	const times = {
		weekdays: getTimeArr(hours, getMinutes(false)),
		weekends: getTimeArr(hours, getMinutes(true)),
		get: ({isWeekend}) => isWeekend ? times.weekends : times.weekdays
	};

	Object.assign(window, {
		getTimeNum: (time, isWeekend = false) => {
			let [h, m] = time.split(':').map(Number);
			if (
				h > lastHour ||
				m > 60
			) return NOT_FOUND;
			const num = times.get({isWeekend}).indexOf(h + ':' + m) + 1;
			return num || NOT_FOUND;
		},
		getNumTime: (num, isWeekend = false) => times.get({isWeekend})[num - 1] || NOT_FOUND,
		getTime: arg => {
			const type = typeof arg;
			return type === 'string'
				? getTimeNum(arg)
				: type === 'number'
					? getNumTime(arg)
					: NOT_FOUND;
		}
	});
})();