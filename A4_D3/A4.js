// set the dimensions and margins of the graph

width = 800;
height = 800;

const svg = d3.select("#ep1") 
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
const svg_right = d3.select("#ep_all")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")

ep_all = d3.json("/starwars-interactions/starwars-full-interactions-allCharacters.json")

d3.json("/starwars-interactions/starwars-episode-1-interactions-allCharacters.json").then (function (data) {
    console.log(data.nodes)
    const link = svg.selectAll("line")
        .data(data.links)
        .join("line")
            .style("stroke", "#aaa")
    
    
    const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
            .attr("r", 20)
            .style("fill", function(d) {return d.colour})
        .on("mouseover", function mouseover() {
            d3.select(this).select("circle").transition()
            .duration(500)
            console.log (function(d) {return String (d.name)})

        })


    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink()
            .id(function(d) {return d.index})
            .links(data.links)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width/2, height/2))
        .on("end", ticked)

    function ticked() {

        link
        .attr("x1", function(d) {return d.source.x})
        .attr("y1", function(d) {return d.source.y})
        .attr("x2", function(d) {return d.target.x})
        .attr("y2", function(d) {return d.target.y})
        
        node
            .attr("cx", function (d) {return d.x+6})
            .attr("cy", function (d) {return d.y-6})

    
    }
})




