(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < audios.length; i++) {
			api.initSound(audios[i].src, audios[i].onLoad, audios[i].onEnd, audios[i].onPause);
		}
        init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';
    var eMove = touchDevice ? 'touchmove' : 'mousemove';
	
	var todo = [{id:0, done:false},
				{id:1, done:false},
				{id:2, done:false},
				{id:3, done:false},
				{id:4, done:false},
				{id:5, done:false},
				{id:6, done:false},
				{id:7, done:false},
				{id:8, done:false},
				{id:9, done:false},
				{id:10, done:false},
				{id:11, done:false},
				{id:12, done:false},
				{id:13, done:false},
				{id:14, done:false},
				{id:15, done:false},
				{id:16, done:false},
				{id:17, done:false},
				{id:18, done:false},
				{id:19, done:false},
				{id:20, done:false},
				{id:21, done:false},
				{id:22, done:false},
				{id:23, done:false},
				{id:24, done:false},
				{id:25, done:false},
				{id:26, done:false},
				{id:27, done:false},
				{id:28, done:false},
				{id:29, done:false},
				{id:30, done:false},
				{id:31, done:false},
				{id:32, done:false}];
	
	//---
	var sounds = {};
	var innerDisrupt;
	var soundsPreloaded = 0;
	var soundsToPreload = 0;
	var callbackOnLoad = {
		onSoundCreated: function (sound, src) {
			var sndID = _.findWhere(audios, {src: src}).id;
			sounds[sndID] = sound;
		}
	};
	var callbackOnEnd = {
		onEnd: function () {
			console.log('end');
			innerDisrupt = true;
			//$('.button').css('pointer-events', 'auto');
			//$('.button-start').addClass('button-start-on');
			setTimeout(function() {
				innerDisrupt = false;
			}, 10);
		}
	};
	var callbackOnPause = {
		onPause: function () {
			console.log('end2');
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			if(soundsPreloaded < soundsToPreload){
				soundsPreloaded += 1;
				return;
			}
			if(audiosPreloaded){
				//$('.button').css('pointer-events', 'none');
				//$('.button-start').removeClass('button-start-on');
			}
		}
	};
	
	var audios = [];
	var audiosPreloaded = false;
	//---
	
	p.resizeDiv = function(scale) {
		var scl = 'scale(' + scale + ')';
		$('.ia-container').find('.ia-incont').css({
			'transform': scl,
			'-webkit-transform': scl,
			'-moz-transform': scl,
			'-o-transform': scl,
			'transform-origin': '0 0',
			'-webkit-transform-origin': '0 0',
			'-moz-transform-origin': '0 0',
			'-o-transform-origin': '0 0'
		});
	}
	
    function init() {
		$('.button').append($('<div class="button-cover"></div>'));
		
		localReset();
		
		$('.button').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			var id = parseInt($(this).attr('id').replace('button-', ''));
			todo[id].done = true;
			update();
			console.log(id);
		});
		
		$('.button-reset').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			localReset();
			$('.button-reset').addClass('button-reset-on');
			
			$(document).on(eUp, function(e){
				e.preventDefault();
				$('.button-reset').removeClass('button-reset-on');
				$(document).off(eUp);
			});
		});
    }
	
	function preloadSounds(){
		if(!audiosPreloaded){
			for(var i=0; i<audios.length; i++){
				setAudio(i);
				audios[i].snd.stop();
				soundsToPreload += 1;
			}
			audiosPreloaded = true;
		}
	}
	
	function update(){
		$('.button').removeClass('button-on');
		for(var i=0; i<todo.length; i++){
			if(todo[i].done){
				$('#button-' + i).addClass('button-on');
			}
		}
	}
		
	function setAudio(id) {
		if(id == null){
			for(var i=0; i<audios.length; i++){
				if(audios[i].snd != null){
					audios[i].snd.stop();
					audios[i].snd = null;
				}
			}
		}
		else{
			audios[id].snd = sounds[audios[id].id];
			audios[id].snd.play();
		}
	}
	
	function localReset() {
		for(var i=0; i<todo.length; i++){
			todo[i].done = false;
		}
		update();
	}
	
    p.reset = function() {
		
    };

    p.loadState = function (obj) {
		for(var i=0; i<todo.length; i++){
			todo[i].done = obj['done' + i];
		}
		update();
    };

    p.saveState = function () {
        var obj = {};
		for(var i=0; i<todo.length; i++){
			obj['done' + i] = todo[i].done;
		}
        return obj;
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);