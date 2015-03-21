
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
	
	this.dragObject = false; 
	this.dropObject = null;
	
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
   
//Insert a callback in this...
gummyBear.prototype.makeDraggable = function (dropzone, dropaction) {
	
	var _this = this;
	
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
			
			_this.rePosition();
        }
    });
	
	if (_this.dropObject !== null) {
	
		_this.dropObject.on("mouseup", function (ev) {
		
			if ( document.gbObjectDragged === _this.name ) {
				_this.dragObject = false;
				document.gbObjectDragged = false;
				
				if ( $(dropzone).length > 0 ) {
					_this.object.trigger(dropaction);
				}
			}
		});
	
	} else {
	
		_this.object.on("mouseup", function (ev) {

			if ( document.gbObjectDragged === _this.name ) {
				_this.dragObject = false;
				document.gbObjectDragged = false;
				
				if ( $(dropzone).length > 0 ) {
					_this.object.trigger(dropaction);
				}
			}
		});
	}
	
	_this.object.on("mousedown", function (ev) {
		if ( !document.gbObjectDragged ) {
			_this.dragObject = true;
			document.gbObjectDragged = _this.name;
		}
	});
}

gummyBear.prototype.reScale = function (xRight, yBottom) 
{	
	var _this = this;

	_this.object.css('width', (_this.screenW - xRight) + 'px');
	_this.object.css('height', (_this.screenH - yBottom) + 'px');
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

gummyBear.prototype.round = function(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

/* and now, the end has come... curtains closed !*/
