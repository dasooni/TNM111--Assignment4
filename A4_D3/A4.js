// set the dimensions of the canvas
width = 800;
height = 800;

var transform = d3.zoom()
    .scaleExtent([0.5, 2])  // This control how much you can unzoom (x0.5) and zoom (x20)
    .translateExtent([[-100, -100], [width + 90, height + 100]]) // This control how much you can pan
    .extent([[0, 0], [width, height]]);// This is where the magic happens


const svg = d3.select("#graph1") 
    .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().on("zoom", function (event) {
            transform = event.transform;
            svg.attr("transform", transform);
        }))
        .append("g");

const svg_right = d3.select("#graph2")
    .append("svg")
        .attr("width", width)
        .attr("height", height);

        

ep_all = d3.json("/starwars-interactions/starwars-full-interactions-allCharacters.json")
ep_all.then (function (data) {
    console.log(data.nodes)
    console.log(data.links)


    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", function(d) {return Math.sqrt(d.value)})

    var tooltip = d3.select("#graph1").append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .text("tooltip")    

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .style("fill", function(d) {return d.colour});

    node.append("title")
        .text(function(d) {return String (d.name)})


    node.on("mouseover", function mouseover(event,d) {
        // Show d.name in tooltip¨

        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip
            .html(d.name)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
    });

    node.on("mouseout", function mouseout(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);   
        });
        
    
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink()
            .id(function(d) {return d.index})
            .links(data.links)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width/2, height/2))
        .on("tick", ticked)

    function ticked() {

        link
        .attr("x1", function(d) {return d.source.x})
        .attr("y1", function(d) {return d.source.y})
        .attr("x2", function(d) {return d.target.x})
        .attr("y2", function(d) {return d.target.y})
        
        node
        .attr("cx", function (d) {return d.x})
        .attr("cy", function (d) {return d.y})

    }

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

    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

})





