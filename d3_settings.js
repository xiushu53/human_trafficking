function display_groupData(val) {
    d3.select(".group_data").select("p").remove();
    d3.select(".group_data").select("svg").remove();
    d3.select(".group_comment").select("p").remove();

    d3.json("test6.json", function(error, graph) {

        if (error) throw error;

        // set the dimensions and margins of the graph
        var margin = {
            top: 0,
            right: 70,
            bottom: 30,
            left: 100
        };
        var chpWidth = document.getElementsByClassName("chp1")[0].clientWidth;

        var width = chpWidth - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;

        // set the ranges
        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var x = d3.scaleLinear()
            .range([0, width]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin


        var group_total = 0,
            group_nationals = 0,
            group_foreigners = 0,
            group_male = 0,
            group_female = 0,
            group_adult = 0,
            group_minor = 0;

        graph.nodes.forEach(function(d) {
            var test_val = val;
            if (d.Group_No == +test_val) {
                group_total += d.total;
                group_nationals += d.domestic;
                group_foreigners += (d.total - d.domestic);
                group_male += d.total_male;
                group_female += d.total_female;
                group_adult += d.total_adult;
                group_minor += d.total_minor;
            }
        });

        var group_data = [{
            "name": "Total victims",
            "value": group_total
        }, {
            "name": "as National",
            "value": group_nationals
        }, {
            "name": "as Foreigner",
            "value": group_foreigners
        }, {
            "name": "as Male",
            "value": group_male
        }, {
            "name": "as Female",
            "value": group_female
        }, {
            "name": "as Adult",
            "value": group_adult
        }, {
            "name": "as Minor",
            "value": group_minor
        }];

        var values_list = group_data.slice(1, group_data.length);

        var names = [];
        var values = []

        for (var i = 0; i < values_list.length; i++) {
            values.push(values_list[i].value);
            names.push(values_list[i].name);
        }



        // Scale the range of the data in the domains
        x.domain([0, d3.max(values)]);
        y.domain(names);

        console.log(group_data[0]);

        d3.select(".group_data").selectAll("p")
            .data([group_data[0]])
            .enter().append("p")
            .text(function(d) {
                console.log(d.name + ": " + d.value);
                return d.name + ": " + d.value;
            })
            .style("font-size", "24px");

        var svg = d3.select(".group_data").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(values_list)
            .enter().append("rect")
            .attr("class", "bar")
            //.attr("x", function(d) { return x(d.sales); })
            .attr("width", function(d) {
                return x(d.value);
            })
            .attr("y", function(d, i) {
                return y(names[i]);
            })
            .attr("height", y.bandwidth())
            .style("fill", function(d, i) {
                if (i < 2) {
                    return "#8dd3c7";
                } else if ((i >= 2) & (i < 4)) {
                    return "#80b1d3";
                } else {
                    return "#bebada";
                }
            });

        svg.selectAll("text.value")
            .data(values_list)
            .enter()
            .append("text")
            .attr("x", 10)
            .attr("y", function(d, i) {
                return y(names[i]) + (y.bandwidth() / 2) + 8;
            })
            .text(function(d) {
                return d.value;
            })
            .style("fill", "#444")
            .style("font-size", "24px");

        // add the y Axis
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        d3.selectAll(".tick").select("text").attr("font-size", "16px");

        var group_comments = [
            "The Asia-Pcific group is the largest network. In particular, 69% of the victims are foreigners and victims across the border are being trafficked. Also, 80% of the victims are female.",
            "In the Europe group, 73% of the victims are citizens of their country, and each country is mainly trafficking in its own country rather than cross-border trafficking. And 65% of the victims are female.",
            "The Senegal Group is a network with senegal as an exploitation site from neighboring countries. The victims number is few, however 81% of the victims are foreigners. And 96% are children and 95% are men."
        ];


        var comment = d3.select(".group_comment")
            .append("p")
            .text(group_comments[+val - 1]);
    });


};

function display_positionData(val) {

    if (val !== "continent") {


        d3.select(".position_data").select("p").remove();
        d3.select(".position_data").select("svg").remove();
        d3.select(".position_comment").select("p").remove();


        d3.json("test6.json", function(error, graph) {

            if (error) throw error;

            inout_data = [];

            graph.nodes.forEach(function(d) {
                var test_val = val;
                if (d.Group_No == +test_val) {
                    var in_value = +d.in,
                        out_value = +d.out,
                        country = d.Country_Name,
                        position = d.position;

                    var row = {
                        "country": country,
                        "in": in_value,
                        "out": out_value,
                        "position": position
                    };
                    inout_data.push(row);
                }
            });

            inout_data.sort(function(a, b) {
                if (a.out < b.out) return 1;
                if (a.out > b.out) return -1;
                return 0;
            });
            inout_data.sort(function(a, b) {
                if (a.in < b.in) return 1;
                if (a.in > b.in) return -1;
                return 0;
            });

            // set the dimensions and margins of the graph
            var margin = {
                top: 0,
                right: 30,
                bottom: 30,
                left: 10
            };

            var chpWidth = document.getElementsByClassName("chp2")[0].clientWidth;

            var tot_width = chpWidth - margin.left - margin.right;
            //height = 250 - margin.top - margin.bottom;

            var labelArea = 160;
            var chart,
                width = (tot_width - labelArea) / 2,
                bar_height = 20,
                height = bar_height * inout_data.length;
            var rightOffset = width + labelArea;

            var xFrom = d3.scaleLinear()
                .range([0, width]);
            var xTo = d3.scaleLinear()
                .range([0, width]);
            var y = d3.scaleBand()
                .rangeRound([0, height])
                .padding(0.1);

            var chart = d3.select(".position_data")
                .append('svg')
                .attr('class', 'chart')
                .attr('width', labelArea + width + width)
                .attr('height', height);

            var test = d3.extent(inout_data, function(d) {
                return d.out;
            });

            xFrom.domain(d3.extent(inout_data, function(d) {
                return d.out;
            }));
            xTo.domain(d3.extent(inout_data, function(d) {
                return d.in;
            }));

            y.domain(inout_data.map(function(d) {
                return d.country;
            }))


            var yPosByIndex = function(d) {
                return y(d.country);
            };
            chart.selectAll("rect.left")
                .data(inout_data)
                .enter().append("rect")
                .attr("x", function(d) {
                    return width - xFrom(d.out);
                })
                .attr("y", yPosByIndex)
                .attr("class", "left")
                .attr("width", function(d) {
                    return xFrom(d.out);
                })
                .attr("height", y.bandwidth())
                .style("fill", function(d) {
                    return group_color(d.position);
                })
                .style("transform", "translateY(10px)");

            chart.selectAll("text.leftscore")
                .data(inout_data)
                .enter().append("text")
                .attr("x", function(d) {
                    return width; //- xFrom(d.out) - 40;
                })
                .attr("y", function(d) {
                    return y(d.country) + y.bandwidth() / 2;
                })
                .attr("dx", "-2")
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'leftscore')
                .text(function(d) {
                    return d.out;
                })
                .style("fill", "#FFF")
                .style("transform", "translateY(10px)");

            chart.selectAll("text.name")
                .data(inout_data)
                .enter().append("text")
                .attr("x", (labelArea / 2) + width)
                .attr("y", function(d) {
                    return y(d.country) + y.bandwidth() / 2;
                })
                .attr("dy", ".20em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(function(d) {
                    return d.country;
                })
                .style("fill", function(d) {
                    return group_color(d.position);
                })
                .style("transform", "translateY(10px)");


            chart.selectAll("rect.right")
                .data(inout_data)
                .enter().append("rect")
                .attr("x", rightOffset)
                .attr("y", yPosByIndex)
                .attr("class", "right")
                .attr("width", function(d) {
                    return xTo(d.in);
                })
                .attr("height", y.bandwidth())
                .style("fill", function(d) {
                    return group_color(d.position);
                })
                .style("transform", "translateY(10px)");

            chart.selectAll("text.score")
                .data(inout_data)
                .enter().append("text")
                .attr("x", function(d) {
                    return rightOffset + 40;
                })
                .attr("y", function(d) {
                    return y(d.country) + y.bandwidth() / 2;
                })
                .attr("dx", -25)
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'score')
                .text(function(d) {
                    return d.in;
                })
                .style("fill", "#FFF")
                .style("transform", "translateY(10px)");

            chart.append("text").attr("x", width / 3).attr("y", 10).attr("class", "title").text("out degree").style("transform", "translateY(5px)");
            chart.append("text").attr("x", width / 3 + rightOffset).attr("y", 10).attr("class", "title").text("in degree").style("transform", "translateY(5px)");
            //chart.append("text").attr("x", width + labelArea / 3).attr("y", 10).attr("class", "title").text("Country").style("transform", "translateY(5px)");


            var position_comments = [
                "In the Asia-Pcific group,  four southeast asian countries are centerd on the group. They are Indonesia as the largest Relay Hub, Phillipine, Thai, Cambodia. Besides  United States is largest destination, and it is deployed in the Middle East, Asia, etc.",
                "The Europe group has a composition that is clearly separated the supplier and the exploiter countries. Eastern european countries such as Ukraine, Romania, Belarus, Moldova are the major supplier countries.",
                "The Senegal group consists of African West Coast region countries."
            ];


            var comment = d3.select(".position_comment")
                .append("p")
                .text(position_comments[+val - 1]);
        });
    }
};

