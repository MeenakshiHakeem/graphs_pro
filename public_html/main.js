//var actualData = []; var preparedData = []; var i = 0;
///*Data Preparation*/
//$.getJSON("data.json", function(data) {
//    data.length=2
//    console.log('data',JSON.stringify(data))
//    
//    var data=[{
//	"id": 11,
//	"first_name": "Mariela",
//	"last_name": "Rogers",
//	"start_date": "4/9/2018 12:00:00 AM",
////	"tenure": 207,
////	"pay_raise": "3/1/2018 12:00:00 AM",
////	"vacation_days": 5,
////	"sick_days": 0,
////	"training_code": 0,
////	"training_date": "",
////	"average_call_time": "212.00",
//	"emotion": "uncertain",
////	"emotion_strength": 10,
//	"calls_day": 51,
//	"cdata": [{
//		"call_id": 25673751,
//		"prediction_value": 0.999999,
//		"disposition": "AGENT - Third Party",
//		"duration": 212,
//		"call_timestamp": "9/17/2018 11:04:12 AM",
//		"direction": "Outbound",
//		"client": "DirecTV",
//		"department": "Verizon",
//		"supervisor": "Louise Grey"
//	}, {
//		"call_id": 25673755,
//		"prediction_value": 0.834637,
//		"disposition": "AGENT - Wrong Number",
//		"duration": 138,
//		"call_timestamp": "9/17/2018 10:54:18 AM",
//		"direction": "Outbound",
//		"client": "DirecTV",
//		"department": "Verizon",
//		"supervisor": "John Bennett"
//	}]
//},{
//	"id": 14,
//	"first_name": "Kayleann",
//	"last_name": "Acosta ",
//	"start_date": "12/15/2016 2:45:00 PM",
////	"tenure": 687,
////	"pay_raise": "3/1/2018 12:00:00 AM",
////	"vacation_days": 5,
////	"sick_days": 0,
////	"training_code": 0,
////	"training_date": "",
////	"average_call_time": "113.00",
//	"emotion": "uncertain",
//	"emotion_strength": 10,
//	"calls_day": 51,
//	"cdata": [{
//		"call_id": 25675162,
//		"prediction_value": 0.896814,
//		"disposition": "AGENT - Unresolved",
//		"duration": 113,
//		"call_timestamp": "9/17/2018 9:22:28 AM",
//		"direction": "Outbound",
//		"client": "Woolies",
//		"department": "Filter",
//		"supervisor": "Phil Brown"
//	}, {
//		"call_id": 25731421,
//		"prediction_value": 0.932107,
//		"disposition": "AGENT - Third Party",
//		"duration": 127,
//		"call_timestamp": "9/18/2018 10:35:46 AM",
//		"direction": "Outbound",
//		"client": "Woolies",
//		"department": "Filter",
//		"supervisor": "Phil Brown"
//	}
//        ]
//        }
//    ]
//    data.forEach(function(v, k){
//        v.cdata.forEach(function(v1, k1){
//        if (k1 < 11){
//        actualData.push(v1)
//                actualData[i]['first_name'] = v.first_name
//                actualData[i]['emotion'] = v.emotion
//                actualData[i]['vacation_days'] = v.vacation_days
//                actualData[i]['department'] = v1.department
//                actualData[i]['emotion'] = v.emotion
//                i++;
//        }
//        })
//    })
///*Defining widh,height,margins etc.,*/
//var width = 500,
//      height = 500,
//      start = 0,
//      end = 2.25,
//      numSpirals = 3
//      margin = {top:50,bottom:50,left:50,right:50};
//
//    var theta = function(r) {
//      return numSpirals * Math.PI * r;
//    };
//
//    // used to assign nodes color by group
//    var color = d3.scaleOrdinal(d3.schemeCategory10);
//
//    var r = d3.min([width, height]) / 2 - 40;
//
//    var radius = d3.scaleLinear()
//      .domain([start, end])
//      .range([40, r]);
//
//    var svg = d3.select("#chart").append("svg")
//      .attr("width", width + margin.right + margin.left)
//      .attr("height", height + margin.left + margin.right)
//      .append("g")
//      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//    var points = d3.range(start, end + 0.001, (end - start) / 1000);
//
//    var spiral = d3.radialLine()
//      .curve(d3.curveCardinal)
//      .angle(theta)
//      .radius(radius);
//
//    var path = svg.append("path")
//      .datum(points)
//      .attr("id", "spiral")
//      .attr("d", spiral)
//      .style("fill", "none")
//      .style("stroke", "steelblue");
//      
//  /*preparing data for chart plotting*/
//   actualData.forEach(function (v, k) {
//    var currentDate = new Date(v.call_timestamp);
//    currentDate.setDate(currentDate.getDate() + k);
////                if (k < 365){
//    preparedData.push({
//        date: currentDate,
//        value: v.duration,
//        group: currentDate.getMonth(),
//        first_name: v.first_name,
//        department: v.department,
//        emotion: v.emotion
//    });
////        }
//})
//
///*Scales and Svg*/
//    var spiralLength = path.node().getTotalLength(),
//        N = preparedData.length,
//        barWidth = (spiralLength / N) - 1;
//    var timeScale = d3.scaleTime()
//      .domain(d3.extent(preparedData, function(d){
//        return d.date;
//      }))
//      .range([0, spiralLength]);
//    
//    // yScale for the bar height
//    var yScale = d3.scaleLinear()
//      .domain([0, d3.max(preparedData, function(d){
//        return d.value;
//      })])
//      .range([0, (r / numSpirals) - 30]);
//
//    svg.selectAll("rect")
//      .data(preparedData)
//      .enter()
//      .append("rect")
//      .attr("x", function(d,i){
//        
//        var linePer = timeScale(d.date),
//            posOnLine = path.node().getPointAtLength(linePer),
//            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
//      
//        d.linePer = linePer; // % distance are on the spiral
//        d.x = posOnLine.x; // x postion on the spiral
//        d.y = posOnLine.y; // y position on the spiral
//        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position
//
//        return d.x;
//      })
//      .attr("y", function(d){
//        return d.y;
//      })
//      .attr("width", function(d){
//        return barWidth;
//      })
//      .attr("height", function(d){
//        return yScale(d.value);
//      })
//      .style("fill", function(d){
//          if(d.emotion == "satisfied"){
//              return '#2CA02C'
//          }else if(d.emotion == "uncertain"){
//              return '#FF7F0E'
//          }else{
//              return '#D62728'
//          }
//      })
//      .style("stroke", "none")
//      .attr("transform", function(d){
//        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
//      });
//    
//    // add date labels
//    var tF = d3.timeFormat("%b %Y"),
//        firstInMonth = {};
//
//    svg.selectAll("text")
//      .data(preparedData)
//      .enter()
//      .append("text")
//      .attr("dy", 10)
//      .style("text-anchor", "start")
//      .style("font", "10px arial")
//      .append("textPath")
//      // only add for the first of each month
//      .filter(function(d){
//        var sd = tF(d.date);
//        if (!firstInMonth[sd]){
//          firstInMonth[sd] = 1;
//          return true;
//        }
//        return false;
//      })
//      .text(function(d){
//        return tF(d.date);
//      })
//      // place text along spiral
//      .attr("xlink:href", "#spiral")
//      .style("fill", "grey")
//      .attr("startOffset", function(d){
//        return ((d.linePer / spiralLength) * 100) + "%";
//      })
//
//
//    var tooltip = d3.select("#chart")
//    .append('div')
//    .attr('class', 'tooltip');
//
//    tooltip.append('div')
//    .attr('class', 'date');
//    tooltip.append('div')
//    .attr('class', 'value');
//    tooltip.append('div')
//    .attr('class', 'agent');
//    tooltip.append('div')
//    .attr('class', 'department');
//    tooltip.append('div')
//    .attr('class', 'emotion');
//
//    svg.selectAll("rect")
//    .on('mouseover', function(d) {
//        tooltip.select('.date').html("Date: <b>" + d.date.toDateString() + "</b>");
//        tooltip.select('.value').html("Duration: <b>" + d.value + "<b>");
//        tooltip.select('.agent').html("Agent: <b>" + d.first_name + "<b>");
//        tooltip.select('.department').html("Department: <b>" + d.department + "<b>");
//        tooltip.select('.emotion').html("Emotion: <b>" + d.emotion + "<b>");
//
//        d3.select(this)
//        .style("fill","#FFFFFF")
//        .style("stroke","#000000")
//        .style("stroke-width","2px");
//        tooltip.style('display', 'block');
//        tooltip.style('opacity',2);
//
//    })
//    .on('mousemove', function(d) {
//        tooltip.style('top', (d3.event.layerY + 10) + 'px')
//        .style('left', (d3.event.layerX - 25) + 'px');
//    })
//    .on('mouseout', function(d) {
//        d3.selectAll("rect")
//        .style("fill", function(d){
//           if(d.emotion == "satisfied"){
//              return '#2CA02C'
//          }else if(d.emotion == "uncertain"){
//              return '#FF7F0E'
//          }else{
//              return '#D62728'
//          }})
//        .style("stroke", "none")
//
//        tooltip.style('display', 'none');
//        tooltip.style('opacity',0);
//    });
//});
//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }
  
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}
