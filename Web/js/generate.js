let addModal, addNodeNameInput, addHeuristicInput, addNodeBtn;

$(document).ready(function () {
	addModal = $(".modal#add_modal");
	addNodeNameInput = addModal.find("input#add_node_name_input");
	addHeuristicInput = addModal.find("input#add_heuristic_input");
	addNodeBtn = addModal.find("button#add_node_btn");

	addModal.on("hide.bs.modal", function () {
		addNodeBtn.off("click");
	});

	addNode("0", null, null, {x: 208, y: 197});
	addNode("1", null, null, {x: 540, y: 198});
	addNode("2", null, null, {x: 534, y: 382});
	addNode("3", null, null, {x: 196, y: 384});
	addNode("4", null, null, {x: 350, y: 523});
	addNode("5", null, null, {x: 711, y: 307});
	addNode("6", null, null, {x: 636, y: 500});

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

	$(".draw-board").on("mousedown touchstart", function (e) {
		e.preventDefault();
		isDragging = false;
		mouseDown = true;
	});

	$(document).on("mouseup touchend", function (e) {
		
		mouseDown = false;
	});

	drawBoardClicks();
	
	//animateAlgo("node_4 -> node_2|node_2 -> node_1|node_1 -> node_0|node_0 -> node_3|node_1 -> node_6|node_1 -> node_5");
});

function animateAlgo(algoText) {
	algoLines = algoText.trim().split("|");

	animateAlgoRecursive(algoLines, 0, null, null, null, 500);
}

function animateAlgoRecursive(algoLines, nextIdx, prevNodeFromEle, prevNodeToEle, prevLinkLine, delay) {
	setTimeout(function() {
		let algoLine = algoLines[nextIdx].trim();

		let [nodeFromId, nodeToId] = algoLine.split(" -> ");

		let nodeFrom = graph.find(x => x.id == nodeFromId);
		let nodeTo = graph.find(x => x.id == nodeToId);

		let nodeFromEle = $("#" + nodeFromId);
		let nodeToEle = $("#" + nodeToId);
		let linkLine = $("#" + nodeFrom.neighbors.find(x => x.id == nodeToId).linkId);

		if(prevNodeFromEle) prevNodeFromEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
		if(prevNodeToEle) prevNodeToEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
		if(prevLinkLine) prevLinkLine.removeClass("link-animated").addClass("link-normal");

		nodeFromEle.removeClass("node-visited").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-animated").addClass("node-animated-from");
		nodeToEle.removeClass("node-visited").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-animated").addClass("node-animated-to");
		linkLine.removeClass("link-normal").addClass("link-animated");

		if(algoLines.length - 1 > nextIdx) animateAlgoRecursive(algoLines, nextIdx + 1, nodeFromEle, nodeToEle, linkLine, delay);
		else {
			setTimeout(function() {
				nodeFromEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
				nodeToEle.removeClass("node-animated").removeClass("node-animated-from").removeClass("node-animated-to").addClass("node-visited");
				linkLine.removeClass("link-animated").addClass("link-normal");

				console.log("end");
			}, delay);
		}

	}, delay);
}

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

			addNode(nodeName, null, heuristic, mousePos);

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

function visualize() {
	if(graph.length == 0) {
		alert("Invalid Graph");
		return;
	}

	localStorage.setItem("graph_to_visualize", JSON.stringify(graph));

	window.location.href = "visualize.html";
}