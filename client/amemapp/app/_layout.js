import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
    return (
        <UserProvider>
            <View style={styles.container}>
                <Slot />
            </View>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8DC'
    },
});