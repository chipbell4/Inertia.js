(function($) {
	$.fn.inertia = function(D){
		// default param values
		var params = {
			maxVelocity: 500,
			velocityDecay: 0.9,
			callback: $.noop(),
			refreshRate: 25,
		};

		params.velocityDecay = Math.max(0, params.velocityDecay);
		params.velocityDecay = Math.min(0.9999, params.velocityDecay);
		
		$self = $(this);

		// overwrite defaults
		params = $.extend(params, D);
		params.xVelocity = 0;
		params.yVelocity = 0;
		params.lastX = null;
		params.lastY = null;
		params.lastTimeStamp = null;
		params.isListening = false;
		

		// set data 
		var DATA_KEY = 'inertia_plugin';
		$self.data(DATA_KEY, params);
		
		// helpers for getting data values for the element
		function getData(key) {
			D = $self.data(DATA_KEY);
			return D[key];
		}
		
		function setData(key, value) {
			D = $self.data(DATA_KEY);
			D[key] = value;
			$self.data(DATA_KEY, D);
		}
		
		// event listeners
		function startListening(event) {
			setData('isListening', true);
			setData('lastX', event.pageX);
			setData('lastY', event.pageY);
			setData('lastTimeStamp', (new Date()).getTime());
			setData('xVelocity', 0);
			setData('yVelocity', 0);
		}
		
		function keepListening(event) {
			if(!getData('isListening'))
				return;
			
			// calculate new velocity (in px per seconds)
			var currentX = event.pageX;
			var currentY = event.pageY;
			var currentT = event.timeStamp;
			var oldX = getData('lastX');
			var oldY = getData('lastY');
			var oldT = getData('lastTimeStamp');
			var xV = 1000.0*(currentX - oldX) / (currentT - oldT);
			var yV = 1000.0*(currentY - oldY) / (currentT - oldT);
			
			// update data
			setData('xVelocity', xV);
			setData('yVelocity', yV);
			setData('lastX', currentX);
			setData('lastY', currentY);
			setData('lastTimeStamp', currentT);
		}
		
		function stopListening(event) {
			setData('isListening', false);
		}
		
		// clamps a velocity value between -max and max velocity
		function clamp(val) {
			var max = getData('maxVelocity');
			var tolerance = 0.01;
			val = Math.min(max, val);
			val = Math.max(-max, val);
			if(Math.abs(val) < tolerance)
				val = 0;
			return val;
		}
		
		// MY callback, that calls YOUR callback (also decays the velocity relative to the refresh rate) 
		function update() {
			var xV = getData('xVelocity');
			var yV = getData('yVelocity');
			
			// clamp to a max speed
			xV = clamp(xV);
			yV = clamp(yV);
			
			var decay = getData('velocityDecay');
			var refreshRateInSeconds = getData('refreshRate') / 1000.0;
			var stepDecay = Math.pow(decay, refreshRateInSeconds); 
			xV *= stepDecay;
			yV *= stepDecay;
			setData('xVelocity', xV);
			setData('yVelocity', yV);
			
			var D = {'xVelocity':xV, 'yVelocity':yV};
			
			getData('callback').apply(this, [D]);
		}
		
		// add event listeners
		$self.mousedown(startListening);
		$(document).mousemove(keepListening);
		$(document).mouseup(stopListening);
		
		// set up callback
		setInterval(update, params.refreshRate);
		
		return $self;
		
	};
})(jQuery);
