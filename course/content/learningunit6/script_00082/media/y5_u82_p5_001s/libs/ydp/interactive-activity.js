(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				if (manifest[i].id === 'ok' || manifest[i].id === 'wrong') {
					api.initSound(manifest[i].src, callback, defaultEndCallback);
				} else {
					api.initSound(manifest[i].src, callback, endCallback, pauseCallback);
				}
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
    var defaultEndCallback = {
        onEnd: function () {
        }
    };
	var endCallback = {
		onEnd: function () {
			//console.log('onEnd');
			innerDisrupt = true;
			currentSound=null;
			turnOffButtons();
			audioID = '';
			setTimeout(function() {
				innerDisrupt = false;
			}, 10);
        }
	}
	var pauseCallback = {
		onPause: function () {
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			//console.log('onPause');
			stopAudio();
        }
	}
	var sounds = {};
	var currentSound, innerDisrupt;
	var currentSlide = 0;
	var bubbles = [];
	var texts = [];
	var visited = [];
	var savedPos = [];
	var savedPosClones = [];
	var isPlaying = false;
	var dropped = false;
	var xmlns = 'http://www.w3.org/2000/svg';
	var xlink = 'http://www.w3.org/1999/xlink';
	var xmlspace = 'http://www.w3.org/XML/1998/namespace';
	var resource,drag,srcDrag,isClone,paintID,audioID,conf,etp;
    
	function init() {
		if (maxSlides > 1) {
			$('.switcher').show();
		}
		
		resource = $('svg').get(0);
		
		$('#resetBtn').on(eDown, function(e) {
			e.preventDefault();
			resetPress();
		})
		
		$('#audioBtn').on(eDown, function(e) {
			e.preventDefault();
			if (currentSound) {
				innerDisrupt = true;
				stopAudio(true);
			}
			isPlaying = !isPlaying;
			if (isPlaying) {
				currentSound = sounds['snd0' + (currentSlide + 1)];
				currentSound.play();
				$(this).attr('class', 'audio-parts button-pressed');
			} else {
				$(this).attr('class', 'audio-parts button');
			}
		});
		
		$('#nextBtn').on(eDown, function(e) {
			e.preventDefault();
			changeSlide(1);
		});
		
		$('#prevBtn').on(eDown, function(e) {
			e.preventDefault();
			changeSlide(-1);
		});
		
		interact('.source-list-element')
            .draggable({
                inertia: false,
                onstart: function (event) {
					event.preventDefault();
					dropped = false;
					drag = $(event.target);
					var cls = drag.attr('class').replace(' hit-gap', '');
					drag.attr('class', cls + ' active');
					event.target.setAttributeNS(null, 'data-gapID', '');
					resource.appendChild(event.target);
					isClone = drag.attr('data-clone');
					if (isClone) {
						var srcID = event.target.getAttributeNS(null, 'data-ID');
						srcDrag = $('g[data-ID=' + srcID + ']').not('g[data-clone=true]');
						srcDrag.hide();
					}
				},
                onmove: function (event) {
					event.preventDefault();
					var x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx / resizeFactor;
					var y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy / resizeFactor;
					drag.attr({
						'transform': 'translate(' + x + ' ' + y + ')',
						'data-x': x,
						'data-y': y
					});
				},
                onend: function (event) {
					event.preventDefault();
					var cls = drag.attr('class').replace(' active', '');
					drag.attr('class', cls);
					if (!dropped) {
						if (isClone) {
							$(drag).remove();
						} else {
							resetDrag(drag);
						}
					}
					if (isClone)
						srcDrag.show();
				},
            })
            .styleCursor(false);
			
		interact('.gap').dropzone({
            accept: '.source-list-element',
            overlap: 0.5,
            ondragenter: function (event) {
				var cls = drag.attr('class');
				drag.attr('class', cls + ' hit-gap');
            },
            ondragleave: function (event) {
				var cls = drag.attr('class').replace(' hit-gap', '');
				drag.attr('class', cls);
            },
            ondrop: function (event) {
				dropped = true;
                checkAnswer(event.target, event.relatedTarget);
            }
        });
		
		showSlide();
	}
	
	function showSlide() {		
		$('.gap').remove();
		$('.gap-inactive').remove();
		$('.arrow').remove();
		$('.speaker').remove();
		$('.source-list-element').remove();
		$('.source-list-element-in-gap').remove();
		
		var arr = slides['slide0' + (currentSlide + 1)];
		var obj,i,speaker,speakerType;
		bubbles = [];
		texts = [];
		
		conf = slideConf[currentSlide];
		etp = conf.elementTextPadding;
		
		if (!conf.resetButtonVisible) {
			$('.reset-parts').hide();
		}
		if (conf.audioButtonVisible) {
			$('.audio-parts').show();
		} else {
			$('.audio-parts').hide();
		}
		if (maxSlides === 1 || !conf.audioButtonVisible) {
			$('.audio-parts.switcher').hide();
		}
		if (!conf.resetButtonVisible) {
			$('.reset-parts').hide();
		} else {
			$('.reset-parts').show();
			if (maxSlides === 1) {
				$('.reset-parts.switcher').hide();
			}
		}
		
		for(i=0;i<arr.length;i++) {
			
			// bubbles
			obj = arr[i].bubble;
			
			if (arr[i].audio && arr[i].audio !== '') {
				speakerType = !arr[i].draggable ? 'bubble' : 's-list-element';
			}
			
			if (obj && !arr[i].disruptor) {
				var gap = document.createElementNS(xmlns, 'rect');
				
				// bubble speaker
				if (!arr[i].draggable && arr[i].audio && arr[i].audio !== '') {
					speaker = document.createElementNS(xmlns, 'use');
					speaker.setAttributeNS(xlink, 'xlink:href', '#small-speaker');
					speaker.setAttributeNS(null, 'class', 'speaker');
					speaker.setAttributeNS(null, 'data-ID', i);
					speaker.setAttributeNS(null, 'x', obj.x + 10);
					speaker.setAttributeNS(null, 'y', obj.y + (obj.h - 28)/2);
				}

				gap.setAttributeNS(null, 'class', arr[i].draggable ? 'gap' : 'gap-inactive');
				gap.setAttributeNS(null, 'data-ID', i);
				gap.setAttributeNS(null, 'x', obj.x);
				gap.setAttributeNS(null, 'y', obj.y);
				gap.setAttributeNS(null, 'width', obj.w);
				gap.setAttributeNS(null, 'height', obj.h);
				gap.setAttributeNS(null, 'rx', 8);
				gap.setAttributeNS(null, 'ry', 8);
				gap.setAttributeNS(null, 'fill', arr[i].draggable ? '#FFF' : obj.color);
				gap.setAttributeNS(null, 'fill-opacity', (obj.color === colors.transparent) ?  0 : 1);
				gap.setAttributeNS(null, 'stroke', obj.color);
				gap.setAttributeNS(null, 'stroke-width', 2);
				bubbles[i] = gap;
				
				var ids = (obj.accept && obj.accept.length) ? obj.accept.join(',') : i.toString();
				gap.setAttributeNS(null, 'data-accept', ids);
				
				// bubble arrows
				if (conf.showBubbleArrows && obj.arrowPos && obj.arrowPos !== '') {
					var arrow = document.createElementNS(xmlns, 'path');
					arrow.setAttributeNS(null, 'class', 'arrow');
					arrow.setAttributeNS(null, 'fill', obj.color);
					arrow.setAttributeNS(null, 'd', 'M0,51.5 L26.4,22.9 29.3,3.3 16.85,0 17.85,20.6 0,51.5z');
					
					var ax = (obj.arrowPos.indexOf('left') != -1) ? 30 : obj.w - 30;
					var ay = (obj.arrowPos.indexOf('down') != -1) ? obj.h - 12 : 12;
					var asx = (obj.arrowPos.indexOf('left') == -1) ? -1 : 1;
					var asy = (obj.arrowPos.indexOf('down') == -1) ? -1 : 1;
					
					if (obj.flipArrow) {
						asx = asx * -1;
						ax += (obj.arrowPos.indexOf('left') != -1) ? 30 : -30;
					}
					arrow.setAttributeNS(null, 'transform', 'matrix(' + asx + ',0,0,' + asy + ',' + (ax + obj.x) + ',' + (ay + obj.y)  +')');
					resource.appendChild(arrow);
				}
				
				resource.appendChild(gap);
				if (speaker) {
					resource.appendChild(speaker);
				}
			}
			
			// s-list
			var txt = arr[i].txt;
			var tf = document.createElementNS(xmlns, 'text');
			var ts;
			
			if (txt.indexOf("\n") != -1) {
				var tempArr = txt.split("\n");
				for(var j=0;j<tempArr.length;j++){
					var str = tempArr[j];
					if (str.indexOf('<fill') !== -1) {
						createSpecialText('color', str, tf, 26 * j);
					} else if (txt.indexOf('<b>') !== -1) {
						createSpecialText('bold', str, tf, 26 * j);
					} else {
						ts = document.createElementNS(xmlns, 'tspan');
						ts.setAttributeNS(xmlspace, 'xml:space', 'preserve');
						ts.setAttributeNS(null, 'x', 0);
						ts.setAttributeNS(null, 'y', 26 * j);
						ts.textContent = convertSpaces(str);
						tf.appendChild(ts);
					}
				}
			} else {
				if (txt.indexOf('<fill') !== -1) {
					createSpecialText('color', txt, tf, 0);
				} else if (txt.indexOf('<b>') !== -1) {
					createSpecialText('bold', txt, tf, 0);
				} else {
					ts = document.createElementNS(xmlns, 'tspan');
					ts.setAttributeNS(xmlspace, 'xml:space', 'preserve');
					ts.textContent = convertSpaces(txt);
					tf.appendChild(ts);
				}
			}
			
			var tempDeltaX = 0;
			if (slideConf[currentSlide].audioButtonVisible && arr[i].audio === "") tempDeltaX = 15;
			////
			tf.setAttributeNS(null, 'transform', 'translate(' + (etp.left - tempDeltaX) + ' ' + (etp.top + 18) + ')');
			tf.setAttributeNS(xmlspace, 'xml:space', 'preserve');
			var element = document.createElementNS(xmlns, 'g');
			var bg = document.createElementNS(xmlns, 'rect');
			var shadow = document.createElementNS(xmlns, 'rect');
			element.setAttributeNS(null, 'class', arr[i].draggable ? 'source-list-element' : 'source-list-element-in-gap');
			element.setAttributeNS(null, 'data-draggable', arr[i].draggable);
			element.setAttributeNS(null, 'data-disruptor', arr[i].disruptor);
			element.setAttributeNS(null, 'data-ID', i);
			element.setAttributeNS(null, 'data-gapID', '');
			element.setAttributeNS(null, 'data-audio', arr[i].audio);
			
			bg.setAttributeNS(null, 'class', 'element-bg');
			bg.setAttributeNS(null, 'fill', '#EEE');
			shadow.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.4)');
			shadow.setAttributeNS(null, 'x', 2);
			shadow.setAttributeNS(null, 'y', 2);

			texts.push(element);
			
			element.appendChild(shadow);
			element.appendChild(bg);
			element.appendChild(tf);
			
			// s-list element speaker
			if (speakerType === 's-list-element') {
				speaker = document.createElementNS(xmlns, 'g');
				var icons = ['audio-1', 'audio-over', 'audio-klik'];
				var cls = ['normal', 'over', 'pressed'];
				for(var j=0;j<3;j++) {
					var icon = document.createElementNS(xmlns, 'use');
					icon.setAttributeNS(xlink, 'xlink:href', '#'+icons[j]);
					icon.setAttributeNS(null, 'class', cls[j]);
					speaker.appendChild(icon);
				}
				
				element.setAttributeNS(null, 'data-speaker', 'true');
				speaker.setAttributeNS(null, 'class', 'button speaker element-speaker');
				speaker.setAttributeNS(null, 'data-ID', i);
				speaker.setAttributeNS(null, 'data-audio', arr[i].audio);
				resource.appendChild(speaker);
			}
			
			resource.appendChild(element);
			
		}
		$('#tab-counter').get(0).textContent = (currentSlide + 1) + '/' + maxSlides;
		$('[id^=img-tab]').hide();
		$('#img-tab-' + currentSlide).show();
		paintSourceList();
	}

	function paintSourceList() {
		var tBox,element,id,completed=true;
		$('.speaker-area').remove();
		for(var i=0;i<texts.length;i++) {
			element = $(texts[i]);
			id = texts[i].getAttributeNS(null, 'data-ID');
			tBox = element.find('text').get(0).getBBox();
			if (!tBox || !tBox.width) {
				completed = false;
				break;
			}
			var w = tBox.width + ((element.attr('data-draggable') !== 'true') ? 20 : etp.left + etp.right);
			var h = tBox.height + etp.top + etp.bottom - 6;
			$(element.find('rect').get(0)).attr('width', w).attr('height', h);
			$(element.find('rect').get(1)).attr('width', w).attr('height', h);
			element.attr('data-w', w).attr('data-h', h);
			
			if (element.attr('data-draggable') !== 'true') {
				var gap = $(bubbles[parseInt(id)]);
				placeInGap(gap, element);
				var audio = element.attr('data-audio');
				if (audio !== '' && audio !== 'undefined' && audio !== 'null') {
					var speakerArea = gap.get(0).cloneNode(true);
					speakerArea.setAttributeNS(null, 'opacity', 0.01);
					speakerArea.setAttributeNS(null, 'class', 'bubble-speaker');
					speakerArea.setAttributeNS(null, 'data-ID', id);
					speakerArea.setAttributeNS(null, 'data-audio', audio);
					resource.appendChild(speakerArea);
				}
			} else {
				
			}
		}
		if (!completed) {
			paintID = setTimeout(paintSourceList, 100);
		} else {
			initSpeakers();
			if (!touchDevice) {
				initMouseOver();
			}
			if (visited[currentSlide]) {
				restoreSlideState(currentSlide);
			} else {
				shuffleSourceList();
			}
		}
	}
	
	function createSpecialText(texttype,str,tf,y) {
		var color;
		if (texttype === 'color') {
			color = str.slice(str.indexOf('#'), str.indexOf('>'));
			str = str.replace('<fill:'+color+'>','|').replace('</fill>','|');
		} else {
			str = str.replace('<b>','|').replace('</b>','|');
		}
		var arr = str.split('|');
		for(var i=0;i<arr.length;i++) {
			if(arr[i] === '') {
				continue;
			}
			var ts = document.createElementNS(xmlns, 'tspan');
			ts.setAttributeNS(xmlspace, 'xml:space', 'preserve');
			if (!i || (i === 1 && arr[0] === '')) {
				ts.setAttributeNS(null, 'x', 0);
			}
			ts.setAttributeNS(null, 'y', y);
			if (texttype === 'color') {
				ts.setAttributeNS(null, 'fill', (i===1?color:'#000'));
			} else {
				ts.setAttributeNS(null, 'font-weight', (i===1?'bold':'normal'));
			}
			ts.textContent = convertSpaces(arr[i]);
			tf.appendChild(ts);
		}
	}
	
	function initMouseOver() {
		$('.button').off('mouseover');
		$('.button').off('mouseout');
		$('.button').on('mouseover', function(e) {
			e.preventDefault();
			$(this).find('.normal').hide();
			$(this).find('.over').show();
		}).on('mouseout', function(e) {
			e.preventDefault();
			$(this).find('.normal').show();
			$(this).find('.over').hide();
		});
	}
	
	function initSpeakers() {
		$('.bubble-speaker, .element-speaker').on(eDown, function(e) {
			e.preventDefault();
			var speaker = $(this).get(0);
			var sndID = speaker.getAttributeNS(null, 'data-audio');
			var speakerType = (speaker.getAttributeNS(null, 'class') === 'bubble-speaker') ? 'bubble' : 'element';
			if (sndID !== audioID) {
				if (currentSound) {
					innerDisrupt = true;
				}
				playAudio(sndID, speaker.getAttributeNS(null, 'data-ID'), speakerType);
				audioID = sndID;
			} else {
				stopAudio();
			}
		});
	}
	
	function changeSlide(n) {
		var newSlide = currentSlide + n;
		if (newSlide >= 0 && newSlide < maxSlides) {
			$('#img-tab-' + currentSlide).hide();
			saveSlideState(currentSlide);
			currentSlide = newSlide;
			stopAudio();
			showSlide();
		}
	}
	
	function playAudio(sndID, gID, audioType) {
		stopAudio();
		currentSound = sounds[sndID];
		currentSound.play();
		var speaker = $('.speaker').get(parseInt(gID));
		if (audioType === 'bubble') {
			$(speaker).attr('xlink:href', '#small-speaker-klik');
		} else {
			$(speaker).attr('class', 'button-pressed speaker element-speaker');
		}
	}
	
	function stopAudio(fullAudio) {
		if (currentSound) {
			currentSound.stop();
			currentSound=null;
			turnOffButtons(fullAudio);
			audioID = '';
		}
	}
	
	function turnOffButtons(fullAudio) {
		if (!fullAudio) {
			isPlaying = false;
		}
		$('#audioBtn').attr('class', 'audio-parts button');
		$('.speaker[xlink\\:href=#small-speaker-klik]').attr('xlink:href', '#small-speaker');
		$('.speaker.button-pressed').attr('class', 'button speaker element-speaker');
	}
	
	function saveSlideState(slide) {
		savedPos[slide] = [];
		savedPosClones[slide] = [];
		visited[slide] = true;
		for(var i=0;i<texts.length;i++) {
			var el = $(texts[i]);
			var node = el.get(0);
			savedPos[slide][i] = {
				x: el.attr('data-x'), 
				y: el.attr('data-y'), 
				sX: el.attr('data-start-x'), 
				sY: el.attr('data-start-y'),  
				cls: el.attr('class'), 
				gID: node.getAttributeNS(null, 'data-gapID')
			};
		}
		if (conf.copySourceList) {
			var elems = $('g[data-clone="true"]');
			for(var i=0;i<elems.length;i++) {
				var el = $(elems[i]);
				var node = el.get(0);
				savedPosClones[slide][i] = {
					x: el.attr('data-x'), 
					y: el.attr('data-y'), 
					sX: el.attr('data-start-x'), 
					sY: el.attr('data-start-y'), 
					ID: node.getAttributeNS(null, 'data-ID'),
					cls: el.attr('class'), 
					gID: node.getAttributeNS(null, 'data-gapID')
				};
			}
		}
	}
	
	function restoreSlideState(slide) {
		var objSaved = savedPos[slide];
		var objSavedClone = savedPosClones[slide];
		
		for(var i=0;i<texts.length;i++) {
			var obj = objSaved[i];
			var el = $(texts[i]);
			var node = el.get(0);
			if (el.attr('data-draggable') === 'true') {
				resource.appendChild(node);
			}
			el.attr({
				'transform': 'translate(' + obj.x + ' ' + obj.y + ')',
				'data-x': obj.x,
				'data-y': obj.y,
				'data-start-x': obj.sX,
				'data-start-y': obj.sY,
				'class': obj.cls
			});
			node.setAttributeNS(null, 'data-gapID', objSaved[i].gID);
			if (el.attr('data-speaker') === 'true') {
				placeElementSpeaker(el,parseInt(objSaved[i].sX),parseInt(objSaved[i].sY));
			}
		}
		
		for(var i=0;i<objSavedClone.length;i++) {
			var obj = objSavedClone[i];
			var clone = $('g[data-ID=' + obj.ID + ']').get(0).cloneNode(true);
			$(clone).attr({
				'transform': 'translate(' + obj.x + ' ' + obj.y + ')',
				'data-x': obj.x,
				'data-y': obj.y,
				'data-start-x': obj.sX,
				'data-start-y': obj.sY,
				'class': obj.cls
			});
			clone.setAttributeNS(null, 'data-clone', true);
			clone.setAttributeNS(null, 'data-ID', obj.ID);
			clone.setAttributeNS(null, 'data-gapID', obj.gID);
			resource.appendChild(clone);
		}
		
	}
	
	function shuffleSourceList() {
		var x = conf.sourceListConf.x;
		var y = conf.sourceListConf.y;
		var temp = texts.slice();
		var randomIndexValue, i;
		var outputArray = [];

		if (conf.sourceListConf.shuffle) {
			for(i=0;i<texts.length;i++) {
				randomIndexValue = Math.round(Math.random() * (temp.length - 1));
				outputArray[i] = temp[randomIndexValue];
				temp.splice(randomIndexValue, 1);
			}
		} else {
			outputArray = temp;
		}
		
		for(i=0;i<outputArray.length;i++) {
			var el = $(outputArray[i]);
			if (el.attr('data-draggable') === 'true') {
				var h = parseInt(el.attr('data-h'));
				if (y + h > 428) {
					x = conf.sourceListConf.x + conf.sourceListConf.spaceX;
					y = conf.sourceListConf.y;
				}
				el.attr({
					'transform': 'translate(' + x + ' ' + y + ')',
					'data-x': x,
					'data-y': y,
					'data-start-x': x,
					'data-start-y': y
				});
				if (el.attr('data-speaker') === 'true') {
					placeElementSpeaker(el,x,y);
				}
				y += h + conf.sourceListConf.spaceY;
			}
		}
	}
	
	function placeElementSpeaker(el,x,y) {
		var id =  el.get(0).getAttributeNS(null, 'data-ID')
		var speaker = $('.speaker[data-ID=' + id + ']');
		speaker.attr({'transform': 'translate(' + (x - 69) + ' ' + (y - 2) + ')'});
	}
	
	function checkAnswer(g,d) {	
		var corrID = g.getAttributeNS(null, 'data-accept');
		var dragID = d.getAttributeNS(null, 'data-ID');
		if(corrID.indexOf(',') > -1) {
			corrID = corrID.split(',');
		}
		if ((corrID === dragID) || (corrID.indexOf(dragID) > -1)) {
			if (conf.copySourceList) {
				if (!isClone) {
					var cpy = drag.get(0).cloneNode(true);
					cpy.setAttributeNS(null, 'data-clone', true);
					cpy.setAttributeNS(null, 'data-ID', dragID);
					resource.appendChild(cpy);
					placeInGap($(g), $(cpy));
					resetDrag(drag);
				} else {
					placeInGap($(g), drag);
				}
			} else {
				placeInGap($(g), drag);
			}
			if (conf.playFeedbackSounds) {
				//stopAudio();
				sounds.ok.play();
			}
		} else {
			if (isClone) {
				$(drag).remove();
			} else {
				resetDrag(drag);
			}
			if (conf.playFeedbackSounds) {
				//stopAudio();
				sounds.wrong.play();
			}
		}
	}
	
	function placeInGap(g,d) {
		var gID = g.get(0).getAttributeNS(null, 'data-ID');
		var dID = d.get(0).getAttributeNS(null, 'data-ID');
		var x = parseInt(g.attr('x')) + ((parseInt(g.attr('width')) - parseInt(d.attr('data-w'))) / 2);
		var y = parseInt(g.attr('y')) + ((parseInt(g.attr('height')) - parseInt(d.attr('data-h'))) / 2);
		d.attr({
			'transform': 'translate(' + x + ' ' + y + ')',
			'data-x': x,
			'data-y': y,
		});
		d.get(0).setAttributeNS(null, 'data-gapID', gID);
		
		// remove previous answer
		var elements = conf.copySourceList ? $('.source-list-element[data-clone=true]') : $('.source-list-element');
		for(var i=0;i<elements.length;i++) {
			var el = $(elements.get(i));
			var elID = el.get(0).getAttributeNS(null, 'data-ID');
			var elgID = el.get(0).getAttributeNS(null, 'data-gapID');
			if (elID !== dID && !isNaN(parseInt(elgID)) && elgID === gID) {
				if (!conf.copySourceList) {
					resetDrag($(el));
				} else {
					$(el).remove();
				}
				break;
			}
		}
	}
	
	function resetDrag(el) {
		var x = parseInt(el.attr('data-start-x'));
		var y = parseInt(el.attr('data-start-y'));		
		el.attr({
			'transform': 'translate(' + x + ' ' + y + ')',
			'data-x': x,
			'data-y': y,
			'class': 'source-list-element'
		});
		el.get(0).setAttributeNS(null, 'data-gapID', '');
	}
	
	function convertSpaces(txt) {
		if (txt.indexOf('  ') > -1) {
			// non-breaking spaces
			txt = txt.split(' ').join('\u00A0');
		}
		return txt;
	}
	
	function resetPress() {
		clearTimeout(paintID);
		stopAudio();
		var tabelements = $('.source-list-element');
		for(var i=0;i<tabelements.length;i++) {
			resetDrag($(tabelements.get(i)));
		}
		$('.source-list-element[data-clone=true]').remove();
		visited[currentSlide] = false;
		savedPos[currentSlide] = [];
		savedPosClones[currentSlide] = [];
		shuffleSourceList();
	}
	
    p.reset = function () {
        
    };

    p.loadState = function (obj) {
        currentSlide = obj.currentSlide;
        visited = obj.visited;
        savedPos = obj.savedPos;
        savedPosClones = obj.savedPosClones;
		showSlide();
    };

    p.saveState = function () {
		clearTimeout(paintID);
		stopAudio();
		saveSlideState(currentSlide);
        return {
			currentSlide: currentSlide,
			visited: visited,
			savedPos: savedPos,
			savedPosClones: savedPosClones
		};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);