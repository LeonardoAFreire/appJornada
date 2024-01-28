import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { differenceInSeconds } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BtnDirecao({
  icon,
  text,
  iniciada,
  lat,
  long,
  checkState,
  setCheckState,
  tempoDirecao,
  setTempoDirecao,
  somaDirecao,
}) {
  const [opacity, setOpacity] = useState(1);
  const refDirecao = useRef(0);
  const refInterval = useRef(null);

  useEffect(() => {
    iniciada ? setOpacity(1) : setOpacity(0.5);
  }, [iniciada]);

  function formatCronometro(tempo) {
    const horasTotais = tempo / 3600;
    const horas = Math.floor(horasTotais);
    const minutos = Math.floor((horasTotais - horas) * 60);
    const segundos = Math.floor((horasTotais - horas) * 3600 - minutos * 60);
    const tempoFormatado = `${horas < 10 ? '0' : ''}${horas}:${
      minutos < 10 ? '0' : ''
    }${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    return tempoFormatado;
  }

  useEffect(() => {
    if (checkState.direcao) {
      (async () => {
        const dataInicio = JSON.parse(
          await AsyncStorage.getItem('inicioDirecao')
        );
        refDirecao.current = differenceInSeconds(new Date(), dataInicio);
        refDirecao.current += somaDirecao;

        refInterval.current = setInterval(async () => {
          refDirecao.current += 1;
          setTempoDirecao(formatCronometro(refDirecao.current));
          try {
            await AsyncStorage.setItem(
              'tempoDirecao',
              JSON.stringify(refDirecao.current)
            );
            await AsyncStorage.setItem(
              'ultimaData',
              JSON.stringify(new Date())
            );
          } catch (error) {
            console.log('Erro ao salvar: ', error);
          }
        }, 1000);
      })();
    } else {
      clearInterval(refInterval.current);
    }
    return () => {
      clearInterval(refInterval.current);
    };
  }, [checkState]);

  function handlePress() {
    if (!checkState.direcao) {
      (async () => {
        const arrayDados = JSON.parse(
          await AsyncStorage.getItem('dadosJornada')
        );

        const novoArrayDados = [
          ...arrayDados,
          {
            cod_jornada: 2,
            nome: 'Nome Motorista',
            placa: 'XXX-000',
            data: new Date(),
            coordenadas: `${lat ? lat : null} ${long ? long : null}`,
            cod_anterior: arrayDados[arrayDados.length - 1].cod_jornada,
          },
        ];

        await AsyncStorage.setItem('inicioDirecao', JSON.stringify(new Date()));
        await AsyncStorage.setItem(
          'dadosJornada',
          JSON.stringify(novoArrayDados)
        );
        await AsyncStorage.setItem(
          'checkState',
          JSON.stringify({
            encerrar: false,
            direcao: true,
            refeicao: false,
            espera: false,
            descansar: false,
          })
        );

        setCheckState({
          encerrar: false,
          direcao: true,
          refeicao: false,
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
        {tempoDirecao ? (
          <Text
            style={{
              fontSize: 26,
              color: '#fff',
            }}
          >
            {tempoDirecao}
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
