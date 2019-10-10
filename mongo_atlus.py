# Imports from python libraries
import pymongo
# Note multiple imports from flask
from flask import Flask, render_template, jsonify
from bson.json_util import dumps
import json
from random import sample
# import credentials
from config import username, password

# Set app with __name__ variable currently referring to __main__
app = Flask(__name__)
# Client given from mongo atlas cloud
# Input eligible username and password to access
client = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@cluster0-hsqne.gcp.mongodb.net/admin?retryWrites=true&w=majority")
# Set approppriate database and collection
db = client.airbnb.nyc_locations.find()

# Homepage with data visualisations
@app.route("/")
def home():
    # Refers to index.html in necessary templates folder
    return render_template('index.html')

# Page hosting data
@app.route("/data")
def data():
    # Create empty list for data entries
    hostings = []
    # Loop through the databases entries
    for host in db:
        # Append entries individually in an array
        # Necessary so that mongo data is iterable and not confused as one entity
        hostings.append(host)
    # random.sample method to grab only 10,000 and reassign to hostings list
    hostings = sample(hostings,100)
    # Use dumps to make readable and turn to string
    # str then turned JSON like object (dict) by json.loads()
    # finally 
    return jsonify(dumps(hostings))

# Run app if __name__ currently set to __main__ (That is, when the script/code being ran)
if __name__ == "__main__":
    app.run(debug=True)