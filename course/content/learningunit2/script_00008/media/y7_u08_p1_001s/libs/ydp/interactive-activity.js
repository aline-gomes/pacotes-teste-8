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
	
	var todo = [{id:0, x0:500, y0:55, x1:500, y1:55, done:false},
				{id:1, x0:500, y0:105, x1:500, y1:55, done:false},
				{id:2, x0:500, y0:155, x1:500, y1:55, done:false},
				{id:3, x0:500, y0:205, x1:500, y1:55, done:false},
				{id:4, x0:500, y0:255, x1:500, y1:55, done:false},
				{id:5, x0:500, y0:305, x1:500, y1:55, done:false},
				{id:6, x0:500, y0:305, x1:500, y1:55, done:false}
				
				];
	
	var slides = [
			{ slidNum:"1/5", gapID:0}
			
			];
	
	
			
	var currSlide = 0;
	var alldone = false;
	
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
			//console.log('end');
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
			//console.log('end2');
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
	
	var audios = [{id:'ok', src: 'sounds/ok.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'wrong', src: 'sounds/wrong.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'allok', src: 'sounds/allOk.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause}];
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
		
	
		$('#gap-0').css({
				left: 377 + 'px',
				top: 26 + 'px'
			});
			
		$('#gap-1').css({
				left: 110 + 'px',
				top: 84 + 'px'
			});
			
		$('#gap-2').css({
				left: 253 + 'px',
				top: 84 + 'px'
			});
			
		$('#gap-3').css({
				left: 253 + 'px',
				top: 175 + 'px'
			});
			
		$('#gap-4').css({
				left: 109 + 'px',
				top: 275 + 'px'
			});
			
		$('#gap-5').css({
				left: 110 + 'px',
				top: 390 + 'px'
			});
			
		
			
		
		$('#gap-0').attr("gappID", 0);
		$('#gap-1').attr("gappID", 1);
		$('#gap-2').attr("gappID", 2);
		$('#gap-3').attr("gappID", 3);
		$('#gap-4').attr("gappID", 4);
		$('#gap-5').attr("gappID", 5);
		
		
		localReset();
		
		$('.button-reset').on(eDown, function(e){
			e.preventDefault();
			// preloadSounds();
			localReset();
			$('.button-reset').addClass('button-reset-on');
			
			$(document).on(eUp, function(e){
				e.preventDefault();
				$('.button-reset').removeClass('button-reset-on');
				$(document).off(eUp);
			});
		});
		
		
		
		
		
		$('.button').on(eDown, function(e){
			e.preventDefault();
			currDrag = $(this);
			currDrag.css('z-index', '999');
			currDrag.removeClass('button-hover');
			currDrag.addClass('button-on');
			setDrag(e);
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
	
	function finish() {
		if(!alldone){
			setAudio(null);
			setAudio(2);
			//$('.allok').show();
			$('.button').css('pointer-events', 'none');
			alldone = true;
		}
	}
	
	function getXY(e) {
		var x;
		var y;
		if(e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]){
			x = e.originalEvent.touches[0].pageX;
			y = e.originalEvent.touches[0].pageY;
		}else{
			x = e.pageX;
			y = e.pageY;
		}
		if(typeof x === "undefined" && typeof y === "undefined"){
			x = currentDragPosition.x;
			y = currentDragPosition.y;
		}
		return {x:x, y:y};
	}
	
	function setDrag(e) {
		currDrag.attr({
			'fromX': currDrag.css('left').replace('px', ''),
			'fromY': currDrag.css('top').replace('px', '')
		});
		
		startPos = getXY(e);
		
		$(document).on(eMove, function(e) {
			e.preventDefault();
			
			var xy = getXY(e);
			var currleft = (parseInt(currDrag.attr('fromX')) + (xy.x - startPos.x) / resizeFactor);
			var currtop = (parseInt(currDrag.attr('fromY')) + (xy.y - startPos.y) / resizeFactor);
			
			currDrag.css({
				'left': currleft + 'px',
				'top': currtop + 'px'
			});
			
			currleft += currDrag.width() / 2;
			currtop += currDrag.height() / 2;
			
			currDrag.removeClass('button-hover');
			$('.gap').removeClass('gap-hover');
			for(var i=0; i<6; i++){
				var gap = $('#gap-' + i);
				var left = parseInt(gap.css('left').replace('px', ''));
				var top = parseInt(gap.css('top').replace('px', ''));
				var right = left + gap.width();
				var bottom = top + gap.height();
				
				if(currleft > left && currleft < right && currtop > top && currtop < bottom){
					gap.removeClass('gap-normal');
					//console.log(gap.attr('gappID'));
					gap.addClass('gap-hover');
				}
				else
				{
					gap.removeClass('gap-hover');
					gap.addClass('gap-normal');
				}
			}
		});
		
		$(document).on(eUp, function(e) {
			e.preventDefault();
			endDrag(e);
			$(document).off(eMove);
			$(document).off(eUp);
			currDrag.css('z-index', 'auto');
			currDrag = null;
		});
		$(document).on('mouseleave', function(e) {
			if(currDrag != null){
				endDrag(e);
			}
			$(document).off(eMove);
			$(document).off(eUp);
			currDrag = null;
		});
	}
	
	function update(){
		/*$('.img-tab').hide();
		
		$('.gap').hide();
		$('#img-tab-'+currSlide).show();
		$('.tab'+currSlide).show();*/
		
		
	
		//$('.gap').removeClass('gap-hover');
		
		$('.gap').html('');
		/*for(var i=0; i<slides[currSlide].days; i++){
			$('#gap-' + (slides[currSlide].first + i)).html('<p>' + (i + 1) + '</p>');
		}*/
		
		
		//$('.button').show();
		//$('.button-gap').show();
		
		var bool = true;
		for(var i=0; i<6; i++){
			
			if(todo[i].done){
				/*var gap = $('#gap-' + i);
				
				var id3 = parseInt(gap.attr("gappID"));
				
				//var id = parseInt(currDrag.attr('id').replace('button-', ''));
				//$('#button-' + id3).hide();
				$('#button-gap-' + id3).hide();*/
				
				//console.log("id2="+id2);
				
				
					
				
				
				
			}
			else{
				bool = false;
			}
		}
		if(bool){
			finish();
		}
	}
	
	function endDrag(e) {
		var id = parseInt(currDrag.attr('id').replace('button-', ''));
		
		var currleft = parseInt(currDrag.css('left').replace('px', '')) + currDrag.outerWidth() / 2;
		var currtop = parseInt(currDrag.css('top').replace('px', '')) + currDrag.outerHeight() / 2;
		var bool = false;
		$('.button').removeClass('button-on');
		//$('.button').removeClass('button-hover');
		
		for(var i=0; i<6; i++){
			
			var gap = $('#gap-' + i);
			var id2 = parseInt(gap.attr('id').replace('gap-', ''));
			var left = parseInt(gap.css('left').replace('px', ''));
			var top = parseInt(gap.css('top').replace('px', ''));
			var right = left + gap.width();
			var bottom = top + gap.height();
			
			
			
			if(currleft > left && currleft < right && currtop > top && currtop < bottom){
				//if(!todo[currSlide].done && slides[currSlide].gapID == i){
				//if(!todo[currSlide].done && gap.attr('gappID') == id){
				if(gap.attr('gappID') == id){	
					//console.log(gap.attr('gappID'));
					//console.log(id);
					todo[id2].done = true;

					var x = left + (gap.outerWidth() - currDrag.outerWidth()) / 2;
					var y = top + (gap.outerHeight() - currDrag.outerHeight()) / 2;
					
					currDrag.css('left', x);
					currDrag.css('top', y);
					todo[i].x1 = x;
					todo[i].y1 = y;
					
					gap.removeClass('gap-hover');
					gap.addClass('gap-normal');
					currDrag.removeClass('button-on');
					currDrag.addClass('button-hover');
					
					bool = true;
					setAudio(0);
				}
			}
		}
		
		if(!bool){
			
			//console.log(id);
			for(var i=0; i<6; i++){
			
				var gap = $('#gap-' + i);
				gap.removeClass('gap-hover');
				gap.addClass('gap-normal');
			}
			
			setAudio(1);
			currDrag.animate({
				'left': todo[id].x0 + 'px',
				'top': todo[id].y0 + 'px'
			}, 100, function() {
				// Animation complete.
			});
		}
		
		update();
	}
	
	function getDist(a, b){
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}
	
	function mixArray(arr) {
		var tmp = arr.slice();
		var newArr = [];
		while(tmp.length > 0){
			var rnd = Math.floor(Math.random() * tmp.length);
			newArr.push(tmp[rnd]);
			tmp.splice(rnd, 1);
		}
		return newArr;
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
		alldone = false;
		currSlide = 0;
		//$('.allok').hide();
		$('.button').css('pointer-events', 'auto');
		$('.button').removeClass('button-on');
		$('.button').removeClass('button-hover');
		$('.button').removeClass('button-off');
		$('.button').addClass('button-off');
		setAudio(null);
		
		
			todo[0].x0 = 644;
			todo[0].y0 = 198;
			todo[1].x0 = 644;
			todo[1].y0 = 250;
			todo[2].x0 = 699;
			todo[2].y0 = 198;
			todo[3].x0 = 644;
			todo[3].y0 = 146;
			todo[4].x0 = 771;
			todo[4].y0 = 198;
			todo[5].x0 = 734;
			todo[5].y0 = 146;
			todo[6].x0 = 725;
			todo[6].y0 = 250;
			
			for(var i=0; i<todo.length; i++){
			
				todo[i].done = false;
				
				$('#button-' + i).css({
					'left': todo[i].x0 + 'px',
					'top': todo[i].y0 + 'px'
				});
				$('#button-gap-' + i).css({
					'left': todo[i].x0 + 'px',
					'top': todo[i].y0 + 'px'
				});
			}

				
		
		
		update();
	}
	
    p.reset = function() {
		
    };

    p.loadState = function (obj) {
		$('.button').css('pointer-events', 'auto');
		for(var i=0; i<todo.length; i++){
			todo[i].done = obj['done' + i];
			todo[i].x0 = obj['x' + i];
			todo[i].y0 = obj['y' + i];
			todo[i].x1 = obj['x1' + i];
			todo[i].y1 = obj['y1' + i];
			
			$('#button-gap-' + i).css({
				'left': todo[i].x0 + 'px',
				'top': todo[i].y0 + 'px'
			});
			
			
			if(todo[i].done)
			{
				$('#button-' + i).css({
					'left': todo[i].x1 + 'px',
					'top': todo[i].y1 + 'px'
				});
				$('#button-' + i).removeClass('button-on');
				$('#button-' + i).addClass('button-hover');
			}
			else
			{
				$('#button-' + i).css({
					'left': todo[i].x0 + 'px',
					'top': todo[i].y0 + 'px'
				});
			}
		}
		currSlide = obj.currSlide;
		
		
		update();
		setAudio(null);
    };

    p.saveState = function () {
        var obj = {};
		for(var i=0; i<todo.length; i++){
			obj['done' + i] = todo[i].done;
			obj['x' + i] = todo[i].x0;
			obj['y' + i] = todo[i].y0;
			obj['x1' + i] = todo[i].x1;
			obj['y1' + i] = todo[i].y1;
			
		}
		obj.currSlide = currSlide;
		
        return obj;
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);