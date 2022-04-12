(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				if (manifest[i].id === 'allOk') {
					api.initSound(manifest[i].src, callback, defaultEndCallback);
				} else {
					api.initSound(manifest[i].src, callback, endCallback);
				}
            }
        }
		if (gfxEngine == "apple") {
			$('#apple').attr('display', 'inline');
		} else if (gfxEngine == "tree") {
			$('#tree').attr('display', 'inline');
		} else if (gfxEngine == "castle") {
			$('#castle').attr('display', 'inline');
		} else {
			$('#stack').attr('display', 'inline');
		}
		
		if (borderStyle == "seaStyle") {
			$('#frame_0').attr('display', 'none');
			$('#frame_1').attr('display', 'inline');
		}
		
		if (backgroundStyle == "png") {
			$('#background_0').attr('display', 'none');
			$('#background_1').attr('display', 'inline');
		}
		
		if (colorSpots == "on") 
			$('#anim-color_spots').attr('display', 'inline');
		
		$('#question0').attr('transform', 'translate(55 '+ (100 + offsetYtexts) + ')');
		$('#question1').attr('transform', 'translate(55 '+ (130 + offsetYtexts) + ')');
		$('#question2').attr('transform', 'translate(55 '+ (160 + offsetYtexts) + ')');
		
        init();
	};

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp =   touchDevice ? 'touchend'   : 'mouseup';
    var eMove = touchDevice ? 'touchmove'  : 'mousemove';
    var eOver = touchDevice ? 'touchover'  : 'mouseover';
    var eOut =  touchDevice ? 'touchout'   : 'mouseout';
	
	var callback = {
        onSoundCreated: function (sound, src) {
            var sndID = _.findWhere(manifest, {src: src}).id;
            sounds[sndID] = sound;
        }
    };
    var defaultEndCallback = {
        onEnd: function () {
			if (buttonAudioVisible) {
				isPlaying = false;
				icon_audioBtn.gotoAndStop(1);
			}
        }
    };
	var endCallback = {
		onEnd: function () {
			currentSound = null;
			if (buttonAudioVisible) {
				isPlaying = false;
				icon_audioBtn.gotoAndStop(1);
			}
        }
	}
	var sounds = {};
	var currentSound, currentSoundCard;

	var icon_allOK, icon_audioBtn, icon_resetBtn, icon_startBtn;
	var icon_letter = [];
	var done = 0;
	var currentQuestion = 0;
	var currentChance = 0;
	var maxChances = 10;
	var questionObj = null;
	//var letterBtns = [];
	//var rings = [];
	var isPlaying = false;
	var shiftX  = 55;
	var shiftY  = 0;
	var counter = 0;
	var anim_resetBtn_block = false;
	var anim_startBtn_block = false;
	var anim_letterBtn_block = false;
	var anim_audioBtn_block = false;
	var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
	var imageAddCheck = false;
	var currentID = 0;
	var letters = [];
	var allOKcheck = false;
	for (var i=0; i<abc.length; i++) 
		letters[i] = 0;
	
	function init() {
		
		if (colorSpots == "on") {
			icon_colorSpots = new ImageAnimation('color_spots', 'images/color_spots.json');
			$('#color_spots').css('left', (colorSpotsOffsetX/9.0 + 35) +'%');
		}
			
		icon_allOK = new ImageAnimation('allOK', 'images/allOK.json');

		if (buttonAudioVisible) {
			icon_audioBtn = new ImageAnimation('audioBtn', 'images/audioBtn.json');
		} else {
			$('#anim-audioBtn').attr('display', 'none');
		}
		
		icon_resetBtn = new ImageAnimation('resetBtn', 'images/resetBtn.json');
		icon_startBtn = new ImageAnimation('startBtn', 'images/startBtn.json');

		for(var i=0; i<abc.length; i++) {
			icon_letter[i] = new ImageAnimation('letters'+i, 'images/letters.json');
			$('#letter'+i)[0].textContent = abc[i];
			$('#letters'+i).css('left', (45 + (shiftX * counter))/9.0+'%');
			$('#letters'+i).css('top', (170 + shiftY)/4.3+'%');
			
			$('#anim-letters'+i).on(eDown, function(e) {
				e.preventDefault();
				var ID = Number(e.target.parentNode.id.split("anim-letters")[1]);
				if (!anim_letterBtn_block) {
					letterPress(ID);
					if (buttonAudioVisible) {
						icon_audioBtn.gotoAndStop(1);
						isPlaying = false;
						sounds[questions[0].audio].stop();
						sounds[questions[currentQuestion-1].audio].stop();
					}
				}
			});

			$('#anim-letters'+i).on(eOver, function(e) {
				e.preventDefault();
				var ID = Number(e.target.parentNode.id.split("anim-letters")[1]);
				if (!anim_letterBtn_block)
				try {
					icon_letter[ID].gotoAndStop(3);
				} catch (error) {
					
				}
			});

			$('#anim-letters'+i).on(eOut, function(e) {
				e.preventDefault();
				var ID = Number(e.target.parentNode.id.split("anim-letters")[1]);
				try {
					icon_letter[ID].gotoAndStop(1);
				} catch (error) {
					
				}
			});

			counter++;
			
			if (counter == 7) {
				counter=0;
				shiftY+=shiftX;
			}
		}
		showButtons(true);
		
		$('#anim-startBtn').on(eDown, function(e) {
			e.preventDefault();
			if (!anim_startBtn_block) {
				anim_startBtn_block = true;
				anim_audioBtn_block = false;
				anim_letterBtn_block = false;
				$('#anim-startBtn').attr('opacity', '0.5');
				icon_startBtn.gotoAndStop(1);
				if (buttonAudioVisible) {
					sounds[questions[0].audio].play();
					isPlaying = true;
					icon_audioBtn.gotoAndStop(3);
				}
				
			}
		});

		$('#anim-startBtn').on(eOver, function(e) {
			e.preventDefault();
			if (!anim_startBtn_block)
				icon_startBtn.gotoAndStop(2);
		});

		$('#anim-startBtn').on(eOut, function(e) {
			e.preventDefault();
			icon_startBtn.gotoAndStop(1);
		});

		$('#anim-resetBtn').on(eDown, function(e) {
			e.preventDefault();
			if (!anim_resetBtn_block) {
				anim_startBtn_block = false;
				anim_audioBtn_block = true;
				anim_letterBtn_block = true;
				$('#anim-startBtn').attr('opacity', '1');
				if (buttonAudioVisible) {
					isPlaying = false;
					sounds[questions[0].audio].stop();
				}
				reset();
			}
		});

		$('#anim-resetBtn').on(eOver, function(e) {
			e.preventDefault();
			if (!anim_resetBtn_block)
				icon_resetBtn.gotoAndStop(2);
		});

		$('#anim-resetBtn').on(eOut, function(e) {
			e.preventDefault();
			icon_resetBtn.gotoAndStop(1);
		});

		$('#anim-audioBtn').on(eDown, function(e) {
			e.preventDefault();
			if (!anim_audioBtn_block && !isPlaying) {
				icon_audioBtn.gotoAndStop(3);
				isPlaying = true;
				sounds[questions[currentQuestion-1].audio].play();
			} else if (!anim_audioBtn_block && isPlaying) {
				isPlaying = false;
				sounds[questions[0].audio].stop()
				sounds[questions[currentQuestion-1].audio].stop();
				icon_audioBtn.gotoAndStop(1);
			}
		});

		$('#anim-audioBtn').on(eOver, function(e) {
			e.preventDefault();
			if (!anim_audioBtn_block)
				if (!isPlaying) icon_audioBtn.gotoAndStop(2);
		});

		$('#anim-audioBtn').on(eOut, function(e) {
			e.preventDefault();
			if (!isPlaying) icon_audioBtn.gotoAndStop(1);
		});

		$('#anim-allOK').on(eDown, function(e) {
			e.preventDefault();
			nextPress();
		});

		$('#anim-allOK').on(eOver, function(e) {
			e.preventDefault();
			icon_allOK.gotoAndStop(2);
		});

		$('#anim-allOK').on(eOut, function(e) {
			e.preventDefault();
			icon_allOK.gotoAndStop(1);
		});

		if (questions[currentQuestion].image.indexOf('.jpg') !== -1 || questions[currentQuestion].image.indexOf('.png') !== -1)
			imageAdd();
		
		showQuestion();
		updateProgress();
		anim_letterBtn_block = true;
		anim_audioBtn_block = true;
	}

	function imageAdd() {
		if (!imageAddCheck) {
			imageAddCheck = true;
			svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', questions[currentQuestion].image);
			svgimg.setAttributeNS(null,'x', posX);
			svgimg.setAttributeNS(null,'y', posY);
			svgimg.setAttributeNS(null,'width', width);
			svgimg.setAttributeNS(null,'height', height);
			svgimg.setAttributeNS(null,'display', 'inline');
			imageChange();
			$('#interactive-layer').append(svgimg);
		}
	}
	
	function imageChange() {
		svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', questions[currentQuestion].image);
		svgimg.setAttributeNS(null,'display', 'inline');
	}
	
	function nextPress(e) {
		allOKcheck = false;
		for (var i=0; i<abc.length; i++) 
			letters[i] = 0;
		if (questions[currentQuestion].image.indexOf('.jpg') !== -1 || questions[currentQuestion].image.indexOf('.png') !== -1) {
			imageAdd();
			imageChange();
		} else if (imageAddCheck) {
			svgimg.setAttributeNS(null,'display', 'none');
		}
			
		if (colorSpots == "on") 
			icon_colorSpots.gotoAndStop(currentQuestion+1);
		
		if (gfxEngine == "apple") {
			$('#apple_0').attr('display', 'inline');
			for (var i=1; i<10; i++) 
				$('#apple_'+i).attr('display', 'none');
		} if (gfxEngine == "tree") {
			for (var i=0; i<10; i++) 
				$('#apple_0'+i).fadeIn(0);
		} else if (gfxEngine == "castle") {
			$('#castle_0').attr('display', 'inline');
			for (var i=1; i<10; i++) 
				$('#castle_'+i).attr('display', 'none');
		} else {
			for (var i=0; i<10; i++) 
				$('#stack_'+i).fadeIn(0);
			$('#stack').attr('transform', 'translate(0 0)');
		}
		
		showButtons(true);
		currentChance = 0;
		$('#allOK0').attr('display', 'none');
		$('#anim-allOK').attr('display', 'none');
		$('#allOK').css('z-index', '1');
		showQuestion();
		if (buttonAudioVisible) {
			icon_audioBtn.gotoAndStop(3);
			isPlaying = true;
			sounds[questions[currentQuestion-1].audio].play();
		}
	}
	
	function showButtons(b) {
		temp = 'none';
		if (b) 
			temp = 'inline';
		for(var i=0; i<abc.length; i++) 
			$('#anim-letters'+i).attr('display', temp);
	}
	
	function letterPress(ID) {
		var ok = false;
		
		for(var i=0; i<questionObj.missing0.length; i++) {
			if (abc[ID] == questionObj.missing0[i].toLowerCase()) {
				questionObj.quest[questionObj.missing1[i]] = abc[ID];
				var temp0 = $('#question0')[0].textContent;
				var temp1 = $('#question1')[0].textContent;
				var temp2 = $('#question2')[0].textContent;
				if (temp0.length > questionObj.missing1[i]) {
					temp0 = temp0.slice(0,questionObj.missing1[i]) + abc[ID] + temp0.slice(questionObj.missing1[i] + 1, temp0.length);
					$('#question0')[0].textContent = temp0;
				} else if (temp0.length + temp1.length > questionObj.missing1[i]) {
					temp1 = temp1.slice(0,questionObj.missing1[i] - temp0.length) + abc[ID] + temp1.slice(questionObj.missing1[i] + 1 - temp0.length, temp1.length);
					$('#question1')[0].textContent = temp1;
				} else {
					temp2 = temp2.slice(0,questionObj.missing1[i] - (temp0.length + temp1.length)) + abc[ID] + temp2.slice(questionObj.missing1[i] + 1 - (temp0.length + temp1.length), temp2.length);
					$('#question2')[0].textContent = temp2;
				}
				questionObj.missing0.splice(i, 1);
				questionObj.missing1.splice(i, 1);
				i--;
				ok = true;
			}
		}

		$('#anim-letters'+ID).attr('display', 'none');
		letters[ID] = 1;
		
		if (!questionObj.missing0.length) {
			showButtons(false);
			onAllOk();
		} else if (ok) {
			sounds['ok'].play();
		} else {
			sounds['wrong'].play();
			currentChance++;
			showFeedback();
			if (currentChance == maxChances) {
				showButtons(false);
				sortText();
				if (currentQuestion != questions.length) {
					$('#anim-allOK').attr('display', 'inline');
					$('#allOK').css('z-index', '10');
				}
			}
		}
		
	}

	function showFeedback() {
		if (gfxEngine == "apple") {
			for (var i=0; i<10; i++) 
				$('#apple_'+i).attr('display', 'none');
			$('#apple_'+currentChance).attr('display', 'inline');
		} if (gfxEngine == "tree") {
			$('#apple_0'+(currentChance-1)).fadeOut(250);
		} else if (gfxEngine == "castle") {
			for (var i=0; i<10; i++) 
				$('#castle_'+i).attr('display', 'none');
			$('#castle_'+currentChance).attr('display', 'inline');
		} else {
			$('#stack_'+(9-currentChance+1)).fadeOut(300, function () {
				var stackSnap = new Snap('#stack');
				if (currentChance != 10) 
					stackSnap.animate({transform: 't0,'+(currentChance*30)+' s1'}, 150);
			});
		}
	}
	
	function reShowFeedback() {
		if (gfxEngine == "apple") {
			for (var i=0; i<10; i++) 
				$('#apple_'+i).attr('display', 'none');
			$('#apple_'+currentChance).attr('display', 'inline');
		} if (gfxEngine == "tree") {
			for (var i=1; i<currentChance+1; i++) 
				$('#apple_0'+(i-1)).fadeOut(0);
		} else if (gfxEngine == "castle") {
			for (var i=0; i<10; i++) 
				$('#castle_'+i).attr('display', 'none');
			$('#castle_'+currentChance).attr('display', 'inline');
		} else {
			for (var i=1; i<currentChance+1; i++) 
				$('#stack_'+(9-i+1)).fadeOut(0);
			var stackSnap = new Snap('#stack');
			if (currentChance != 10) 
				stackSnap.animate({transform: 't0,'+(currentChance*30)+' s1'}, 0);
		}
	}
	
	function sortText() {
		currentID = 0;
		$('#question0')[0].textContent = '';
		$('#question1')[0].textContent = '';
		$('#question2')[0].textContent = '';
		for(var i=0; i<questionObj.answer.length; i++) {
			var txt = questionObj.answer.charAt(i);
			$('#question'+currentID)[0].textContent = $('#question'+currentID)[0].textContent + txt;
			if (txt == "\n") 
				currentID++;
		}
	}
	
	function onAllOk() {
		allOKcheck = true;
		$('#allOKtext')[0].textContent = allOkText;
		sounds['allOk'].play();
		done++;
		updateProgress();
		if (currentQuestion < questions.length) {
			$('#allOK0').attr('display', 'inline');
			$('#anim-allOK').attr('display', 'inline');
			$('#allOK').css('z-index', '10');
		} else {
			$('#allOK0').attr('display', 'inline');
		}
	}
	
	function showQuestion() {
		questionObj = questions[currentQuestion];
		questionObj.missing0 = [];
		questionObj.missing1 = [];
		var push = 0;
		currentID = 0;
		$('#question0')[0].textContent ='';
		$('#question1')[0].textContent ='';
		$('#question2')[0].textContent ='';
		
		for(var i=0; i<questionObj.quest.length; i++) {
			var txt = questionObj.quest.charAt(i);
			$('#question'+currentID)[0].textContent = $('#question'+currentID)[0].textContent + txt;

			if (txt == "_") {
				questionObj.missing0[push] = questionObj.answer.charAt(i);
				questionObj.missing1[push] = i;
				push++;
			}
			if(txt == "\n") {
				currentID++;
			}
		}

		setSpeaker();
		
		currentChance = 0;
		currentQuestion++;
		
		$('#questionCounter')[0].textContent = currentQuestion + " / " + questions.length;
		
		isPlaying = false;
	}

	function setSpeaker() {
		if (buttonAudioVisible) {
			var tBox = $("#question0")[0].getBBox();
			if (!tBox || !tBox.width) {
				setTimeout(setSpeaker, 10);
			} else {
				if (buttonAudioAfterLine == "last") {
					$('#audioBtn').css('left', (shiftX + 25 + $("#question"+currentID)[0].getBBox().width)/9.0+'%');
					$('#audioBtn').css('top', (10 + currentID * 30 + 65 + offsetYtexts) / 4.3 + '%');
				} else {
					$('#audioBtn').css('left', (shiftX + 25 + Math.max($("#question0")[0].getBBox().width, $("#question1")[0].getBBox().width, $("#question2")[0].getBBox().width))/9.0+'%');
					$('#audioBtn').css('top', (65 + offsetYtexts) / 4.3 + '%');
				}
			}
		}
	}
	
	function updateProgress() {
		if (done == 0) {
			$('#progress').attr('display', 'none');
		} else {
			$('#progress').attr('display', 'inline')
			$('#progress').attr('x2', String(Number($('#progress').attr('x1')) + Number(done * 95 / questions.length)));
		}
			
	}
	
    function reset() {
		allOKcheck = false;
		
		if (colorSpots == "on") 
			icon_colorSpots.gotoAndStop(1);

		done = 0;
		
		if (gfxEngine == "apple") {
			$('#apple_0').attr('display', 'inline');
			for (var i=1; i<10; i++) 
				$('#apple_'+i).attr('display', 'none');
		} if (gfxEngine == "tree") {
			for (var i=0; i<10; i++) 
				$('#apple_0'+i).fadeIn(100);
		} else if (gfxEngine == "castle") {
			$('#castle_0').attr('display', 'inline');
			for (var i=1; i<10; i++) 
				$('#castle_'+i).attr('display', 'none');
		} else {
			$('#stack').attr('transform', 'translate(0, 0)');
			for (var i=0; i<10; i++) 
				$('#stack_'+i).fadeIn(0);
		}
		
		currentQuestion = 0;
		currentChance = 0;
		updateProgress();
		
		if (questions[currentQuestion].image.indexOf('.jpg') !== -1 || questions[currentQuestion].image.indexOf('.png') !== -1) {
			imageAdd();
			imageChange();
		} else {
			svgimg.setAttributeNS(null,'display', 'none');
		}

		for (var i = 0; i < manifest.length; i++) 
			if (manifest[i].src.indexOf('.mp3') !== -1) 
				sounds[manifest[i].id].stop();
		
		if (buttonAudioVisible) {
			isPlaying = false;
			icon_audioBtn.gotoAndStop(1);
		}
		
		$('#allOK0').attr('display', 'none');
		$('#anim-allOK').attr('display', 'none');
		$('#allOK').css('z-index', '1');
		
		showButtons(true);
		showQuestion();
	};

    p.reset = function () {
		//reset();
	};

    p.loadState = function (obj) {
		currentSound = obj.currentSound;
		currentSoundCard = obj.currentSoundCard;
		done = obj.done;
		currentQuestion = obj.currentQuestion;
		currentChance = obj.currentChance;
		questionObj = obj.questionObj;
		isPlaying = false;
		counter = obj.counter;
		anim_resetBtn_block = obj.anim_resetBtn_block;
		anim_startBtn_block = obj.anim_startBtn_block;
		anim_letterBtn_block = obj.anim_letterBtn_block;
		anim_audioBtn_block = obj.anim_audioBtn_block;
		imageAddCheck = obj.imageAddCheck;
		currentID = obj.currentID;
		letters = obj.letters;
		allOKcheck = obj.allOKcheck;
		
		for (var i=0; i<abc.length; i++) {
			if (letters[i] == 1) 
				$('#anim-letters'+i).attr('display', 'none');
		}
		
		$('#question0')[0].textContent = obj.q0;
		$('#question1')[0].textContent = obj.q1;
		$('#question2')[0].textContent = obj.q2;
		
		$('#questionCounter')[0].textContent = currentQuestion + " / " + questions.length;
		
		setSpeaker();
		updateProgress();

		if (anim_startBtn_block) {
			$('#anim-startBtn').attr('opacity', '0.5');
		}
		
		if (allOKcheck) {
			showButtons(false);
			$('#allOKtext')[0].textContent = allOkText;
			if (currentQuestion < questions.length) {
				$('#allOK0').attr('display', 'inline');
				$('#anim-allOK').attr('display', 'inline');
				$('#allOK').css('z-index', '10');
			} else {
				$('#allOK0').attr('display', 'inline');
			}
		}
		
		if (currentChance == maxChances) {
			showButtons(false);
			sortText();
			if (currentQuestion != questions.length) {
				$('#anim-allOK').attr('display', 'inline');
				$('#allOK').css('z-index', '10');
			}
		}

		reShowFeedback();

    };

    p.saveState = function () {
		if (buttonAudioVisible) {
			isPlaying = false;
			icon_audioBtn.gotoAndStop(1);
		}

        var obj = {
			q0: $('#question0')[0].textContent,
			q1: $('#question1')[0].textContent,
			q2: $('#question2')[0].textContent,
			currentSound: currentSound,
			currentSoundCard: currentSoundCard,
			done: done,
			currentQuestion: currentQuestion,
			currentChance: currentChance,
			questionObj: questionObj,
			counter: counter,
			anim_resetBtn_block: anim_resetBtn_block,
			anim_startBtn_block: anim_startBtn_block,
			anim_letterBtn_block: anim_letterBtn_block,
			anim_audioBtn_block: anim_audioBtn_block,
			imageAddCheck: imageAddCheck,
			currentID: currentID,
			letters: letters,
			allOKcheck: allOKcheck
		};
        return obj;
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);