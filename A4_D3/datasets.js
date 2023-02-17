// This file gathers all data files (.json) and assigns them to variables.
// The variables are then used together with renderDiagram in A4.js to update the diagram.
// And re-render.
ep_all = d3.json(
  "/starwars-interactions/starwars-full-interactions-allCharacters.json"
);
ep_1 = d3.json(
  "/starwars-interactions/starwars-episode-1-interactions-allCharacters.json"
);
ep_2 = d3.json(
  "/starwars-interactions/starwars-episode-2-interactions-allCharacters.json"
);
ep_3 = d3.json(
  "/starwars-interactions/starwars-episode-3-interactions-allCharacters.json"
);
ep_4 = d3.json(
  "/starwars-interactions/starwars-episode-4-interactions-allCharacters.json"
);
ep_5 = d3.json(
  "/starwars-interactions/starwars-episode-5-interactions-allCharacters.json"
);
ep_6 = d3.json(
  "/starwars-interactions/starwars-episode-6-interactions-allCharacters.json"
);
ep_7 = d3.json(
  "/starwars-interactions/starwars-episode-7-interactions-allCharacters.json"
);

function updateVis() {
  const selectedEpisode = document.getElementById("select_graph").value;
  const selectedEpisode_graph2 = document.getElementById("select_graph2").value;

  console.log("selectedEpisode: " + selectedEpisode);
  let filePath = "";

  switch (selectedEpisode) {
    case "0":
      filePath =
        "/starwars-interactions/starwars-full-interactions-allCharacters.json";
      break;
    case "1":
      filePath =
        "/starwars-interactions/starwars-episode-1-interactions-allCharacters.json";
      break;
    case "2":
      filePath =
        "/starwars-interactions/starwars-episode-2-interactions-allCharacters.json";
      break;
    case "3":
      filePath =
        "/starwars-interactions/starwars-episode-3-interactions-allCharacters.json";
      break;
    case "4":
      filePath =
        "/starwars-interactions/starwars-episode-4-interactions-allCharacters.json";
      break;
    case "5":
      filePath =
        "/starwars-interactions/starwars-episode-5-interactions-allCharacters.json";
      break;
    case "6":
      filePath =
        "/starwars-interactions/starwars-episode-6-interactions-allCharacters.json";
      break;
    case "7":
      filePath =
        "/starwars-interactions/starwars-episode-7-interactions-allCharacters.json";
      break;
    default:
      filePath =
        "/starwars-interactions/starwars-full-interactions-allCharacters.json";
  }

  Promise.all([d3.json(filePath)])
    .then(function (data) {
      const episodeData = data[0];

      renderDiagram(svg,"body", episodeData, svg_right);
      renderDiagram(svg_right,"body", episodeData, svg);
      console.log("renderDiagram");
    })
    .catch(function (error) {
      console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
  updateVis();
  document.getElementById("select_graph").addEventListener("change", updateVis);
  console.log("event listener added");
});