import { View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BtnIniciar({
  icon,
  text,
  setIniciada,
  iniciada,
  setInicioJornada,
  dateTime,
  lat,
  long,
  setCheckState,
}) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    (async () => {
      const valorIniciada = await AsyncStorage.getItem('iniciada');
      const iniciou = JSON.parse(valorIniciada);

      const valorData = await AsyncStorage.getItem('inicioJornada');
      const dataIniciada = JSON.parse(valorData);

      if (iniciou) {
        setIniciada((v) => !v);
        setOpacity(0.5);
        setInicioJornada(dataIniciada);
      }
    })();
  }, []);

  function handlePress() {
    if (dateTime) {
      setIniciada((v) => {
        (async () => {
          await AsyncStorage.setItem('iniciada', JSON.stringify(true));
          await AsyncStorage.setItem('inicioJornada', JSON.stringify(dateTime));
        })();

        return !v;
      });
      setOpacity(0.5);
      setInicioJornada(dateTime);

      (async () => {
        const novoArrayDados = [
          {
            cod_jornada: 1,
            nome: 'Nome Motorista',
            placa: 'XXX-000',
            data: new Date(),
            coordenadas: `${lat ? lat : null} ${long ? long : null}`,
          },
        ];

        await AsyncStorage.setItem(
          'dadosJornada',
          JSON.stringify([...novoArrayDados])
        );
        await AsyncStorage.setItem(
          'checkState',
          JSON.stringify({
            encerrar: false,
            direcao: false,
            refeicao: false,
            espera: false,
            descansar: false,
          })
        );
      })();
    }
  }

  return (
    <View style={{ width: 165 }}>
      <TouchableOpacity
        disabled={iniciada}
        style={{ ...styles.btn, opacity: opacity }}
        onPress={handlePress}
      >
        <Ionicons name={icon} size={60} color="#fff" />
        <Text style={{ fontSize: 14, color: '#fff' }}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    gap: 8,
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 3,
    backgroundColor: '#304e70',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
