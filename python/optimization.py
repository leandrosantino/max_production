import pandas as pd
from pulp import *
from sys import argv

json_data = argv[1]
print(json_data)
safety_stock = int(argv[2])

df = pd.read_json(json_data, orient='split', dtype={'sapCode': str, 'line': str})

prob = LpProblem("Stock_Optimation",LpMaximize)

product_items = list(df['description'])

lines = {
    "226": [],
    "521.1": [],
    "521.2": [],
    "551/598.1": [],
    "551/598.2": [],
  }

variables = LpVariable.dicts("Products",product_items,0,cat='Integer')

prob += lpSum(variables), "Objective function"

for i, data in df.iterrows():
    description = data['description']
    line = data['line']
    demand = data['demand']
    stock = data['stock']

    constrant = (safety_stock*demand)-stock

    lines[str(line)].append(variables[description])
    prob += (variables[description]>=constrant), f"Minimal Lot of production to {description}"

prob += lpSum(lines['226']) <= 515, "Line 226 capacity restrictions"

prob += lpSum(lines['521.1'] + lines['521.2']) <= 548, "Line 521.1 + 521.2 capacity restrictions "
prob += lpSum(lines['521.1']) <= 549, "Line 521.1 capacity restrictions"
prob += lpSum(lines['521.2']) <= 257, "Line 521.2 capacity restrictions"

prob += lpSum(lines['551/598.1'] + lines['551/598.2']) <= 515, "Line 551/598.1 + 551/598.2 capacity restrictions"
prob += lpSum(lines['551/598.1']) <= 515, "Line 551/598.1 capacity restrictions"
prob += lpSum(lines['551/598.2']) <= 343, "Line 551/598.2 capacity restrictions"


solver = pulp.PULP_CBC_CMD(msg=False)
prob.solve(solver)

soluction = {}
for v in prob.variables():
    soluction[v.name] = v.varValue

products_to_soluction = {}
for i, data in df.iterrows():
    products_to_soluction[data["description"]] = soluction[variables[data["description"]].name]

df['minLot'] = df['description'].map(products_to_soluction)

print(pd.DataFrame({'sapCode': df['sapCode'], 'value': df['minLot']}).to_json(orient='records', indent=2))
