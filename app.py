from flask import Flask
from utils import *
from routes import configure_app

SECRET_KEY = gerar_secret_key()

app = Flask(__name__)

app.secret_key = SECRET_KEY

if __name__ == '__main__':
    configure_app(app)

    app.run(debug=True)