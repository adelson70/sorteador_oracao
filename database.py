import sqlite3
from tinydb import TinyDB


def conectarDB():
    conexao = sqlite3.connect('database/oracao.db')
    cursor = conexao.cursor()

    # TABELA DO NOME DOS PARTICIPANTES ATRELADO AO TOKEN
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS pessoas(
                   id INTEGER PRIMARY KEY,
                   id_token INTEGER,
                   nome TEXT,
                   FOREIGN KEY (id_token) REFERENCES salas(token)
                   )
                   """)
    
    # TABELA DAS SALAS
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS salas(
                   token TEXT,
                   status TEXT,
                   nome_sala TEXT,
                   PRIMARY KEY (token)
                   )
                   """)
    
    # TABELA DOS ACESSOS PARA CRIAÇÃO DA SALA
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS usuarios(
                   id INTEGER PRIMARY KEY,
                   nome TEXT,
                   senha TEXT)
                   """)
    
    conexao.commit()

    return conexao, cursor

# BANCO NO SQL
def conectarDB_NoSql():
    db = TinyDB('database/sorteios.json')

    return db

if __name__ == '__main__':
    print('banco carregado!')
    conectarDB()