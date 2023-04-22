const graph = [];
const selectedNodes = [];

let addModal, addNodeNameInput, addHeuristicInput, addNodeBtn;

let nodeHolder, node, linkHolder, linkGroup, nodeUtilDiv, selNodeText, linkNodeDiv, nodeLinkCostInput, selInfoText, deleteNodeBtn;

let mouseDown = false, isDragging = false;

let visited = [];

$(document).ready(function () {

	addModal = $(".modal#add_modal");
	addNodeNameInput = addModal.find("input#add_node_name_input");
	addHeuristicInput = addModal.find("input#add_heuristic_input");
	addNodeBtn = addModal.find("button#add_node_btn");

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

	addModal.on("hide.bs.modal", function () {
		addNodeBtn.off("click");
	});

	addNode("0", null, {x: 208, y: 197});
	addNode("1", null, {x: 540, y: 198});
	addNode("2", null, {x: 534, y: 382});
	addNode("3", null, {x: 196, y: 384});
	addNode("4", null, {x: 350, y: 523});
	addNode("5", null, {x: 711, y: 307});
	addNode("6", null, {x: 636, y: 500});

	link2Nodes("node_0", "node_1", null);
	link2Nodes("node_0", "node_3", null);
	link2Nodes("node_1", "node_2", null);
	link2Nodes("node_3", "node_2", null);
	link2Nodes("node_3", "node_1", null);
	link2Nodes("node_1", "node_6", null);
	link2Nodes("node_2", "node_4", null);
	link2Nodes("node_4", "node_6", null);
	link2Nodes("node_1", "node_5", null);
	link2Nodes("node_2", "node_5", null);
	link2Nodes("node_3", "node_4", null);
	

	// addNode("A", 6, {x: 300, y: 500});
	// addNode("B", 11, {x: 400, y: 300});
	// addNode("C", 5, {x: 550, y: 600});
	// addNode("D", 9, {x: 700, y: 400});

	// link2Nodes("node_A", "node_C", 6);

	$(".draw-board").on('mousedown touchstart', function (e) {
		e.preventDefault();
		isDragging = false;
		mouseDown = true;
	});

	$(document).on('mouseup touchend', function (e) {
		
		mouseDown = false;
	});

	drawBoardClicks();
	
	animateRecursive("node_0", "node_0");
});

function animateRecursive(currNodeId, prevNodeId, prevLinkId) {
	setTimeout(function() {
		let currNode = graph.find(x => x.id == currNodeId);

		let currNodeEle = $("#" + currNodeId);
		let prevNodeEle = $("#" + prevNodeId);
		let prevLinkLine = $("#" + prevLinkId);

		prevNodeEle.removeClass("node-animated").addClass("node-normal");
		prevLinkLine.removeClass("link-animated").addClass("link-normal");

		currNodeEle.removeClass("node-normal").addClass("node-animated");

		visited.push(currNodeId);

		if(currNode.neighbors.length > 0) {
			let neighbor = currNode.neighbors.find(x => !visited.includes(x.id));

			let linkLine = $("#" + neighbor.linkId);

			linkLine.removeClass("link-normal").addClass("link-animated");

			animateRecursive(neighbor.id, currNodeId, neighbor.linkId);
		}
	}, 1000);
}

function animate() {
	let lastNodeEle;
	graph.forEach(function(node, idx) {
		setTimeout(function() {
			nodeEle = $("#" + node.id);
			lastNodeEle = nodeEle;

			

		}, 1000 * idx);
	});

	setTimeout(function() {
		if(lastNodeEle) {
			lastNodeEle.removeClass("node-animated").addClass("node-normal");
		}
	}, 1000 * graph.length);
}

