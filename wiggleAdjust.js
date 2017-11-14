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
	return function (superGif, identifier, offset) {
		var storageKey = 'wiggle' + ( identifier || document.location.pathname ),
			listener = function(e) {
				var adjusting = true,
					delta = e.shiftKey ? 10 : 1;

				switch(e.keyCode) {
					case 37:
					case 72:
						offset.x -= delta; // left
						break;
					case 38:
					case 74:
						offset.y -= delta; // up
						break;
					case 39:
					case 76:
						offset.x += delta; // right
						break;
					case 40:
					case 75:
						offset.y += delta; // down
						break;
					case 85:
						offset.r -= delta / 5; // counterclock
						break;
					case 73:
						offset.r += delta / 5; // clockwise
						break;
					default:
						adjusting = false;
				}

				if (!adjusting) {
					return;
				}

				superGif.set_frame_offset( 1, offset );
				storeOffset( offset );
				e.preventDefault();
			},
			mc,
			swipeHandler = function( e ) {
				offset.x += e.velocityX;
				offset.y += e.velocityY;
				superGif.set_frame_offset( 1, offset );
				storeOffset( offset );
			},
			storeOffset = function( offset ) {
				var serialized = offset.x + '|' + offset.y + '|' + offset.r;
				window.localStorage.setItem( storageKey, serialized );
			},
			getStoredOffset = function() {
				var serialized = window.localStorage.getItem( storageKey ),
					exploded,
					result;
				if ( !serialized ) {
					return false;
				}
				exploded = serialized.split( '|' );
				result = {
					x: parseInt( exploded[0], 10 ),
					y: parseInt( exploded[1], 10 )
				};
				if ( exploded.length > 2 ) {
					result.r = parseInt( exploded[2] );
				} else {
					result.r = 0;
				}
				return result;
			};
		offset = offset || { x: 0, y: 0, r: 0 };
		return {
			attach: function() {
				var storedOffset = getStoredOffset();
				document.addEventListener('keydown', listener, false);
				mc = new Hammer.Manager(document.body);
				mc.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold: 0 } ) );
				mc.on( 'swipe', swipeHandler );
				if ( storedOffset ) {
					offset = storedOffset;
				}
				superGif.set_frame_offset( 1, offset );
			},
			detach: function() {
				document.removeEventListener('keydown', listener, false);
				mc.remove( 'swipe' );
				mc.destroy();
			},
			getOffset: function() {
				return offset;
			}
		};
	};
}));
