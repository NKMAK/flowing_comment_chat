import datetime
from flask import Flask,request,jsonify,render_template

app = Flask(__name__)

users_data = {}
items=[]

@app.route('/', methods=['GET'])
def hello_world():
    return render_template('index.html')

@app.route('/commentstore', methods=["GET"])
def comment_store():
    user_detail = {}
    user_detail["comment"]=request.args.get("comment")
    user_detail["userName"]=request.args.get("userName")
    print(user_detail["userName"])
    
    now_time = datetime.datetime.utcnow()
    iso_time = now_time.isoformat() + "+00:00"
    
    user_detail["time"]=iso_time
    
    items.append(user_detail)
    
    if(len(items)>100):
        items.pop(0)
    
    global users_data
    users_data={"items":items}
    return "success"

@app.route('/commentretrieve', methods=["GET"])
def comment_retrieve():
    print(len(items))
    return jsonify(users_data)


if __name__ == '__main__':
    app.run()
    