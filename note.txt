If two characters speak together within the same scene, they have been connected. 

starwars-full-interactions-allCharacters.json contains the social network extracted from all episodes

starwars-episode-#-interactions-allCharacters.json are the social network for each individual Star Wars episode.

The json files contain Nodes and Links, and the attributes are explained as follows: 

Nodes represent characters: (vertices)
• name: Name of the character. 
• value: Number of scenes the character appeared in. 
• colour: A color value suggested within the source dataset to differentiate the main characters. However, you are free to use other color mappings of your choice. 


Links represent connections between characters: (edges)
• source: zero-based index of the character that is one end of the link, the order of nodes is the order in which they are listed in the “nodes” element. 
• target: zero-based index of the character that is the other end of the link. 
• value: Number of scenes where the “source character” and “target character” of the link appeared together.


Requirements:

• Node-link diagram to visualize character relationships.
• Two instances of the node-link diagram to support visual comparison of two network states.
• Control panels (sliders, menus) where necessary.
• Brushing and linking of node representations. Like clicking on a node highlights it, and if another diagram has the node its also highlighted.
• Display details on demand for both nodes and edges.

• Support interactive filtering of the network data with respect to edge weights, e.g., 
display the nodes and/or edges (links) between nodes depending on the edge weight filter, 
as selected dynamically by the user using, for example, range sliders and additional controls 
(e.g., checkmarks to enable/disable filtering for the edges and the respective nodes separately). 
Use the starwars-full-interactions-allCharacters.json-file for this task.