const graph = [];
const selectedNodes = [];

$(document).ready(function () {

	let nodeHolder = $("div#node_holder");
	let node = nodeHolder.find("svg#node");

	let addModal = $(".modal#add_modal");
	let addNodeNameInput = addModal.find("input#add_node_name_input");
	let addHeuristicInput = addModal.find("input#add_heuristic_input");
	let addNodeBtn = addModal.find("button#add_node_btn");

	addModal.on("hide.bs.modal", function () {
		addNodeBtn.off("click");
	});

	$(".draw-board").on("dblclick", function (e) {
		if(e.preventDefault) e.preventDefault();

		mousePos = getMousePosition(e);

		addNodeBtn.on("click", function (e) {
			let nodeName = addNodeNameInput.val()
			let heuristic = addHeuristicInput.val()

			if (!nodeName || nodeName == "") {
				alert("Please enter node name");
				return;
			}

			let alreadyExists = false;
			graph.forEach(function(node) {
				if(node.name.toLowerCase() == nodeName.toLowerCase()) alreadyExists = true; 
			});

			if(alreadyExists) {
				alert("Node already exists!");
				return;
			}

			let newNode = node.clone(true);
			newNode.prop("id", newNode.prop("id") + "_" + nodeName);
			let newNodeId = newNode.prop("id");

			let newNodeCircle = newNode.find("circle");
			let newNodeNameText = newNode.find("text:nth-child(2)");
			let newNodeHeuristicText = newNode.find("text:nth-child(3)");

			newNodeNameText.html(nodeName);
			newNodeHeuristicText.html(heuristic);

			newNode.on("click", function(e) {
				if(selectedNodes.includes(newNodeId)) {
					selectedNodes.splice(selectedNodes.indexOf(newNodeId), 1);
				}
				else {
					selectedNodes.push(newNodeId);
				}

				updateSelectedNodes();
			});

			let nodeWidth = newNode.width();
			let nodeHeight = newNode.height();

			if (typeof mousePos.x !== 'undefined') {
				newNode.css("left", mousePos.x - (nodeWidth / 2));
				newNode.css("top", mousePos.y - (nodeHeight / 2));
			}

			newNode.removeClass("d-none");

			graph.push({ id: newNodeId, name: nodeName, heuristicValue: heuristic, neighbors: [] });

			nodeHolder.append(newNode);

			addNodeNameInput.val(null);
			addHeuristicInput.val(null);
			addModal.modal("hide");

			console.log(graph);
		});

		addModal.modal("show");
	});
});

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

	selectedNodes.forEach(function(nodeId) {
		let node = $("#" + nodeId);
		let nodeCircle = node.find("circle");

		nodeCircle.css("stroke", "red");
	});
}