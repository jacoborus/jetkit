(function() {
'use strict';

/**
 * Get form values
 * @param  {Object} form  target form
 * @return {Object}       object with form values
*/
var getValues = function (form) {

	var inputs = form.getElementsByTagName( 'input' ),
		data = {},
		len = inputs.length,
		areas = form.getElementsByTagName( 'textarea' ),
		areasLength = areas.length,
		i, x;

	for (i = 0; i<len; i++) {
		x = inputs[i];
		if (x.name) {
			switch (x.type) {
				// file inputs
				case 'file':
					break;
				// inputs with multiple instances
				case 'radio':
					if (x.checked) {
						data[x.name] = x.value;
					}
					break;

				case 'checkbox':
					data[x.name] = x.checked;
					break;

				// regular inputs
				default:
					if (x.value === '') {break;}
					if (x.value === ' ') {
						data[x.name] = '';
						break;
					}
					data[x.name] = x.value;
					break;
			}
		}
	}

	for (i = 0; i<areasLength; i++) {
		x = areas[i];
		if (x.name) {
			if (x.value === '') {break;}
			if (x.value === ' ') {
				data[x.name] = '';
				break;
			}
			data[x.name] = x.value;
		}
	}
	return data;
};

var counter = function (limit, callback) {
	var count = 0,
		oldErr = false;
	return function (err) {
		if (!oldErr) {
			if (err) {
				return callback( oldErr = err );
			}
			if (++count >= limit) {
				callback();
			}
		}
	};
};

var getInputWithName = function (elems, name) {
	var i;
	for (i in elems) {
		if (elems.hasOwnProperty(i) && elems[i].name === name) {
			return elems[i];
		}
	}
	return false;
};

var pushFields = function (params, data, form) {
	params = params.trim().split( ',' );
	params.forEach( function (param) {
		param = param.trim().split(' ');
		var named = getInputWithName( form.elements, param[0] );
		if (!named) {
			named = document.createElement('input');
			named.setAttribute( 'type', 'hidden' );
			named.setAttribute( 'name', param[0] );
			form.appendChild( named );
		}
		named.setAttribute( 'value', data[param[1]] );
	});
};

var submitForm = function (form) {

	if (!form.uploads) {
		return upload({
			url: form.action,
			method: form.getAttribute( 'method' ),
			data: getValues( form )
		}, form.callback );
	}

	var count = counter( form.uploads.length, function (err) {
		if (err) { return form.opts.fail( err );}
		upload({
			url: form.action,
			method: form.getAttribute( 'method' ),
			data: getValues( form )
		}, form.callback );
	});

	form.uploads.forEach( function (upInput) {

		var upFile = function (err, credential) {
			var fileForm = new FormData();
			fileForm.append( 'file', upInput.files[0] );
			upload({
				url: form.uploadPath + '/put/' + credential.hash,
				data: fileForm,
				multi: true
			}, function (err, data) {
				if (err) { return console.log( err );}
				pushFields( upInput.getAttribute( 'push' ), data.data, form );
				count();
			});
		};
		getSignedUrl( form.uploadPath + '/sign', { filename: upInput.files[0].name }, upFile );
	});
};

var getSignedUrl = function (url, data, callback) {
	upload({
		url: url,
		data: data
	}, callback );
};


var upload = function (opts, callback) {

	var request = new XMLHttpRequest(),
		progress = opts.progress || function () {};

	request.open( opts.method || 'POST', opts.url );

	if (!opts.multi) {
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		opts.data = JSON.stringify( opts.data );
	}/* else {
		request.setRequestHeader('Content-Type', 'multipart/form-data; charset=utf-8;');
	}*/

	request.onreadystatechange = function () {
		var resp;
		if (request.readyState === 4) {
			if (request.status !== 200) {
				return callback('error uploading');
			}
			try {
				resp = JSON.parse( request.responseText );
			} catch (err) {
				if (err) {
					return callback({
						status: 'error',
						data: 'Unknown error occurred: [' + request.responseText + ']'
					});
				}
				callback( null, resp );
			}
		}
	};

	request.upload.addEventListener( 'progress', function (e) {
		return progress( (e.loaded / e.total) * 100);
	}, false );
	request.onload = function () {
		callback( null, JSON.parse( request.responseText ));
	};
	request.addEventListener( 'error', function (e) {
		return callback( e );
	}, false );

	request.send( opts.data );
};



var bindButtons = function (form) {
	// Allow external submit buttons
	var inputs = document.getElementsByTagName('input');
	Array.prototype.forEach.call( inputs, function (btn){
		if (btn.attributes.target && btn.attributes.target.value === form.getAttribute('name') && btn.attributes.type.value === 'submit') {
			btn.onclick = function (e) {
				e.preventDefault();
				submitForm( form );
			};
		}

	});

	// Submit button binding
	form.addEventListener( 'submit', function (evt) {
		evt.preventDefault();
		submitForm( form );
	});
};

// preview for input files
var linkPreview = function (item) {
	if (!item.attributes.preview) {
		return;
	}
	console.log(item.getAttribute('preview'));
	var el = document.getElementById( item.getAttribute('preview') );
	item.addEventListener( 'change', function (e) {
		console.log('cambio de foto')
		var files = e.target.files || e.dataTransfer.files;
		var reader = new FileReader();

		reader.onload = function (e) {
			el.src = e.target.result;
		};
		reader.readAsDataURL(files[0]);
	}, false);
};

// OPTIONS:
// - uploadPath
// - callback
// - progress
var submitter = function (formName, opts) {

	opts = opts || {};
	var form = document.forms[formName],
		inputs = form.getElementsByTagName('input'),
		uploads = [];

	// assign url to get credentials to form
	if (opts.uploadPath) {
		form.uploadPath = opts.uploadPath;
	}

	// recover inputs for upload files
	var len = inputs.length,
		i;
	for (i = 0; i<len; i++) {
		if (inputs[i].type === 'file' && inputs[i].attributes.submitter && inputs[i].attributes.push) {
			linkPreview( inputs[i] );
			uploads.push( inputs[i] );
		}
	}
	if (uploads.length !== 0) {
		form.uploads = uploads;
	}

	form.progress = opts.progress || function () {};
	form.callback = opts.callback || function () {};

	bindButtons( form );
};

// node.js
if((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
	module.exports = submitter;
// browser
} else if(typeof window !== 'undefined') {
	window.submitter = submitter;
}


})();

