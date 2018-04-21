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
	album_deg = 0,
	album_speed_roatation = 10,
	album_interval;

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

			album_rotation_start();
			break;

		case "play":
			audio.pause();
			play_button.setAttribute("status", "pause");
			play_button.innerHTML = play_button.innerHTML.replace("pause", "play");
			album_rotation_stop();
			break;
	}
}

function album_rotation() {
	album_deg = audio.currentTime * Math.PI * album_speed_roatation;
	album_cover.style.transform = "rotate(" + album_deg + "deg)";
}
function album_rotation_start() {
	album_interval = setInterval(album_rotation, 10);
}
function album_rotation_stop() {
	clearInterval(album_interval);
}

var start_X, start_Y, current_X, current_Y, start_angle, stage_angle, destination_angle, R2D, drag = false;

var center = {
	x: 0,
	y: 0
};

album_cover.onmousedown = function(e) {
	drag = true;

	var _ref = this.getBoundingClientRect(), top = _ref.top, left = _ref.left, height = _ref.height, width = _ref.width;

    center = {
      x: left + (width / 2),
      y: top + (height / 2)
    }

	start_X = e.pageX - center.x,
	start_Y = e.pageY - center.y;
	start_angle = (180 / Math.PI) * Math.atan2(start_Y, start_X);
}
document.onmousemove = function(e) {
	if (drag) {
		current_X = e.pageX - center.x,
		current_Y = e.pageY - center.y;

		stage_angle = (180 / Math.PI) * Math.atan2(current_Y, current_X);
		destination_angle = stage_angle - start_angle;
		completed_angle = album_deg + destination_angle;

	    album_cover.style.transform = "rotate(" + completed_angle + "deg)";
	}
}
album_cover.onmouseup = function(e) {
	drag = false;
	album_deg += destination_angle;
}

function rewind_audio() {

}

play_button.addEventListener("click", play_stop);
volume.addEventListener('input', volume_on_change, false);