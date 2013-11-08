from flask import Flask, render_template, redirect, url_for, send_from_directory
import json
import yaml

app = Flask(__name__)

app.debug = True

@app.route("/")
def main():
    return render_template("main.html")

@app.route("/rooms")
def hello():
    data = yaml.load(open("./module/content.yaml").read())
    return json.dumps(data)

@app.route("/<path:path>")
def image(path):
    if(path.find(".mp3") != -1):
        return send_from_directory("./module/audio", path)
    elif(path.find(".jpg") != -1):
        return send_from_directory("./module/images/", path)