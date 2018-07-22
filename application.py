import os

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['general']

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("create channel")
def channel(new_channel):
    channel_list.append(new_channel)
    emit("display channels", channel_list, broadcast=True)