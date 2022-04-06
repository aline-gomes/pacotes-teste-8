if (!window.sourcelist) { window.sourcelist = {}; }

var p; // shortcut to reference prototypes

// stage content:
(window.sourcelist.sourcelist = function() {
	this.initialize();

	// buttons >1 page
	this.switcher = new window.sourcelist.switcher();
	this.switcher.setTransform(765.1,24.9,1,1,0,0,0,85.5,24.9);

	// buttons
	this.resetBtn = new window.sourcelist.resetBtn();
	this.resetBtn.setTransform(861,0,0.735,0.735);

	this.audioBtn = new window.sourcelist.audioBtn();
	this.audioBtn.setTransform(619,-0.1);

	// border
	this.instance = new window.sourcelist.border();

	// images
	this.imgHolder = new window.sourcelist.images();
	this.imgHolder.setTransform(300,215,1,1,0,0,0,300,215);

	this.instance_1 = new window.sourcelist.Symbol1("synched",0);
	this.instance_1.setTransform(571.1,27,0.576,1,0,0,0,79.8,12.5);

	this.addChild(this.instance_1,this.imgHolder,this.instance,this.audioBtn,this.resetBtn,this.switcher);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0,0,911,430);

(window.sourcelist.switcher = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.f("#999999").p("AAEjVQgCgBgCAAQgBAAgCABQgBACAAACIAAA8QAAACABABQACACABAAQACAAACgCQABgBAAgCIAAg8QAAgCgBgC").p("AAEgZQABgCAAgCIAAg8QAAgCgBgCQgCgBgCAAQgBAAgCABQgBACAAACIAAA8QAAACABACQACABABAAQACAAACgB").p("AAEBeQABgCAAgCIAAg8QAAgCgBgCQgCgBgCAAQgBAAgCABQgBACAAACIAAA8QAAACABACQACABABAAQACAAACgB").p("AAFDSIAAg8QAAgCgBgBQgCgCgCAAQgBAAgCACQgBABAAACIAAA8QAAACABACQACABABAAQACAAACgBQABgCAAgC").f();
	this.shape.setTransform(0,24.5);

	this.shape_1 = new Shape();
	this.shape_1.graphics.f("#999999").p("AgEjRIAAA8QAAACABABQACACABAAQACAAABgCQACgBAAgCIAAg8QAAgCgCgCQgBgBgCAAQgBAAgCABQgBACAAAC").p("AgDhdQgBACAAACIAAA8QAAACABACQACABABAAQACAAABgBQACgCAAgCIAAg8QAAgCgCgCQgBgBgCAAQgBAAgCAB").p("AAAAZQgBAAgCABQgBACAAACIAAA8QAAACABACQACABABAAQACAAABgBQACgCAAgCIAAg8QAAgCgCgCQgBgBgCAA").p("AgECWIAAA8QAAACABACQACABABAAQACAAABgBQACgCAAgCIAAg8QAAgCgCgBQgBgCgCAAQgBAAgCACQgBABAAAC").f();
	this.shape_1.setTransform(171.1,24.5);

	this.prev = new window.sourcelist.left();
	this.prev.setTransform(10.1,-0.1);

	this.next = new window.sourcelist.right();
	this.next.setTransform(110.5,-0.1);

	this.addChild(this.next,this.prev,this.shape_1,this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(-0.4,0,172.1,50);


(window.sourcelist.left = function() {
	this.initialize();

	// Layer 4
	this.shape = new Shape();
	this.shape.graphics.f("#474747").p("ABphRIgqAIIAAhNIinCYICnCVIAAg7IAqAPIAAi8").f();
	this.shape.setTransform(22.1,24.1);

	// Layer 5
	this.shape_1 = new Shape();
	this.shape_1.graphics.f("rgba(0,0,0,0.149)").p("AA/CXIAAg7IArAPIAAi8IgrAIIAAhNIinCYICnCV").f();
	this.shape_1.setTransform(24.5,26.1);

	// Layer 6
	this.bg = new window.sourcelist.btn_bg();
	this.bg.setTransform(24.5,24.4,0.735,0.735);

	this.addChild(this.bg,this.shape_1,this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0.3,0.2,50,50);


(window.sourcelist.btn_bg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{},true);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(Tween.get(this).wait(0).call(this.frame_0).wait(12));

	// Layer 2
	this.shape = new Shape();
	this.shape.graphics.f("rgba(0,0,0,0.2)").p("ADtkSIghgEIgcAAQgCAAgBABQgCACAAACQAAACACABQABACACAAIAbAAIAgAEQAEACADACQACABACgBQACAAABgCQABgBAAgCQgBgCgBgCQgEgCgGgDQgBAAAAAA").p("AA4kMIA8AAQACAAACgCQABgBAAgCQAAgCgBgCQgCgBgCAAIg8AAQgCAAgBABQgCACAAACQAAACACABQABACACAA").p("AETjZQgCgBgCABQgCAAgBABQgBACAAACQACAPABAVIAAAWQAAADACABQABABACAAQACAAACgBQABgBAAgDIAAgXQgBgVgCgQQAAgBgCgC").p("AEPhhQgCABAAACIAAA8QAAADACABQABABACAAQACAAACgBQABgBAAgDIAAg8QAAgCgBgBQgCgBgCgBQgCABgBAB").p("AEMAaIAAA8QAAACACABQABABACABQACgBACgBQABgBAAgCIAAg8QAAgDgBgBQgCgBgCAAQgCAAgBABQgCABAAAD").p("AEMChQgDAcgDASQgBACACACQABACACAAQACAAABgBQACgBABgCQADgTADgcIAAgQQgBgDgBgBQgBgBgCAAQgDAAgBABQgBABAAADIAAAP").p("AB7EWQABgBAAgCQAAgDgBgBQgCgBgCAAIg8gBQgCAAgBABQgCABAAADQAAACACABQABABACABIA8ABQACgBACgB").p("ACuETQAAABACACQABABADAAQAagCAQgIQAIgFAIgEQABgBABgCQAAgCgBgCQgBgCgCAAQgCgBgBABQgHAEgJAFQgPAHgXACQgCAAgCACQgBABAAAD").p("AADEOQgCgBgBAAIg8gBQgCAAgCACQgBABAAACQAAACABACQACABACAAIA8ABQABgBACgBQABgBAAgCQAAgDgBgB").p("Ai3kMIA8AAQACAAABgCQACgBAAgCQAAgCgCgCQgBgBgCAAIg8AAQgCAAgCABQgBACAAACQAAACABABQACACACAA").p("Ag/kMIA8AAQACAAABgCQABgBAAgCQAAgCgBgCQgBgBgCAAIg8AAQgCAAgCABQgBACAAACQAAACABABQACACACAA").p("AjzkLQgVALgGAVIAAAAQgCAKgDAMQAAACABABQACADABAAQADAAABgBQACgBAAgDQACgKADgKIAAAAQAFgRARgJQACgBAAgCQABgCgBgCQAAgCgDgBQgBAAgDAB").p("AkXiZQAAAHABAHIAAAwQAAACABABQACACACAAQACAAABgCQACgBAAgCIAAgxQAAgGgBgHQAAgCgBgBQgBgBgDgBQgCABgBABQgBABgBAC").p("AkWgfIAAA7QABACABACQABABACAAQADAAABgBQABgCAAgCIAAg7QAAgCgCgCQgBgBgCAAQgCAAgCABQgBACAAAC").p("AkWBYIABA8QABACABACQABABACAAQADAAABgBQABgCAAgCIgBg8QAAgCgBgBQgBgCgDAAQgCAAgBACQgBABgBAC").p("AkSDRQAFAUAIALQAFAHAGAFQAGAEAGADQACABACAAQACgBABgBQABgCgBgCQAAgCgCgBQgFgEgGgDQgEgEgEgFIAAAAQgIgLgEgRQAAgCgCgBQgBgBgDAAQgCAAgBACQgBACAAAC").p("AhzERQAAgCgCgBQgBgCgCAAIgfAAQgNABgNgBQgCAAgCABQgBACgBACQAAACABABQACACACAAQANABAOgBIAfAAQACAAABgBQACgCAAgC").f();

	this.timeline.addTween(Tween.get({}).to({state:[{t:this.shape}]}).wait(12));

	// Layer 5
	this.shape_1 = new Shape();
	this.shape_1.graphics.f("#1f2125").p("ABdh8IiwAAQggABgFASQgFAQABAaIABCTQABAQAGAJQACACACACQAUAOAYgCICIAAQAVABALgFQALgGAFgFQAFgFADgfIABiZQgBgZgEgHQgEgHgIgEIgPgC").f();

	this.timeline.addTween(Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1}]},11).wait(1));

	// Layer 1
	this.shape_2 = new Shape();
	this.shape_2.graphics.f("#ffcc00").p("AEfkOQgKgQgTgJIgkgEImnAAQhNABgLAqQgMApACA+IACFiQADAnAOATQAEAHAGAEQAvAhA6gFIFHACQAzACAbgOQAbgNAMgMQAMgMAHhLIADlxQgEg9gKgQ").f();

	this.shape_3 = new Shape();
	this.shape_3.graphics.f("#b1d621").p("AEfkOQgKgQgTgJIgkgEImnAAQhNABgLAqQgMApACA+IACFiQADAnAOATQAEAHAGAEQAvAhA6gFIFHACQAzACAbgOQAbgNAMgMQAMgMAHhLIADlxQgEg9gKgQ").f();

	this.shape_4 = new Shape();
	this.shape_4.graphics.f("#5fc2ed").p("AECknIgkgEImnAAQhNABgLAqQgMApACA+IACFiQADAnAOATQAEAHAGAEQAvAhA6gFIFHACQAzACAbgOQAbgNAMgMQAMgMAHhLIADlxQgEg9gKgQQgKgQgTgJ").f();

	this.shape_5 = new Shape();
	this.shape_5.graphics.f("#b1d621").p("ADekrImnAAQhNABgLAqQgMApACA+IACFiQADAnAOATQAEAHAGAEQAvAhA6gFIFHACQAzACAbgOQAbgNAMgMQAMgMAHhLIADlxQgEg9gKgQQgKgQgTgJIgkgE").p("AC0hzIgCDcQgEAtgHAHQgIAHgQAIQgQAIgegBIjDgBQgjADgcgUQgDgCgDgEQgIgMgCgXIgBjTQgBglAHgZQAHgZAuAAID8AAIAVACQAMAGAFAJQAGAKADAk").f();

	this.timeline.addTween(Tween.get({}).to({state:[{t:this.shape_2}]}).to({state:[{t:this.shape_3}]},4).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},5).wait(2));

	// Layer 6
	this.shape_6 = new Shape();
	this.shape_6.graphics.f("rgba(0,0,0,0.047)").p("AD7lOIgigFQgEAAgDAAImQAAQh+ACgMBRIAAgBQgNAtACBFQAAAAAAABIABFNQAAACABACQAEA4AWAbQAJAOANAJQABABABABQA7AoBJgEIE0ABQBBACAjgSIAAAAQAigSAQgQQABAAAAgBQAZgPAJhmQAAgCAAgCIACleQAAgCAAgBQgEhPgQgUIAAAAQgSgegjgQQgHgDgJgB").p("ADXlEIAiAEQAGAAAHADQAeAOAQAaQAPATAEBKQAAABAAABIgDFeQAAABAAACQgJBegVAOQAAAAAAABQgPAPghAQIAAAAQggASg9gDIk1gBQhEAEg3gmQgBgBAAAAQgLgJgJgLIABABQgUgZgEg0QAAgBAAgCIgClNQAAgBAAAAQgChDANgrQALhGBxgCIGQAAQACAAADAB").f("rgba(0,0,0,0.098)").p("ADSlFImQAAQhxACgLBGQgNArACBDQAAAAAAABIACFNQAAACAAABQAEA0AUAZIgBgBQAJALALAJQAAAAABABQA3AmBEgEIE1ABQA9ADAggSIAAAAQAhgQAPgPQAAgBAAAAQAVgOAJheQAAgCAAgBIADleQAAgBAAgBQgEhKgPgTQgQgagegOQgHgDgGAAIgigEQgDgBgCAA").p("ADWk2IAiAEQAEABAEABQAaAMAOAWQANASAEBEQAAABAAABIgDFeQAAABAAABQgIBWgSANQAAAAAAABQgOANgeAPQgeAQg5gCIkygBQhCAFg0gkQAAgBgBAAQgJgHgHgJQgRgXgEgvQAAgBAAgBIgClOQgChAAMgqQAMg8BjgCIGQAAQACAAACAB").f("rgba(0,0,0,0.149)").p("ADSk3ImQAAQhjACgMA8QgMAqACBAIACFOQAAABAAABQAEAvARAXQAHAJAJAHQABAAAAABQA0AkBCgFIEyABQA5ACAegQQAegPAOgNQAAgBAAAAQASgNAIhWQAAgBAAgBIADleQAAgBAAgBQgEhEgNgSQgOgWgagMQgEgBgEgBIgigEQgCgBgCAA").p("ADUkoIAiAEQACAAACABQAWAKAMATQALARADA+IgCFeQAAABAAABQgHBOgPAMIAAAAQgNANgbAOQgcAOg1gCIkzgBQg8AEgxghIAAgBQgIgFgFgIIAAAAQgQgUgDgqQAAgBAAAAIgClPQgBg9ALgoQALgzBWAAIGQAAQABAAABAA").f("rgba(0,0,0,0.2)").p("ADSkoImQAAQhWAAgLAzQgLAoABA9IACFPQAAAAAAABQADAqAQAUIAAAAQAFAIAIAFIAAABQAxAhA8gEIEzABQA1ACAcgOQAbgOANgNIAAAAQAPgMAHhOQAAgBAAgBIACleQgDg+gLgRQgMgTgWgKQgCgBgCAAIgigEQgBAAgBAA").f();
	this.shape_6.setTransform(1,1);

	this.shape_7 = new Shape();
	this.shape_7.graphics.f("rgba(0,0,0,0.047)").p("AD7lOIgigEQgEgBgDAAImQAAQh+ACgMBRIAAgBQgNAtACBFQAAAAAAABIABFNQAAACABACQAEA4AWAbQAJAOANAJQABABABABQA7AoBJgEIE0ACQBBACAjgTIAAAAQAigSAQgQQABAAAAgBQAZgPAKhmQAAgCAAgCIACleQAAgCAAgBQgFhPgQgUIAAAAQgSgegjgQQgHgDgJgB").p("ADXlEIAiAEQAGAAAHADQAeAOAQAaQAPATAEBKQAAABAAABIgDFeQAAABAAACQgJBegVAOQAAAAAAABQgPAPghAQIAAAAQggASg9gDIk1gBQhEAEg3gmQgBgBAAAAQgLgJgJgLIABABQgUgZgEg0QAAgBAAgCIgClNQAAgBAAAAQgChCANgsQALhGBxgCIGQAAQACAAADAB").f("rgba(0,0,0,0.098)").p("ADSlFImQAAQhxACgLBGQgNAsACBCQAAAAAAABIACFNQAAACAAABQAEA0AUAZIgBgBQAJALALAJQAAAAABABQA3AmBEgEIE1ABQA9ADAggSIAAAAQAhgQAPgPQAAgBAAAAQAVgOAJheQAAgCAAgBIADleQAAgBAAgBQgEhKgPgTQgQgagegOQgHgDgGAAIgigEQgDgBgCAA").p("ADWk2IAiAEQAEABAEABQAaAMAOAWQANASAEBEQAAACAAAAIgDFeQAAABAAABQgIBWgSANQAAAAAAABQgOANgeAPQgeAQg5gCIkygBQhCAFg0gkQAAgBgBAAQgJgHgHgJQgRgXgEgvQAAgBAAgBIgClOQgChAAMgqQAMg8BjgCIGQAAQACAAACAB").f("rgba(0,0,0,0.149)").p("ADSk3ImQAAQhjACgMA8QgMAqACBAIACFOQAAABAAABQAEAvARAXQAHAJAJAHQABAAAAABQA0AkBCgFIEyABQA5ACAegQQAegPAOgNQAAgBAAAAQASgNAIhWQAAgBAAgBIADleQAAAAAAgCQgEhEgNgSQgOgWgagMQgEgBgEgBIgigEQgCgBgCAA").p("ADUkoIAiAEQACAAACABQAWAKAMATQALARADA/IgCFdQAAABAAABQgHBOgPAMIAAAAQgNANgbAOQgcAOg1gCIkzgBQg8AEgxghIAAgBQgIgFgFgIIAAAAQgQgUgDgqQAAgBAAAAIgClPQgBg9ALgoQALgzBWAAIGQAAQABAAABAA").f("rgba(0,0,0,0.2)").p("ADSkoImQAAQhWAAgLAzQgLAoABA9IACFPQAAAAAAABQADAqAQAUIAAAAQAFAIAIAFIAAABQAxAhA8gEIEzABQA1ACAcgOQAbgOANgNIAAAAQAPgMAHhOQAAgBAAgBIACldQgDg/gLgRQgMgTgWgKQgCgBgCAAIgigEQgBAAgBAA").f();
	this.shape_7.setTransform(0.8,0.9);

	this.timeline.addTween(Tween.get({}).to({state:[{t:this.shape_6}]}).to({state:[{t:this.shape_6}]},5).to({state:[{t:this.shape_7}]},5).wait(2));

}).prototype = p = new MovieClip();
p.nominalBounds = new Rectangle(-32.9,-32.9,68,68);