function hdi_val(val) {

    d3.select(".hdi_chart").select("h4").remove();
    d3.select(".hdi_chart").select("p").remove();
    d3.select(".hdi_chart").select("svg").remove();

    var margin = {
        top: 30,
        right: 50,
        bottom: 30,
        left: 10
    };

    var chpWidth = document.getElementsByClassName("chp3")[0].clientWidth;

    var width = chpWidth - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);

    if (typeof val === "undefined") {
        var form = document.forms.hdi_forms;
        val = form.hdi.value;
    }

    d3.json("test6.json", function(error, graph) {

        if (error) throw error;

        var suplier_data = [],
            Exploiter_data = [],
            both_data = []

        var val_list = [
            "HUMA_2015",
            "GEND_2015",
            "EXPE_2015",
            "LABO_2015",
            "GROS_2015",
            "INCO_2015",
            "ESTI_2015",
            "TOTA_2015",
            "NATU_2014",
            "DEPE_2015",
            "UNDE_2015",
            "EDUC_2015",
            "MEAN_2015",
            "LIFE_2015",
            "INEQ_2015"
        ];

        var titleDesp = [
            ["HUMA_2015", "Human Development Index (HDI)", "A composite index measuring average achievement in three basic dimensions of human developmentóa long and healthy life, knowledge and a decent standard of living."],
            ["GEND_2015", "Gender Inequality Index (GII)", "A composite measure reflecting inequality in achievement between women and men in three dimensions: reproductive health, empowerment and the labour Exploiter."],
            ["EXPE_2015", "Expected years of schooling (years)", "Number of years of schooling that a child of school entrance age can expect to receive if prevailing patterns of age-specific enrolment rates persist throughout the childís life."],
            ["LABO_2015", "Labour force participation rate, female (% ages 15 and older)", "Percentage of a countryís working-age population that engages actively in the labour Exploiter, either by working or looking for work. It provides an indication of the relative size of the supply of labour available to engage in the production of goods and services."],
            ["GROS_2015", "Gross national income (GNI) per capita (2011 PPP$)", "Aggregate income of an economy generated by its production and its ownership of factors of production, less the incomes paid for the use of factors of production owned by the rest of the world, converted to international dollars using PPP rates, divided by midyear population."],
            ["INCO_2015", "Income Index", "GNI per capita (2011 PPP International $, using natural logarithm) expressed as an index using a minimum value of $100 and a maximum value $75,000."],
            ["ESTI_2015", "Estimated gross national income per capita, female (2011 PPP$)", "Derived from the ratio of female to male wages, female and male shares of economically active population and GNI (in 2011 purchasing power parity terms)."],
            ["TOTA_2015", "Total unemployment rate (% of labour force)", "Percentage of the labour force population ages 15 and older that is not in paid employment or self-employed but is available for work and has taken steps to seek paid employment or self-employment."],
            ["NATU_2014", "Natural resource depletion (% of GNI)", "Monetary expression of energy, mineral and forest depletion, expressed as a percentage of gross national income (GNI)."],
            ["DEPE_2015", "Dependency ratio, young age (0-14) (per 100 people ages 15-64)", "Ratio of the population ages 0ñ14 to the population ages 15ñ64, expressed as the number of dependants per 100 people of working age (ages 15ñ64)."],
            ["UNDE_2015", "Under-five mortality rate (per 1,000 live births)", "Probability of dying between birth and exactly age 5, expressed per 1,000 live births."],
            ["EDUC_2015", "Education Index", "Education index is an average of mean years of schooling (of adults) and expected years of schooling (of children), both expressed as an index obtained by scaling with the corresponding maxima."],
            ["MEAN_2015", "Mean years of schooling, female (years)", "Average number of years of education received by people ages 25 and older, converted from education attainment levels using official durations of each level."],
            ["LIFE_2015", "Life expectancy at birth (years)", "Number of years a newborn infant could expect to live if prevailing patterns of age-specific mortality rates at the time of birth stay the same throughout the infantís life."],
            ["INEQ_2015", "Inequality in education (%)", "Inequality in distribution of years of schooling based on data from household surveys estimated using the Atkinson inequality index."]
        ];

        var valIdx = val_list.indexOf(val);

        graph.nodes.forEach(function(d) {
            d[val_list[valIdx]] = +d[val_list[valIdx]];

            if (d.position == "Supplier") {
                if (+d[val_list[valIdx]] > 0) {
                    suplier_data.push(+d[val_list[valIdx]])
                    both_data.push(+d[val_list[valIdx]])
                }
            } else if (d.position == "Exploiter") {
                if (+d[val_list[valIdx]] > 0) {
                    Exploiter_data.push(+d[val_list[valIdx]])
                    both_data.push(+d[val_list[valIdx]])
                }
            }
        });

        var ave_data = [d3.mean(suplier_data), d3.mean(Exploiter_data)];

        x.domain(d3.extent(graph.nodes, function(d) {
            return d[val_list[valIdx]];
        }));

        d3.select(".hdi_chart").append("h4")
            .text(titleDesp[valIdx][1])
            .style("fill", "#333")
            .style("text-anchor", "start");

        d3.select(".hdi_chart").append("p")
            .text(titleDesp[valIdx][2])
            .style("fill", "#333")
            .style("text-anchor", "start");



        var svg = d3.select(".hdi_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("dot")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) {
                return x(d[val_list[valIdx]]);
            })
            .attr("cy", height * .66)
            .style("opacity", .5)
            .style("fill", function(d) {
                return group_color(d.position);
            });

        svg.append("line")
            .attr("x1", x(ave_data[0]))
            .attr("x2", x(ave_data[0]))
            .attr("y1", (height * .66) - 20)
            .attr("y2", (height * .66) + 20)
            .attr("stroke-width", 2)
            .attr("stroke", "#FB8072")
            .append("text")
            .text("Ave.");

        svg.append("text")
            .attr("x", x(ave_data[0]))
            .attr("y", (height * .66) - 22)
            .text("Supplier Ave.")
            .style("fill", "#FB8072")
            .style("text-anchor", "middle");

        svg.append("line")
            .attr("x1", x(ave_data[1]))
            .attr("x2", x(ave_data[1]))
            .attr("y1", (height * .66) - 20)
            .attr("y2", (height * .66) + 20)
            .attr("stroke-width", 2)
            .attr("stroke", "#80B1D3");

        svg.append("text")
            .attr("x", x(ave_data[1]))
            .attr("y", (height * .66) - 22)
            .text("Exploiter Ave.")
            .style("fill", "#80B1D3")
            .style("text-anchor", "middle");

        svg.append("text")
            .attr("x", x(d3.min(both_data)))
            .attr("y", (height * .66) + 40)
            .attr("dx", "-0.7em")
            .text("▲ Min " + d3.min(both_data))
            .style("fill", "#555")
            .style("text-anchor", "start");

        svg.append("text")
            .attr("x", x(d3.max(both_data)))
            .attr("y", (height * .66) + 40)
            .attr("dx", "0.5em")
            .text("Max " + d3.max(both_data) + " ▲")
            .style("fill", "#555")
            .style("text-anchor", "end");


        function group_color(position) {
            if (position == "Supplier") {
                return "#FB8072";
            } else if (position == "Exploiter") {
                return "#80B1D3";
            } else if (position == "Relay Hub") {
                return "#BC80BD";
            } else if (position == "Domestic") {
                return "#D9D9D9";
            }
        };


    });
}

