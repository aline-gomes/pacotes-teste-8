(function (wnd) {

	// Slider version 1.0.3

    var Slider = function (td, id, scrollLength, type, steps) {
		touchDevice = td;
        this.thumb = $(id);
		this.max = scrollLength;
		this.type = type;
		this.steps = steps;
		this.init();
    };

    var p = Slider.prototype;
	p.thumb = null;
	p.max = null;
	p.type = null;
	p.steps = null;
	p.step = null;
	p.pos = null;
	p.disabled = null;
	p.onChange = null;
	p.onChangeDrop = null;
	p.onlyOnMouseUp = null;
	
	var touchDevice = false;
	
	p.init = function() {
		var eDown = touchDevice ? 'touchstart' : 'mousedown';
		var eUp = touchDevice ? 'touchend' : 'mouseup';
		var eMove = touchDevice ? 'touchmove' : 'mousemove';
		
		this.pos = {cx:0, cy:0, sx:0, sy:0};
		
		if (this.steps !== null) {
			this.step = this.max / this.steps;
		}
		
		var th = this;
		
		this.thumb.on(eDown, function(e) {
			e.preventDefault();
			if (th.disabled) {
				return;
			}
			th.pos.x = (touchDevice) ? e.originalEvent.touches[0].pageX : e.pageX; 
			th.pos.y = (touchDevice) ? e.originalEvent.touches[0].pageY : e.pageY;
			
			$(document).on(eMove, function(e) {
				
				e.preventDefault();
				
				if (th.type === 'H') {
					var x = (touchDevice) ? e.originalEvent.touches[0].pageX : e.pageX;
					var tempX = th.pos.sx + ((x - th.pos.x) / resizeFactor);
					if (tempX < 0) {
						tempX = 0;
					}
					if (tempX > th.max) {
						tempX = th.max;
					}
					if (th.steps) {
						tempX = Math.round(tempX / th.step) * th.step;
					}
					
					if (tempX !== th.pos.cx) {
						th.pos.cx = tempX;
						th.thumb.attr('transform', 'translate(' + th.pos.cx + ', 0)');
						if (th.onChange !== null && !th.onlyOnMouseUp) {
							var val = th.getValue();
							th.onChange(val, 'move');
						}
					}
				} else {
					var y = (touchDevice) ? e.originalEvent.touches[0].pageY : e.pageY;
					var tempY = th.pos.sy + ((y - th.pos.y) / resizeFactor);
					if (tempY < 0) {
						tempY = 0;
					}
					if (tempY > th.max) {
						tempY = th.max;
					}
					if (th.steps) {
						tempY = Math.round(tempY / th.step) * th.step;
					}
					if (tempY !== th.pos.cy) {
						th.pos.cy = tempY;
						th.thumb.attr('transform', 'translate(0, ' + th.pos.cy + ')');
						if (th.onChange !== null && !th.onlyOnMouseUp) {
							var val = th.getValue();
							th.onChange(val, 'move');
						}
					}
				}
				
			});
			
			$(document).on(eUp, function(e) {
				e.preventDefault();
				th.pos.sx = th.pos.cx;
				th.pos.sy = th.pos.cy;
				$(document).off(eMove);
				$(document).off(eUp);
				if (th.onChangeDrop) {
					var val = th.getValue();
					th.onChangeDrop(val, 'up');
				} else if (th.onlyOnMouseUp) {
					var val = th.getValue();
					th.onChange(val, 'up');
				}
			});
		});
	}
	
	p.setValue = function(val) {
		if(this.type === 'H') {
			this.pos.sx = val * this.max;
			this.thumb.attr('transform', 'translate(' + this.pos.sx + ', 0)');
		} else {
			this.pos.sy = val * this.max;
			this.thumb.attr('transform', 'translate(0, ' + this.pos.sy + ')');
		}
	}
	
	p.getValue = function() {
		var val = (this.type === 'H') ? (this.pos.cx / this.max) : (this.pos.cy / this.max);
		return val;
	}
	
	p.setDisabled = function(b) {
		this.disabled = b;
		if (b) {
			this.thumb.attr('class', 'slider-disabled');
		} else {
			this.thumb.attr('class', '');
		}
	}
	
	wnd.Slider = Slider;

})(window);