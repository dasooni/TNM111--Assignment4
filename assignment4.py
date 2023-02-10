import json
import networkx as nx
import plotly.graph_objects as go

ep1 = open('starwars-interactions/starwars-episode-1-interactions-allCharacters.json' , 'r')
all_ep = open('starwars-interactions/starwars-full-interactions-allCharacters.json' , 'r')

data_ep1 = json.load(ep1)
data_all = json.load(all_ep)

def create_graph(data):
    # Extract nodes and edges
    nodes = data['nodes']
    edges = data['links']

    # Prepare networkx graph
    G = nx.Graph()

    # Add nodes to the graph
    for node in nodes:
        G.add_node(node['name'], 
        value = node['value'], 
        color = node['colour'])
    # Add edges to the graph
    for edge in edges:
        G.add_edge(nodes[edge['source']]['name'], 
        nodes[edge['target']]['name'], 
        value=edge['value'])
    pos = nx.spring_layout(G)
    for node in G.nodes():
        G.nodes[node]['pos'] = list(pos[node])
    
    node_trace = go.Scatter(
        x=[],
        y=[],
        text=[],
        mode='markers',
        hoverinfo='text',
        marker=dict(
            showscale=True,
            colorscale='YlGnBu',
            reversescale=True,
            color=[],
            size=10,
            colorbar=dict(
                thickness=15,
                title='Node Connections',
                xanchor='left',
                titleside='right'
            ),
        line_width=2
    ))

    for node in G.nodes():
        x, y = G.nodes[node]['pos']
        node_trace['x'] += tuple([x])
        node_trace['y'] += tuple([y])

    node_adjacencies = []
    node_text = []

    for node, adjacencies in enumerate(G.adjacency()):
        node_adjacencies.append(len(adjacencies[1]))
        node_text.append(adjacencies[0])

    node_trace.marker.color = node_adjacencies
    node_trace.text = node_text

    edge_trace = go.Scatter(
        x=[],
        y=[],
        line=dict(width=0.5,color='#888'),
        hoverinfo='none',
        mode='lines'
    )

    for edge in G.edges():
        x0, y0 = G.nodes[edge[0]]['pos']
        x1, y1 = G.nodes[edge[1]]['pos']
        edge_trace['x'] += tuple([x0, x1, None])
        edge_trace['y'] += tuple([y0, y1, None])

    fig = go.Figure(data=[edge_trace, node_trace],
                layout=go.Layout(
                    title='title',
                    titlefont_size=16,
                    showlegend=False,
                    hovermode='closest',
                    margin=dict(b=20,l=5,r=5,t=40),
                    annotations=[ dict(
                        showarrow=False,
                        xref="paper", yref="paper",
                        x=0.005, y=-0.002 ) ],
                    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)))
    fig.show()

G_ep1 = create_graph(data_ep1)




