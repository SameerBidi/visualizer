import json
from algorithms import BreadthFS, DepthFS
import flask
from flask import request, render_template, send_from_directory, Response
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

@app.get("/")
def load_index():
    return render_template("index.html")

@app.get("/generate")
def load_generate():
    return render_template("generate.html")

@app.get("/visualize")
def load_visualize():
    algos = [
        {"id": 0, "name": "Breadth-First Search"},
        {"id": 1, "name": "Depth-First Search"},
    ]
    return render_template("visualize.html", algos=algos)

@app.post("/get_viz_out")
def get_viz_out():
    req = request.json

    graph = req["graph"]
    algo_id = req["algo_id"]
    start_node_id = req["start_node_id"]
    goal_node_id = req["goal_node_id"]

    if(algo_id == 0):
        bfs = BreadthFS(graph)

        output = bfs.run(start_node_id, goal_node_id)

        return Response(json.dumps({"success": True, "output": output}), mimetype="application/json")
    elif(algo_id == 1):
        dfs = DepthFS(graph)

        output = dfs.run(start_node_id, goal_node_id)

        return Response(json.dumps({"success": True, "output": output}), mimetype="application/json")
    
    else:
        return Response(json.dumps({"success": False, "message": "Invalid algo id"}), mimetype="application/json")

app.run(host='0.0.0.0', port=53241, debug=True)