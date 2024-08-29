import sqlite3

def conectarDB():
    conexao = sqlite3.connect('database/oracao.db')
    cursor = conexao.cursor()

    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS pessoas(
                   id INTEGER PRIMARY KEY,
                   nome TEXT
                   )
                   """)
    
    conexao.commit()

    return conexao, cursor

if __name__ == '__main__':
    conectarDB()