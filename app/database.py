import sqlite3 as sql
from tinydb import TinyDB as nosql
from tinydb import Query
from os import name
from pathlib import Path


# conexao banco sql
def connSQL():
    # verificando OS

    path = Path('database/oracao.db').resolve()

    # if name == 'nt':
    #     path = "sorteador_oracao/database/oracao.db"

    # else:
    #     path = "database/oracao.db"

    conexao = sql.connect(path)
    cursor = conexao.cursor()

    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS sala(
                   id INTEGER PRIMARY KEY,
                   token TEXT(6),
                   nome TEXT(20),
                   limiteParticipante INTEGER,
                   dataCriacao DATE,
                   dataRevelacao DATE,
                   link TEXT(45),
                   status TEXT(10),
                   estado TEXT(10),
                   idUsuario INTEGER,
                   FOREIGN KEY (idUsuario) REFERENCES usuario (id)
                   )
                   """)
    
    conexao.commit()

    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS participante(
                   id INTEGER PRIMARY KEY,
                   nome TEXT(20),
                   whatsapp TEXT(13),
                   email TEXT(45),
                   salaToken TEXT(6)
                   )
                   """)
    conexao.commit()

    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS usuario(
                   id INTEGER PRIMARY KEY,
                   nome TEXT(64),
                   senha TEXT(64),
                   plano TEXT (64)
                   )
                   """)
    conexao.commit()

    return conexao, cursor

# conxao ao noSql
def connNsql():
    # verifica OS

    path = Path('database/sorteios.json').resolve()

    # if name == 'nt':
    #     path = 'sorteador_oracao/database/sorteios.json'

    # else:
    #     path = 'database/sorteios.json'

    db = nosql(path)

    return db

# carregando banco
if __name__ == '__main__':
    try:
        connSQL()
        print('banco carregado')

    except Exception as e:
        print('erro ao carregar o banco ',e)