import json

graph = []

with open("graph.json", "r") as graph_file:
    graph = json.loads(graph_file.read())


def dfs_util(node_id, from_node_id, visited_list):

    graph_node = [x for x in graph if x["id"] == node_id][0]

    visited_list.append(node_id)

    if(node_id != from_node_id):
        print(f"{from_node_id} -> {node_id}", end="|")

    for neighbor in graph_node["neighbors"]:
        if(neighbor["id"] not in visited_list):
            dfs_util(neighbor["id"], node_id, visited_list)


def dfs(start_node_id):
    visited_list = []

    dfs_util(start_node_id, start_node_id, visited_list)


dfs("node_4")