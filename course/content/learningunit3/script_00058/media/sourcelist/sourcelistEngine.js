//namespace
window.sourcelist = window.sourcelist||{};

(function(wnd){
	
	//constructor
	var Engine = function(resource, stage){
		if(ydpjs == null && wnd.sourcelist.ydpjs != undefined){
			ydpjs = wnd.sourcelist.ydpjs;
		}
		
		this.lib = wnd.sourcelist;
		this.initialize(resource, stage);
	}
	
	var p = Engine.prototype;
	
	//ydpjs lib namespace
	var ydpjs = null;
	
	p.stage = null;
	
	//Representative of fla file
	p.resource = null;
	
	//fla graphic library object
	p.lib = null;
	
	p.initialize = function(resource, stage){
		this.resource = resource;
		this.stage = stage;
		this.stage.enableMouseOver();
		Touch.enable(this.stage)
		
		
		
		// --- SETUP ---
		
		this.maxSlides = 1; // 1-5
		
		this.sourceListPos = { x:608, y:150, spaceBetweenItems:10 };
		
		this.audioButtonVisible = true;
		
		this.slide01 = [{txt:"'OK,' says the cow.\n'Let’s play basketball now.'", draggable:true, disruptor:false, bubble:{ x:235, y:70, w:290, h:71, color:"#5FC2ED", arrowPos:"left,down" }},
						{txt:"What a silly story!\nI like it. It’s funny.", draggable:true, disruptor:false, bubble:{ x:175, y:285, w:290, h:71, color:"#B1D621", arrowPos:"right,up" }}];
						
	
		// --- SETUP END ---
		
		
		
		this.currentSlide = 1;
		this.bubbles = [];
		this.texts = [];
		this.visited = [];
		this.savedPos = [];
		this.isPlaying = false;
		
		var tf = new Text("1/" + this.maxSlides, "22px Trebuchet MS", "#000");
		tf.textAlign = "center";
		tf.x = 85;
		tf.y = 32
		this.resource.switcher.addChild(tf);
		this.resource.switcher.tf = tf;
		
		this.resource.switcher.next.onPress = Delegate.create(this, this.changeSlide, 1);
		this.resource.switcher.next.onMouseOver = Delegate.create(this, this.onBtnOver);
		this.resource.switcher.next.onMouseOut = Delegate.create(this, this.onBtnOut);
		
		this.resource.switcher.prev.onPress = Delegate.create(this, this.changeSlide, -1);
		this.resource.switcher.prev.onMouseOver = Delegate.create(this, this.onBtnOver);
		this.resource.switcher.prev.onMouseOut = Delegate.create(this, this.onBtnOut);
		
		this.resource.resetBtn.onPress = Delegate.create(this, this.reset);
		this.resource.resetBtn.onMouseOver = Delegate.create(this, this.onBtnOver);
		this.resource.resetBtn.onMouseOut = Delegate.create(this, this.onBtnOut);
		
		this.resource.audioBtn.visible = this.audioButtonVisible;
		this.resource.instance_1.visible = this.audioButtonVisible; 
		
		if (this.audioButtonVisible) {
			this.resource.audioBtn.onPress = Delegate.create(this, this.playAudio);
			this.resource.audioBtn.onMouseOver = Delegate.create(this, this.onBtnOver);
			this.resource.audioBtn.onMouseOut = Delegate.create(this, this.onBtnOut);
		} else {
			this.resource.switcher.x = this.resource.switcher.x - 95;
			this.resource.switcher.shape.visible = false;
			this.resource.switcher.shape_1.visible = false;
		}
		
		if (this.maxSlides == 1)
			this.resource.switcher.visible = false;
		
		this.showSlide();
	}
	
	p.showSlide = function() {
		
		//clear all
		
		if (this.resource.imgHolder.getNumChildren() > 1)
			this.resource.imgHolder.removeChildAt(1);
			
		for(var i=0;i<this.bubbles.length;i++){	
			this.resource.removeChild(this.bubbles[i]);
		}
		for(var i=0;i<this.texts.length;i++){	
			this.resource.removeChild(this.texts[i]);
		}
		this.bubbles = [];
		this.texts = [];
			
		// new image
		
		var img = new Bitmap(window.images.sourcelist["image0" + this.currentSlide]);
		this.resource.imgHolder.addChild(img);
		
		var arr = this["slide0" + this.currentSlide];
		var lastDraggableYPos = this.sourceListPos.y;
		
		for(var i=0;i<arr.length;i++) {
			
			// bubbles
			
			if (!arr[i].disruptor) {
				var obj = arr[i].bubble;
				var bubble = new MovieClip();
				
				var g = new Graphics();
				if (arr[i].draggable) {
					g.setStrokeStyle(2);
					g.beginStroke(obj.color);
				}
				g.beginFill(arr[i].draggable ? "#FFFFFF" : obj.color);
				g.drawRoundRect(0,0,obj.w,obj.h,8);
				g.endFill();
				if (arr[i].draggable) {
					g.endStroke();
				}
				var sh = new Shape(g);
				bubble.addChild(sh);
				
				g = new Graphics();
				g.beginFill(obj.color);
				g.moveTo(0,51.5);
				g.lineTo(26.4,22.9);
				g.lineTo(29.3,3.3);
				g.lineTo(16.85,0);
				g.lineTo(17.85,20.6);
				g.lineTo(0,51.5);
				g.endFill();
				
				if (obj.arrowPos && obj.arrowPos != "") {
					var arrow = new Shape(g);
					arrow.x = (obj.arrowPos.indexOf("left") != -1) ? 30 : obj.w - 30;
					arrow.y = (obj.arrowPos.indexOf("down") != -1) ? obj.h - 12 : 12;
					if (obj.arrowPos.indexOf("down") == -1)
						arrow.scaleY = -1;
					if (obj.arrowPos.indexOf("left") == -1)
						arrow.scaleX = -1;
									
					bubble.addChildAt(arrow, 0);
				}
				
				bubble.w = obj.w;
				bubble.h = obj.h;
				bubble.regX = Math.round(bubble.w / 2);
				bubble.regY = Math.round(bubble.h / 2);
				bubble.x = obj.x + bubble.regX;
				bubble.y = obj.y + bubble.regY;
					
				this.resource.addChild(bubble);
				this.bubbles.push(bubble);
			}
			
			//texts
			
			var el = new MovieClip();
			el.draggable = arr[i].draggable;
			el.isDisruptor = arr[i].disruptor;
			if (!el.isDisruptor)
				el.ID = this.bubbles.length - 1;
				
			var txt = arr[i].txt;
			var tf;
			var tfWidth = 0;
			var tfHeight = 0;
			
			if (txt.indexOf("\n") != -1) {
				
				var tempArr = txt.split("\n");
				for(var j=0;j<tempArr.length;j++){
					tf = new Text(tempArr[j], "22px Trebuchet MS", "#000");
					tf.textAlign = "left";
					tf.y = 18 + (j * 22);
					el.addChild(tf);
					if (tfWidth < tf.getMeasuredWidth())
						tfWidth = tf.getMeasuredWidth();
				}
				tfHeight = tf.y + 2;
				
			} else {
				tf = new Text(txt, "22px Trebuchet MS", "#000");
				tf.textAlign = "left";
				tf.y = 18;
				tfWidth = tf.getMeasuredWidth();
				tfHeight = 20;
				el.addChild(tf);
			}
			
			el.w = tfWidth;
			el.h = tfHeight;
			el.regX = Math.round(tfWidth / 2);
			el.regY = Math.round(tfHeight / 2);

			this.resource.addChild(el);
			this.texts.push(el);
			
			if (el.draggable) {
				var bg = new Graphics();
				var sh = new Shape(bg);
				el.addChildAt(sh, 0);
				el.bg = bg;
				el.sh = sh;
				this.drawBg(el, "#EEEEEE");
				
				el.x = this.sourceListPos.x + el.regX;
				
				el.onPress = Delegate.create(this, this.startDragging);
				el.onMouseOver = Delegate.create(this, this.elOver);
				el.onMouseOut = Delegate.create(this, this.elOut);
				el.startX = el.x;
				//el.startY = el.y; - moved to shuffleSourceList	
				
				var bg2 = new Graphics();
				var sh2 = new Shape(bg2);
				el.addChildAt(sh2, 0);
				bg2.beginFill(Graphics.getRGB(255,255,255,0.01));
				bg2.drawRect(-22,-10,el.w+44,el.h+21);
				bg2.endFill();
							
			} else {
				el.x = bubble.x;
				el.y = bubble.y;
				bubble.notActive = true;
			}
		}
		
		if (this.visited[this.currentSlide]) {
			// load state
			var objSaved = this.savedPos[this.currentSlide];
			for(var i=0;i<this.texts.length;i++) {
				var el = this.texts[i];
				el.x = objSaved[i].x;
				el.y = objSaved[i].y;
				el.startX = objSaved[i].sX;
				el.startY = objSaved[i].sY;
				if (el.draggable && (el.x != el.startX)) {
					el.sh.visible = false;
				}
			}
		} else {
			this.shuffleSourceList();
		}
	}
	
	p.drawBg = function(el, col) {
		el.bg.clear();
		el.bg.beginFill(Graphics.getRGB(0,0,0,0.4));
		el.bg.drawRect(-20,-8,el.w+44,el.h+21);
		el.bg.beginFill(col);
		el.bg.drawRect(-22,-10,el.w+44,el.h+21);
		el.bg.endFill();
	}
	
	p.elOver = function(e) {
		var el = e.target;
		this.drawBg(el, "#FFCC00");
	}
	
	p.elOut = function(e) {
		var el = e.target;
		this.drawBg(el, "#EEEEEE");
	}
	
	p.shuffleSourceList = function() {
		var lastDraggableYPos = this.sourceListPos.y;
		
		var temp = this.texts.slice();
		var randomIndexValue;
		var outputArray = [];

		for (var i = 0; i < this.texts.length; i++) {
			randomIndexValue = Math.round(Math.random() * (temp.length - 1));
			outputArray[i] = temp[randomIndexValue];
			temp.splice(randomIndexValue, 1);
		}
		
		for(var i=0;i<outputArray.length;i++) {
			var el = outputArray[i];
			if (el.draggable) {
				el.y = lastDraggableYPos + el.regY;
				el.startY = el.y;
				lastDraggableYPos = el.y + el.regY + 21 + this.sourceListPos.spaceBetweenItems;
			}
		}
	}
	
	p.changeSlide = function(e, num) {
		if (this.currentSlide + num >= 1 && this.currentSlide + num <= this.maxSlides) {
			
			this.savedPos[this.currentSlide] = [];
			
			// save state
			for(var i=0;i<this.texts.length;i++) {
				var el = this.texts[i];
				this.savedPos[this.currentSlide][i] = {x:el.x, y:el.y, sX:el.startX, sY:el.startY};
			}
			this.visited[this.currentSlide] = true;
			
			this.currentSlide = this.currentSlide + num;
			this.resource.switcher.tf.text = this.currentSlide + "/" + this.maxSlides;
			
			this.resource.audioBtn.gotoAndStop(0);
			this.resource.audioBtn.bg.gotoAndStop(0);
			this.isPlaying = false;
			SoundJS.stop();
			
			this.showSlide();
		}
	}
	
	p.startDragging = function(e) {
		
		var el = e.target;
		
		this.resource.addChild(el);
		
		el.sX = el.x;
		el.sY = el.y;
		
		var st = this.stage;
		var th = this;
		
		var mouseStartX = st.mouseX;
		var mouseStartY = st.mouseY;
		
		e.onMouseMove = function(evt) {
			el.x = el.sX + (st.mouseX - mouseStartX);
			el.y = el.sY + (st.mouseY - mouseStartY);
			
			for(var i=0;i<th.bubbles.length;i++) {
				var bubble = th.bubbles[i];
				hitBubble = ( (Math.abs(el.x - bubble.x) < (bubble.w / 2)) && (Math.abs(el.y - bubble.y) < (bubble.h / 2)) );
				if (hitBubble && !bubble.notActive) {
					el.sh.visible = false;
					break;
				} else if (i==th.bubbles.length-1) {
					th.drawBg(el, "#FFCC00");
					el.sh.visible = true;
				}
			}
		}
		
		e.onMouseUp = function(evt) {
			th.stopDragging(this);
			delete this.onMouseUp;
			delete this.onMouseMove;
		}
	}
	
	p.stopDragging = function(e) {
		
		var el = e.target;
		var bubble;
		var hitBubble = false;
		
		if (!el.isDisruptor) {
			bubble = this.bubbles[el.ID];
			hitBubble = ( (Math.abs(el.x - bubble.x) < (bubble.w / 2)) && (Math.abs(el.y - bubble.y) < (bubble.h / 2)) );
		}

		if (!hitBubble) {
			el.x = el.startX;
			el.y = el.startY;
			this.drawBg(el, "#EEEEEE");
			el.sh.visible = true;
		} else {
			el.x = bubble.x;
			el.y = bubble.y;
			this.drawBg(el, "#EEEEEE");
			el.sh.visible = false;
		}
	}
	
	p.reset = function(e) {
		for(var i=0;i<this.texts.length;i++){
			var el = this.texts[i];
			if (el.draggable) {
				el.x = el.startX;
				el.y = el.startY;
				el.sh.visible = true;
				this.drawBg(el, "#EEEEEE");
			}
		}
		this.shuffleSourceList();
		this.visited[this.currentSlide] = false;
		this.savedPos[this.currentSlide] = [];
		
		this.resource.audioBtn.gotoAndStop(0);
		this.resource.audioBtn.bg.gotoAndStop(0);
		this.isPlaying = false;
		SoundJS.stop();
	}
	
	p.playAudio = function(e) {
		if (!this.isPlaying) {
			this.resource.audioBtn.gotoAndStop(1);
			this.isPlaying = true;
			
			var instance = SoundJS.play("snd0" + this.currentSlide, SoundJS.INTERRUPT_EARLY, 0, 0, 0);
			instance.onComplete = Delegate.create(this, this.onAudioEnd);
			
			//playSound("snd0" + this.currentSlide, 0);
		} else {
			this.resource.audioBtn.gotoAndStop(0);
			this.isPlaying = false;
			SoundJS.stop();
		}
	}
	
	p.onAudioEnd = function(e) {
		this.isPlaying = false;
		this.resource.audioBtn.gotoAndStop(0);
		this.resource.audioBtn.bg.gotoAndStop(0);
	}
	
	p.onBtnOver = function(e) {
		e.target.bg.gotoAndStop(5);
	}
	
	p.onBtnOut = function(e) {
		
		if (e.target == this.resource.audioBtn) {
			if (!this.isPlaying)
				this.resource.audioBtn.bg.gotoAndStop(1);
		} else {
			e.target.bg.gotoAndStop(1);
		}
	}
	
	/**
	 * Delegate util.
	*/
	Delegate = function(){}
	
	/**
	 * Delegates method call.
	 * @param thisTarget object which will be available as 'this' inside method
	 * @param functionRef reference to method that will be delegated
	 * @param args additional arguments which will be passed to delegated method
	 * @return reference to delegated method
	*/
	Delegate.create = function(thisTarget, functionRef, args){
		var delegateArgs = Array.prototype.slice.call(arguments);
		delegateArgs = delegateArgs.slice(2);
		
		return function(){
			var newArgs = Array.prototype.slice.call(arguments).concat(delegateArgs);
			functionRef.apply(thisTarget, newArgs);
		}
	}
	
	p.tick = function(){
		//Here place code which will execute in every frame		
		this.stage.update();
	}
	
	wnd.sourcelist.sourcelistEngine = Engine;
	
}(window));