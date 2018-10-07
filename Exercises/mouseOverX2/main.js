let api="https://raw.githubusercontent.com/valuecodes/Free-Code-Camp/master/APIs/OMXHelsinkiHistoricChart/Data/omx25.json";

    document.addEventListener("DOMContentLoaded", function(event) {
      console.log('starting');
      fetch(api)
      
      .then(function(response) { return response.json(); })
      .then(function(data) {
          var parsedData = parseData(data);
          console.log(parsedData);
          createChart(parsedData);
          // createMouse();

      })
      .catch(function(err) { console.log(err); });
      
  });


  function parseData(data) {
    var arr = [];
      for(var i=0;i<data.length;i++){
           arr.push({
            date: new Date(data[i][0]), //date
            value:data[i][1].split(',')[0] //convert string to number
          });
      }
    return arr;
}

let createChart=(data1)=>{
    var m = [80, 80, 80, 100]; // margins
    var w = 1000 - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height

let data=[];
let year=[];

for(var i=data1.length-1;i>0;i--){
    data.push(data1[i].value);
    year.push(data1[i].date);
}

console.log(year)


var xScale = d3.scale.linear()
    .domain([0, data.length])
    .range([0, w]);

var yScale = d3.scale.linear()
    .domain([d3.min(data, (d) => d), d3.max(data, (d) => d)])
    .range([h, 0]);

var line = d3.svg.line()
// assign the X function to plot our line as we wish
.x(function (d, i) {
    // verbose logging to show what's actually being done
    //  console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
    // return the X coordinate where we want to plot this datapoint
    return xScale(i);
})
    .y(function (d) {
    // verbose logging to show what's actually being done
    //  console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
    // return the Y coordinate where we want to plot this datapoint
    return yScale(d);
});

// Add an SVG element with the desired dimensions and margin.
var graph = d3.select("#graph").append("svg:svg")

    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
// 
// create yAxis
var xAxis = d3.svg.axis().scale(xScale).tickSubdivide(true);
// Add the x-axis.

var rect = graph.append("rect").attr({
    w: 0,
    h: 0,
    width: w,
    height: h,
    fill: "white"
});

graph.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);



var yAxisLeft = d3.svg.axis().scale(yScale).ticks(4).orient("left");

graph.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(-25,0)")
    .call(yAxisLeft);


var mainLine = graph
    .append("path")
    .attr("d", line(data))
    .attr('class','line');    ;

//console.log(line(data));        


var verticalLine = graph.append('line')
// .attr('transform', 'translate(100, 50)')
.attr({
    'x1': 0,
    'y1': 0,
    'x2': 0,
    'y2': h
})
    .attr("stroke", "red")
    .attr('class', 'verticalLine')



    
var horizontalLine = graph.append('line')
    .attr({
        'x1': w,
        'y1': 0,
        'x2': 0,
        'y2': 0
    })
        .attr("stroke", "red")
        .attr('class', 'horizontalLine')

circle = graph.append("circle")
    .attr("opacity", 0)
    .style("stroke", "6px")
    .attr('class', 'circle')
    .attr({
    r: 5,
    fill: 'white',
});

text=graph.append("text")
    .attr("x", 9)
    .attr("dy", ".35em")
    .style('fill','red')
    .attr("class", "textValue").style('fill','black')

rect.on('mousemove', function () {

    var xPos = d3.mouse(this)[0];
    var yPos = d3.mouse(this)[1];

    d3.select(".verticalLine").attr("transform", function () {
        return "translate(" + xPos + ",0)";
    });

    var pathLength = mainLine.node().getTotalLength();
    var x = xPos;
    var beginning = x,
        end = pathLength,
        target;
    while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = mainLine.node().getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== x) {
            break;
        }
        if (pos.x > x) end = target;
        else if (pos.x < x) beginning = target;
        else break; //position found
    }
    circle.attr("opacity", 1)
        .attr("cx", x)
        .attr("cy", pos.y);

    text.attr("x", w)
        .attr("y", pos.y)
        .text(yScale.invert(pos.y).toFixed(2));
    // console.log("x and y coordinate where vertical line intersects graph: " + [pos.x, pos.y]); 
    
    d3.select(".horizontalLine").attr("transform", function () {
        return "translate(0,"+ pos.y +")";
    });
    console.log([xScale.invert(pos.x), yScale.invert(pos.y)]);

});

}