function group_val(val) {

    if (typeof val === "undefined") {
        var form = document.forms.network_group;
        val = form.node_color.value;
    }

    if (val == "continent") {
        var all_nodes = document.getElementsByClassName("node");
        for (var i = 0; i < all_nodes.length; i++) {
            all_nodes[i].style.opacity = 1;
        }
    } else {
        var all_nodes = document.getElementsByClassName("node");
        for (var i = 0; i < all_nodes.length; i++) {
            all_nodes[i].style.opacity = .2;
        }
        var node = document.getElementsByClassName(val);
        for (var i = 0; i < node.length; i++) {
            node[i].style.opacity = 1;
            document.getElementsByName("node_color")[0][+val].selected = true;
        }
        display_groupData(val);
        display_positionData(val);
    }
}

function position_val(pos_val) {
    if (typeof pos_val === "undefined") {
        var pos_form = document.forms.display_position;
        pos_val = pos_form.pos_color.value;
    }

    if (pos_val == "continent") {
        var pos_node = document.getElementsByClassName("Asia");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#FDB462";
        }
        var pos_node = document.getElementsByClassName("Europe");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#BC80BD";
        }
        var pos_node = document.getElementsByClassName("Africa");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#8DD3C7";
        }
        var pos_node = document.getElementsByClassName("North America");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#FB8072";
        }
        var pos_node = document.getElementsByClassName("South America");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#FCCDE5";
        }
        var pos_node = document.getElementsByClassName("No_place");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#777777";
        }

    } else if (pos_val == "by_position") {
        var pos_node = document.getElementsByClassName("Supplier");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#FB8072";
        }
        var pos_node = document.getElementsByClassName("Exploiter");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#80B1D3";
        }
        var pos_node = document.getElementsByClassName("Relay Hub");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#BC80BD";
        }
        var pos_node = document.getElementsByClassName("Domestic");
        for (var i = 0; i < pos_node.length; i++) {
            pos_node[i].style.fill = "#D9D9D9";
        }
        document.getElementsByName("pos_color")[0][1].selected = true;

    }
}

