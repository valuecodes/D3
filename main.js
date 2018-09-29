
// minute 15

// import { axisBottom, axisLeft } from 'd3-axis';

// var dataset=[80,90,40,60,100,120];

// var svgWidth=600,svgHeight=400,barPadding=50;
// var barWidth=(svgWidth / dataset.length);

// var svg=d3.select('svg')
// .attr('width',svgWidth)
// .attr('height',svgHeight);

// var yScale=d3.scaleLinear()
//     .domain([0,d3.max(dataset)])
//     .range([svgHeight,0]);

// var xScale=d3.scaleLinear()
//     .domain([0,d3.max(dataset)])
//     .range([0,svgWidth]);

// var xAxis=d3.axisBottom().scale(xScale);
// var yAxis=d3.axisLeft().scale(yScale);

// svg.append("g")
//     .attr("transform", "translate(50,0)")
//     .call(yAxis);

// var xAxisTranslate=svgHeight-20;

// svg.append('g')
// .attr('transform','translate(50,'+xAxisTranslate+')')
// .call(xAxis);

// var barChart= svg.selectAll('rect')
// .data(dataset)
// .enter()
// .append('rect')
// .attr('y',d=>svgHeight-yScale(d)-20)
// // .attr('x',(d,i)=>i*)
// .attr('height',d=>yScale(d))
// .attr('width',barWidth-barPadding)
// .attr('transform',(d,i)=>{
//     var translate=[barWidth*i,0];
//     return 'translate('+ translate+')';
// })

// d3.select('body')
// .selectAll('p')
// .data(dataset)
// .enter()
// .append('p')
// // .text('D3 is awesome');
// .text(d=>d);


// var svgWidth=600,svgHeight=500;
// var svg=d3.select('svg')
// .attr('width',svgWidth)
// .attr('height',svgHeight)
// .attr('class','svg-container')

// var line=svg.append('line')
// .attr('x1',100)
// .attr('x2',500)
// .attr('y1',50)
// .attr('y2',60)
// .attr('stroke','red')
// .attr('stroke-width',20)

// var line=svg.append('rect')
// .attr('x',100)
// .attr('width',500)
// .attr('y',100)
// .attr('height',60)
// .attr('stroke','red')
// .attr('stroke-width',20)

// var line=svg.append('circle')
// .attr('x',100)
// .attr('cx',200)
// .attr('cy',300)
// .attr('r',80)

// var data = [
//     {'platform':'Android','percentage':40.11},
//     {'platform':"Windows",'percentage':36.69},
//     {'platform':'iOS','percentage':13.06}
// ];

// var svgWidth=500,svgHeight=300,radius=Math.min(svgWidth,svgHeight)/2;

// var svg=d3.select('svg')
// .attr('width',svgWidth)
// .attr('height',svgHeight);

// var g=svg.append('g')
// .attr('transform','translate('+radius+','+radius+')');

// var color=d3.scaleOrdinal(d3.schemeCategory10);

// var pie=d3.pie().value(d=>d.percentage);

// var path=d3.arc()
// .outerRadius(radius)
// .innerRadius(110);//pie chart set to zero

// var arc=g.selectAll('arc')
// .data(pie(data))
// .enter()
// .append('g');

// arc.append('path')
// .attr('d',path)
// .attr('fill',d=>color(d.data.percentage))

//API to fetch historical data of Bitcoin Price Index

let date= new Date();
let year=date.getFullYear();
let month=date.getMonth();
let day=date.getDate();

let getToday=(year,month,day)=>{
    if(month<=10){
        month="0"+month;        
    }
    return year+'-'+month+'-'+day;
};

let getThreeMonths=(year,month,day)=>{
    month=month-3;
    if(month<=10){
        month="0"+month;        
    }
    return year+'-'+month+'-'+day;
}

let getSixMonths=(year,month,day)=>{
    month=month-6;
    day=day-1; 
    if(month<=10){
        month="0"+month;        
    }
    return year+'-'+month+'-'+day;
}


let change=(months,years)=>{
    // svg=document.getElementsByClassName('bar-chart');
    d3.select("g").remove(); 
    let newMonth=month-months;
    let newDay=day-1;
    let newYear=year-years; 
    if(newMonth<=10){
        newMonth="0"+newMonth;        
    }
    let start=newYear+'-'+newMonth+'-'+newDay;
    console.log(start);
    makeChart(start,'2018-07-28');
}


let threeM=getThreeMonths(year,month,day);
let sixM=getSixMonths(year,month,day);
let today=getToday(year,month,day);
console.log(sixM);

let makeChart=(start)=>{
    
    let api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start='+start+'&end='+today;


    /**
     * Loading data from API when DOM Content has been loaded'.
     */
    // document.addEventListener("DOMContentLoaded", function(event) {
        console.log('starting');
        fetch(api)
        
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var parsedData = parseData(data);
            // console.log(parsedData[900].date.getFullYear());
            drawChart(parsedData);
        })
        .catch(function(err) { console.log(err); });
        
    // });
}
makeChart(sixM,today);


/**
 * Parse data into key-value pairs
 * @param {object} data Object containing historical data of BPI
 */
function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        let year=new Date(i).getFullYear();
        arr.push({
            date: new Date(i), //date
            year:year,
            value: +data.bpi[i] //convert string to number
        });
    }
    return arr;
}

/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
function drawChart(data) {
    
var svgWidth = 1900, svgHeight = 700;
var margin = { top: 20, right: 40, bottom: 30, left: 90 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) {return x(d.date)})
    .y(function(d) { return y(d.value)})
    x.domain(d3.extent(data, function(d) { return d.date}));
    y.domain(d3.extent(data, function(d) { return d.value }));

g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .append('text')
    .select(".domain")
    .remove()
    .style("font", "190")
    .text("Price ($)");
    


g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line)
    .on('mouseover',function(){
        tooltip.style('display',null);
    })
    .on('mouseout',function(){
        tooltip.style('display','none')
    })
    .on('mousemove',function(){
        var xPos=d3.mouse(this)[0]-15;
        var yPos=d3.mouse(this)[1]-15;
        tooltip.attr('transform','translate('+xPos+','+yPos+')');
        tooltip.select('text').text('text');
    });
    var tooltip=svg.append('g')
    .attr('class',tooltip)
    .style('display','none');

    tooltip.append('text')
        .attr('x',15)
        .attr('dy','1.2em');
}