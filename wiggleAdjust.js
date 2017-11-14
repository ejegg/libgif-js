/* WiggleAdjust
 * 
 * Uses the SuperGif from libgif-js to allow a user to adjust the frame
 * alignment in a wiggle-3d stereoscopic GIF image.
 * 
 * Usage:
 * var superGif = new SuperGif(document.getElementById('wiggle'));
 * var wiggleAdjuster = new WiggleAdjuster(superGif);
 * superGif.play();
 * 
 * Arrow keys move the second frame of the gif around, one pixel per press
 * normally, or ten pixels per press when the shift key is held.
 * 
 * Limitations:
 * currently only works for a single image on a page.
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.WiggleAdjust = factory();
	}
}(this, function () {
	var WiggleAdjust = function (superGif) {
		var offset = { x: 0, y: 0 },
			listener = function(e) {
				var adjusting = true,
					delta = e.shiftKey ? 10 : 1;

				switch(e.keyCode) {
					case 37: 
						offset.x -= delta; // left
						break;
					case 38:
						offset.y -= delta; // up
						break;
					case 39:
						offset.x += delta; // right
						break;
					case 40:
						offset.y += delta; //down
						break;
					default:
						adjusting = false;
				}

				if (!adjusting) {
					return;
				}

				superGif.set_frame_offset(1, offset);
				e.preventDefault();
			},
			attach = function() {
				document.addEventListener('keydown', listener, false);
			},
			detach = function() {
				document.removeEventListener('keydown', listener, false);
			},
			getOffset = function() {
				return offset;
			};

		attach();
	};

	return WiggleAdjust;
}));