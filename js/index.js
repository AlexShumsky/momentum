'use strict'
window.addEventListener('load', appInit)
let currentSlide;
function appInit() {

	setInterval(timeManager, 500);
	getRandomNum(1, 20)
	localManager()
	changeBackground()
	backgroundSlider()

}

function localManager() {
	const userName = document.querySelector('.user__name');
	getLocalName();

	function getLocalName() {
		if (localStorage.getItem('userName')) userName.value = localStorage.getItem('userName');
	}

	userName.addEventListener('change', saveUserName);
	function saveUserName() {
		localStorage.setItem('userName', this.value);
	}
}

function timeManager() {
	const date = new Date();
	sayHello(date.getHours())
	showCurrentTime(date.getHours(), date.getMinutes(), date.getSeconds())
	showDayTime(date.getHours())
	showDate(date.getDate(), date.getDay(), date.getMonth())

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
		let dayPeriod = (time < 6 || time == 24) ? 'night' :
			(time < 12) ? 'morning' : (time < 18) ? 'afternoon' : 'evening';
		document.querySelector('.hello__text').textContent = `Good, ${dayPeriod}`;
	}
	function checkHours(h) {
		return (h > 12) ? h % 12 : h;
	}
}
function changeBackground() {
	const bgDate = new Date();
	let dayPeriodBg = (bgDate.getHours() < 6 || bgDate.getHours() == 24) ? 'night' :
		(bgDate.getHours() < 12) ? 'morning' : (bgDate.getHours() < 18) ? 'afternoon' : 'evening';
	document.querySelector('.wrapper').style.background =
		`url(https://raw.githubusercontent.com/AlexShumsky/stage1-tasks/assets/images/${dayPeriodBg}/${addZero(currentSlide)}.jpg) center / cover no-repeat`;
}
function backgroundSlider() {
	const arrows = document.querySelectorAll('.button-slider');
	arrows.forEach(arrow => arrow.addEventListener('click', changeCurrentSlide))
	function changeCurrentSlide() {
		this.classList.contains('button-slider-r') ? nextSlide() : prevSlide();
		function prevSlide() {
			+currentSlide--;
			if (+currentSlide < 1) currentSlide = 20;
			changeBackground()
		}
		function nextSlide() {
			+currentSlide++;
			if (+currentSlide > 20) currentSlide = 1;
			changeBackground()
		}
	}
}

function getRandomNum(minU, maxU) {
	let max = Math.floor(maxU);
	let min = Math.ceil(minU);
	currentSlide = addZero(Math.floor(Math.random() * (max - min + 1) + min));
}
function addZero(num) {
	return (num > 0 && num < 10) ? '0' + num : num;
}
