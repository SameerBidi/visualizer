from visualizer import Visualizer
from collections import deque
from queue import LifoQueue

class BreadthFS:
    def __init__(self, graph):
        viz = Visualizer()
        viz.add_table("Visited")
        viz.add_table("Queue")
        self.graph = graph
        self.viz = viz

    def run(self, start_node_id, goal_node_id):
        graph = self.graph

        queue = deque([[start_node_id]])

        visited = set()

        from_ids = {}

        past_node_id = start_node_id

        if start_node_id == goal_node_id:
            self.viz.add_path([start_node_id])
            return self.viz.output

        while queue:
            path = queue.popleft()
            node_id = path[-1]

            if node_id not in visited:
                if len(from_ids.keys()) > 0:
                    past_node_id = [from_ids[x] for x in from_ids if x == node_id][0]

                visited.add(node_id)

                if(past_node_id and node_id != past_node_id):
                    self.viz.set_table_values("Queue", list(queue)[-1])
                    self.viz.move(past_node_id, node_id)
                    self.viz.set_table_values("Visited", list(visited))

                if node_id == goal_node_id:
                    self.viz.add_path(path)
                    return self.viz.output

                neighbors = [x["neighbors"] for x in graph if x["id"] == node_id][0]

                for neighbor in neighbors:
                    from_ids[neighbor["id"]] = node_id
                    new_path = list(path)
                    new_path.append(neighbor["id"])
                    queue.append(new_path)
        self.viz.add_path([])
        return self.viz.output


class DepthFS:
    def __init__(self, graph):
        viz = Visualizer()
        viz.add_table("Visited")
        viz.add_table("Stack")
        self.graph = graph
        self.viz = viz

    def run(self, start_node_id, goal_node_id):
        graph = self.graph

        stack = LifoQueue()
        stack.put([start_node_id])

        visited = set()

        from_ids = {}

        past_node_id = start_node_id

        while not stack.empty():
            curr_path = stack.get()
            curr_node_id = curr_path[-1]

            if len(from_ids.keys()) > 0:
                past_node_id = [from_ids[x] for x in from_ids if x == curr_node_id][0]

                visited.add(curr_node_id)
                
                if(past_node_id and curr_node_id != past_node_id):
                    self.viz.set_table_values("Stack", list(curr_path))
                    self.viz.move(past_node_id, curr_node_id)
                    self.viz.set_table_values("Visited", list(visited))

            if curr_node_id == goal_node_id:
                self.viz.add_path(list(curr_path))
                return self.viz.output

            neighbors = [x["neighbors"] for x in graph if x["id"] == curr_node_id][0]

            for neighbor in neighbors:
                if neighbor["id"] not in visited:
                    from_ids[neighbor["id"]] = curr_node_id
                    visited.add(neighbor["id"])
                    new_path = curr_path.copy()
                    new_path.append(neighbor["id"])
                    stack.put(new_path)

        self.viz.add_path([])
        return self.viz.output

# class DFS:
#     def __init__(self, graph):
#         viz = Visualizer()
#         viz.add_table("Visited")
#         #viz.add_table("Stack")
#         self.graph = graph
#         self.viz = viz

#     def __dfs_util(self, node_id, from_node_id, visited_list):
#         graph = self.graph

#         graph_node = [x for x in graph if x["id"] == node_id][0]

#         visited_list.append(node_id)

#         if(node_id != from_node_id):
#             self.viz.move(from_node_id, node_id)
#             self.viz.set_table_values("Visited", visited_list)

        

#         for neighbor in graph_node["neighbors"]:
#             if(neighbor["id"] not in visited_list):
#                 self.__dfs_util(neighbor["id"], node_id, visited_list)

#     def run_dfs(self, start_node_id):
#         visited_list = []

#         self.__dfs_util(start_node_id, start_node_id, visited_list)

#         return self.viz.get_output()

# class DFS:
#     def __init__(self, graph):
#         viz = Visualizer()
#         viz.add_table("Visited")
#         viz.add_table("Stack")
#         self.graph = graph
#         self.viz = viz

    # def __dfs_util(self, node_id, from_node_id, visited_list):
    #     graph = self.graph

    #     graph_node = [x for x in graph if x["id"] == node_id][0]

    #     visited_list.append(node_id)

        

    #     if(node_id != from_node_id):
    #         self.viz.move(from_node_id, node_id)

    #     self.viz.set_table_values("Visited", visited_list)

    #     for neighbor in graph_node["neighbors"]:
    #         if(neighbor["id"] not in visited_list):
    #             self.__dfs_util(neighbor["id"], node_id, visited_list)

    # def run_dfs(self, start_node_id):
    #     visited_list = []
    #     stack_list = [start_node_id]
    #     from_node_id = start_node_id

    #     while stack_list:
    #         self.viz.set_table_values("Stack", stack_list)
    #         node_id = stack_list.pop()

    #         if node_id not in visited_list:
    #             visited_list.append(node_id)

    #             if(node_id != from_node_id):
    #                 self.viz.move(from_node_id, node_id)
    #                 from_node_id = node_id
    #             self.viz.set_table_values("Visited", visited_list)

    #             neighbors = [x["neighbors"] for x in self.graph if x["id"] == node_id][0]
                
    #             for neighbor in neighbors:
    #                 stack_list.append(neighbor["id"])
            


    #     return self.viz.get_output()
