# importando modulos do init
from app.services import *
from database import *

# função criar sala de oração
def criarSalaDB(token, nome, limite, dataCriacao, dataRevelacao, link, status, estado, idUsuario):
    try:
        conn, cursor = connSQL()

        cursor.execute("""
                       INSERT INTO sala (token, nome, limiteParticipante, dataCriacao, dataRevelacao, link, status, estado, idUsuario)
                       VALUES (?,?,?,?,?,?,?,?,?)
                       """,(token, nome, limite, dataCriacao, dataRevelacao, link, status, estado, idUsuario,))
        conn.commit()
        conn.close()

        return True

    except Exception as e:
        print('erro ao inserir dados na tabela sala: ',e)

def consultarNomeSala(nomeSala,idAdm):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT COUNT(*)
                   FROM sala
                   WHERE nome=? and idUsuario=? and status=?
                   """,(nomeSala,idAdm,'Aberta',))
    
    result = cursor.fetchone()[0]
    conn.close()

    return result


# consultar as informações da sala
def consultarSalaDB(idUsuario, params=None):
    # caso o token esteja com valor None, será retornado todas as salas que o usuario criou
    conn, cursor = connSQL()
    
    if params == None:
        cursor.execute("""
                        SELECT *
                        FROM sala
                        WHERE idUsuario=? and estado=?
                        """,(idUsuario,'ativo',))
    else:
        PARAMS = f'%{params}%'
        cursor.execute("""
                    SELECT *
                    FROM sala
                    WHERE idUsuario=? and estado=? and (nome LIKE ? or token LIKE ? or dataCriacao LIKE ? or status LIKE ?)
                    """,(idUsuario,'ativo',PARAMS,PARAMS,PARAMS,PARAMS))
    
    resultado = cursor.fetchall()

    conn.close()
    
    return resultado

# consultar o as informações da sala
def consultarSalaDBToken(token):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT *
                   FROM sala
                   WHERE token=?
                   """,(token,))
    
    result = cursor.fetchone()
    conn.close()

    return result

# consultar se a sala existe
def salaExistsDB(token):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT COUNT(token), limiteParticipante, status
                   FROM sala
                   WHERE token=?
                   """,(token,))
    
    result = cursor.fetchone()
    conn.close()

    return result

# consulta a quantidade de usuarios que entraram na sala
def consultarLimiteSalaDB(token):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT COUNT(nome)
                   FROM participante
                   WHERE salaToken=?
                   """,(token,))

    result = cursor.fetchone()[0]
    conn.close()

    return result

# consulta se o nome do participante já esta em uso
def consultarNomeUso(nome,token):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT COUNT(nome)
                   FROM participante
                   WHERE nome=? AND salaToken=?
                   """,(nome,token,))
    
    result = cursor.fetchone()[0]
    conn.close()

    return result

# "deletar sala"
def deleteSalaDB(token):
    try:
        conn, cursor = connSQL()
        novoEstado = 'nativo'
        cursor.execute("""
                       UPDATE sala
                       SET estado=?
                       WHERE token=?
                       """, (novoEstado, token,))
        conn.commit()
        conn.close()

        return True

    except Exception as e:
        print('erro ao "deletar" a sala: ',e)

# fechar sala
def fecharSala(token):
    try:
        novoStatus = 'Fechada'
        conn, cursor = connSQL()

        cursor.execute("""
                       UPDATE sala
                       SET status=?
                       WHERE token=?
                       """, (novoStatus, token))
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
                       """, (nome, whatsapp, email, salaToken))
        conn.commit()
        conn.close()

        return True
    
    except Exception as e:
        print('erro ao inserir dados na tabela participante: ',e)

# função para retornar o nome do participante da sala especifica
def retornarNomeParticipanteDB(tokenSala):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT nome
                   FROM participante
                   WHERE salaToken=?
                   """,(tokenSala,))
    
    result = cursor.fetchall()
    conn.close()

    return result

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

# função para consultar a existencia do login do usuario no DB
def consultarUsuario(nome,senha):
    conn, cursor = connSQL()

    cursor.execute("""
                   SELECT COUNT(*), id
                   FROM usuario
                   WHERE nome=? and senha=?
                   """,(nome,senha,))
    
    result = cursor.fetchone()
    conn.close()

    return result

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

# função para retornar todas informações da sala de oração no nosql
def retornarSorteioDB(token):
    try:
        db = connNsql()
        q = Query()

        sorteios = db.all()

        for sala in sorteios:
            if sala['token'] == token:
                return sala

        return 'vazio'
    
    except Exception as e:
        print("erro ao consultar a sala de oração: ", e)

# função para criar objeto no db nosql
def adicionarSorteioNDB(data):
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
        q = Query()

        registros = db.all()

        for registro in registros:
            if registro['token'] == token:
                revelacao = registro["revelacao"]
                amigoSecreto = revelacao.get(meuNome)

                if amigoSecreto:
                    data = {"meuNome":meuNome, "amigoSecreto":amigoSecreto}
                    return data
                
                else:
                    "nao_encontrado"

    
    except Exception as e:
        print('erro ao consultar nome sorteado: ',e)
        