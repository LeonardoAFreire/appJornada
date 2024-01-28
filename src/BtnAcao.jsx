import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect } from 'react'




export default function BtnAcao({ icon, text, iniciada }) {
    const [opacity, setOpacity] = useState(0.5)

    useEffect(() => {
        iniciada ? setOpacity(1) : setOpacity(0.5);
    }, [iniciada]);

    return (
        <View style={{ width: 170 }}>
            <TouchableOpacity disabled={!iniciada} style={{ ...styles.btn, opacity: opacity }} onPress={() => alert('Teste')}>
                <Ionicons name={icon} size={60} color="#fff" />
                <Text style={{ fontSize: 14, color: '#fff' }}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    btn: {
        gap: 8,
        borderRadius: 4,
        paddingVertical: 15,
        paddingHorizontal: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 3,
        backgroundColor: '#304e70',
        justifyContent: 'center',
        alignItems: 'center'
    }
})