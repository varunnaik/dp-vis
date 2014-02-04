var dpvis = {};

dpvis.subsequence = {

	data: [-15, 29, -36, 3, -22, 11, 19, -5],
	maxSum: 0,
	sumSoFar: 0,
	startIndex: 0,
	endIndex: 0,
	currentIndex: 0,
	handle: null,
	stepInterval: 250, // milliseconds
	togglePause: function() {
		var self = this;
		if (this.handle !== null) {
			window.clearInterval(this.handle);
			this.handle = null;
		} else {
			this.handle = window.setInterval(function() {self.run_alg.call(self)}, this.stepInterval);
		}
	},
	run_alg: function() {
		if (this.currentIndex >= this.data.length) return;
		
		var i = this.currentIndex;
		this.sumSoFar += this.data[i];
		if (this.sumSoFar > this.maxSum) {
			this.maxSum = this.sumSoFar
			this.endIndex = i
		} else if (this.sumSoFar < 0) {
			this.sumSoFar = 0
			this.startIndex = i+1
		}

		this.currentIndex += 1;
		if (this.currentIndex == this.data.length) {
			window.clearInterval(this.handle);
			this.handle = null;
		}
	},
	setup: function() {
	 
	},
	update_display: function() {
	 
	}
	
}