function group_color(position) {
    if (position == "Supplier") {
        return "#FB8072";
    } else if (position == "Exploiter") {
        return "#80B1D3";
    } else if (position == "Relay Hub") {
        return "#BC80BD";
    } else if (position == "Domestic") {
        return "#D9D9D9";
    }
};

var g_width = document.getElementsByClassName('graph_area')[0].clientWidth;
var g_height = document.getElementsByClassName('graph_area')[0].clientHeight * .65;

var svg = d3.select("svg").attr("width", g_width).attr("height", g_height),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    node,
    link;

// colored by continent
function continent_color(val, data) {

    if (val == "continent") {

        if (data.Continent == "Asia") {
            return "#FDB462";
        } else if (data.Continent == "Europe") {
            return "#BC80BD";
        } else if (data.Continent == "Africa") {
            return "#8DD3C7";
        } else if (data.Continent == "North America") {
            return "#FB8072";
        } else if (data.Continent == "South America") {
            return "#FCCDE5";
        } else {
            return "#777777";
        }
    } else if (val == "1") {
        if (data.Group_No != "1") {
            return "#D9D9D9";
        } else {
            return "#BEBADA";
        }
    } else if (val == "2") {
        if (data.Group_No != "2") {
            return "#D9D9D9";
        } else {
            return "#BEBADA";
        }
    } else if (val == "3") {
        if (data.Group_No != "3") {
            return "#D9D9D9";
        } else {
            return "#BEBADA";
        }
    } else if (val == "0") {
        if (data.Group_No != "0") {
            return "#D9D9D9";
        } else {
            return "#BEBADA";
        }
    }
};

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.id;
    }))
    .force("collide", d3.forceCollide(function(d) {
        return Math.sqrt(d.total) * .7;
    }))
    .force("charge", d3.forceManyBody(1000).strength(-5))
    .force("center", d3.forceCenter(width / 2, height / 2));

