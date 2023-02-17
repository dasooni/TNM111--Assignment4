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
    
    //handle links
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.value) });

    //tooltip activated on hover
    var tooltip = d3.select(id).append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .text("tooltip");
    // handle nodes
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

    //hover behaviour
    node.on("mouseover", function mouseover(event, d) {
        // Show d.name in tooltip¨
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip
            .html(d.name)
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

    // force simulation, physics & stuff
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

