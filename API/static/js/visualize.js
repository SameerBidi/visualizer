let visualizeUtilDiv, algoSelect, startNodeSelect, goalNodeSelect, delayInput;

let visualizeDiv, graphTableHolder, graphTableDiv;

$(document).ready(function() {

    visualizeUtilDiv = $("div#visualize_util_div");
    algoSelect = visualizeUtilDiv.find("select#algo_select");
    startNodeSelect = visualizeUtilDiv.find("select#start_node_select");
    goalNodeSelect = visualizeUtilDiv.find("select#goal_node_select");
    delayInput = visualizeUtilDiv.find("input#delay_input");

    visualizeDiv = $("div#visualize_div");
    graphTableHolder = visualizeDiv.find("div#graph_table_holder");
    graphTableDiv = graphTableHolder.find("div#graph_table_div");

    let currentGraphJson = localStorage.getItem("graph_to_visualize");
    //localStorage.removeItem("graph_to_visualize");

    if(!currentGraphJson || currentGraphJson == "") {
        alert("Invalid Graph");
        return;
    }

    let currentGraph = JSON.parse(currentGraphJson);

    generateGraph(currentGraph);
});

function generateGraph(currentGraph) {
    currentGraph.forEach(graphNode => {
        addNode(graphNode.name, graphNode.id, graphNode.heuristicValue, graphNode.mousePos, false);
        startNodeSelect.append("<option value='" + graphNode.id + "'>" + graphNode.name + "</option>");
        goalNodeSelect.append("<option value='" + graphNode.id + "'>" + graphNode.name + "</option>");
    });

    currentGraph.forEach(graphNode => {
        graphNode.neighbors.forEach(neighbor => {
            if(!graph.find(x => x.id == neighbor.id && x.neighbors.length > 0 && x.neighbors.find(y => y.id == graphNode.id))) {
                link2Nodes(graphNode.id, neighbor.id, neighbor.cost);
            }
        });
    });
}

function visualize() {
    let algo_id = algoSelect.val();
    let start_node_id = startNodeSelect.val();
    let goal_node_id = goalNodeSelect.val();
    let delay = delayInput.val();

    if(!algo_id || algo_id == "" || !start_node_id || start_node_id == "" || !goal_node_id || goal_node_id == "" || !delay || delay == "") {
        alert("Invalid Input");
        return;
    }

    algo_id = parseInt(algo_id);
    delay = parseFloat(delay);
    
    doAjaxPost(
        "/get_viz_out",
        JSON.stringify({"graph": graph, "algo_id": algo_id, "start_node_id": start_node_id, "goal_node_id": goal_node_id}),
        function(response) {
            if(response.success) {
                animateGraphRecursive(response.output.split("\n"), 0, null, null, null, delay);
            }
        },
        function(error) {
            console.error(error);
        }
    );
}

function animateGraphRecursive(algoLines, nextIdx, prevNodeFromEle, prevNodeToEle, prevLinkLine, delay) {
    setTimeout(function() {
        if(prevNodeFromEle) prevNodeFromEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
		if(prevNodeToEle) prevNodeToEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
		if(prevLinkLine) prevLinkLine.removeClass("link-animated").addClass("link-normal");

        let algoLine = algoLines[nextIdx].trim();

        let [command_type, command] = algoLine.split(":");
        
        if(command_type == "add_table") {
            let newGraphTableDiv = graphTableDiv.clone(true);
            newGraphTableDiv.prop("id", newGraphTableDiv.prop("id") + "_" + command);

            let graphTable = newGraphTableDiv.find("table#graph_table");
            graphTable.prop("id", graphTable.prop("id") + "_" + command);

            let graphTableHead = graphTable.find("thead > tr > th");

            graphTableHead.html(command);

            newGraphTableDiv.removeClass("d-none");

            graphTableHolder.append(newGraphTableDiv);
        }
        else if(command_type == "set_table_values") {
            
            let [table_name, values] = command.split("|");

            let graphTable = graphTableHolder.find("table#graph_table_" + table_name);
            let graphTableTbody = graphTable.find("tbody");

            console.log(graphTableTbody.find("tr:not(:first)"));

            graphTableTbody.find("tr:not(:first)").remove();

            let value_list = values.split(",");
            
            value_list.forEach(value => {
                let graphTableRow = graphTableTbody.find("tr:first").clone(true);

                graphTableRow.find("td").html(value);

                graphTableRow.removeClass("d-none");

                graphTableTbody.append(graphTableRow);
            });
        }
        else if(command_type == "move") {
            let [nodeFromId, nodeToId] = command.split(">");

            console.log(nodeFromId, nodeToId);

            let nodeFrom = graph.find(x => x.id == nodeFromId);
            let nodeTo = graph.find(x => x.id == nodeToId);
    
            let nodeFromEle = $("#" + nodeFromId);
            let nodeToEle = $("#" + nodeToId);
            let linkLine = $("#" + nodeFrom.neighbors.find(x => x.id == nodeToId).linkId);

            nodeFromEle.removeClass("node-visited").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-animated").addClass("node-animated-from");
            nodeToEle.removeClass("node-visited").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-animated").addClass("node-animated-to");
            linkLine.removeClass("link-normal").addClass("link-animated");

            if(algoLines.length - 1 > nextIdx) {
                animateGraphRecursive(algoLines, nextIdx + 1, nodeFromEle, nodeToEle, linkLine, delay);
                return;
            }
            else {
                setTimeout(function() {
                    nodeFromEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
                    nodeToEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
                    linkLine.removeClass("link-animated").addClass("link-normal");
                }, delay);
            }
        }

        if(algoLines.length - 1 > nextIdx) animateGraphRecursive(algoLines, nextIdx + 1, prevNodeFromEle, prevNodeToEle, prevLinkLine, delay);
    }, delay)
}