import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BtnRefeicao({
  icon,
  text,
  iniciada,
  dateTime,
  lat,
  long,
  checkState,
  setCheckState,
}) {
  const [opacity, setOpacity] = useState(1);
  const [tempoRefeicao, setTempoRefeicao] = useState(0);
  const refRefeicao = useRef(0);
  const refInterval = useRef(null);

  useEffect(() => {
    iniciada ? setOpacity(1) : setOpacity(0.5);
  }, [iniciada]);

  useEffect(() => {
    if (checkState.refeicao) {
      refInterval.current = setInterval(() => {
        refRefeicao.current += 1;
        const hora = refRefeicao.current / 3600;
        const minuto = (refRefeicao.current % 3600) / 60;
        const segundo = refRefeicao.current % 60;

        const tempoFormatado = format(
          new Date(0, 0, 0, hora, minuto, segundo),
          'HH:mm:ss'
        );
        // Imprime o tempo formatado
        setTempoRefeicao(tempoFormatado);
      }, 1000);
    } else {
      clearInterval(refInterval.current);
    }

    return () => {
      clearInterval(refInterval.current);
    };
  }, [checkState]);

  function handlePress() {
    if (!checkState.refeicao) {
      (async () => {
        const arrayDados = JSON.parse(
          await AsyncStorage.getItem('dadosJornada')
        );
        console.log('Pegando async de daods: ', arrayDados);

        const novoArrayDados = [
          ...arrayDados,
          {
            cod_jornada: 5,
            nome: 'Nome Motorista',
            placa: 'XXX-000',
            data: new Date(),
            coordenadas: `${lat ? lat : null} ${long ? long : null}`,
            cod_anterior: arrayDados[arrayDados.length - 1].cod_jornada,
          },
        ];

        await AsyncStorage.setItem(
          'dadosJornada',
          JSON.stringify(novoArrayDados)
        );
        await AsyncStorage.setItem(
          'checkState',
          JSON.stringify({
            encerrar: false,
            direcao: false,
            refeicao: true,
            espera: false,
            descansar: false,
          })
        );

        setCheckState({
          encerrar: false,
          direcao: false,
          refeicao: true,
          espera: false,
          descansar: false,
        });
      })();
    }
  }

  return (
    <View
      style={{
        ...styles.caixa,
        opacity: opacity,
      }}
    >
      <TouchableOpacity
        disabled={!iniciada}
        style={{ ...styles.btn }}
        onPress={handlePress}
      >
        {tempoRefeicao ? (
          <Text
            style={{
              fontSize: 26,
              color: '#fff',
            }}
          >
            {tempoRefeicao}
          </Text>
        ) : (
          <Ionicons name={icon} size={60} color="#fff" />
        )}

        <Text style={{ fontSize: 14, color: '#fff' }}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  caixa: {
    width: 165,
    height: 120,
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
    tempo: {
      fontSize: 22,
      color: '#fff',
    },
  },
});
