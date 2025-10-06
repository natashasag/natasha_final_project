from pymongo import MongoClient

import os
client = MongoClient(os.environ.get("mongodb+srv://<db_username>:<db_password>@natashasag.extfv.mongodb.net/?retryWrites=true&w=majority&appName=natashasag"))
db = client["carbon_footprint"]