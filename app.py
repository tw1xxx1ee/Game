from flask import Flask, jsonify, request, render_template
import json
import os
import sqlite3

app = Flask(__name__, static_folder='assets', template_folder='templates')

# DB Setup
def init_db():
    conn = sqlite3.connect('game.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, value INTEGER)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/level')
def get_level():
    with open('assets/updated_scene.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/api/interact', methods=['POST'])
def interact():
    data = request.json
    obj_id = data.get('id')
    obj_type = data.get('type')
    
    # Simple logic for collection
    if obj_type == 'coins':
        conn = sqlite3.connect('game.db')
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO progress (id, value) VALUES ('coins', (SELECT COALESCE(value,0) FROM progress WHERE id='coins') + 1)")
        conn.commit()
        conn.close()
        return jsonify({"status": "collected", "id": obj_id})
    
    return jsonify({"status": "ok", "message": f"Interacted with {obj_type}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
