// set the dimensions of the canvas
width = 500;
height = 500;

// For zoomig and panning.
var transform = d3.zoom()
    .scaleExtent([0.5, 2])  // unzoom (x0.5) and zoom (x20)
    .translateExtent([[-100, -100], [width + 90, height + 100]]) // This control how much you can pan
    .extent([[0, 0], [width, height]]);// This is where the magic happens

// append the svg object to the body of the page
const svg = d3.select("#graph1_svg") 
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().on("zoom", function (event) {
            transform = event.transform;
            svg.attr("transform", transform);
        }))
    .append("g");

// Append another svg, on the right side. 
const svg_right = d3.select("#graph2_svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().on("zoom", function (event) {
            transform = event.transform;
            svg_right.attr("transform", transform);
        }))
    .append("g");

// Function to clear the diagram, to avoid drawing on top, see updateVis()
function clearDiagram(svg) {
    svg.selectAll("*").remove();
}

// Function to render the diagram. All rendering is done here.
function renderDiagram(svg, id, data, svg2) {
    clearDiagram(svg); // Clear the diagram before rendering
    
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.value) });

    var tooltip = d3.select(id).append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .text("tooltip");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", function (d) { return d.value * Math.PI/6})
        .style("fill", function (d) { return d.colour });

    //bonus, node names on hover
    node.append("title")
        .text(function (d) { return String(d.name) });
    
    node.on("mouseover", function mouseover(event, d) {
        // Show d.name in tooltip¨
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip
            .html("Source: " + "<b>" + d.source.name + "</b>" 
            + "<br>" + " Target: " + "<b>" + d.target.name + "</b>" + "</br"
             + "<br>" + " Value: " + "<b>" + d.value + "</b>" + "</br")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
    });
    
    node.on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip
            .html("<b>" + d.name + "</b>" 
            + "<br>" + " Value: " + "<b>" +  d.value + "</b>"+ "</br>")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
    });

    //hide tooltip on mouseout
    node.on("mouseout", function mouseout(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    //click behaviour, highlighting links. 
    node.on("click", function mouseclick(event, d) {
        d3.selectAll(".links").selectAll("line")
            .style("stroke", function (l) {
                if (l.source === d || l.target === d) {
                    return "red";
                } else {
                    return "#999";
                }
            })
            .style("stroke-opacity", function (l) {
                if (l.source === d || l.target === d) {
                    return 1;
                } else {
                    return 0.6;
                }
            });
    });

    
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink()
            .id(function (d) { return d.index })
            .links(data.links)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    // tick function, called on every tick of the simulation
    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x })
            .attr("y1", function (d) { return d.source.y })
            .attr("x2", function (d) { return d.target.x })
            .attr("y2", function (d) { return d.target.y })

        node
            .attr("cx", function (d) { return d.x })
            .attr("cy", function (d) { return d.y })
    }

    // drag behaviour
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    /* drag functions */
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    /* end drag functions */

}

//range slider script
let rangeMin = 0;
const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".range-input input");
const rangePrice = document.querySelectorAll(".range-price input");

rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minRange = parseInt(rangeInput[0].value);
      let maxRange = parseInt(rangeInput[1].value);
      if (maxRange - minRange < rangeMin) {     
        if (e.target.className === "min") {
          rangeInput[0].value = maxRange - rangeMin;        
        } else {
          rangeInput[1].value = minRange + rangeMin;        
        }
      } else {
        range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
        range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
      }
      //console.log(rangeInput[0].value+" "+rangeInput[1].value);
      //anropa render, med filter
      filter(rangeInput[0].value, rangeInput[1].value);
    });  
});

//filter according to selected range
function filter(min, max) {
    nodes = document.getElementById("checkbox_nodes");
    edges = document.getElementById("checkbox_edges");
    svg1box = document.getElementById("checkbox_svg1");
    svg2box = document.getElementById("checkbox_svg2");
    
    //reset if nothing is to be filtered
    if(svg1box.checked==false && svg2box.checked==false || edges.checked==false && nodes.checked==false)
    {
        d3.selectAll(".links").selectAll("line")
        .style("opacity", "1.0");

        d3.selectAll(".nodes").selectAll("circle")
        .style("opacity", "1.0");
    }

    //if a diagram and filter type is chosen, do the filtering
    else
    {
        if(svg1box.checked==true && svg2box.checked==true) filtersvg = "#graph1_svg,#graph2_svg";
        else if(svg1box.checked==true) filtersvg = "#graph1_svg";
        else if(svg2box.checked==true) filtersvg = "#graph2_svg";

        if(edges.checked == true)
        {
            d3.selectAll(filtersvg).selectAll(".links").selectAll("line")
                .style("opacity", function (l) {
                    if (l.value >= min && l.value <= max) {
                        return "1.0";
                    } else {
                        return "0.15";
                    }
                });
        }

        if(nodes.checked == true)
        {
            d3.selectAll(filtersvg).selectAll(".nodes").selectAll("circle")
                .style("opacity", function (l) {
                    if (l.value >= min && l.value <= max) {
                        return "1.0";
                    } else {
                        return "0.3";
                    }
                });
        }

    }

};
