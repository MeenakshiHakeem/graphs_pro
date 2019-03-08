/*starting node chart with svg,color,pack*/
this.getStartNodeChart=function(){
     this.svg = d3.select("svg"),
            margin = 20,
            diameter = +svg.attr("width"),
            g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    this.pack = d3.pack()
            .size([diameter - margin, diameter - margin])
            .padding(2);   
}
 //-----------------------------------------------------------------------------
 /*Data preparation*/
this.getNodeChartData=function() {
    d3.json("data1.json", function (error, data) {
        var nested = d3.nest()
                .key(function (d) {
                    return d.emotion
                })
                .entries(data);
        var childrenData = [];
        var emotions = [];
        var tenures = []
        nested.forEach(function (v, k) {
            v.values.forEach(function (v1, k1) {
                var secondChild = [];
                var thirdChild = []
                var tenure_Agent = "Tenure-" + v1.tenure + "\n" + "Agent-" + v1.first_name + " " + v1.last_name
                secondChild.push({
                    'name': tenure_Agent,
                    'size': v1.tenure,
                    'name1': v1.first_name + " " + v1.last_name,
                })
                if (emotions.indexOf(v['key']) === -1) {
                    childrenData.push({
                        'name': v['key'],
                        'children': secondChild
                    })
                    emotions.push(v['key'])
                } else {
                    secondChild.forEach(function (v3, k3) {
                        childrenData.some(function (o, k) {
                            if (o['name'] === v['key']) {
                                childrenData[k]['children'].push(v3)
                            }
                        })
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
/*zoom*/
  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function (d) {
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function (t) {
                    zoomTo(i(t));
                };
            });

    transition.selectAll("text")
            .filter(function (d) {
                return d.parent === focus || this.style.display === "inline";
            })
            .style("fill-opacity", function (d) {
                return d.parent === focus ? 1 : 0;
            })
            .on("start", function (d) {
                if (d.parent === focus)
                    this.style.display = "inline";
            })
            .on("end", function (d) {
                if (d.parent !== focus)
                    this.style.display = "none";
            });
}

//----------------------------------------------------------------------------
/*zoom to*/
function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function (d) {
        return d.r * k;
    });
}
//------------------------------------------------------------------------------
/*draw circles */
 this.drawNodeCircle=function(nodes) {
    /*CIrcle*/
    this.circle = g.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function (d) {

                return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
            })
            .style("fill", function (d) {
                var emotions = ['uncertain', 'satisfied', 'discontent']
                if (emotions.indexOf(d['data']['name']) === -1) {
                    if (d['data']['name'] == "flare") {
                        return "#D07DA8"
                    } else {
                        return null
                    }
                } else {
                    if (emotions.indexOf(d['data']['name']) == 0) {
                        return "orange"
                    } else if (emotions.indexOf(d['data']['name']) == 1) {
                        return "#008000ab"
                    } else if (emotions.indexOf(d['data']['name']) == 2) {
                        return '#ff00006b'
                    }
                }
            })
            .on("click", function (d) {
                if (focus !== d)
                    zoom(d), d3.event.stopPropagation();
            })
}
//------------------------------------------------------------------------------
/*draw node text*/
this.drawNodeText=function(nodes){
     /*TEXT*/
        this.text = g.selectAll("text")
                .data(nodes)
                .enter().append("text")
                .attr("class", "node_label")
                .style("fill-opacity", function (d) {
                    return d.parent === root ? 1 : 0;
                })
                .style("display", function (d) {
                    return d.parent === root ? "inline" : "none";
                })
                .text(function (d) {
                    return d.data.name;
                });
this.node = g.selectAll("circle,text");
}
//------------------------------------------------------------------------------
/*plot chart*/
this.plotNodeChart=function(preparing_data) {
    root = d3.hierarchy(preparing_data)
            .sum(function (d) {
                return d.size;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });

    this.focus = root,
    this.nodes = pack(root).descendants(),
    this.view;
    this.drawNodeCircle(this.nodes)
    this.drawNodeText(this.nodes)
    /*SVG*/
    this.svg
            .style("background", "transaparent")
            .on("click", function () {
                zoom(root);
            });
    zoomTo([root.x, root.y, root.r * 2 + margin]);
}
//------------------------------------------------------------------------------
this.getStartNodeChart()
this.getNodeChartData()