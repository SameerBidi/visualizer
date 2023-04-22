import json

graph = []

with open("graph.json", "r") as graph_file:
    graph = json.loads(graph_file.read())

print(graph)