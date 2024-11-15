from app.rotas import *

def registerMain(app):

    @app.route('/')
    def main():
        return 'ola mundo'