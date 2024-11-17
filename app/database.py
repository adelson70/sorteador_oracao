import sqlite3 as sql
import tinydb as nosql

# conexao banco sql
def connSQL():
    conexao = sql.connect("database/oracao.db")
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
    db = nosql('database/sorteios.json')

    return db

# carregando banco
if __name__ == '__main__':
    try:
        connSQL()
        print('banco carregado')

    except Exception as e:
        print('erro ao carregar o banco ',e)