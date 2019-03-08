/*starting node chart with svg,color,pack*/
this.getStartNodeChart = function () {
    this.svg = d3.select("#nodeChart").append("svg")
        .attr("width", 600)
        .attr("height", 600)
    this.svg = d3.select("svg"),
        this.margin = 20,
        this.diameter = +svg.attr("width"),
        g = svg.append("g").attr("transform", "translate(" + this.diameter / 2 + "," + this.diameter / 2 + ")");

    this.pack = d3.pack()
        .size([this.diameter - this.margin, this.diameter - margin])
        .padding(2);
   this.root;
}
//-----------------------------------------------------------------------------
/*zoom*/
this.zoomNode=function(d) {
   var d1=d
    console.log('tis',this.focus)
    this.focus=d1
    var currentThis=this
    
    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function (d) {
        var i = d3.interpolateZoom(currentThis.view, [currentThis.focus.x, currentThis.focus.y, currentThis.focus.r * 2 + currentThis.margin]);
        return function (t) {
          currentThis.zoomTonode(i(t));
        };
      });
    
    transition.selectAll("text")
      .filter(function (d) {
        return d.parent === currentThis.focus || this.style.display === "inline";
      })
      .style("fill-opacity", function (d) {
        return d.parent === currentThis.focus ? 1 : 0;
      })
      .on("start", function (d) {
        if (d.parent === currentThis.focus)
          this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== currentThis.focus)
          this.style.display = "none";
      });
}

//----------------------------------------------------------------------------
/*zoom to*/
this.zoomTonode=function(v) {
    var k = this.diameter / v[2];
    this.view = v;
    node.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function (d) {
        return d.r * k;
    });
}

