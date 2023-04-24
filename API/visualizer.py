class Visualizer:
    def __init__(self):
        self.tables = {}
        self.output = ""

    def add_table(self, table_name):
        self.tables[table_name] = []
        self.output += f"\nadd_table:{table_name}"

    def add_table_value(self, table_name, value):
        self.output += f"\nadd_table_value:{table_name}|{value}"

    def set_table_values(self, table_name, values_list):
        self.tables[table_name] = values_list
        self.output += f"\nset_table_values:{table_name}|{','.join(values_list)}"

    def move(self, from_node_id, to_node_id):
        self.output += f"\nmove:{from_node_id}>{to_node_id}"

    def get_output(self):
        
        return self.output.lstrip("\n").strip()