// tooltips
var div = d3.select('.tooltips_area').append('div')
    .attr('class', 'tooltip')
    .style('opacity', '0')

var val = "continent";

function draw_graph(val) {

    d3.json("test6.json", function(error, graph) {
        if (error) throw error;

        display_positionData(val);


        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                return Math.sqrt(d.pop) * .2;
            })
            .style("stroke", "#AAA")
            .style("opacity", .5);

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", function(d) {
                return "node " + d.Continent + " " + d.Group_No + " " + d.position;
            })
            .attr("r", function(d) {
                return (Math.sqrt(d.total) * .4) + 3;
            })
            .style("fill", function(d) {
                return continent_color(val, d);
            })
            .style("opacity", 1)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )
            .on("click", function(d) {
                d3.select(this)
                    .transition().duration(100)
                div.transition().duration(300)
                    .style('opacity', .6);
                div.html('<h4>' + d.Country_Name + ' (' + d.position + ')</h4>' +
                        'Total victims: ' + d.total +
                        ' (Male: ' + d.total_male + ', Female: ' + d.total_female + ')' +
                        '<br>Nationals: ' + d.domestic + ' , Foreigners: ' + (d.total - d.domestic) +
                        '<br>Minor(Children): ' + d.total_minor + ' , Adults: ' + d.total_adult +
                        '<br>Is Data Counts: ' + d.is_list +
                        '<br>Type Data Counts: ' + d.type_list +
                        '<br>Means Data Counts: ' + d.means_list +
                        '<br>Recruiter Data Counts: ' + d.recruiter_list
                    )
                    .style('left', (width * .7) + 'px')
                    .style('top', (height / 10) + 'px');
            });

        node.append("title")
            .text(function(d) {
                return d.Country_Name;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }


        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    });
};

draw_graph(val);