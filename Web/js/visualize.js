$(document).ready(function() {
    let currentGraphJson = localStorage.getItem("graph_to_visualize");
    //localStorage.removeItem("graph_to_visualize");

    if(!currentGraphJson || currentGraphJson == "") {
        alert("Invalid Graph");
        return;
    }

    let currentGraph = JSON.parse(currentGraphJson);

    generateGraph(currentGraph);

    console.log(graph);
});

function generateGraph(currentGraph) {
    currentGraph.forEach(graphNode => {
        addNode(graphNode.name, graphNode.id, graphNode.heuristicValue, graphNode.mousePos, false);
    });

    currentGraph.forEach(graphNode => {
        graphNode.neighbors.forEach(neighbor => {
            if(!graph.find(x => x.id == neighbor.id && x.neighbors.length > 0 && x.neighbors.find(y => y.id == graphNode.id))) {
                link2Nodes(graphNode.id, neighbor.id, neighbor.cost);
            }
        });
    });
}