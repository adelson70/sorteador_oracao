from app.rotas import *
from app.services.usuario import *

def registerUsuario(app):
    
    @app.route('/usuario/admin',methods=['POST','GET'])
    def loginADM():
        return render_template('loginADM.html')