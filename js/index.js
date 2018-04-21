function volume_on_change(){
	var min = this.min || 0,
	  	max = this.max || 100,
	  	c_style, u, edge_w, val, str = '';

	this.setAttribute('value', this.value);

	val = this.value + '% 100%';
	str += 'input[type="range"]' + volume_track[0] + '{background-size:' + val + '}';
	volume_styles_array[0] = str;
	volume_style.textContent = volume_styles_array.join('');

	audio.volume = this.value / 100;
}
var volume = document.getElementById("volume"),
	volume_style = document.createElement('style'),
	volume_styles_array = [],
	volume_track = ['::-webkit-slider-runnable-track'];
	
	document.body.appendChild(volume_style);

var play_button = document.getElementById("play");
var prev_button = document.getElementById("prev");
var next_button = document.getElementById("next");

var album_cover = document.getElementById("album"),
	album_deg,
	album_speed_roatation = 10;

var music_path = "assets/audio/";
var music = ["Justin_Timberlake-Say_something.mp3"];
var audio;

function sound(src) {
    audio = new Audio(src);
    audio.volume = volume.value / 100;
}

function play_stop() {
	var status = play_button.getAttribute("status");

	switch (status) {
		case null:
			sound(music_path + music[0]);
			audio.play();
			play_button.setAttribute("status", "play");
			play_button.innerHTML = play_button.innerHTML.replace("play", "pause");

			album_rotation_start();
			break;

		case "pause":
			audio.play();
			play_button.setAttribute("status", "play");
			play_button.innerHTML = play_button.innerHTML.replace("play", "pause");
			break;

		case "play":
			audio.pause();
			play_button.setAttribute("status", "pause");
			play_button.innerHTML = play_button.innerHTML.replace("pause", "play");
			break;
	}
}

function album_rotation() {
	album_deg = audio.currentTime;
	album_cover.style.transform = "rotate(" + album_deg * Math.PI * album_speed_roatation + "deg)";
}
function album_rotation_start() {
	setInterval(album_rotation, 10);
}
play_button.addEventListener("click", play_stop);
volume.addEventListener('input', volume_on_change, false);