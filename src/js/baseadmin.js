/*jshint browser:true */
'use strict';

var $cl, $id, $ajax, nanobar, options, delBtns;

$id = function(id) {
	return document.getElementById(id);
};

$cl = function(cl) {
	return document.getElementsByClassName(cl);
};

$ajax = function (type, url, callback) {
	var request = new XMLHttpRequest();
	request.open(type, url, true);

	request.onload = function () {
		if (this.status >= 200 && this.status < 400) {
			// Success!
			callback( null, this.response);
		} else {
			// We reached our target server, but it returned an error
			callback( 'connection error' );
		}
	};

	request.onerror = function () {
		callback( 'fail' );
	};

	request.send();
};

nanobar = new Nanobar({
	bg: '#f47216'
});

options = {
	progress: function (p) {
		nanobar.go(p);
	},
	callback: function (err, data) {
		if (err) {
			nanobar.go(100);
			return alert('Error uploading data');
		}
		nanobar.go(100);
		console.log(data);
		nanobar.go(100);
		if (data.ok) {
			if (data.modelType === 'collection') {
				window.location.assign('/admin/collection/' + data.model + '/' + data.id);
			} else {
				window.location.assign('/admin/single/' + data.model );
			}
		} else {
			alert('Error with form');
		}
	},
	uploadPath: '/_upload'
};
if (document.querySelector( 'form[name="mainform"]' ) !== null) {
	submitter('mainform', options);
}

delBtns = document.querySelectorAll('a.deleteDoc') || {};

Array.prototype.forEach.call( delBtns, function (el) {
	var donde = el.getAttribute( 'href' );
	el.addEventListener(
		'click',
		function (e) {
			var r, res;
			e.preventDefault();
			r = confirm('¿Are you sure?');
			if (r) {
				$ajax( 'DELETE', donde, function (err, result) {
					if (err) {
						console.log( err );
					} else {
						res = JSON.parse( result );
						console.log(res);
						if (res.res === true) {
							return location.reload();
						} else {
							return alert('error, no encontrado');
						}
					}
				});
			}
		}
	);
});

var mds = document.querySelector( '.md' );
if (mds) {
	mds.markdown({
		autofocus: false,
		savable: false
	});
}


var layout   = document.getElementById('layout'),
	menu     = document.getElementById('menu'),
	menuLink = document.getElementById('menuLink');

function toggleClass(element, className) {
	var classes = element.className.split(/\s+/),
		length = classes.length,
		i = 0;

	for(; i < length; i++) {
	  if (classes[i] === className) {
		classes.splice(i, 1);
		break;
	  }
	}
	// The className is not found
	if (length === classes.length) {
		classes.push(className);
	}

	element.className = classes.join(' ');
}

menuLink.onclick = function (e) {
	var active = 'active';

	e.preventDefault();
	toggleClass(layout, active);
	toggleClass(menu, active);
	toggleClass(menuLink, active);
};
