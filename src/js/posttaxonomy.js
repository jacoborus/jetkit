'use strict';

var sidetool = new Sidetool();

var containId = function (list, id) {
	var i;
	for (i in list) {
		if (list[i].id === id) {
			return true;
		}
	}
	return false;
};

var getTaxonomy = function (model, callback) {
	var request = new XMLHttpRequest();

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
		    // Success!
			callback( null, JSON.parse(request.responseText).data );
		} else {
	    	callback( 'error' );
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		callback( 'error' );
	};

	request.open( 'GET', '/admin/taxonomy/' + model, true );
	request.send();
};


var ListItem = function (data, sidetool, select) {
	var self = this;
	this.id = data._id;
	if (data._taxoInfo) {
		this.caption = data._taxoInfo.caption;
		this.helper = data._taxoInfo.helper;
	} else {
		this.caption = data._id;
		this.helper = ' ';
	}
	this.el = document.createElement( 'li' );
	this.el.setAttribute( 'id', data._id );
	if (this.id === select.currentId) {
		this.el.classList.add( 'current' );
	}
	var caption = document.createElement( 'span' );
	var helper = document.createElement( 'span' );
	caption.innerHTML = this.caption;
	caption.setAttribute( 'class', 'big' );
	helper.innerHTML = this.helper;
	this.el.appendChild( caption );
	this.el.appendChild( helper );
	this.el.addEventListener( 'click', function () {
		select( self );
		sidetool.close();
	});
};

var List = function (data, sidetool, select) {
	var i;
	this.el = document.createElement('ul');
	this.el.setAttribute( 'class', 'ulSelector' );
	this.items = data;
	this.elems = [];
	for (i in data) {
		this.elems[i] = new ListItem( data[i], sidetool, select );
		this.el.appendChild( this.elems[i].el );
	}
};

var Selector = function (el) {
	var self = this,
		currentId;
	currentId = el.getAttribute( 'taxo-id' );
	this.modelName = el.getAttribute( 'modelname' );
	this.input = document.createElement( 'input' );
	this.input.setAttribute( 'type', 'hidden' );
	this.input.setAttribute( 'name', el.getAttribute( 'name' ));
	el.parentNode.appendChild( this.input );
	this.input.setAttribute( 'name', el.getAttribute( 'taxo-name' ));

	// SELECT
	this.select = function (obj) {
		el.setAttribute( 'idn', obj.id );
		self.input.setAttribute( 'value', obj.id );
		el.innerHTML = obj.caption;
	};

	this.select.currentId = currentId;

	el.addEventListener( 'click', function () {
		getTaxonomy( self.modelName, function (err, data) {
			if (err) {
				return alert( 'error' );
			}
			sidetool.open( new List( data, sidetool, self.select ));
		});
	});
};


// li items for multiselect
var MultiLi = function (el, parent) {
	var self = this;
	this.el = el;
	// get data
	this.id = this.el.getAttribute( 'taxo-id' );
	this.name = this.el.getAttribute( 'taxo-name' );
	this.caption = this.el.innerHTML;
	el.innerHTML = '';
	// create elements
	this.captionEl = document.createElement('span');
	this.captionEl.innerHTML = this.caption;
	this.delBt = document.createElement('a');
	this.delBt.setAttribute( 'class', 'minus' );
	this.delBt.innerHTML = 'X';
	this.input = document.createElement('input');
	this.input.setAttribute( 'type', 'hidden' );
	this.input.setAttribute( 'value', this.id );
	this.input.setAttribute( 'name', parent.fieldName );
	// insert elements
	el.appendChild( this.captionEl );
	el.appendChild( this.delBt );
	el.appendChild( this.input );
	this.delBt.addEventListener( 'click', function () {
		parent.remove( self.id );
	});
};

// multiselect ul
var MultiList = function (el) {
	var self = this,
		i;

	this.el = el;
	this.fieldName = el.getAttribute( 'taxo-name' );
	this.modelName = el.getAttribute( 'modelname' );
	this.el.setAttribute( 'class', 'multilist' );

	// plus button
	this.plus = document.createElement('a');
	this.plus.setAttribute( 'class', 'pure-button button-success button-small' );
	this.plus.innerHTML = '+ añadir';

	// hidden input
	this.input = document.createElement( 'input' );
	this.input.setAttribute( 'type', 'hidden' );
	this.input.setAttribute( 'value', '_deleteAll' );

	// items
	this.items = [];
	this.lis = el.getElementsByTagName( 'li' );

	// methods
	this.add = function (item) {
		var li;
		if (!containId( self.items, item.id)) {
			li = document.createElement( 'li' );
			li.setAttribute( 'taxo-id', item.id );
			li.innerHTML = item.caption;
			el.appendChild( li );
			self.items.push( new MultiLi( li, self ));
		}
	};

	this.remove = function (id) {
		var i;
		for (i in self.items) {
			if (self.items[i].id == id) {
				el.removeChild( self.items[i].el );
				self.items.splice( i, 1 );
			}
		}
		if (this.items.length) {
			this.input.setAttribute( 'name', '_no' );
		} else {
			this.input.setAttribute( 'name', this.fieldName );
		}
	};

	// get initial items
	for (i in this.lis) {
		if (this.lis[i].classList){
			this.items[i] = new MultiLi( this.lis[i], this );
		}
	}

	// append and bind elements
	el.insertBefore( this.plus, el.firstChild );
	el.insertBefore( this.input, el.firstChild );
	this.plus.addEventListener( 'click', function () {
		getTaxonomy( self.modelName, function (err, data) {
			if (err) { return alert( 'error' );}

			sidetool.open( new List( data, sidetool, self.add ));
		});
	});
};




var selectElems = document.getElementsByClassName('selector');
var selectors = [];
var j;
for (j in selectElems) {
	if (selectElems[j].classList) {
		selectors[j] = new Selector( selectElems[j] );
	}
}

var multiEls = document.getElementsByClassName('multiselector');
var multis = [];
var k;
for (k in multiEls) {
	if (multiEls[k].classList) {
		multis[k] = new MultiList( multiEls[k] );
	}
}
