// This file gathers all data files (.json) and assigns them to variables.
// The variables are then used together with renderDiagram in A4.js to update the diagram.
// And re-render.
async function updateVis() {
  const filePaths = [
    "/starwars-interactions/starwars-full-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-1-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-2-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-3-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-4-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-5-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-6-interactions-allCharacters.json",
    "/starwars-interactions/starwars-episode-7-interactions-allCharacters.json",
  ];

  const selectedEpisode = document.getElementById("select_graph").value;
  const selectedEpisodeRight = document.getElementById("select_graph_right").value;

  console.log("Episode, left: " + selectedEpisode);
  console.log("Episode, right: " + selectedEpisodeRight);

  renderDiagram(svg, "body", await d3.json(filePaths[selectedEpisode]));
  renderDiagram(svg_right, "body", await d3.json(filePaths[selectedEpisodeRight]));
}

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
  
  updateVis();
  document.getElementById("select_graph").addEventListener("change", updateVis);
  document.getElementById("select_graph_right").addEventListener("change", updateVis);
  console.log("event listener added");
});

