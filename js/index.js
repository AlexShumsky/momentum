'use strict'
window.addEventListener('load', appInit)

function appInit() {
	setInterval(timeManager, 500);
	localManager()
}
function localManager() {
	const userName = document.querySelector('.user__name');
	getLocalName();

	function getLocalName() {
		if (localStorage.getItem('userName')) userName.value = localStorage.getItem('userName');
	}

	userName.addEventListener('change', saveUserName);
	function saveUserName(el) {
		localStorage.setItem('userName', this.value);
	}

}

function timeManager() {
	const date = new Date();
	showCurrentTime(date.getHours(), date.getMinutes(), date.getSeconds())
	showDayTime(date.getHours())
	showDate(date.getDate(), date.getDay(), date.getMonth())
	sayHello(date.getHours())

	function showCurrentTime(h, m, s) {
		const hour = document.querySelector('.time-h');
		const minute = document.querySelector('.time-m');
		const seconds = document.querySelector('.time-s');
		hour.textContent = addZero(checkHours(h));
		minute.textContent = addZero(m);
		seconds.textContent = addZero(s);
	}
	function showDate(date, day, month) {
		const dayObj = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday',
		}
		const monthObj = {
			0: 'January',
			1: 'February',
			2: 'March',
			3: 'April',
			4: 'May',
			5: 'June',
			6: 'July',
			7: 'August',
			8: 'September',
			9: 'October',
			10: 'November',
			11: 'December',
		}
		document.querySelector('.date-day').textContent = `${dayObj[day]}, `;
		document.querySelector('.date-month').textContent = monthObj[month];
		document.querySelector('.date-num').textContent = date;
	}
	function showDayTime(h) {
		let daytime = document.querySelector('.time-daytime');
		daytime.textContent = (h > 12) ? 'PM' : 'AM';
	}
	function sayHello(time) {
		document.querySelector('.hello__text').textContent = `Good, ${(time < 6 || time == 24) ? 'night' :
			(time < 12) ? 'morning' : (time < 18) ? 'afternoon' : 'evening'}`;
	}

	function addZero(num) {
		return (num >= 0 && num < 10) ? '0' + num : num;
	}
	function checkHours(h) {
		return (h > 12) ? h % 12 : h;
	}
}