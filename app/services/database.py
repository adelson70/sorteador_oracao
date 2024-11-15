# importando modulos do init
from app.services import *
from database import *

# função para cria linha na tabela sala
def inserirSalaDB(token, nome, limite, dataCriacao, dataRevelacao, link, status, estado):
    try:
        conn, cursor = connSQL()

        cursor.execute("""
                       INSERT INTO sala (token, nome, limiteParticipante, dataCriacao, dataRevelacao, link, status, estado)
                       VALUES (?,?,?,?,?,?,?,?)
                       """,(token, nome, limite, dataCriacao, dataRevelacao, link, status, estado))
        conn.commit()
        conn.close()

        return True

    except Exception as e:
        print('erro ao inserir dados na tabela sala: ',e)
        

# "deletar sala"
def deleteSalaDB(id):
    try:
        conn, cursor = connSQL()
        novoEstado = 'nativo'
        cursor.execute("""
                       UPDATE sala
                       SET estado=?
                       WHERE id=?
                       """, novoEstado, id)
        conn.commit()
        conn.close()

        return True

    except Exception as e:
        print('erro ao "deletar" a sala: ',e)

# desativando sala
def desativarSalaDB(id):
    try:
        novoStatus = 'offline'
        conn, cursor = connSQL()

        cursor.execute("""
                       UPDATE sala
                       SET status=?
                       WHERE id=?
                       """, novoStatus, id)
        conn.commit()
        conn.close()

        return True
    
    except Exception as e:
        print('erro ao desativar a sala: ',e)

# função para criar linha na tabela participantes
def inserirParticipanteDB(nome, salaToken, whatsapp=None, email=None):
    try:
        conn, cursor = connSQL()

        cursor.execute("""
                       INSERT INTO participante(nome, whatsapp, email, salaToken)
                       VALUES (?,?,?,?)
                       """, nome, whatsapp, email, salaToken)
        conn.commit()
        conn.close()

        return True
    
    except Exception as e:
        print('erro ao inserir dados na tabela participante: ',e)

# função para criar linha na tabela usuario
def inserirUsuarioDB(nome, senha, plano):
    try:
        conn, cursor = connSQL()

        cursor.execute("""
                       INSERT INTO usuario(nome, senha, plano)
                       VALUES (?,?,?)
                       """, nome, senha, plano)
        conn.commit()
        conn.close()

        return True
    
    except Exception as e:
        print('erro ao inserir dados na tabela usuario: ',e)

# função para editar o usuario
def editarUsuarioDB(id=None, nome=None, senha=None, plano=None):
    try:
        if nome == None and senha == None and plano == None and id == None:
            return False
        
        conn, cursor = connSQL()
        
        if nome != None:
            cursor.execute("""
                           UPDATE usuario
                           SET nome=?
                           WHERE id=?
                           """, nome, id)
            conn.commit()

        if senha != None:
            cursor.execute("""
                           UPDATE usuario
                           SET senha=?
                           WHERE id=?
                           """, senha, id)
            conn.commit()

        if plano != None:
            cursor.execute("""
                           UPDATE usuario
                           SET plano=?
                           WHERE id=?
                           """, plano, id)
            conn.commit()

        conn.close()

        return True
    
    except Exception as e:
        print('erro ao editar o usuario: ',e)

# função para criar objeto no db nosql
def adicionarSorteioDB(data):
    try:
        db = connNsql()

        db.insert(data)

        return True
    
    except Exception as e:
        print('erro ao inserir valores no banco noSql: ', e)

# função para retornar a respectiva pessoa que tirou o amigo secreto de oração
def retornarNomeSorteadoDB(token, meuNome):
    try:
        db = connNsql()
        q = nosql.Query()

        response = {}

        busca = db.search(q.token == token)

        # verifica se houve sorteio
        if len(busca) != 0:
            nomeSorteado = None

            resultado = dict(busca[0])

            revelacao = resultado["revelacao"]
            minhaRevelacao = revelacao[meuNome]

            response[meuNome] = minhaRevelacao

            return response


        # caso não encontre o banco de dados significa que não houve sorteio
        else:
            return 'nao_sorteado'

    
    except Exception as e:
        print('erro ao consultar nome sorteado: ',e)
        