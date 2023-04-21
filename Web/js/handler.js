const graph = [];
const selectedNodes = [];

let linkHolder, linkGroup, nodeUtilDiv, selNodeText, linkNodeDiv, nodeLinkCostInput, selInfoText, deleteNodeBtn;

$(document).ready(function () {

	let nodeHolder = $("div#node_holder");
	let node = nodeHolder.find("svg#node");

	let addModal = $(".modal#add_modal");
	let addNodeNameInput = addModal.find("input#add_node_name_input");
	let addHeuristicInput = addModal.find("input#add_heuristic_input");
	let addNodeBtn = addModal.find("button#add_node_btn");

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

			heuristic && heuristic != "" ? heuristic = parseInt(heuristic) : heuristic = null;

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

			let nodeWidth = newNode.width();
			let nodeHeight = newNode.height();

			if (typeof mousePos.x !== 'undefined') {
				newNode.css("left", mousePos.x - (nodeWidth / 2));
				newNode.css("top", mousePos.y - (nodeHeight / 2));
			}

			newNode.removeClass("d-none");

			graph.push({ id: newNodeId, name: nodeName, heuristicValue: heuristic, neighbors: [], loc: [mousePos.x, mousePos.y] });

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

	let node1 = $("#" + selectedNodes[0][1]);
	let node2 = $("#" + selectedNodes[1][1]);
}