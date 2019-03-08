var data=[
]
//data.sort(function(a, b){return a.start_date-b.start_date});
console.log('data',data)
        var newData = []; var someData = []; var i = 0;
        data.forEach(function(v, k){
        
        v.cdata.forEach(function(v1, k1){
//        if (k1 < 11){
        newData.push(v1)
                newData[i]['first_name'] = v.first_name
                newData[i]['emotion'] = v.emotion
                newData[i]['vacation_days'] = v.vacation_days
                newData[i]['department'] = v1.department
                newData[i]['emotion'] = v.emotion
                i++;
//        }
        })
        })
console.log('newdata',newData)

var width = 500,
      height = 500,
      start = 0,
      end = 2.25,
      numSpirals = 3
      margin = {top:50,bottom:50,left:50,right:50};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    // used to assign nodes color by group
    var color = d3.scaleOrdinal().range(['#2CA02C','#FF7F0E', '#D62728']);;

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "steelblue");

    var spiralLength = path.node().getTotalLength(),
        N = 365,
        barWidth = (spiralLength / N) - 1;

console.log('barWidth',barWidth)
    var someData = [];
//    for (var i = 0; i < N; i++) {
//      var currentDate = new Date();
//      currentDate.setDate(currentDate.getDate() + i);
//      someData.push({
//        date: currentDate,
//        value: Math.random(),
//        group: currentDate.getMonth()
//      });
//    }

          newData.forEach(function (v, k) {
    var currentDate = new Date(v.call_timestamp);
    currentDate.setDate(currentDate.getDate() + k);
                if (k >= 465 && k<500){
                    var color;
        if (v.emotion == "satisfied"){
            color = '#2CA02C' 
//              return '#2CA02C'
//        return color(0);
        } else if (v.emotion == "uncertain"){
            var group=1
              color =  '#FF7F0E'
//        return color(1);
        } else{
            var group=2
              color =  '#D62728'
//        return color(2);
        }
    someData.push({
        date: currentDate,
        value: v.duration,
        group: currentDate.getMonth(),
//        group:group,
        color:color,
        first_name: v.first_name,
        department: v.department,
        emotion: v.emotion
    });
        }


})
console.log('someData0',someData.sort(function(a, b){return a.date-b.date}))

    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;
      }))
      .range([0, spiralLength]);
    
    // yScale for the bar height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;
      })])
      .range([0, (r / numSpirals) - 30]);

    svg.selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
        var linePer = timeScale(d.date),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
      
        d.linePer = linePer; // % distance are on the spiral
        d.x = posOnLine.x; // x postion on the spiral
        d.y = posOnLine.y; // y position on the spiral
        
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

        return d.x;
      })
      .attr("y", function(d){
        return d.y;
      })
      .attr("width", function(d){
        return barWidth;
      })
      .attr("height", function(d){
        return yScale(d.value);
      })
      .style("fill", function(d){
          return d.color;
//          console.log('clorrrr',color(d.group))
//          return color(d.group);
//          if(d.emotion == "satisfied"){
////              return '#2CA02C'
//return color(0);
//          }else if(d.emotion == "uncertain"){
////              return '#FF7F0E'
//return color(1);
//          }else{
////              return '#D62728'
//return color(2);
//          }
          })
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
      });
    
    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      // only add for the first of each month
      .filter(function(d){
        var sd = tF(d.date);
        if (!firstInMonth[sd]){
          firstInMonth[sd] = 1;
          return true;
        }
        return false;
      })
      .text(function(d){
        return tF(d.date);
      })
      // place text along spiral
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";
      })


    var tooltip = d3.select("#chart")
    .append('div')
    .attr('class', 'tooltip');

     tooltip.append('div')
    .attr('class', 'date');
    tooltip.append('div')
    .attr('class', 'value');
    tooltip.append('div')
    .attr('class', 'agent');
    tooltip.append('div')
    .attr('class', 'department');
    tooltip.append('div')
    .attr('class', 'emotion');

    svg.selectAll("rect")
    .on('mouseover', function(d) {
        console.log('d',d)
        tooltip.select('.date').html("Date: <b>" +d.date + "</b>");
        tooltip.select('.value').html("Duration: <b>" + d.value + "<b>");
        tooltip.select('.agent').html("Agent: <b>" + d.first_name + "<b>");
        tooltip.select('.department').html("Department: <b>" + d.department + "<b>");
        tooltip.select('.emotion').html("Emotion: <b>" + d.emotion + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", function(d){
            return d.color;
//            return color(d.group);
//             if(d.emotion == "satisfied"){
//              return '#2CA02C'
//          }else if(d.emotion == "uncertain"){
//              return '#FF7F0E'
//          }else{
//              return '#D62728'
//          }
})
        .style("stroke", "none")

        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });