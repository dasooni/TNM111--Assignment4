// set the dimensions of the canvas
width = 800;
height = 700;

// for zooming and panning
var transform = d3.zoom()
  .scaleExtent([0.2, 5]) // unzoom (x0.5) and zoom (x20)
  .translateExtent([[-width * 5, -height * 5],
    [width*5 , height*5],]) // this control how much you can pan
  .extent([[0, 0],[width, height],
  ]);

// select the svg object to the body of the page
const svg = d3.select("#graph1_svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width, -height, width*2, height*2])
  .call(d3.zoom().on("zoom", (event) => {
      svg.attr("transform", event.transform);
    })
  )
  .append("g")
  
// select the other svg, on the right side.
const svg_right = d3.select("#graph2_svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width, -height, width*2, height*2])
  .call(transform.on("zoom", (event) => {
        svg_right.attr("transform", event.transform);
      })
  )
  .append("g");

// Function to clear the diagram, to avoid drawing on top, see updateVis()
function clearDiagram(svg) {
  svg.selectAll("*").remove();
}

// Function to render the diagram. All rendering is done here.
function renderDiagram(svg, id, data) {
  clearDiagram(svg); // Clear the diagram before rendering

  // links (edges)
  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  var tooltip = d3.select(id)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .text("tooltip");

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => (5 * Math.sqrt(d.value)))
    .style("fill", function (d) {
      return d.colour;
    
    })
    .style("stroke", function (d) {
      return d.colour;
    });


  //bonus, node names on hover
  node.append("title").text((d) => String(d.name));

  link.on("mouseover", (event, d) => {
    // Show d.name in tooltip¨
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip
      .html(
        "<b>" + d.source.name + "</b>" + 
        " and: " + "<b>" + d.target.name + "</b>" +"<br>" +
        " Number of scenes together: " + "<b>" + d.value + "</b>" + "</br>"
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 28 + "px");
  });

  node.on("mouseover", (event, d) => {
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip
      .html( "<b>" + d.name + "</b>" + "<br>" +
      " Number of scenes: " + "<b>" + d.value + "</b>" + "</br>"
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 28 + "px");
  });

    //click behaviour, highlighting links.
  d3.selectAll(".nodes").selectAll("circle").on("click", (event, d) => {
    d3.selectAll(".links").selectAll("line")
      .style("stroke", (l) => {
          if (l.source === d || l.target === d) {
            //console.log(l);
            return "red";
          } else {
            return "#999";
          }
        })
      .style("stroke-opacity", (l) => {
          if (l.source === d || l.target === d) {
            return 1;
          } else {
            return 0.6;
          }
        });
  });

  //hide tooltip on mouseout
  node.on("mouseout", (d) => {
    tooltip.transition()
    .duration(200).style("opacity", 0);
  });

  link.on("mouseout", (d) => {
    tooltip.transition()
    .duration(200).style("opacity", 0);
  });

  const simulation = d3.forceSimulation(data.nodes)
    .force("link",d3.forceLink()
        .id((d) => d.index)
        .links(data.links))
    .force("charge", d3.forceManyBody().strength(-500).distanceMin(100))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);

  // tick function, called on every tick of the simulation
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  }

  /* drag functions */
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  // call drag behaviour
  node.call(drag(simulation));
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
  if (
    (svg1box.checked == false && svg2box.checked == false) ||
    (edges.checked == false && nodes.checked == false)
  ) {
    d3.selectAll(".links").selectAll("line").style("opacity", "1.0");

    d3.selectAll(".nodes").selectAll("circle").style("opacity", "1.0");
  }

  //if a diagram and filter type is chosen, do the filtering
  else {
    if (svg1box.checked == true && svg2box.checked == true)
      filtersvg = "#graph1_svg,#graph2_svg";
    else if (svg1box.checked == true) filtersvg = "#graph1_svg";
    else if (svg2box.checked == true) filtersvg = "#graph2_svg";

    if (edges.checked == true) {
      d3.selectAll(filtersvg)
        .selectAll(".links")
        .selectAll("line")
        .style("opacity", function (l) {
          if (l.value >= min && l.value <= max) {
            return "1.0";
          } else {
            return "0.15";
          }
        });
    }

    if (nodes.checked == true) {
      d3.selectAll(filtersvg)
        .selectAll(".nodes")
        .selectAll("circle")
        .style("opacity", function (l) {
          if (l.value >= min && l.value <= max) {
            return "1.0";
          } else {
            return "0.3";
          }
        });
    }
  }
}

