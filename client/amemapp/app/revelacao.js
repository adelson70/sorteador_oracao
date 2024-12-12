import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'
import { useUserContext } from '../contexts/UserContext';
import socket from '../config/socket';

export default function Menu() {

    const router = useRouter()
    const { meuNome, nomeSorteado, token, sorteado  } = useUserContext()    
    
    useEffect(() => {

        try {
            socket.connect()

            console.log(socket.connected)
    
            // emit para entrar na sala de oração
            socket.emit('entrar_sala_mobile', {
                nome: meuNome,
                token: token
            })
            
            console.log('evento emitido', meuNome, token)
            
        } catch (error) {
            console.log(error)    
        }
        
        // caso tente voltar para outra pagin
        const backAction = () => {
            return true
        }
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction)
        }
    }, [router.query])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Seja Bem-vindo {meuNome}!</Text>
            <Text style={styles.text}> {token} </Text>
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
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
    },
});