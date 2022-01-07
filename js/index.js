'use strict'


//window.addEventListener('load', timeManager);
setInterval(timeManager, 500);
function timeManager() {
	const date = new Date();
	showCurrentTime(date.getHours(), date.getMinutes(), date.getSeconds())
	showDayTime(date.getHours())
}

function showCurrentTime(h, m, s) {
	const hour = document.querySelector('.time-h');
	const minute = document.querySelector('.time-m');
	const seconds = document.querySelector('.time-s');
	hour.textContent = addZero(checkHours(h));
	minute.textContent = addZero(m);
	seconds.textContent = addZero(s);
}

function addZero(num) {
	return (num >= 0 && num < 10) ? '0' + num : num;
}
function checkHours(h) {
	return (h > 12) ? h % 12 : h;
}
function showDayTime(h) {
	let daytime = document.querySelector('.time-daytime');
	daytime.textContent = (h > 12) ? 'PM' : 'AM';
}