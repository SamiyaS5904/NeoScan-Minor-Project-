import os
from pymongo import MongoClient
from django.conf import settings

# In production, use environment variables for your connection string!
# MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://Minor_Project:minor_g9_321@cluster0.45dsjs4.mongodb.net/?appName=Cluster0')
MONGO_URI = 'mongodb+srv://Minor_Project:minor_g9_321@cluster0.45dsjs4.mongodb.net/?appName=Cluster0'

def get_mongo_client():
    try:
        client = MongoClient(MONGO_URI)
        # Test connection
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def get_database():
    client = get_mongo_client()
    if client:
        return client['neoscan_db'] # Name of your database
    return None

def get_predictions_collection():
    db = get_database()
    if db is not None:
        return db['predictions']
    return None
