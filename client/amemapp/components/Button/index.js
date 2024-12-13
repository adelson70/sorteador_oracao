import { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'

export const Button = (props) => {

    const [ pressionado, setPressionado ] = useState(false)

    return (
        <TouchableOpacity
        style={{
            borderWidth: 1,
            borderColor: pressionado ? 'white' : undefined,
            marginVertical: 8,
            padding: 6,
            paddingInline: 12,
            borderRadius: 4,
            width: 'auto',
            backgroundColor: pressionado ? '#003366' : undefined
        }}
        
        onPressIn={() => setPressionado(true)} // Quando pressionar
        onPressOut={() => setPressionado(false)} // Quando soltar

        onPress={props.onPress}
        activeOpacity={0.7}>

        <Text style={{
            color: pressionado ? 'white' : '#003366',
            fontWeight: 'normal',
            fontSize: 16,
            textAlign: 'center'
        }}>
            {props.children}
        </Text>


        </TouchableOpacity>
    )
}