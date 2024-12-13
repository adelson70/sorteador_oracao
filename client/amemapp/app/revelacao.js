import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router'
import { useUserContext } from '../contexts/UserContext';
import socket from '../config/socket';
import { Button } from '../components/Button';

export default function Menu() {

    const router = useRouter()
    const { meuNome, token, sorteado, setSorteado} = useUserContext()
    const [ salaEntrar, setSalaEntrar ] = useState(false)
    const [ nomeSorteado, setNomeSorteado ] = useState(null)
    
    useEffect(() => {

        try {
            socket.connect()
            
            if (!salaEntrar){
                // emit para entrar na sala de oração
                socket.emit('entrar_sala_mobile', {
                    nome: meuNome,
                    token: token
                })

                setSalaEntrar(true)
    
                if (socket.connected){
                    setSorteado(false)
                }

            }
            
            
        } catch (error) {
            console.log(error)    
        }

        // evento quando receber o sorteio
        socket.on('receber_nome_oracao', (data)=>{
            let nomeAux = data[meuNome]

            setNomeSorteado(nomeAux)
            setSorteado(true)

            Alert.alert('Aviso', 'Nomes Sorteados!')
            
        })

        
        // caso tente voltar para outra pagin
        const backAction = () => {
            return true
        }
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction)
        }
    }, [router.query])

    const handle_amem = () => {
        Alert.alert(
            'Aviso',
            'Você quer sair?',
            [
                {
                    text:'Não',
                    style: 'cancel'
                },
                {
                    text:'Sim',
                    onPress: () => router.push('/'),
                }
            ]
        )
    }

    return (
        <View style={styles.container}>
    
            { !sorteado && (
                <View style={styles.container}>
                    <Text style={styles.aviso}>Aguardando Sorteio</Text>
                    
                    <ActivityIndicator size={'150'} color="#003366" />

                </View>
            )}
            { sorteado && (
                <View style={styles.container}>
                    {/* <Text style={styles.aviso}>Nomes Sorteados!</Text> */}

                    <View style={styles.containerAviso}>
                        <Text style={styles.avisoNome}>{nomeSorteado} é a pessoa por quem você estará em oração!</Text>
                    </View>

                    <View style={styles.btn}>
                        <Button onPress={handle_amem} > Amém </Button>
                    </View>

                </View>
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF8DC'
    },

    aviso: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        top: '-10%'
    },

    avisoNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#003366',
        top: '-5%',
        textAlign: 'center'
    },
    containerAviso: {
        backgroundColor: '#B0C4DE',
        padding: 8,
        borderRadius: 8
    },
    btn: {
        marginVertical: 20
    }

});