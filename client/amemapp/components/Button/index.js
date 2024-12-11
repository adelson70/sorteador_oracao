import { Text, TouchableOpacity } from 'react-native'

export const Button = (props) => {
    return (
        <TouchableOpacity
        style={{
            borderWidth: 1,
            borderColor: '#003366',
            marginVertical: 8,
            padding: 6,
            paddingInline: 12,
            borderRadius: 4,
            width: 'auto'
        }}
        
        activeOpacity={0.7}>

        <Text style={{
            color: '#003366',
            fontWeight: 'normal',
            fontSize: 16,
            textAlign: 'center'
        }}>
            {props.title}
        </Text>


        </TouchableOpacity>
    )
}