var dpvis = {};

dpvis.subsequence = {

    data: [-15, 29, -36, 3, -22, 11, 19, -5],
    maxSum: 0,
    sumSoFar: 0,
    startIndex: 0,
    startTemp: 0,
    endIndex: 0,
    currentIndex: 0,
    handle: null,
    stepInterval: 70, // milliseconds
    boxSide: 20, // Side of box used in animation, pixels
    visBarMaxWidth: 100, // Maximum width of the bar used to show seq size
    togglePause: function () {
        var self = this;
        if (this.handle !== null) {
            window.clearInterval(this.handle);
            this.handle = null;
        } else {
            this.handle = window.setInterval(function () {
                self.run_alg.call(self)
            }, this.stepInterval);
        }
    },
    run_alg: function () {
        if (this.currentIndex >= this.data.length) return;

        var i = this.currentIndex;
        this.sumSoFar += this.data[i];
        if (this.sumSoFar > this.maxSum) {
            this.maxSum = this.sumSoFar
            this.endIndex = i
            this.startIndex = this.startTemp
        } else if (this.sumSoFar < 0) {
            this.sumSoFar = 0
            this.startTemp = i
        }

        this.update_display();

        this.currentIndex += 1;
        if (this.currentIndex == this.data.length) {
            window.clearInterval(this.handle);
            this.handle = null;
            console.log("RESULT", this.startIndex, this.endIndex)
        }
    },
    setup: function () {
        // Create boxes
        // Get the SVG
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        this.data = new Array(200);
        for (var i = 0; i < 200; i++) {
            this.data[i] = parseInt(getRandomArbitrary(-100,100));
        }
        var row = 0;
        var self = this;
        var svg = d3.select("body").select("svg");
        var width = parseInt(svg.style("width").split("px")[0]);
        var maxBoxes = Math.floor(width / self.boxSide);
        svg.selectAll('rect').data(this.data)
            .enter()
            .append('rect')
            .attr("class", "box")
            .attr("width", this.boxSide)
            .attr("height", this.boxSide)
            .attr("x", 0)
            .attr("y", 0)
            .transition()
            .duration(750)
            .attr("x", function (d, i) {
                return (i % maxBoxes) * self.boxSide;
            })
            .attr("y", function (d, i) {
                return Math.floor(i / maxBoxes) * self.boxSide;
            });
            
        var height = Math.floor(this.data.length / maxBoxes) * this.boxSide + this.boxSide;

        svg.selectAll('g')
            .data([1, 2])
            .enter()
            .append('g')
            .append('text')
            .attr("class", 'label')
            .attr('x', 0)
            .attr('y', function(d,i) {return (i*2)*self.boxSide + height + self.boxSide*2})
            .text(function (d, i) {
                if (i == 0) return "Largest sequence so far"
                return "Current sequence"
            })
        svg.selectAll('g')
            .append('rect')
            .attr('height', self.boxSide)
            .attr('width', 2)
            .attr("x", 180)
            .attr("y", function(d,i) {return ((i*2)*self.boxSide + height + self.boxSide*2)-15})
            .attr('id', function (d, i) {
                return "vis-" + i
            })
            .style("fill", function (d, i) {
                if (i == 0) return "rgb(166,217,106)";
                return "rgb(254,224,139)";
            })
        svg.selectAll('g')
            .append('text')
            .attr('x', 300)
            .attr('y', function(d,i) {return (i*2)*self.boxSide + height + self.boxSide*2})
            .attr("class", 'label')
            .attr('id', function (d, i) {
                return "text-" + i
            })
            


        setTimeout(function () {
            dpvis.subsequence.togglePause()
        }, 750);
    },
    update_display: function () {
        // Update box shading based on state of variables
        // Get the svg
        // Get the currentIndex and set the colour of the previous box
        // Get the start and end index and colour them
        var svg = d3.select("body").select("svg");
        var self = this;
        svg.selectAll('rect')
            .style("fill", function (d, i) {
                if (self.currentIndex == i) {
                    return "rgb(244,109,67)";
                }
                var colour = "";
                if (i < self.currentIndex) {
                    colour = "rgb(255,255,191)";
                }

                if (i >= self.startIndex && i <= self.endIndex) {
                    colour = "rgb(166,217,106)";
                }
                if (i > self.endIndex && i < self.currentIndex) {
                    colour = "rgb(254,224,139)";
                }
                return colour;
            });

        var maxLimit = 1;
        while (maxLimit < this.maxSum) maxLimit *= 10;

        // Update the width of the visualisation bars
        svg.selectAll('#vis-0').attr('width', (this.maxSum / maxLimit) * 100).style('fill', "rgb(166,217,106)");
        svg.selectAll('#vis-1').attr('width', (this.sumSoFar / maxLimit) * 100).style('fill', "rgb(254,224,139)");
		svg.selectAll('#text-0').text(this.maxSum)
		svg.selectAll('#text-1').text(this.sumSoFar)
    }

}
