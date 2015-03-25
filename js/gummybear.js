
function gummyBear( element, name, factorX, factorY) {

	this.object = $(element);
	this.name = name;
	
	this.x = 0; // x = horizontal
	this.y = 0; // y = vertical
	
	this.factorX = factorX;
	this.factorY = factorY;
	
	this.screenW = 0;
	this.screenH = 0;
	this.oldScreenW = 0;
	this.oldScreenH = 0;
	
	this.pageLetsReference = [];
	this.pageLets = [];
	this.pageLetCounter = 0;
	
	this.dialogAlert = null;
	this.crapcutter();
	
	this.cursor = "pointer";
	
	this.draggable = false; 
	this.dragObject = false; 
	this.dropObject = null;
	
	this.reCursor();
	this.reWindow();
}

gummyBear.prototype.reversion = function (version) 
{	
	var v = version.split('.');
	return (Number(v[0]) * 1000) + (Number(v[1]) * 10) + Number(v[2]);
}

gummyBear.prototype.crapcutter = function ()
{
	var _this = this;
	
	var msg = "Error: jQuery-version < 1.7.0!";
	
	if ( window.jQuery !== undefined ) {
		if (this.reversion(window.jQuery.fn.jquery) < this.reversion("1.7.0") ) {
			alert(msg);			
			throw msg;
		}
	}
}

gummyBear.prototype.log = function (msg) 
{	
	var _this = this;
	
	if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
		console.log("gummyBear(" + _this.name + ") says: " + msg);
	}
}

gummyBear.prototype.blueBear = function (element, blueGlue, 
	listItem, listSelect, listRemove, listMoveLeft, listMoveRight, callback) 
{	
	var _this = this;

	var director = $(element);
	
	var papaBear = null;
	var blueBear = $( "<ul id='bluebear'/>" );
	
	var bbLeft = $( "<li id='bb-left'/>" );
	var bbRight = $( "<li id='bb-right'/>" );
	
	if ( _this.object.is('ul') ) {
		
		if (listItem !== null) {
			_this.object.each(function() {
				$(this).find(listItem).each(function() {
					_this.pageLetsReference.push($(this).text());
				});
			});
		}
		
		papaBear = _this.object.parent();
		papaBear.css('height', director.css('top')); //remain height
		
		blueBear.append( bbLeft, bbRight );
		papaBear.find(blueGlue).append( blueBear );
		
		/* begin: move LEFT button */	
		bbLeft.html(listMoveLeft);
		
		bbLeft.on("click", function() {
			if ( _this.pageLetCounter > 0 ) {
				_this.pageLetCounter -= 1;
			}
			if (listSelect !== null) {
				$(listSelect).val(_this.pageLetCounter);
			}
			_this.object.html(_this.pageLets[_this.pageLetCounter]);
			callback();
		});
		/* end: move LEFT button */	
		
		/* begin: move RIGHT button */	
		bbRight.html(listMoveRight);
		
		bbRight.on("click", function() {
			if ( _this.pageLetCounter < (_this.pageLets.length - 1) ) {
				_this.pageLetCounter += 1;
			}
			if (listSelect !== null) {
				$(listSelect).val(_this.pageLetCounter);
			}
			_this.object.html(_this.pageLets[_this.pageLetCounter]);
			callback();
		});
		/* end: move RIGHT button */	
		
		if ( (_this.pageLetsReference.length > 0) && (listSelect !== null) ) {

			$.each(_this.pageLetsReference, function(key, value) {   
			     $(listSelect)
			          .append($('<option>', { value : key })
			          .text(value)); 
			});
			
			$(listSelect).on("change", function() {
				$( "select option:selected" ).each(function() {
					_this.pageLetCounter = Number($(this).val());
					_this.object.html(_this.pageLets[_this.pageLetCounter]);
					callback();
					$(this).parent().blur();
				});
			});
		}
		
		_this.object.each(function() {
			$(this).find('li').each(function() {
				if ( listRemove ) {
					$(this).find(listItem).hide();
				}
				_this.pageLets.push($(this));
				$(this).remove();
			});
		});
		
		//console.log(_this.pageLetsReference);
		_this.object.html(_this.pageLets[_this.pageLetCounter]);
		callback();
	}
}

gummyBear.prototype.reCursor = function (dropzone, dropaction) {
	
	var _this = this;
	
	var closeHand = "url(http://www.google.com/intl/en_ALL/mapfiles/closedhand.cur)";
	var openHand = "url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur)";
	
	var curBrowser = _this.browserInfo().name;
	var cursCoords = (_this.browserInfo().name == "Explorer") ? "" : " 4 4"; 
	
	if ( _this.draggable ) {
		
		if (document.gbObjectDragged) {
		    _this.cursor = (curBrowser == "Firefox") ? 
				"-moz-grabbing" : closeHand + cursCoords + ", move";
		    // Opera doesn't support url cursors and doesn't fall back well...
		    if (curBrowser == "Opera") {
				_this.cursor = "move";
			}
		} else {
		    _this.cursor = (curBrowser == "Firefox") ? 
				"-moz-grab" : openHand + cursCoords + ", move";
		}
	}
	
	_this.object.css("cursor", _this.cursor);
	_this.object.css("user-select", "none");
}

