from flask import render_template, session, redirect, url_for, jsonify, request

def configure_app(app):

    # ROTA PRINCIPAL
    @app.route('/', methods=['POST','GET'])
    def main():
        return render_template('index.html')