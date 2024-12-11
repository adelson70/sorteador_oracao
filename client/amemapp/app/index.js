import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Alert, Modal } from 'react-native'
// import api from '../config/api'
import { useRouter } from 'expo-router'
import { Button } from '../components/Button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useCameraPermissions, CameraView } from 'expo-camera'

export default function IndexPage() {

    const [ input, setInput ] = useState('')
    const [ scan, setScan ] = useState(false)
    const [ cameraPermission, rqCameraPermission ] = useCameraPermissions()

    useEffect(() => {
        if ( cameraPermission === null ){
            rqCameraPermission()
        }
    }, [cameraPermission])

    const handleChangeInput = (input) => {
        const textoFormatado = input.replace(/[^a-zA-Z]/g, '')
        setInput(textoFormatado)
    }

    const handleCamera = () => {
        setScan(true)
    }
    
    const handleScan = ({ type, data }) => {
        setScan(false)
        setInput(data)
        console.log(`QR Code lido: ${data}`)

    }

    return (
        <View style={styles.container}>

            <View style={styles.containerTexto}>
                <Text style={styles.textoInspiracao}>
                "A oração é a respiração da alma. É o segredo do poder espiritual. Nenhum outro recurso da graça pode substituí-la, e a saúde da alma ser  conservada."
                </Text>
                <Text style={styles.grifado}>Mensagens aos Jovens - Pag. 249</Text>
            </View>

            <View style={styles.containerInputTexto}> 
                <Text style={styles.texto}>
                    Digite o TOKEN da Sala de Oração
                </Text>
            </View>

            <View style={styles.containerInput}>
                <TextInput style={styles.input}
                maxLength={6}
                autoCapitalize='characters'
                value={input}
                onChangeText={handleChangeInput}
                />
            </View>

            <View>
                <Button onPress={handleCamera}>
                <Icon name='camera' size={30} color='#003366'/>
                </Button>

                <Text style={{color: '#003366'}}>Ler QR Code</Text>
            </View>

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