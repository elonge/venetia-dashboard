import os
import csv
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

def fahrenheit_to_celsius(f_temp):
    if f_temp is None:
        return None
    return round((f_temp - 32) * 5 / 9, 2)

def upload_weather():
    # MongoDB Connection
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("Error: MONGODB_URI not found in environment.")
        return

    client = MongoClient(mongodb_uri)
    # Explicitly set the database name
    db = client['venetia_project']
    collection = db['weather']

    # Clear existing records to ensure consistent date format
    print("Clearing existing weather records...")
    collection.delete_many({})

    source_dir = os.path.expanduser('~/history/ready_sources')
    files = [
        'weather_Alderley_Park.csv',
        'weather_london.csv',
        'weather_oxford.csv'
    ]

    fields = [
        "station", "name", "latitude", "longitude", "elevation", 
        "date", "prcp", "prcp_attributes", "tavg", "tavg_attributes", 
        "tmax", "tmax_attributes", "tmin", "tmin_attributes"
    ]

    all_records = []

    for file_name in files:
        file_path = os.path.join(source_dir, file_name)
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue

        # Determine location from filename
        location = "Unknown"
        if "london" in file_name.lower():
            location = "London"
        elif "oxford" in file_name.lower():
            location = "Oxford"
        elif "alderley" in file_name.lower():
            location = "Alderley"

        print(f"Processing {file_name} (Location: {location})...")
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                # Skip header row if present
                if row and row[0] == "STATION":
                    continue
                
                if not row:
                    continue

                # Map row to dictionary
                record = {}
                for i, field in enumerate(fields):
                    if i < len(row):
                        val = row[i].strip()
                        
                        # Convert numeric fields
                        if field in ["latitude", "longitude", "elevation", "prcp", "tavg", "tmax", "tmin"]:
                            try:
                                if val:
                                    f_val = float(val)
                                    # Convert Temperature from Fahrenheit to Celsius
                                    if field in ["tavg", "tmax", "tmin"]:
                                        record[field] = fahrenheit_to_celsius(f_val)
                                    else:
                                        record[field] = f_val
                                else:
                                    record[field] = None
                            except ValueError:
                                record[field] = val
                        elif field == "date":
                            try:
                                # Convert to datetime object for MongoDB Date storage
                                record[field] = datetime.strptime(val, '%Y-%m-%d')
                            except ValueError:
                                record[field] = val
                        else:
                            record[field] = val
                    else:
                        record[field] = None
                
                # Add source file information and unit metadata
                record['source_file'] = file_name
                record['location'] = location
                record['temp_unit'] = 'Celsius'
                all_records.append(record)

    if all_records:
        print(f"Prepared {len(all_records)} records with temperature in Celsius and ISO dates.")
        print(f"Target collection: 'weather' in {db.name}")
        collection.insert_many(all_records)
        print("Upload complete.")
    else:
        print("No records found to process.")

if __name__ == "__main__":
    upload_weather()