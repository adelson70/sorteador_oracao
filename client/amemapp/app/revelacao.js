import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'
import { useUserContext } from '../contexts/UserContext';
import io from 'socket.io-client'
import { API_URL } from '../config/constants';

export default function Menu() {

    const router = useRouter()
    const { meuNome, nomeSorteado, token, sorteado  } = useUserContext()    
    
    useEffect(() => {
        const socket = io(API_URL)

        // emit para entrar na sala de oração
        socket.emit('entrar_sala_template', {
            nome: meuNome,
            token: token,
            entrou: false
        })
        console.log('evento emitido', meuNome, token)
        
        // caso tente voltar para outra pagin
        const backAction = () => {
            return true
        }
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction)
            socket.disconnect()
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