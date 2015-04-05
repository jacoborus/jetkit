'use strict';

var Sidetool = function () {
	var self = this;
	this.bg = document.createElement('div');
	this.bg.setAttribute( 'class', 'sidetool-bg hidden');
	this.el = document.createElement('div');
	this.el.setAttribute( 'class', 'sidetool hidden');
	document.getElementsByTagName( 'body' )[0].appendChild( this.bg );
	document.getElementsByTagName( 'body' )[0].appendChild( this.el );
	this.bg.addEventListener( 'click', function () {
		self.close();
	});
};


Sidetool.prototype.close = function () {
	this.el.classList.remove( 'hidden' );
	this.el.classList.add( 'hidden' );
	this.bg.classList.add( 'hidden' );
	this.el.removeChild( this.content.el );
};


Sidetool.prototype.open = function (content) {
	this.el.classList.remove( 'hidden' );
	this.bg.classList.remove( 'hidden' );
	this.content = content;
	this.el.appendChild( this.content.el );
};