(window.sourcelist.right = function() {
	this.initialize();

	// Layer 4
	this.shape = new Shape();
	this.shape.graphics.f("#474747").p("AhohRIAAC8IArgPIAAA7ICniVIiniYIAABNIgrgI").f();
	this.shape.setTransform(27.1,24.1);

	// Layer 5
	this.shape_1 = new Shape();
	this.shape_1.graphics.f("rgba(0,0,0,0.149)").p("Ag9CXICniVIiniYIAABNIgrgIIAAC8IArgPIAAA7").f();
	this.shape_1.setTransform(29.1,25.1);

	// Layer 6
	this.bg = new window.sourcelist.btn_bg();
	this.bg.setTransform(24.5,24.4,0.735,0.735);

	this.addChild(this.bg,this.shape_1,this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0.3,0.2,50,50);


(window.sourcelist.resetBtn = function() {
	this.initialize();

	// Layer 6
	this.shape = new Shape();
	this.shape.graphics.f("#474747").p("Ag2BMIBthLIhthNIAACY").f();
	this.shape.setTransform(41.3,23.3);

	// Layer 4
	this.shape_1 = new Shape();
	this.shape_1.graphics.f("#474747").p("ABPAAIgRAgQgFAIgIAJQgFAEgEAEQgSAMgWAAQgcAAgUgTQgVgVAAgdQAAgcAVgTIAAgBQAUgUAcAAQACAAACAAIAkAAIAAhIIgkAAQgCAAgCAAQg6AAgpApIABAAQgrApAAA6QAAA7AqAqIABAAIAAAAQAoAoA6AAQAxAAAlgdIACgBQADgDAFgEIAFgFQAPgRAJgQIARggIg/gi").f();
	this.shape_1.setTransform(33.1,33.8);

	// Layer 5
	this.shape_2 = new Shape();
	this.shape_2.graphics.f("rgba(0,0,0,0.153)").p("ABMAVIgPAhQgEAHgHAHIgCACQgDAEgCABIABAAQgTAOgYAAQgcAAgVgUQgVgUAAgdQAAgcAVgTIAAAAQAVgVAcAAQACAAACAAIAXAAIAAApIBuhNIhuhMIAAAoIgXAAQgCAAgCAAQg4AAgrApQAAAAAAAAQgrApAAA6QAAA7ArApQAqApA5AAQAwAAAmgcIABgBQAGgGAFgFQASgRAJgUIAQghIhCge").f();
	this.shape_2.setTransform(35.3,33.4);

	// Layer 7
	this.bg = new window.sourcelist.btn_bg();
	this.bg.setTransform(33,33);

	this.addChild(this.bg,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0,0,68,68);


(window.sourcelist.audioBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{},true);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(Tween.get(this).wait(0).call(this.frame_0).wait(2));

	// Layer 4
	this.shape = new Shape();
	this.shape.graphics.f("#474747").p("ABpgjQgOgNgUAAIAFBgQARgCAMgMQAOgOAAgUQAAgUgOgP").p("Ahwg3IgFBqIBFAAIBrBYIgQkUIhgBXIg7gF").f();
	this.shape.setTransform(23.7,23.9);

	this.shape_1 = new Shape();
	this.shape_1.graphics.f("#1f2125").p("ABQhPIifAAIAACfICfAAIAAif").f();
	this.shape_1.setTransform(24,24);

	this.timeline.addTween(Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).wait(1));

	// Layer 5
	this.shape_2 = new Shape();
	this.shape_2.graphics.f("rgba(0,0,0,0.153)").p("AgygyIg8gFIgGBqIBGAAIBrBXIgQkTIhfBX").p("ABEgzIAGBhQAQgCANgNQANgNAAgUQAAgUgNgPQgPgOgUAA").f();
	this.shape_2.setTransform(25.8,25.1);

	this.shape_3 = new Shape();
	this.shape_3.graphics.f("rgba(0,0,0,0.149)").p("ABQhPIifAAIAACfICfAAIAAif").f();
	this.shape_3.setTransform(26,26);

	this.timeline.addTween(Tween.get({}).to({state:[{t:this.shape_2}]}).to({state:[{t:this.shape_3}]},1).wait(1));

	// Layer 6
	this.bg = new window.sourcelist.btn_bg();
	this.bg.setTransform(24.5,24.4,0.735,0.735);

	this.timeline.addTween(Tween.get({}).to({state:[{t:this.bg}]}).wait(2));

}).prototype = p = new MovieClip();
p.nominalBounds = new Rectangle(0.3,0.2,50,50);


(window.sourcelist.border = function() {
	this.initialize();

	// Layer 3
	this.shape = new Shape();
	this.shape.graphics.f("#2e677b").p("EAsfghlMAAABDLIASAAMAAAhDLIgSAA").p("EgswghlMAAABDLIASAAMAAAhDLIgSAA").f();
	this.shape.setTransform(286.5,215);

	// Layer 2
	this.shape_1 = new Shape();
	this.shape_1.graphics.f("#2e677b").p("EAsxghlMhZhAAAIAAAXMBZhAAAIAAgX").p("EgswAhmMBZhAAAIAAgXMhZhAAAIAAAX").f();
	this.shape_1.setTransform(286.5,215);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0,0,573,430);


(window.sourcelist.images = function() {
	this.initialize();

	// Layer 3
	this.shape = new Shape();
	this.shape.graphics.f("#ffffff").p("EAsxghlMhZhAAAMAAABDLMBZhAAAMAAAhDL").f();
	this.shape.setTransform(286.5,215);

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0,0,573,430);


(window.sourcelist.Symbol1 = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.f("#5fc2ed").p("AHbAWIigiSIrzCbIk5hnIgrCAIFsBFILcivICdCBIFUiLIlCBS").f();
	this.shape.setTransform(79.7,12.5);

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0,0,159.5,25);