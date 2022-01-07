'use strict'
window.addEventListener('load', preloadImages)
let currentSlide;

function preloadImages() {
	let periods = ['night', 'morning', 'afternoon', 'evening'];
	let images = [];
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j < 21; j++) {
			let image = new Image();
			image.src = `https://raw.githubusercontent.com/AlexShumsky/stage1-tasks/assets/images/${periods[i]}/${addZero(j)}.jpg`;
			images.push(image);
		}
	}
	appInit()
}

function appInit() {

	setInterval(timeManager, 500);
	getRandomNum(1, 20)
	localManager()
	changeBackground()
	backgroundSlider()
	getWeather()
}

function localManager() {
	const userName = document.querySelector('.user__name');
	const userCity = document.querySelector('.user__city');
	getLocalProperties();


	function getLocalProperties() {
		if (localStorage.getItem('userName')) userName.value = localStorage.getItem('userName');
		if (localStorage.getItem('userCity')) userCity.value = localStorage.getItem('userCity');
	}

	userName.addEventListener('change', saveUserName);
	userCity.addEventListener('change', saveUserCity);
	function saveUserName() {
		localStorage.setItem('userName', this.value);
	}
	function saveUserCity() {
		localStorage.setItem('userCity', this.value);
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
	document.querySelector('body').style.background =
		`url(https://raw.githubusercontent.com/AlexShumsky/stage1-tasks/assets/images/${dayPeriodBg}/${addZero(currentSlide)}.jpg) center / cover no-repeat`;
}
function backgroundSlider() {
	const arrows = document.querySelectorAll('.button-slider');
	let timer = true;

	arrows.forEach(arrow => arrow.addEventListener('click', changeCurrentSlide))

	function changeCurrentSlide() {
		(this.classList.contains('button-slider-r')) ? nextSlide() : prevSlide();

		function prevSlide() {
			if (timer) {
				+currentSlide--;
				if (+currentSlide < 1) currentSlide = 20;
				timer = false;
				changeBackground()

				setTimeout(() => timer = true, 700)
			}
		}

		function nextSlide() {
			if (timer) {
				+currentSlide++;
				if (+currentSlide > 20) currentSlide = 1;
				timer = false;
				changeBackground()

				setTimeout(() => timer = true, 700)
			}
		}
	}
}
async function getWeather() {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&lang=en&appid=052d91374bd32073e60e2c409c2a2625&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	showWeather();
	function showWeather() {
		let weatherIcon = document.querySelector('.weather__image');
		document.querySelector('.weather__temperature').textContent =
			`${Math.round(data.main.temp)}°C ${data.weather[0].description}`
		document.querySelector('.weather__wind').textContent =
			`Wind speed: ${Math.round(data.wind.speed)} m/s`
		document.querySelector('.weather__humidity').textContent =
			`humidity:  ${data.main.humidity}%`
		weatherIcon.className = 'weather__image owf';
		weatherIcon.classList.add(`owf-${data.weather[0].id}`)
	}

}

function getRandomNum(minU, maxU) {
	let max = Math.floor(maxU);
	let min = Math.ceil(minU);
	currentSlide = addZero(Math.floor(Math.random() * (max - min + 1) + min));
}
function addZero(num) {
	return (num.toString().length == 1) ? '0' + num : num;
}