/*Data preparation*/
this.getNodeChartData = function () {
    d3.json("data4.json", function (error, data) {
        var nested = d3.nest()
            .key(function (d) {
                return d.emotion
            })
            .entries(data);
        var childrenData = [];
        var emotions = [];
        var tenures = []
        nested.forEach(function (v, k) {
            var secondChild = [];
            var thirdChild = []
            secondChild.push({
                'name': '0-30',
                'size': 60,
                'children': [],
            })
            secondChild.push({
                'name': '31-90',
                'size': 90,
                'children': [],
            })
            secondChild.push({
                'name': '91-180',
                'size': 120,
                'children': [],
            })
            secondChild.push({
                'name': '+180',
                'size': 150,
                'children': [],
            })
            if (emotions.indexOf(v['key']) === -1) {
                childrenData.push({
                    'name': v['key'],
                    'children': secondChild
                })
                emotions.push(v['key'])
            } else {
                secondChild.forEach(function (v3, k3) {
                    var childrenIndex = childrenData.findIndex(p => p.name == v['key'])
                    childrenData[k]['childrenIndex'].push(v3)
                    // childrenData.some(function (o, k) {
                    //     if (o['name'] === v['key']) {
                            
                    //     }
                    // })
                })
            }
            v.values.forEach(function (v1, k1) {
                if (v1.tenure <= 30) {
                    var index = secondChild.findIndex(p => p.name == '0-30')
                    secondChild[index]['children'].push({
                        'name': v1.first_name + " " + v1.last_name + " " + v1.tenure,
                        'size': v1.tenure
                    })
                } else if (v1.tenure <= 90) {
                    var index = secondChild.findIndex(p => p.name == '31-90')
                    secondChild[index]['children'].push({
                        'name': v1.first_name + " " + v1.last_name + " " + v1.tenure,
                        'size': v1.tenure
                    })
                } else if (v1.tenure <= 180) {
                    var index = secondChild.findIndex(p => p.name == '31-90')
                    secondChild[index]['children'].push({
                        'name': v1.first_name + " " + v1.last_name + " " + v1.tenure,
                        'size': v1.tenure
                    })
                } else if (v1.tenure > 180) {
                    var index = secondChild.findIndex(p => p.name == '+180')
                    secondChild[index]['children'].push({
                        'name': v1.first_name + " " + v1.last_name + " " + v1.tenure,
                        'size': v1.tenure
                    })
                }
            })
        })
        var preparing_data = {
            'name': "flare",
            'children': childrenData
        }
        this.plotNodeChart(preparing_data)

    })
}
//-----------------------------------------------------------------------------
//------------------------------------------------------------------------------
/*draw circles */
this.drawNodeCircle = function (nodes, tooltip) {
    var data=this
    /*CIrcle*/
    this.circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function (d) {

            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
        })
        .style("fill", function (d) {
            var emotions = ['uncertain', 'satisfied', 'discontent']
            var tenures = ['0-30', '31-90', '91-180', '+180']
            if (emotions.indexOf(d['data']['name']) === -1) {
                if (d['data']['name'] == "flare") {
                    return "#D07DA8"
                } else {
                    if (tenures.indexOf(d['data']['name'])) {
                        if (emotions.indexOf(d['parent']['data']['name']) == 0) {
                            return "orange"
                        } else if (emotions.indexOf(d['parent']['data']['name']) == 1) {
                            return "#008000ab"
                        } else if (emotions.indexOf(d['parent']['data']['name']) == 2) {
                            return '#ff00006b'
                        }
                    } else {
                        return "white"
                    }

                }
            } else {
                if (emotions.indexOf(d['data']['name']) == 0) {
                    return "#ffa50091"
                } else if (emotions.indexOf(d['data']['name']) == 1) {
                    return "rgba(0, 128, 0, 0.5)"
                } else if (emotions.indexOf(d['data']['name']) == 2) {
                    return 'rgba(255, 0, 0, 0.4)'
                }
            }
            return "white";
        })
        .on("click", function(d) {
            if (focus !== d)
                data.zoomNode(d), d3.event.stopPropagation();
               
        })
    //            .on('mouseover', function (d) {
    //                console.log('.d',d)
    //                tooltip.select('.content').html(d.data.name);
    //                tooltip.style('display', 'block');
    //                tooltip.style('opacity', 2);
    //            })
    //            .on('mousemove', function (d) {
    //                tooltip.style('top', (d3.event.layerY + 10) + 'px')
    //                        .style('left', (d3.event.layerX - 25) + 'px');
    //            })
    //            .on('mouseout', function (d) {
    //                tooltip.style('display', 'none');
    //                tooltip.style('opacity', 0);
    //            })
}
//------------------------------------------------------------------------------
/*draw node text*/

this.drawNodeText = function (nodes) {
    /*TEXT*/
    var currentThis=this
    this.text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "node_label")
        .style("fill-opacity", function (d) {
            return d.parent === currentThis.root ? 1 : 0;
        })
        .style("display", function (d) {
            return d.parent === currentThis.root ? "inline" : "none";
        })
        .text(function (d) {
            return d.data.name;
        });
    this.node = g.selectAll("circle,text");
}
//------------------------------------------------------------------------------
/*plot chart*/
this.plotNodeChart = function (preparing_data) {
    var currentThis=this
    this.tooltip = d3.select("#nodeChart")
        .append('div')
        .attr('class', 'node_tooltip');
    this.tooltip.append('div')
        .attr('class', 'content');
    this.root = d3.hierarchy(preparing_data)
        .sum(function (d) {
            return d.size;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });
  var root=this.root
        this.focus = this.root,
        this.nodes = pack(this.root).descendants(),
        this.view;
    this.drawNodeCircle(this.nodes, this.tooltip)
    this.drawNodeText(this.nodes)
    /*SVG*/
    this.svg
        .style("background", "transaparent")
        .on("click", function () {
            console.log('befre',view)
            currentThis.zoomNode(root);
        });

        currentThis.zoomTonode([this.root.x, this.root.y, this.root.r * 2 + this.margin]);
}
//------------------------------------------------------------------------------
this.getStartNodeChart()
this.getNodeChartData()