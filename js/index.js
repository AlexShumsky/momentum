'use strict'
import { quotes } from './quotes.js';
const images = [];
let currentSlide = addZero(getRandomNum(1, 20));
window.addEventListener('load', preloadImages)

function preloadImages() {
	let periods = ['night', 'morning', 'afternoon', 'evening'];
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
	localManager()
	backgroundManager()
	getWeather()
	quoteManager()
	audioManager()
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
function localManager() {
	const userName = document.querySelector('.user__name');
	const userCity = document.querySelector('.user__city');

	userName.addEventListener('change', saveUserName);
	userCity.addEventListener('change', saveUserCity);
	getLocalProperties();


	function getLocalProperties() {
		if (localStorage.getItem('userName')) userName.value = localStorage.getItem('userName');
		if (localStorage.getItem('userCity')) userCity.value = localStorage.getItem('userCity');
	}

	function saveUserName() {
		localStorage.setItem('userName', this.value);
	}
	function saveUserCity() {
		localStorage.setItem('userCity', this.value);
		getWeather(localStorage.getItem('userCity'))
	}
}
function backgroundManager() {
	changeBackground()
	backgroundSlider()

	function changeBackground() {
		const bgDate = new Date();
		const dayPeriodBg = (bgDate.getHours() < 6 || bgDate.getHours() == 24) ? 'night' :
			(bgDate.getHours() < 12) ? 'morning' : (bgDate.getHours() < 18) ? 'afternoon' : 'evening';
		const imageLink = images.filter(image => image.src == `https://raw.githubusercontent.com/AlexShumsky/stage1-tasks/assets/images/${dayPeriodBg}/${currentSlide}.jpg`)[0];
		document.querySelector('body').style.background = `url(${imageLink.src}) center / cover no-repeat`;
	}
	function backgroundSlider() {
		const arrows = document.querySelectorAll('.button-slider');
		let timer = true;

		arrows.forEach(arrow => arrow.addEventListener('click', changeCurrentSlide))

		function changeCurrentSlide() {
			(this.classList.contains('button-slider-r')) ? nextSlide() : prevSlide();

			function prevSlide() {
				if (timer) {
					currentSlide = addZero(+currentSlide - 1);
					if (+currentSlide < 1) currentSlide = 20;
					timer = false;
					changeBackground()

					setTimeout(() => timer = true, 700)
				}
			}

			function nextSlide() {
				if (timer) {
					currentSlide = addZero(+currentSlide + 1);
					if (+currentSlide > 20) currentSlide = '01';
					timer = false;
					changeBackground()

					setTimeout(() => timer = true, 700)
				}
			}
		}
	}
}
async function getWeather(city = 'minsk') {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=052d91374bd32073e60e2c409c2a2625&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	const temp = document.querySelector('.weather__temperature');
	const wind = document.querySelector('.weather__wind');
	const humidity = document.querySelector('.weather__humidity');
	const weatherIcon = document.querySelector('.weather__image');
	const error = document.querySelector('.weather__error');

	(data.cod == '404') ? showError() : showWeather();

	function showWeather() {
		hideError()
		temp.textContent = `${Math.round(data.main.temp)}°C ${data.weather[0].description}`;
		wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
		humidity.textContent = `humidity:  ${data.main.humidity}%`;
		weatherIcon.className = 'weather__image owf';
		weatherIcon.classList.add(`owf-${data.weather[0].id}`)
	}
	function showError() {
		temp.style.display = 'none';
		wind.style.display = 'none';
		humidity.style.display = 'none';
		weatherIcon.style.display = 'none';
		error.style.display = 'block';
		error.textContent = `Error! City not found for '${document.querySelector('.user__city').value}'!`
	}
	function hideError() {
		temp.style.display = 'block';
		wind.style.display = 'block';
		humidity.style.display = 'block';
		weatherIcon.style.display = 'block';
		error.style.display = 'none';
	}
}
function quoteManager() {
	showQuote()
	changeQuote()

	function showQuote() {
		const quoteContainer = document.querySelector('.quote-text');
		const quoteAuthorContainer = document.querySelector('.quote-author');
		let randomQuote = quotes[getRandomNum(0, 1643)];
		quoteContainer.textContent = randomQuote.text;
		quoteAuthorContainer.textContent = randomQuote.author || 'Anonimus';
	}
	function changeQuote() {
		const quoteButton = document.querySelector('.button-quote');
		quoteButton.addEventListener('click', showQuote)
	}
}
function audioManager() {
	const playButton = document.querySelector('.audio__button-play');
	const playNextButton = document.querySelector('.audio__button-next');
	const playPrevButton = document.querySelector('.audio__button-prev');
	const audios = document.querySelectorAll('[data-track]');
	let trackNum = 0;
	let currentAudio = audios[trackNum];


	playButton.addEventListener('click', useAudio)
	playNextButton.addEventListener('click', playNextAudio)
	playPrevButton.addEventListener('click', playPrevAudio)

	showAudioNames()

	function showAudioNames() {
		audios.forEach((audio, i) => {
			const audioList = document.querySelector('.audio__list');
			const audioElement = document.createElement('li');
			audioElement.classList.add('audio__track');
			if (i == 0) audioElement.classList.add('audio__track-active');
			audioElement.textContent = Object.values(audios[i].dataset);
			audioList.append(audioElement)
		})
	}

	function useAudio() {
		let isPlay = !currentAudio.paused;
		(isPlay) ? pauseAudio(isPlay) : playAudio(isPlay);
	}

	function playAudio(isPlay) {
		currentAudio.currentTime = 0;
		currentAudio.play();
		changePlayButton(isPlay)
		markPlayTrack()
		currentAudio.onended = () => playNextAudio()
	}
	function pauseAudio(isPlay) {
		currentAudio.pause();
		changePlayButton(isPlay)
	}
	function playNextAudio() {
		pauseAudio()
		trackNum = (trackNum < audios.length - 1) ? trackNum + 1 : trackNum = 0;
		currentAudio = audios[trackNum];
		playAudio()
	}
	function playPrevAudio() {
		pauseAudio()
		trackNum = (trackNum < 1) ? audios.length - 1 : trackNum - 1;
		currentAudio = audios[trackNum];
		playAudio()
	}

	function changePlayButton(isPlay) {
		playButton.children[0].src = `assets/svg/${isPlay ? 'play' : 'pause'}.svg`;
	}
	function markPlayTrack() {
		const tracks = document.querySelectorAll('.audio__track')
		tracks.forEach(track => track.classList.remove('audio__track-active'))
		tracks[trackNum].classList.add('audio__track-active')
	}
}

function getRandomNum(minU, maxU) {
	let max = Math.floor(maxU);
	let min = Math.ceil(minU);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function addZero(num) {
	return (num.toString().length == 1) ? '0' + num : num;
}