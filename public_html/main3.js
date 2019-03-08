$(document).ready(function () {
      var chartData = [];
      var emotions = []
    startEventDropChart()
    function startEventDropChart() {
        $.getJSON("data.json", function (data) {
            var data = getChartData(data)
            const numberCommitsContainer = document.getElementById('numberCommits');
            const zoomStart = document.getElementById('zoomStart');
            const zoomEnd = document.getElementById('zoomEnd');
            const updateCommitsInformation = chart => {
                const filteredData = chart
                        .filteredData()
                        .reduce((total, repo) => total.concat(repo.data), []);

                numberCommitsContainer.textContent = filteredData.length;
                zoomStart.textContent = humanizeDate(chart.scale().domain()[0]);
                zoomEnd.textContent = humanizeDate(chart.scale().domain()[1]);
            };
            const tooltip = getTooltip()

            const chart = eventDrops({
                d3,
                zoom: {
                    onZoomEnd: () => updateCommitsInformation(chart),
                },
                drop: {
                    date: d => new Date(d.date),
                    onMouseOver: commit => {
                        tooltip
                                .transition()
                                .duration(200)
                                .style('opacity', 1)
                                .style('pointer-events', 'auto');

                        tooltip
                                .html(
                                        `
                    <div class="commit">
                    <div class="content">
                        <h3 class="message">Agent : ${commit.agent}</h3>
                         <span class="date">Call Date: ${humanizeDate(
                                                new Date(commit.date)
                                                )}</span><br>
                         <span class="date">Avg Call Time :${commit.avgCallTime}
                                            </span><br>
                         <span class="date">Department :${commit.department}
                                            </span><br>
                         <span class="date">Client :${commit.client}
                                            </span><br>
                    </div>
                `
                                        )
                                .style('left', `${d3.event.pageX - 30}px`)
                                .style('top', `${d3.event.pageY + 20}px`);
                    },
                    onMouseOut: () => {
                        tooltip
                                .transition()
                                .duration(500)
                                .style('opacity', 0)
                                .style('pointer-events', 'none');
                    },
                },
            });
            const repositoriesData = data.map(repository => ({

                    name: repository.emotion,
                    data: repository.callDetails,
                }));
            
            plotChart(repositoriesData, chart)
            updateCommitsInformation(chart);
        });
    }
    
  //----------------------------------------------------------------------  
/*Function for get chart data*/
        function getChartData(data) {
        var nested = d3.nest()
                .key(function (d) {
                    return d.emotion
                })
                .entries(data);
        console.log('nested',nested)
        nested.forEach(function (v, k) {
            v.values.forEach(function (v1, k1) {
                var callDetails = [];
                v1.cdata.forEach(function (v2, k2) {
                    callDetails.push({
                        'date': v2['call_timestamp'],
                        'agent': v1.first_name + " " + v1.last_name,
                        'avgCallTime':v1.average_call_time,
                        'department':v2.department,
                        'client':v2.client
                    })
                })
                if (emotions.indexOf(v['key']) === -1) {
                    chartData.push({
                        'emotion': v['key'],
                        'callDetails': callDetails
                    })
                    emotions.push(v['key'])
                } else {
                    callDetails.forEach(function (v3, k3) {
                        chartData.some(function (o, k) {
                            if(o['emotion'] === v['key']){
                                chartData[k]['callDetails'].push(v3)
                            }
                        })
                    })
                }
            });
        })
        function compare(a, b) {
          if (b.emotion < a.emotion)
            return -1;
          if (b.emotion > a.emotion)
            return 1;
          return 0;
        }
        chartData.sort(compare)
        return chartData
    }
  //------------------------------------------------------------------- 
  /*Tooltip*/
    function getTooltip() {
        return d3
                .select('body')
                .append('div')
                .classed('tooltip', true)
                .style('opacity', 0)
                .style('pointer-events', 'auto');
    }
   //------------------------------------------------------------------- 
    /*chart plotting*/
    function plotChart(repositoriesData, chart) {
        console.log('chart',chart,repositoriesData)
        d3
                .select('#eventdrops-demo')
                .data([repositoriesData])
                .call(chart);
    }
    //----------------------------------------------------------------------
//     $(window).resize(function () {
//        var width = $('#eventdrops-demo').width()
//        console.log('width', width)
//        $('.event-drop-chart').attr('width', width)
//         chartData = [];
//         emotions = []
//        replotChart()
//    });
    //--------------------------------------------------------------------

});
