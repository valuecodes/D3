
// minute 15

// import { axisBottom, axisLeft } from 'd3-axis';

var dataset=[80,90,40,60,100,120];

var svgWidth=600,svgHeight=400,barPadding=50;
var barWidth=(svgWidth / dataset.length);

var svg=d3.select('svg')
.attr('width',svgWidth)
.attr('height',svgHeight);

var yScale=d3.scaleLinear()
    .domain([0,d3.max(dataset)])
    .range([svgHeight,0]);

var xScale=d3.scaleLinear()
    .domain([0,d3.max(dataset)])
    .range([0,svgWidth]);

var xAxis=d3.axisBottom().scale(xScale);
var yAxis=d3.axisLeft().scale(yScale);

svg.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis);

var xAxisTranslate=svgHeight-20;

svg.append('g')
.attr('transform','translate(50,'+xAxisTranslate+')')
.call(xAxis);

var barChart= svg.selectAll('rect')
.data(dataset)
.enter()
.append('rect')
.attr('y',d=>svgHeight-yScale(d)-20)
// .attr('x',(d,i)=>i*)
.attr('height',d=>yScale(d))
.attr('width',barWidth-barPadding)
.attr('transform',(d,i)=>{
    var translate=[barWidth*i,0];
    return 'translate('+ translate+')';
})

// d3.select('body')
// .selectAll('p')
// .data(dataset)
// .enter()
// .append('p')
// // .text('D3 is awesome');
// .text(d=>d);