(function (wnd) {
	
	// ImageAnimation version 1.0.1

    var ImageAnimation = function (elem, url) {
        var th = this;
        this.mc = $('#img-' + elem);

        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.overrideMimeType("application/json");
        req.send(null);
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                th.json = JSON.parse(req.responseText);
                th.init();
            }
        };
    };

    var p = ImageAnimation.prototype;

    p.json = null;
    p.mc = null;
    p.mode = 'loop';
    p.frames = null;
    p.currentFrame = null;
    p.totalFrames = null;
	p.ended = null;
	p.prev = null;
	p.onEnd = null;
	p.onReady = null;

    p.init = function() {
        this.frames = [];
        this.currentFrame = 1;
        for(var i in this.json.frames) {
			var obj = this.json.frames[i].frame;
            this.frames.push([obj.x, obj.y]);
        }
        this.totalFrames = this.frames.length;
		if (this.onReady !== null) {
			this.onReady();
		}
    };
	
	p.setMode = function(m) {
		this.mode = m;
	};

    p.nextFrame = function() {
        this.currentFrame++;
        if (this.currentFrame > this.totalFrames) {
			if (this.mode === 'playOnce') {
				if (!this.ended) {
					this.ended = true;
					if (this.onEnd !== null) {
						this.onEnd();
					}
				} else {
					return;
				}
			} else {
				if (this.onEnd !== null) {
					this.onEnd();
				}
			}
            this.currentFrame = (this.mode === 'loop') ? 1 : this.totalFrames;
        }
        this.gotoAndStop(this.currentFrame);
    };

    p.gotoAndStop = function(frame) {
        var arr = this.frames[frame - 1];
		if (this.prev) {
			if((arr[0] === this.prev[0]) && (arr[1] === this.prev[1])) {
				return;
			}
		}
        this.mc.attr('x', -arr[0]);
        this.mc.attr('y', -arr[1]);
		this.prev = [arr[0], arr[1]];
    };
	
	p.reset = function() {
		this.ended = false;
		this.currentFrame = 1;
		this.gotoAndStop(1);
	};

    wnd.ImageAnimation = ImageAnimation;

})(window);
