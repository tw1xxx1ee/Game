from flask import Flask, jsonify, request, render_template
import json
import os
import sqlite3

app = Flask(__name__, static_folder='assets', static_url_path='/assets', template_folder='templates')

# DB Setup
def init_db():
    conn = sqlite3.connect('game.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, value INTEGER)''')
    conn.commit()
    conn.close()

init_db()

import threading
import time
import math

# Global state
player_state = {"x": 6, "z": 2}

def move_player():
    angle = 0
    while True:
        # Move in a circle around the island
        player_state["x"] = 6 + math.cos(angle) * 3
        player_state["z"] = 2 + math.sin(angle) * 3
        angle += 0.05
        time.sleep(0.05)

# Start background movement
threading.Thread(target=move_player, daemon=True).start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/state')
def get_state():
    return jsonify(player_state)

@app.route('/api/level')
def get_level():
    if os.path.exists('assets/updated_scene.json'):
        with open('assets/updated_scene.json', 'r') as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify({"error": "no level data"})

@app.route('/api/interact', methods=['POST'])
def interact():
    data = request.json
    obj_type = data.get('type')
    print(f"Python received interaction: {obj_type}")
    
    if obj_type == 'coins':
        conn = sqlite3.connect('game.db')
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO progress (id, value) VALUES ('coins', (SELECT COALESCE(value,0) FROM progress WHERE id='coins') + 1)")
        conn.commit()
        conn.close()
        return jsonify({"status": "collected"})
    
    return jsonify({"status": "ok", "message": f"Python handled {obj_type}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False)