//Insert a callback in this...
gummyBear.prototype.makeDraggable = function (dropzone, dropaction) {
	
	var _this = this;
	
	_this.draggable = true;
	_this.reCursor();
	
	if (typeof document.gbObjectDragged === 'undefined') {
		document.gbObjectDragged = false;
	}
	
	if ( $(dropzone).length > 0 ) {
		_this.dropObject = $(dropzone);
	}
	
	var objH = _this.object.height() / 2;
	var objW = _this.object.width() / 2;

    $(document.body).on("mousemove", function(ev) {
	
		ev = ev || window.event; 
	
        if (_this.dragObject) {
			
			var xMulti = (.5 - Math.abs((ev.pageX - _this.screenW) / _this.screenW)) * 2;
			var yMulti = (.5 - Math.abs((ev.pageY - _this.screenH) / _this.screenH)) * 2;

			_this.factorX = (ev.pageX + (objW * xMulti)) / _this.screenW;
			_this.factorY = (ev.pageY + (objH * yMulti)) / _this.screenH; 
			
			_this.reCursor();
			_this.rePosition();
        }
    });
	
	var mouseUp = function () {
		if ( document.gbObjectDragged === _this.name ) {
			_this.dragObject = false;
			document.gbObjectDragged = false;
			if ( $(dropzone).length > 0 ) {
				_this.object.trigger(dropaction);
			}
			_this.reCursor();
		}
	}
	
	var mouseDown = function() {
		if ( !document.gbObjectDragged ) {
			_this.dragObject = true;
			document.gbObjectDragged = _this.name;
			_this.reCursor();
		}
	}
	
	if (_this.dropObject !== null) {
		_this.dropObject.on("mouseup", function (ev) {
			mouseUp();
		});
	} else {
		_this.object.on("mouseup", function (ev) {
			mouseUp();
		});
	}
	
	_this.object.on("mousedown", function (ev) {
		mouseDown();
	});
}

gummyBear.prototype.reScale = function (xRight, yBottom) 
{	
	var _this = this;

	_this.object.css('width', (_this.screenW - xRight) + 'px');
	_this.object.css('height', (_this.screenH - yBottom) + 'px');
}

gummyBear.prototype.angle = function (xI, xO, yI, yO) {
	var deg = Math.atan2(yI - yO, xI - xO) * (180/Math.PI);
	deg += 90;
	if (deg < 0) {
		deg += 360;
	}
	return deg;
};

gummyBear.prototype.trajectory = function (nX, nY, d, callback) 
{	
	var _this = this;
	
	var interval = d / 100;
	var t = 0;
	
	nX = nX * 100;
	nY = nY * 100;
	
	var x = _this.factorX * 100;
	var y = _this.factorY * 100;
	
	if ( !jQuery.isFunction(callback) ) {
		callback = function (t, b, c, d) {
			return c*t/d + b;
		}
	}
	
	var myTimer = setInterval(function() {
		
		if ( (x > nX) || (x < nX) ) {
			x = callback(t, x, (nX - x) / Math.PI, d);
		} 

		if ( (y > nY) || (y < nY) ) {
			y = callback(t, y, (nY - y) / Math.PI, d);
		}

		t += interval;
		
		if ( t === d ) {	
			clearInterval(myTimer);	
		}

		_this.factorX = x / 100;
		_this.factorY = y / 100;
		
		_this.rePosition();
		
	}, interval);
	
	return;
}
	
gummyBear.prototype.reWindow = function () 
{	
	var _this = this;
	
	_this.screenW = $( window ).width();
	_this.screenH = $( window ).height();
	
	_this.oldScreenW = _this.screenW;
	_this.oldScreenH = _this.screenH;
	
	if ( _this.oldScreenW === 0 || _this.oldScreenH === 0 ) {
		_this.oldScreenW = _this.screenW;
		_this.oldScreenH = _this.screenH;
	}
}

gummyBear.prototype.position = function () 
{	
	var _this = this;
	
	return _this.object.position();
}

gummyBear.prototype.rePosition = function ()
{	
	var _this = this;
	
	_this.object.css('top', (_this.screenH - _this.object.height()) * _this.factorY);
	_this.object.css('left', (_this.screenW - _this.object.width()) * _this.factorX);
}

gummyBear.prototype.overlay = function ()
{	
	var _this = this;
	
	_this.object.on("click", function(){
		_this.overlay();
	});
	
	_this.object.css('visibility', function(i, visible) {
		return (visible === 'visible') ? 'hidden' : 'visible';
	});
}

/*
gummyBear.prototype.round = function(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}
*/

gummyBear.prototype.browserInfo = function () {
	
    var ua = navigator.userAgent, tem, 
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		 
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {
			name: 'IE ',
			version: (tem[1]||'')
		};
	}
	   
    if ( M[1] === 'Chrome' ) {
        tem = ua.match(/\bOPR\/(\d+)/);
        if ( tem != null ) {
			return {
				name: 'Opera', version: tem[1]
			};
		}
	}
	   
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	
    if ( (tem = ua.match(/version\/(\d+)/i)) != null) {
		M.splice(1, 1, tem[1]);
	}
    
	return {
      name: M[0],
      version: M[1]
    };
}

/* and now, the end has come... curtains closed !*/
