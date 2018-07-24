import os

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_message = {}

@app.route("/")
def index():
    return render_template("index.html",channel_list = channel_message.keys())

@app.route("/<string:channel2display>", methods=["POST"])
def display(channel2display):
    if channel2display in channel_message:
        return jsonify({"success": True, "message":channel_message[channel2display]})
    else:
        channel_message[channel2display] = ['second default message','first']
        return jsonify({"success": True, "message":channel_message[channel2display]})

@socketio.on("create channel")
def channel(data):
    new_channel = data["new_channel"]
    message = 'first message'
    channel_message[new_channel] = [message]
    emit("display channels", channel_message.keys(), broadcast=True)

@socketio.on("submit message")
def append_message(data):
    channel = data["channel"]
    text = data["message"]
    time = data["time"]
    user = data["user"]
    message = text
    channel_message[channel].append(message)
    emit("new_message_added", channel_message[channel], broadcast=True)