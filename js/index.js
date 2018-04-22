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
	album_speed_roatation = 0.5,
	album_interval,
	readyToRewind = false;

var music_path = "assets/audio/";
var music = ["Justin_Timberlake-Say_something.mp3"];
var audio;

var back_panel = document.getElementById("back-panel"),
	author = document.getElementById("author"),
	time_remaining = document.getElementById("remaining-time"),
	time_duration = document.getElementById("duration-time");

function sound(src) {
    audio = new Audio(src);
    audio.volume = volume.value / 100;
}

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

function play_stop() {
	var status = play_button.getAttribute("status");
	switch (status) {
		case null:
			sound(music_path + music[0]);
			audio.play();

			play_button.setAttribute("status", "play");
			play_button.innerHTML = play_button.innerHTML.replace("play", "pause");
			
			author.innerHTML = music[0].replace(/_/g, " ").replace("-", " - ");

			back_panel.className = "active";

			audio.onloadedmetadata = function () {
				var seconds = parseInt(audio.duration % 60);
			    var minutes = parseInt((audio.duration / 60) % 60);

			    if (seconds < 10) {
			        time_duration.innerHTML = minutes + ':0' + seconds;
			    } else {
			        time_duration.innerHTML = minutes + ':' + seconds;
			    }
			}

			album_rotation_start();
			readyToRewind = true;
			break;

		case "pause":
			audio.play();
			play_button.setAttribute("status", "play");
			play_button.innerHTML = play_button.innerHTML.replace("play", "pause");
			back_panel.className = "active";

			album_rotation_start();
			break;

		case "play":
			audio.pause();
			play_button.setAttribute("status", "pause");
			play_button.innerHTML = play_button.innerHTML.replace("pause", "play");
			back_panel.className = "";

			album_rotation_stop();
			break;
	}
}
function remaining_time() {
	var seconds = parseInt(audio.currentTime % 60);
    var minutes = parseInt((audio.currentTime / 60) % 60);

    if (seconds < 10) {
        time_remaining.innerHTML = minutes + ':0' + seconds;
    } else {
        time_remaining.innerHTML = minutes + ':' + seconds;
    }
}

function album_rotation() {
	if (album_deg > 360) {
		album_deg = album_deg - 360;
	} else {
		album_deg = album_deg + album_speed_roatation;
	}

	album_cover.style.transform = "rotate(" + album_deg + "deg)";

	remaining_time();
}
function album_rotation_start() {
	album_interval = setInterval(album_rotation, 10);
}
function album_rotation_stop() {
	clearInterval(album_interval);
}

var start_X, start_Y, current_X, current_Y, start_angle, stage_angle, destination_angle, drag = false, audio_duration = 0, center;

album_cover.onmousedown = function(e) {
	if (readyToRewind) {
		drag = true;

		if (audio != undefined) {
			audio_duration = audio.duration;
		}

		var info = this.getBoundingClientRect(), top = info.top, left = info.left, height = info.height, width = info.width;

	    center = {
	      x: left + (width / 2),
	      y: top + (height / 2)
	    }

		start_X = e.pageX,
		start_Y = e.pageY;
	}
}
document.onmousemove = function(e) {
	if (drag && readyToRewind) {
		current_X = e.pageX,
		current_Y = e.pageY;

		start_angle = Math.atan2((start_Y - center.y) ,(start_X - center.x)) *  (180 / Math.PI);
		stage_angle = Math.atan2((current_Y - center.y) ,(current_X - center.x)) *  (180 / Math.PI);
		
		destination_angle = (stage_angle - start_angle);

		completed_angle = album_deg + destination_angle;
		album_deg = album_deg + destination_angle;

		if (completed_angle < 0) {
			completed_angle = 360 + completed_angle;
		} else if (completed_angle > 360) {
			completed_angle = completed_angle - 360;
		}

		if (destination_angle < 0) {
			audio.currentTime -= audio_duration / 360 * completed_angle / 100;
		} else {
			audio.currentTime += audio_duration / 360 * completed_angle / 100;
		}

	    album_cover.style.transform = "rotate(" + album_deg + "deg)";

	    remaining_time();

	    if (play_button.getAttribute("status") != "pause") {
	    	album_rotation_stop();
	    }
	    start_X = current_X,
		start_Y = current_Y;
	}
}
album_cover.onmouseup = function(e) {
	if (readyToRewind) {
		drag = false;
		album_deg = completed_angle;

		if (play_button.getAttribute("status") != "pause") {
	    	album_rotation_start();
	    }
	}
}

window.onload = function () {
	play_button.addEventListener("click", play_stop);
	volume.addEventListener('input', volume_on_change, false);
}