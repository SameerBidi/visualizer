from visualizer import Visualizer

class DFS:
    def __init__(self, graph):
        viz = Visualizer()
        viz.add_table("Visited")
        viz.add_table("Stack")
        self.graph = graph
        self.viz = viz

    def __dfs_util(self, node_id, from_node_id, visited_list):
        graph = self.graph

        graph_node = [x for x in graph if x["id"] == node_id][0]

        visited_list.append(node_id)

        self.viz.set_table_values("Visited", visited_list)

        if(node_id != from_node_id):
            self.viz.move(from_node_id, node_id)

        for neighbor in graph_node["neighbors"]:
            if(neighbor["id"] not in visited_list):
                self.__dfs_util(neighbor["id"], node_id, visited_list)

    def run_dfs(self, start_node_id):
        visited_list = []

        self.__dfs_util(start_node_id, start_node_id, visited_list)

        return self.viz.get_output()

    