function drawBoardClicks() {
	$(".draw-board").on("dblclick", function (e) {
		e.preventDefault();

		mousePos = getMousePosition(e);

		addNodeBtn.on("click", function (e) {
			let nodeName = addNodeNameInput.val()
			let heuristic = addHeuristicInput.val()

			if (!nodeName || nodeName == "") {
				alert("Please enter node name");
				return;
			}

			heuristic && heuristic != "" ? heuristic = parseInt(heuristic) : heuristic = null;

			let alreadyExists = false;
			graph.forEach(function(node) {
				if(node.name.toLowerCase() == nodeName.toLowerCase()) alreadyExists = true; 
			});

			if(alreadyExists) {
				alert("Node already exists!");
				return;
			}

			addNode(nodeName, heuristic, mousePos);

			addNodeNameInput.val(null);
			addHeuristicInput.val(null);
			addModal.modal("hide");

			console.log(graph);
		});

		addModal.modal("show");
	});

	$(".draw-board").on("click", function(e) {
		selectedNodes.splice(0, selectedNodes.length);
		console.log(getMousePosition(e));
		updateSelectedNodes();
	});
} 

function addNode(nodeName, nodeHeuristic, mousePos) {
	let newNode = node.clone(true);
	let newNodeId = newNode.prop("id") + "_" + nodeName;
	newNode.prop("id", newNodeId);

	let newNodeCircle = newNode.find("circle");
	let newNodeNameText = newNode.find("text:nth-child(2)");
	let newNodeHeuristicText = newNode.find("text:nth-child(3)");

	newNodeNameText.html(nodeName);
	newNodeHeuristicText.html(nodeHeuristic);

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

	newNode.on('mousemove touchmove', function (e) {
		e.preventDefault();
		if (mouseDown) {
			let mousePos = getMousePosition(e);

			isDragging = true;

			updateNodePos(newNodeId, mousePos);
		}
	});

	nodeHolder.append(newNode);

	let nodeWidth = newNode.width();
	let nodeHeight = newNode.height();

	if (typeof mousePos.x !== 'undefined') {
		newNode.css("left", mousePos.x - (nodeWidth / 2));
		newNode.css("top", mousePos.y - (nodeHeight / 2));
	}

	newNode.removeClass("d-none");

	graph.push({ id: newNodeId, name: nodeName, heuristicValue: nodeHeuristic, neighbors: [], position: newNode.position(), width: nodeWidth, height: nodeHeight});
}

function updateNodePos(nodeId, mousePos) {

	graph.map(node => {
		if(node.id == nodeId) {

			let nodeEle = $("#" + nodeId);

			if (typeof mousePos.x !== 'undefined') {
				nodeEle.css("left", mousePos.x - (node.width / 2));
				nodeEle.css("top", mousePos.y - (node.height / 2));
			}

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

function getMousePosition(e) {
	var x = e.clientX;
	var y = e.clientY + document.body.scrollTop;

	return { x, y };
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

function linkNodes() {
	if(selectedNodes.length != 2) {
		alert("Please select exactly 2 nodes to link");
		return;
	}

	let node1Id = selectedNodes[0][1];
	let node2Id = selectedNodes[1][1];

	if(graph.find(x => x.id == node1Id && x.neighbors.length > 0 && x.neighbors.find(y => y.id == node2Id)) && 
		graph.find(x => x.id == node2Id && x.neighbors.length > 0 && x.neighbors.find(y => y.id == node1Id))) {
			alert("Already linked!!");
			return;
	}

	let linkCost = nodeLinkCostInput.val()

	linkCost && linkCost != "" ? linkCost = parseInt(linkCost) : null;

	link2Nodes(node1Id, node2Id, linkCost);

	nodeLinkCostInput.val(null);
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

	let x = ((x1 + x2) / 2) + 20;
	let y = ((y1 + y2) / 2) - 20;

	linkLine.attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
	linkText.attr("x", x).attr("y", y);
}

function exportGraphAsJSON() {
	let modal = $("#exportModal");
  
	modal.find("#exportText").html("<pre>" + JSON.stringify(graph, null, 4) + "</pre>");
  
	modal.modal("show");
  }