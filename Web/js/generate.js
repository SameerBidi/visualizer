let selectedNodeName = "";
let selectedNodeId = null;

let graph = []

function addNode() {
	let nodeName = $("#node_name_input").val();
	$("#node_name_input").val('');
	let nodeHeuristicValue = $("#node_heuristic_input").val();
	$("#node_heuristic_input").val('');

	if (nodeName && nodeName != "" && nodeHeuristicValue && nodeHeuristicValue != "") {

    let alreadyExists = false;
    graph.forEach(function(node) {
      if(node.name.toLowerCase() == nodeName.toLowerCase()) alreadyExists = true; 
    });

    if(!alreadyExists) {
      nodeHeuristicValue = Number(nodeHeuristicValue);

      let nodeHolder = $("#node_holder");

      let node = $("#node").clone(true);
      node.prop("id", node.prop("id") + "_" + nodeName)
  
      let nodeNameText = node.find("#node_name_text");
      nodeNameText.prop("id", nodeNameText.prop("id") + "_" + nodeName)
      nodeNameText.html(nodeName);
  
      let nodeHeuristicText = node.find("#node_heuristic_text");
      nodeHeuristicText.prop("id", nodeHeuristicText.prop("id") + "_" + nodeName)
      nodeHeuristicText.html(nodeHeuristicValue);
  
      nodeNameText.val(nodeName);
      nodeHeuristicText.val(nodeHeuristicValue);
  
      node.off("click.gvc")
      node.on("click.gvc", function(event) {
        let clickedNode = $(this);
  
        let clickedNodeId = clickedNode.prop("id");
  
        if(clickedNodeId == selectedNodeId) {
          clickedNode.removeClass("selected");
          selectedNodeId = null;
          selectedNodeName = "";
        }
        else {
          nodeHolder.find(".node").not(":first").each(function() {
            let loopNode = $(this);
            loopNode.removeClass("selected");
            selectedNodeId = null;
            selectedNodeName = "";
          });
  
          clickedNode.addClass("selected");
          selectedNodeId = clickedNodeId;
          selectedNodeName = nodeName;
        }
  
        updateSelection();
      });

      graph.push({id: node.prop("id"), name: nodeName, heuristicValue: nodeHeuristicValue, neighbors: []});
  
      node.removeClass("d-none");
      nodeHolder.append(node);
    }
	}
}

function updateSelection() {
	let nodeUtilitiesRow = $("#node_utilities_row");
	let selNodeText = $("#sel_node_text");

	if(selectedNodeId && selectedNodeId != "") {
		selNodeText.html("Selected Node: " + selectedNodeName);

		nodeUtilitiesRow.removeClass("d-none");
	}
	else {
		selNodeText.html("Selected Node: Not Selected");

		nodeUtilitiesRow.addClass("d-none");
	}
}

function getMousePosition(event) {
  var x = event.clientX;
  var y = event.clientY + document.body.scrollTop;

  return {x, y};
}

function changePos() {
	let clickAnywhereText = $("#click_anywhere_text");

	let nodeHolder = $("#node_holder");
	nodeHolder.off("mousedown.gvc");
	nodeHolder.on("mousedown.gvc", function(event) {
		
		let node = $("#" + selectedNodeId);
		let nodeWidth = node.width();
		let nodeHeight = node.height();

		let mousePos = getMousePosition(event);

    if (typeof mousePos.x !== 'undefined') {
      node.css("left", mousePos.x - nodeWidth);
      node.css("top", mousePos.y - nodeHeight);
    }

		clickAnywhereText.addClass("d-none");
		nodeHolder.off("mousedown.gvc");
	});

	clickAnywhereText.removeClass("d-none");
}

function addNeighbor() {

  let cost = $("#node_neighbour_cost").val();
  $("#node_neighbour_cost").val('');

  if(cost && cost != "") {
    cost = Number(cost);

    let clickAnyNodeText = $("#click_any_node_text");

    let node = $("#" + selectedNodeId);
    let nodeWidth = node.width();
    let nodeHeight = node.height();
    let nodePos = node.position();
  
    let nodeHolder = $("#node_holder");
    nodeHolder.find(".node").not(":first").each(function() {
      let loopNode = $(this);
      
      if(loopNode.prop("id") != node.prop("id")) {
        loopNode.off("click.gvc_c");
        loopNode.on("click.gvc_c", function() {
          let loopNodeWidth = node.width();
          let loopNodeHeight = node.height();
          let loopNodePos = loopNode.position();
          let connectorHolder = $("#connector_holder");
  
          let connectorGroup = $("#connector_group").clone(true);
          connectorGroup.prop("id", connectorGroup.prop("id") + "_" + node.prop("id") + "_" + loopNode.prop("id"));

          let connectorLine = connectorGroup.find("line");
          let connectorText = connectorGroup.find("text");
  
          let x1 = nodePos.left + (nodeWidth);
          let y1 = nodePos.top + (nodeHeight);
          let x2 = loopNodePos.left + (loopNodeWidth);
          let y2 = loopNodePos.top + (loopNodeHeight);

          let x = ((x1 + x2) / 2) + 20;
          let y = ((y1 + y2) / 2) - 20;

          connectorLine.attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
          connectorText.attr("x", x).attr("y", y);
          connectorText.html(cost);

          graph.forEach(function(searchNode) {
            if(searchNode.id == node.prop("id")) {
              searchNode.neighbors.push({id: loopNode.prop("id"), cost: cost});
            }
          });

          connectorGroup.removeClass("d-none");
          connectorHolder.append(connectorGroup);
  
          clickAnyNodeText.addClass("d-none");
  
          nodeHolder.find(".node").not(":first").each(function() {
            $(this).off("click.gvc_c");
          });
        });
      }
  
      clickAnyNodeText.removeClass("d-none");
    });
  }
}

function exportGraphAsJSON() {
  let modal = $("#exportModal");

  modal.find("#exportText").html("<pre>" + JSON.stringify(graph, null, 4) + "</pre>");

  modal.modal("show");
}