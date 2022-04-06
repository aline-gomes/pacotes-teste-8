(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				api.initSound(manifest[i].src, callback, endCallback, pauseCallback);
            }
        }
        init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';
    var eMove = touchDevice ? 'touchmove' : 'mousemove';
	
	var callback = {
        onSoundCreated: function (sound, src) {
            var sndID = _.findWhere(manifest, {src: src}).id;
            sounds[sndID] = sound;
        }
    };
	var endCallback = {
		onEnd: function () {
			//console.log('end');
			innerDisrupt = true;
			playAudio();
			setTimeout(function() {
				innerDisrupt = false;
			}, 10);
        }
	}
	var pauseCallback = {
		onPause: function () {
			//console.log('pause', isPlaying);
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			if (soundsFired < soundsToFire) {
				soundsFired++;
				if (soundsFired === soundsToFire) {
					soundsNeedToFire = false;
				}
				return;
			}
			if (isPlaying) {
				isPlaying = false;
				switchButtonPlay();
				if (currentSound) {
					currentSound.pause();
				}
			}
        }
	}
	var sounds = {};
	var currentSound;
	var currentSlide = 0;
	var soundsNeedToFire = true;
	var soundsToFire = 0;
	var soundsFired = 0;
	var isPlaying = false;
	var delayID;
	var currentSlideSounds;
	var innerDisrupt;
    
	function init() {
		
		$('#img-0').show();
		$('#img-frame')
			.attr('width', photoSize[0] - 2)
			.attr('height', photoSize[1] - 2)
			.show();
		
		var shiftX = Math.round((900 - photoSize[0]) / 2);
		$('.slide-img, #img-frame').attr('transform', 'translate(' + shiftX + ' 0)' );
		$('#btnPlay').attr('transform', 'translate(' + shiftX + ' 362)').show();
		$('#btnStop').attr('transform', 'translate(' + (shiftX + 75) + ' 362)').show();
		
		for(var i=0;i<slides;i++) {
			$('#b'+i).attr('transform', 'translate(' + (shiftX + photoSize[0] - 39 - ((slides - i - 1) * 48)) + ' ' + (photoSize[1] + 11) + ')').show();
		}
		
		$('#btnPlay').on(eDown, function(e) {
			e.preventDefault();
			if (soundsNeedToFire) {
				fireSounds(0);
				playSlideshow(true);
			} else {
				playSlideshow();
			}
		});

		$('#btnStop').on(eDown, function(e) {
			e.preventDefault();
			stopCurrentSlide();
		});
		
		if (!touchDevice) {
			$('#btnPlay').attr('class', 'button button-nonmobile');
			$('#btnStop').attr('class', 'button-nonmobile');
			$('.slide-button').attr('class', 'slide-button button button-nonmobile');
		}
		
		$('.slide-button').on(eDown, function(e) {
			e.preventDefault();
			var id = parseInt($(this).attr('id').slice(-1));
			if (currentSound) {
				currentSound.stop();
				currentSound = null;
			}
			if (soundsNeedToFire) {
				fireSounds(id);
				showSlide(id, 'play', true);
			} else {
				if (isPlaying) {
					innerDisrupt = true;
				}
				showSlide(id, 'play');
			}
		});
	}
	
	function playSlideshow(alreadyPlaying) {
		isPlaying = !isPlaying;
		switchButtonPlay();
		if (isPlaying) {
			if (currentSound && !alreadyPlaying) {
				currentSound.resume();
			} else {
				showSlide(currentSlide, 'play', alreadyPlaying);
			}
		} else {
			if (currentSound) {
				currentSound.pause();
			}	
		}
	}
	
	function stopSlideshow() {
		clearTimeout(delayID);
		showSlide(0, 'stop');
		isPlaying = false;
		switchButtonPlay();
		if (currentSound) {
			currentSound.stop();
			currentSound = null;
		}
	}
	
	function stopCurrentSlide() {
		clearTimeout(delayID);
		isPlaying = false;
		switchButtonPlay();
		if (currentSound) {
			currentSound.stop();
			currentSound = null;
		}
	}
	
	function switchButtonPlay() {
		if (!touchDevice) {
			$('#btnPlay').attr('class', isPlaying ? 'button-pressed' : 'button button-nonmobile');
		} else {
			$('#btnPlay').attr('class', isPlaying ? 'button-pressed' : 'button');
		}
	}
	
	function showSlide(slideID, action, alreadyPlaying) {
		clearTimeout(delayID);
		if (!touchDevice) {
			$('#b'+currentSlide).attr('class', 'slide-button button button-nonmobile');
		} else {
			$('#b'+currentSlide).attr('class', 'slide-button button');
		}
		$('#img-'+currentSlide).hide();
		
		currentSlide = slideID;
		$('#img-'+currentSlide).show();
		
		if (action === 'play') {
			if (!isPlaying) {
				isPlaying = true;
				switchButtonPlay();
			}
			$('#b'+currentSlide).attr('class', 'slide-button button-pressed');
			currentSlideSounds = slideAudio[currentSlide].slice();
			if (!alreadyPlaying) {
				playAudio();
			} else {
				currentSlideSounds.shift();
			}
		}
	}
	
	function playAudio() {
		if (currentSlideSounds.length) {
			var sndID = currentSlideSounds.shift();
			currentSound = sounds[sndID];
			currentSound.play();
			if (!isPlaying) {
				isPlaying = true;
				switchButtonPlay()
			}
		} else {
			if (currentSlide < slides - 1) {
				//delayID = setTimeout(function() {
					
					showSlide(currentSlide + 1, 'play');
				//}, 50);
			} else {
				stopSlideshow();
			}
		}
	}
	
	function fireSounds(sndID) {
		sndID = slideAudio[sndID][0];
		soundsToFire = _.size(sounds) - 1;
		for(var snd in sounds) {
			if (snd !== sndID) {
				sounds[snd].play();
				sounds[snd].stop();
			}
		}
		currentSound = sounds[sndID];
		currentSound.play();
	}
	
    p.reset = function () {};
    p.loadState = function (obj) {};
    p.saveState = function () {
		stopSlideshow();
        return {};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);