const graph = [];
const selectedNodes = [];

let nodeHolder, node, linkHolder, linkGroup, nodeUtilDiv, selNodeText, linkNodeDiv, nodeLinkCostInput, selInfoText, deleteNodeBtn;

let mouseDown = false, isDragging = false;

let visited = [];

$(document).ready(function () {
	nodeHolder = $("div#node_holder");
	node = nodeHolder.find("svg#node");
	linkHolder = $("svg#link_holder");
	linkGroup = $("g#link_group");
	nodeUtilDiv = $("div#node_util_div");
	selNodeText = nodeUtilDiv.find("p#sel_node_text");
	linkNodeDiv = nodeUtilDiv.find("div#link_node_div");
	nodeLinkCostInput = linkNodeDiv.find("input#node_link_cost");
	selInfoText = nodeUtilDiv.find("p#sel_info_text");
	deleteNodeBtn = nodeUtilDiv.find("button#delete_node_btn");
});

function addNode(nodeName, newNodeId = null, nodeHeuristic, mousePos, isEdit = true) {
	let newNode = node.clone(true);
	if(!newNodeId || newNode == "") newNodeId = newNode.prop("id") + "_" + nodeName;
	newNode.prop("id", newNodeId);

	let newNodeCircle = newNode.find("circle");
	let newNodeNameText = newNode.find("text:nth-child(2)");
	let newNodeHeuristicText = newNode.find("text:nth-child(3)");

	newNodeNameText.html(nodeName);
	newNodeHeuristicText.html(nodeHeuristic);

	if(isEdit) {
		newNode.on("click", function(e) {
			e.stopPropagation();
	
			if(isDragging) return;
	
			if(selectedNodes.map(x => x[1]).includes(newNodeId)) {
				selectedNodes.splice(selectedNodes.findIndex(x => x[1] == newNodeId), 1);
			}
			else {
				
				for(let i = 0; i < selectedNodes.length - 1; i++) {
					selectedNodes.splice(0, 1);
				}
	
				selectedNodes.push([nodeName, newNodeId]);
			}
	
			updateSelectedNodes();
		});
	
		newNode.on("mousemove touchmove", function (e) {
			e.preventDefault();
			if (mouseDown) {
				let mousePos = getMousePosition(e);
	
				isDragging = true;
	
				updateNodePos(newNodeId, mousePos);
			}
		});
	}

	nodeHolder.append(newNode);

	let nodeWidth = newNode.width();
	let nodeHeight = newNode.height();

	if (typeof mousePos.x !== "undefined") {
		newNode.css("left", mousePos.x - (nodeWidth / 2));
		newNode.css("top", mousePos.y - (nodeHeight / 2));
	}

	newNode.removeClass("d-none");

	graph.push({ id: newNodeId, name: nodeName, heuristicValue: nodeHeuristic, neighbors: [], mousePos: mousePos, position: newNode.position(), width: nodeWidth, height: nodeHeight});
}

function updateNodePos(nodeId, mousePos) {

	graph.map(node => {
		if(node.id == nodeId) {

			let nodeEle = $("#" + nodeId);

			if (typeof mousePos.x !== "undefined") {
				nodeEle.css("left", mousePos.x - (node.width / 2));
				nodeEle.css("top", mousePos.y - (node.height / 2));
			}

			node.mousePos = mousePos;
			node.position = nodeEle.position();

			if(node.neighbors.length > 0) {
				node.neighbors.forEach(function(neighbor) {
					let linkGroup = $("#" + neighbor.linkId);
					let linkLine = linkGroup.find("line");
					let linkText = linkGroup.find("text");

					updateLinkPos(nodeId, neighbor.id, linkLine, linkText);
				});
			}

			return;
		}
	});
}

function updateSelectedNodes() {
	$(".node").each(function() {
		let node = $(this);

		let nodeCircle = node.find("circle");

		nodeCircle.css("stroke", "white");
	});

	selectedNodes.forEach(function([nodeName, nodeId]) {
		let node = $("#" + nodeId);
		let nodeCircle = node.find("circle");

		nodeCircle.css("stroke", "red");
	});

	if(selectedNodes.length > 0) {
		nodeUtilDiv.removeClass("d-none");

		selNodeText.html(selectedNodes.map(x => x[0]).join(", "));

		selectedNodes.length == 1 ? deleteNodeBtn.removeClass("d-none") : deleteNodeBtn.addClass("d-none");

		if(selectedNodes.length == 2) {
			selInfoText.addClass("d-none");
			linkNodeDiv.removeClass("d-none");
		}
		else {
			linkNodeDiv.addClass("d-none");
			selInfoText.removeClass("d-none");
		}
	}
	else {
		selNodeText.html("-");
		nodeUtilDiv.addClass("d-none");
	}
}

function link2Nodes(node1Id, node2Id, linkCost) {
	let newLinkGroup = linkGroup.clone(true);
	let linkId = newLinkGroup.prop("id") + "_" + node1Id + "_" + node2Id;
	newLinkGroup.prop("id", linkId);

	let linkLine = newLinkGroup.find("line");
	let linkText = newLinkGroup.find("text");

	updateLinkPos(node1Id, node2Id, linkLine, linkText);
	
	linkText.html(linkCost);

	graph.forEach(function(searchNode) {
		if(searchNode.id == node1Id) {
			searchNode.neighbors.push({id: node2Id, cost: linkCost, linkId: linkId});
		}
		else if(searchNode.id == node2Id) {
			searchNode.neighbors.push({id: node1Id, cost: linkCost, linkId: linkId});
		}
	});

	newLinkGroup.removeClass("d-none");
	linkHolder.append(newLinkGroup);
}

function updateLinkPos(node1Id, node2Id, linkLine, linkText) {
	let node1Pos, node1Width, node1Height, node2Pos, node2Width, node2Height;

	graph.forEach(function(searchNode) {
		if(searchNode.id == node1Id) {
			node1Pos = searchNode.position;
			node1Width = searchNode.width;
			node1Height = searchNode.height;
		}
		else if(searchNode.id == node2Id) {
			node2Pos = searchNode.position;
			node2Width = searchNode.width;
			node2Height = searchNode.height;
		}
	});

	let x1 = node1Pos.left + (node1Width / 2);
	let y1 = node1Pos.top + (node1Height / 2) + 10;
	let x2 = node2Pos.left + (node2Width / 2);
	let y2 = node2Pos.top + (node2Height / 2) + 10;

	let dx1 = x2 - x1;
	let dy1 = y2 - y1;
	let lineLength1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
	let unitVector1 = {
	  x: dx1 / lineLength1,
	  y: dy1 / lineLength1,
	};
	x1 = x1 + unitVector1.x * 20;
	y1 = y1 + unitVector1.y * 20;

	let dx2 = x1 - x2;
	let dy2 = y1 - y2;
	let lineLength2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
	let unitVector2 = {
	  x: dx2 / lineLength2,
	  y: dy2 / lineLength2,
	};
	x2 = x2 + unitVector2.x * 20;
	y2 = y2 + unitVector2.y * 20;

	let x = ((x1 + x2) / 2) + 20;
	let y = ((y1 + y2) / 2) - 20;

	linkLine.attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
	linkText.attr("x", x).attr("y", y);
}

function getMousePosition(e) {
	var x = e.clientX;
	var y = e.clientY + document.body.scrollTop;

	return { x, y };
}

function exportGraphAsJSON() {
	let modal = $("#exportModal");

	modal.find("#exportText").html("<pre>" + JSON.stringify(graph, null, 4) + "</pre>");

	modal.modal("show");
}