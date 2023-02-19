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
  // const selectedEpisodeRight = document.getElementById("select_graph_right").value;
  console.log("Left window episode : " + selectedEpisode);
  // console.log("Right window episode : " + selectedEpisodeRight);

  let filePath = filePaths[selectedEpisode] || filePaths[0];
  //let filePathRight = filePaths[selectedEpisodeRight] || filePaths[0];

  Promise.all([d3.json(filePath)])
    .then((data) => {
      const episodeData = data[0];

      renderDiagram(svg, "body", episodeData);
      renderDiagram(svg_right, "body", episodeData);
      console.log("renderDiagram");
    })
    .catch((error) => {
      console.log("Unfullfilled promise " + error);
    });

    
}

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    updateVis();
    document.getElementById("select_graph").addEventListener("change", updateVis);
    // document.getElementById("select_graph_right").addEventListener("change", updateVis);
    console.log("Waiting to update");
  });