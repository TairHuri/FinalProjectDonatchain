from bottle import Bottle, route, run, request, response
import json
import csv
from embedding import retrieve_top_k_ngos
from bottle_cors_plugin import cors_plugin
import traceback
from embedding_NGO import NGO_DATA_PATH, new_ngo_controller, update_ngo_controller

# Create Bottle application instance
app = Bottle()
# Enable CORS for all origins
# You can restrict origins for security, e.g., ["http://localhost:4000"]
app.install(cors_plugin("*"))


@app.route('/api/ngo', method="POST")
def add_ngo():
        """
    Endpoint to add a new NGO.
    Expects JSON body: {"name": str, "ngoNumber": str, "description": str, "tags": str}
    Appends the NGO data to CSV and calls new_ngo_controller for further processing.
    """
    try:
        if request.json is None:
            response.staus = 400
            return {"error":"missing ngo in request"}
        ngo = request.json  #{"name":string, ngoNumber:string, description:string, tag:string}
       # Append NGO data to CSV storage
        with open(NGO_DATA_PATH, "a", encoding="utf-8", newline="") as ngos_file:
            writer = csv.writer(ngos_file)
            writer.writerow([ngo["name"], ngo["ngoNumber"], ngo["description"], ngo["tags"]])
                # Call controller to handle embedding / AI-related processing
        new_ngo_controller(ngo["name"],ngo["description"])

        request.status=201
        return {"message":"ngo added successfully"}
    except Exception as ex:
        traceback.print_exc()
        response.status=500
        return {"error": str(ex) }    


@app.route('/api/ngo', method="PUT")
def update_ngo():
    try:
        if request.json is None:
            response.staus = 400
            return {"error":"missing ngo in request"}
        ngo = request.json  #{"name":string, ngoNumber:string, description:string, tags:string}

        status, error = update_ngo_controller(ngo["name"],ngo["description"], ngo["tags"], ngo["ngoNumber"])

        print(status, error,ngo["ngoNumber"], ngo["name"])
        if status == True:
            response.status=200
            return {"message":"ngo added successfully"}
        else:
            response.status = 400
            return {"message": error}
    except Exception as ex:
        traceback.print_exc()
        response.status=500
        return {"error": str(ex) }


@app.route('/api/ngo/search', method="GET")
def search_ngo():
    query = request.query.get("q", "")
    if query == "":
        return {"message":"query was empty", "data":{}}
    try:
        query = query.encode("latin1").decode("utf-8")
        result =retrieve_top_k_ngos(query)
        
        return json.dumps({"message":"result", "data":result.to_dict(orient="records")}, ensure_ascii=False)
    except Exception as ex:
        traceback.print_exc()
        response.status=500
        return {"error": str(ex), "query":query, }

if __name__ == "__main__":
    run(app, host='localhost', port=6256, reloader=True, debug=True)