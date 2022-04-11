(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				if (manifest[i].id === 'allOk') {
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
			//console.log('end', cardsOpened, checked);
			currentSound = null;
            if (currentSoundCard) {
                setCardAudioButton('off');
            }
            if (cardsOpened === 2) {
                checkCards();
            }
        }
	}
	var pauseCallback = {
		onPause: function () {
			//console.log('pause', cardsOpened, checked);
			if (innerSound) {
				innerSound = false;
				return;
			}
			currentSound = null;
            if (currentSoundCard) {
                setCardAudioButton('off');
            }
            if (cardsOpened === 2) {
                checkCards();
            }
        }
	}
	var sounds = {};
	var currentSound,currentSoundCard, innerSound;
	var pairSets = { 2:"2x2", 3:"3x2", 4:"4x2", 5:"5x2", 6:"4x3", 7:"5x3", 8:"6x3", 9:"6x3" };
	var XMax,YMax,XShift,YShift;
	var allElemContent,elems;
	var cards = {};
    var cardsAllOk = {};
	var pressedCards = [];
	var cardsOpened = 0;
    var checkDelay, feedDelay, soundDelay;
    var feedbackSoundsNeedToFire = true;
	var outputArray, done, todo, checked, stateObject;
    
	function init() {
		
		done = 0;
		todo = pairsNum;
		stateObject = null;
		
		$('#resetBtn').on(eDown, function(e) {
			e.preventDefault();
			resetPress();
		});
		if (!touchDevice) {
			$('#resetBtn').addClass('non-mobile');
		}
		$('#allOkBg').find('span').html(allOkText);
		XMax = Number(pairSets[pairsNum].split("x")[0]);
		YMax = Number(pairSets[pairsNum].split("x")[1]);
		
		for(var i=XMax;i<6;i++) {
			$('.card[id*=-'+i+']').hide();
		}
		if (YMax < 3) {
			$('#crow2').hide();
		}
		
		var diff = (XMax*YMax) - (pairsNum*2);
		if (diff) {
			for(var i=XMax-1;i>0;i--) {
				$('#card' + (YMax-1) + '-' + i).hide();
				diff--;
				if (!diff) break;
			}
		}
		
		XShift = Math.round((930 - (XMax * 133) - ((XMax - 1) * spaceBetweenElems)) / 2);
		YShift = Math.round((430 - (YMax * 133) - ((YMax - 1) * spaceBetweenElems)) / 2);
		if (XMax == 6) {
			XShift = 20;
		}
		if (YMax == 3) {
			YShift = 5;
		}
		
		var cW = (XMax * 133) + ((XMax - 1) * spaceBetweenElems);
		var cH = (YMax * 133) + ((YMax - 1) * spaceBetweenElems);
		
		$('#crow1').css('top', (133+spaceBetweenElems)+'px');
		if (YMax === 3) {
			$('#crow2').css('top', ((133+spaceBetweenElems)*2)+'px');
		}
		$('.card').css('margin-right', spaceBetweenElems+'px');
		$('.card[id*=-'+(XMax-1)+']').css('margin-right', 0);
		$('.card-container').css({
			'width': cW + 'px',
			'height': cH + 'px',
			'left': XShift + 'px',
			'top': YShift + 'px'
		});
		$('#resetBtn').css({
			'left': (XShift + cW + 18) + 'px',
			'top': (YShift - 2) + 'px'
		});

		elems = $('.card:visible');
		allElemContent = [];
		for (var i=0;i<pairsNum;i++) {
			var obj = content[i];
			allElemContent.push( {id:obj.id, elemContent:obj.elem0, color:0} );
			allElemContent.push( {id:obj.id, elemContent:obj.elem1, color:1} );
		}
		
		elems.on(eDown, function(e) {
			e.preventDefault();
			var card = $(this);
			if (!touchDevice) {
				var cardID = card.attr('id');
				var cardObj = cards[cardID];
				$(this).find('.front').attr('class', 'front card' + cardObj.ID);
			}
			if (feedbackSoundsNeedToFire) {
				sounds.allOk.play();
				sounds.allOk.stop();
				feedbackSoundsNeedToFire = false;
				showCard(card);
			} else {
				showCard(card);
			}
		});
		
		if (!touchDevice) {
			elems.on('mouseover', function(e) {
				e.preventDefault();
				var cardID = $(this).attr('id');
				var cardObj = cards[cardID];
				if (cardObj.state === 'folded') {
					$(this).find('.front').attr('class', 'front card-over');
				}
			}).on('mouseout', function(e) {
				e.preventDefault();
				var cardID = $(this).attr('id');
				var cardObj = cards[cardID];
				if (cardObj.state === 'folded') {
					$(this).find('.front').attr('class', 'front card' + cardObj.ID);
				}
			});
		}
		
		shuffleCards();
	}
	
	function shuffleCards() {		
		var temp = allElemContent.slice();
		var randomIndexValue;
		outputArray = [];

		for (var i=0;i<allElemContent.length;i++) {
			randomIndexValue = Math.round(Math.random() * (temp.length - 1));
			outputArray[i] = temp[randomIndexValue];
			temp.splice(randomIndexValue, 1);
		}
		
		for(var j=0;j<outputArray.length;j++) {
			var elem = $(elems.get(j));
			var obj = outputArray[j];
			var contentStr;
			elem.find('.front').attr('class', 'front card' + obj.color);
			elem.attr({
				'data-ID': obj.id,
				'data-done': false,
				'data-sound': obj.elemContent.sound
			});
			
			var cardID = elem.attr('id');
			var cardObj = {
				pairID: obj.id,
				ID: obj.color,
				state: 'folded'
			};
			cards[cardID] = cardObj;
			cardObj.txt = (obj.elemContent.text === '') ? null : obj.elemContent.text;
			cardObj.img = (obj.elemContent.image === '') ? null : _.find(manifest, function (item) {
				return (item.id === obj.elemContent.image);
			});
			cardObj.snd = (obj.elemContent.sound === '') ? null : _.find(manifest, function (item) {
				return (item.id === obj.elemContent.sound);
			});
			
			elem.find('.front').show();
			var holder = elem.find('.holder');
            holder.css('opacity', '1').css('transform', '').attr('transform', '').hide();
			holder.empty();
			
			if (obj.elemContent.text != "") {
				contentStr = '<span class="holder-element">' + convertBreakLines(obj.elemContent.text) + '</span>';
			} else if (obj.elemContent.image != "") {
				contentStr = '<img class="holder-img" src="' + cardObj.img.src + '"/>';
			} else {
				contentStr = '<img class="card-snd-icon" src="images/audio_1.png"/>';
			}
			holder.append(contentStr);
			holder.append('<div class="holder-frame"></div>');
		}
	}
	
	function showCard(card) {
		var cardID = card.attr('id');
		var cardObj;
        if (todo === done) {
            cardObj = cardsAllOk[cardID];
            if (cardObj.snd) {
                playSoundCard(card, cardObj);
            }
        } else {
            if (pressedCards.length < 2) {
                cardObj = cards[cardID];
                if (cardObj.state === 'folded') {
                    cardObj.state = 'opened';
                    pressedCards.push(cardID);
                    if (cardObj.snd) {
                        playSoundCard(card, cardObj);
                    } else {
						card.addClass('readonly');
					}
					animateCard(card, cardID, 'show');
                } else if (cardObj.state === 'opened' && cardObj.snd) { 
					playSoundCard(card, cardObj);
				}
				if (cardsOpened === 2) {
					checked = false;
				}
            }
        }
	}
	
	function animateCard(card, cardID, type) {
		var cardObj = cards[cardID];
		if (type === 'show') {
			cardsOpened++;
			card.find('.holder').show();
			card.find('.front').hide();
			if (pressedCards.length === 2) {
				if (!currentSound && cardsOpened === 2) {
					checkDelay = setTimeout(function () {
						if (!checked) {
							checkCards();
						}
					}, 750);
				}
			}
		} else if (type === 'hide') {
			card.find('.holder').hide();
			card.find('.front').show();
			pressedCards.pop();
            cardObj.state = 'folded';
            card.removeClass('readonly');
            cardsOpened--;
		}
	}
	
	function checkCards(afterPageReload) {
		if (checked) return;
		checked = true;
		clearTimeout(checkDelay);
        var card0Obj = cards[pressedCards[0]];
        var card1Obj = cards[pressedCards[1]];
        if (card0Obj.pairID === card1Obj.pairID) {
			if (!afterPageReload)
				done++;
            if(done === todo) {
				playFeedback('allok');
			} else {
				playFeedback('ok');
			}
        } else {
            playFeedback('wrong');
        }
    }

    function playFeedback(type) {
		var id0 = pressedCards[0];
		var id1 = pressedCards[1];
        var card0 = $('#' + id0);
        var card1 = $('#' + id1);
        if (type !== 'wrong') {
            if (type === 'allok') {
				$('#allOkBg').css('display', 'table');
                sounds.allOk.play();
            }
            animateCardOnOk(card0, id0);
            animateCardOnOk(card1, id1);
        } else {
            animateCard(card0, id0, 'hide');
            animateCard(card1, id1, 'hide');
        }
    }
	
	function animateCardOnOk(card, cardID) {
        var cardObj = cards[cardID];
        card.find('.holder').velocity({
            scaleX: '0%',
            scaleY: '0%',
            opacity: '0',
            rotateZ: '90deg'
        }, {
            duration: 850,
            easing: 'easeOut',
            complete: function () {
                cardObj.state = 'answered';
                pressedCards.pop();
                cardsOpened--;
                if (done === todo && !cardsOpened) {
                    feebackOnAllOk(true);
                }
            }
        });
    }
	
	function feebackOnAllOk(animateCards) {
        var arr = getIDs();
        for (var i = 0; i < content.length; i++) {
            var match = _.matcher({pairID: i});
            var arr2 = _.filter(cards, match);
            arr2 = _.sortBy(arr2, 'ID');
            for (var j = 0; j < 2; j++) {
                var cardID = arr.shift();
                var card = $('#' + cardID);
                var holder = card.find('.holder');
				var contentStr;
				holder.empty();
				card.find('.front').hide();
				
                cardsAllOk[cardID] = arr2[j];

				if (cardsAllOk[cardID].txt) {
					contentStr = '<span class="holder-element">' + convertBreakLines(cardsAllOk[cardID].txt) + '</span>';
				} else if (cardsAllOk[cardID].img) {
					contentStr = '<img class="holder-img" src="' + cardsAllOk[cardID].img.src + '"/>';
				} else {
					contentStr = '<img class="card-snd-icon" src="images/audio_1.png"/>';
				}
				holder.append(contentStr);
				holder.append('<div class="holder-frame"></div>');
				holder.show();
				
                if (cardsAllOk[cardID].snd) {
                    if (card.hasClass('readonly')) {
                        card.removeClass('readonly');
                    }
                } else if (!card.hasClass('readonly')) {
                    card.addClass('readonly');
                }
                if (animateCards) {
                    animateCardsOnAllOk(cardID);
                } else {
                    holder.css('scaleX', '100%').css('scaleY', '100%').css('opacity', '1');
                    holder.css('transform', '').attr('transform', '');
                }
            }
        }
		if (animateCards) {
			setTimeout(function() {
				$('#allOkBg').hide();
			}, 2000);
		}
    }

    function animateCardsOnAllOk(cardID, i) {
        var card = $('#' + cardID);
        card.find('.holder').velocity({
            scaleX: '100%',
            scaleY: '100%',
            opacity: '1',
            rotateZ: '0deg'
        }, {
            delay: 200 * i,
            duration: 750,
            easing: 'easeOut'
        });
    }
	
	function playSoundCard(card, cardObj) {		
		clearTimeout(soundDelay);
        if (currentSound) {
			if (currentSoundCard && currentSoundCard.attr('id') !== card.attr('id')) {
				setCardAudioButton('off');
			}
			innerSound = true;
			currentSound.stop();
			currentSound = null;
        }
        if (!cardObj.img) {
			if (!currentSoundCard || currentSoundCard.attr('id') !== card.attr('id')) {
				currentSoundCard = card;
				setCardAudioButton('on');
			} else {
				if (currentSoundCard && currentSoundCard.attr('id') === card.attr('id')) {
					setCardAudioButton('off');
				}
				return;
			}
        }
        currentSound = sounds[cardObj.snd.id];
        currentSound.play();
    }

    function setCardAudioButton(state) {
		if (state === 'on') {
			$(currentSoundCard).find('.card-snd-icon').attr('src', 'images/audio_klik.png');
		} else {
			if (currentSoundCard) {
				$(currentSoundCard).find('.card-snd-icon').attr('src', 'images/audio_1.png');
				currentSoundCard = null;
			}
		}
    }
	
	function getIDs() {
		var arr = [];
		for(var i=0;i<elems.length;i++) {
			arr.push( $(elems.get(i)).attr('id') );
		}
		return arr;
	}
	
	function convertBreakLines(s) {
		if (s.indexOf('\n') > 1) {
			s = s.split('\n').join('<br/>');
		}
		return s
	}
	
	function resetPress() {
		if (currentSound) {
            currentSound.stop();
            currentSound = null;
        }
		sounds.allOk.stop();
        $('.readonly').removeClass('readonly');
        $('#allOkBg').hide();
        $('.holder').velocity('stop').removeData();
        cardsOpened = 0;
        done = 0;
        checked = false;
        pressedCards = [];
        clearTimeout(checkDelay);
        clearTimeout(feedDelay);
		clearTimeout(soundDelay);
        shuffleCards();
	}
	
	 function restoreCards() {
        cardsOpened = 0;
        done = stateObject.done;
        pressedCards = stateObject.pressedCards;
        cards = stateObject.cards;
        outputArray = stateObject.outputArray;

        if (done === todo) {
            feebackOnAllOk(false);
        } else {
            for (var i=0;i<outputArray.length;i++) {
				var elem = $(elems.get(i));
				var obj = outputArray[i];
				var holder = elem.find('.holder');
				var front = elem.find('.front');
				
				if (!obj)
					continue;
				
				elem.find('.front').attr('class', 'front card' + obj.color);
				elem.attr({
					'data-ID': obj.id,
					'data-done': false,
					'data-sound': obj.elemContent.sound
				});
				
				var cardID = elem.attr('id');
				cardObj = cards[cardID];
				
				var contentStr;
				holder.empty();
				if (cardObj.txt) {
					contentStr = '<span class="holder-element">' + convertBreakLines(cardObj.txt) + '</span>';
				} else if (cardObj.img) {
					contentStr = '<img class="holder-img" src="' + cardObj.img.src + '"/>';
				} else {
					contentStr = '<img class="card-snd-icon" src="images/audio_1.png"/>';
				}
				holder.append(contentStr);
				holder.append('<div class="holder-frame"></div>');

				if (cardObj.state === 'folded') {
					front.attr('class', 'front card' + cardObj.ID);
				} else if (cardObj.state === 'opened') {
					cardsOpened++;
					holder.show();
					front.hide();
					elem.addClass('readonly');
				} else if (cardObj.state === 'answered') {
					holder.css('scaleX', '0%').css('scaleX', '0%').css('opacity', '0');
					holder.css('transform', 'rotateZ(90deg)').attr('transform', 'rotateZ(90deg)');
					holder.show();
					front.hide();
				}
            }

            if (cardsOpened === 2 || pressedCards.length === 2) {
                checkCards(true);
            }
        }
        stateObject = null;
    }
	
    p.reset = function () {
        
    };

    p.loadState = function (obj) {
        stateObject = obj;
        restoreCards();
    };

    p.saveState = function () {
        if (currentSound) {
            currentSound.stop();
            currentSound = null;
        }
		sounds.allOk.stop();
        $('.holder').velocity('stop').removeData();
        clearTimeout(checkDelay);
        clearTimeout(feedDelay);
		clearTimeout(soundDelay);
		
        if (stateObject === null) {
            stateObject = {
                done: done,
                pressedCards: pressedCards,
                cards: cards,
				outputArray: outputArray
            };
        }
        return stateObject;
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);