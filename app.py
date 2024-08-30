from flask import Flask
from utils import gerar_secret_key
from routes import configure_app

SECRET_KEY = gerar_secret_key()

app = Flask(__name__)

app.secret_key = 'e6d54b4b8f270e78140b1957170de5338c6d8bc067ba703928a389b7d103f78f' #chave temporaria

if __name__ == '__main__':
    configure_app(app)

    app.run(debug=True)