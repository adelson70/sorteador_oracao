import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Alert, Modal } from 'react-native'
import api from '../config/api'
import { useRouter } from 'expo-router'
import { Button } from '../components/Button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useCameraPermissions, CameraView } from 'expo-camera'
import { useUserContext } from '../contexts/UserContext'

export default function IndexPage() {

    const [ input, setInput ] = useState('')
    const [ inputNome, setInputNome ] = useState('')
    const [ inputToken, setInputToken ] = useState('')
    const [ scan, setScan ] = useState(false)
    const [ salaAcessada, setSalaAcessada ] = useState(false)
    const [ cameraPermission, rqCameraPermission ] = useCameraPermissions()

    const { setMeuNome, setToken  } = useUserContext()

    const router = useRouter()

    useEffect(() => {
        if ( cameraPermission === null ){
            rqCameraPermission()
        }
    }, [cameraPermission])

    const handleChangeInput = (input) => {
        const textoFormatado = input.replace(/[^a-zA-Z]/g, '')
        setInput(textoFormatado)

        if (textoFormatado.length == 6){
            acessarSala(textoFormatado)
        }
    }

    const handleChangeInputLetter = (input) => {
        const nomeFormatado = input.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
        setInputNome(nomeFormatado)
    }

    const handleCamera = () => {
        setScan(true)
    }
    
    const handleScan = ({ type, data }) => {
        setScan(false)
        let token = data.slice(-6)
        setInput(token)
        acessarSala(token)
        
    }

    const handleEntrarSala = () => {
        // requisição que envia o nome para participar da sala de oração
        let meuNome = inputNome
        let tokenSala = inputToken


        api.post('/sala/entrar/mobile', {nome:meuNome, token:tokenSala})
            .then(response => {
                let msg = response.data.msg

                console.log(msg)

                switch (msg) {
                    case 'nome_em_uso':
                        Alert.alert('Aviso','Esse nome já esta em uso!')
                        break;
                
                    case 'ok':
                        setToken(tokenSala)
                        setMeuNome(meuNome)
                        router.push('/revelacao')
                        break;
                        
                }
            })
    }
    
    const acessarSala = (token) => {
        api.post(`/sala/acessar/${token}`)
            .then(response => {
                let msg = response.data.msg
    
                switch (msg) {
                    case 'ok':
                        setSalaAcessada(true)
                        setInputToken(token)
                        break;
                
                    case 'sala_nao_existe':
                        Alert.alert('Aviso', 'Sala não existe!')
                        break;
    
                    case 'sala_fechada':
                        Alert.alert('Aviso', 'Essa sala esta fechada!')
                        break;
    
                    case 'limite_atingido':
                        Alert.alert('Aviso', 'Limite de participantes atingido!')
                        break;
        
                                    
                }
        })

    }

    return (
        <View style={styles.container}>

            <View style={styles.containerTexto}>
                <Text style={styles.textoInspiracao}>
                "A oração é a respiração da alma. É o segredo do poder espiritual. Nenhum outro recurso da graça pode substituí-la, e a saúde da alma ser  conservada."
                </Text>
                <Text style={styles.grifado}>Mensagens aos Jovens - Pag. 249</Text>
            </View>

            {/* se acessou a sala com o token esse componente ira aparecer */}
            {salaAcessada && (
                <View style={styles.containerInputTexto}> 
                    <Text style={styles.texto}>
                        Digite seu nome
                    </Text>
                </View>
            )}

            {/* se ainda não acessou a sala com o token */}
            {!salaAcessada && (
                <View style={styles.containerInputTexto}> 
                    <Text style={styles.texto}>
                        Digite o TOKEN da Sala de Oração
                    </Text>
                </View>

            )}

            {/* se não acessou a sala com o token, input do token */}
            {!salaAcessada && (
                <View style={styles.containerInput}>
                    <TextInput style={styles.input}
                    maxLength={6}
                    autoCapitalize='characters'
                    value={input}
                    onChangeText={handleChangeInput}
                    />
                </View>
            )}

            {/* se ja colocou um token valido, ira pedir o nome para entrar na sala */}
            {salaAcessada && (
                <View style={styles.containerInput}>
                    <TextInput style={styles.inputNome}
                    maxLength={12}
                    autoCapitalize='characters'
                    value={inputNome}
                    onChangeText={handleChangeInputLetter}
                    />
                </View>
            )}

            {/* se não entrou com token aparece o componente da camera */}
            {!salaAcessada && (
                <View>
                    <Button onPress={handleCamera}>
                    <Icon name='camera' size={30} color='#003366'/>
                    </Button>

                    <Text style={{color: '#003366'}}>Ler QR Code</Text>
                </View>
            )}

            {/* caso tenha colocado token valido ira aparecer um botão para entrar de fato na sala de oração */}
            {salaAcessada && (
                <View>
                    <Button onPress={ handleEntrarSala }> Entrar </Button>

                </View>
            )}
        
            {/* caso tenha clicado no botão de scan */}
            {scan && (
                <Modal style={{flex: 1}}>
                    <CameraView
                    style={styles.camera}
                    facing='back'
                    onBarcodeScanned={handleScan}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    />
                    <Button onPress={()=> setScan(false)}> Fechar </Button>

                </Modal>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    textoInspiracao: {
        color: '#003366',
        fontSize: 16,
        textAlign: 'center',
    },

    texto: {
        color: '#003366',
        fontSize: 18
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8DC'
    },

    containerInput: {
        top: '-10%'
    },

    containerInputTexto: {
        top: '-15%'
    },

    containerTexto: {
        width: '90%',
        top: '-30%'
    },

    grifado: {
        color: '#003366',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'  
    },

    input: {
        color: '#003366',
        fontSize: 40,
        fontWeight: '600',
        textAlign: 'center',
        borderBottomColor: '#003366',
        borderBottomWidth: 3,
        minWidth: '70%',
        maxWidth: '80%',
        letterSpacing: 6
    },

    inputNome: {
        color: '#003366',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        borderBottomColor: '#003366',
        borderBottomWidth: 3,
        minWidth: '70%',
        maxWidth: '80%'
    },

    centerText: {
        fontSize: 18,
        padding: 16,
        color: '#000',
    },

    camera: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})