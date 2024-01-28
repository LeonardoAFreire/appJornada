import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Button,
  Image,
  AppState,
} from 'react-native';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BtnAcao from '../BtnAcao';
import BtnIniciar from '../BtnIniciar';
import BtnDirecao from '../BtnDirecao';
import BtnRefeicao from '../BtnRefeicao';
import { format, differenceInSeconds } from 'date-fns';

export default function Home() {
  const [arrayDados, setArrayDados] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [inicioJornada, setInicioJornada] = useState(null);
  const [iniciada, setIniciada] = useState(false);
  const [somaDirecao, setSomaDirecao] = useState(0);

  // Estados dos componentes filho
  const [tempoDirecao, setTempoDirecao] = useState(null);
  const [checkState, setCheckState] = useState({
    encerrar: false,
    direcao: false,
    refeicao: false,
    espera: false,
    descansar: false,
  });

  useEffect(() => {
    (async () => {
      const dados = JSON.parse(await AsyncStorage.getItem('dadosJornada'));
      if (dados) {
        setSomaDirecao(0);
        dados.forEach((dado, index) => {
          if (dado['cod_jornada'] === 2) {
            if (dados[index + 1]) {
              const dataInicio = dado['data'];
              const dataFim = dados[index + 1]['data'];
              const diff = differenceInSeconds(dataFim, dataInicio);
              const total = diff ? diff : 0;
              setSomaDirecao((sum) => (sum += total));
            }
          }
        });
      }
    })();
  }, [checkState]);

  useEffect(() => {
    (async () => {
      const getState = JSON.parse(await AsyncStorage.getItem('checkState'));
      if (getState) {
        setCheckState(getState);
      }
    })();
  }, []);

  useEffect(() => {
    // Primeira dateTime para que nao demore 1segundo pro temporizador comecar a atualizar
    setDateTime(format(new Date(), 'dd/MM/yyy HH:mm:ss'));

    // Temporizador para que o horario fique atualizando
    const idInterval = setInterval(() => {
      setDateTime(format(new Date(), 'dd/MM/yyy HH:mm:ss'));
      (async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Permissão nao concedida');
            return;
          }
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
          });
          setLat(location.coords.latitude);
          setLong(location.coords.longitude);
        } catch (e) {
          console.error(e, ': Erro ao pegar a localização.');
        }
      })();
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={44} color="#243b55" />
        <View>
          <Text style={styles.headerText}>João Da Silva</Text>
          <Text style={{ ...styles.headerText, fontSize: 12 }}>Motorista</Text>
        </View>
      </View>
      <View style={styles.bgData}>
        <View style={styles.viewData}>
          <Ionicons name="calendar" size={32} color="#fff" />

          <Text style={styles.text}>Data de Hoje</Text>
          <Text style={styles.text}>{dateTime}</Text>
        </View>
        <View style={styles.viewData}>
          <Ionicons name="car" size={32} color="#fff" />
          <Text style={styles.text}>Inicio de Jornada</Text>
          <View style={{ alignItems: 'center', gap: 8, color: '#fff' }}>
            <Text style={{ fontSize: 14, color: '#fff' }}>
              {inicioJornada ? inicioJornada : 'Jornada não iniciada'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <BtnIniciar
          icon="caret-forward-outline"
          text="INICIAR"
          setIniciada={setIniciada}
          iniciada={iniciada}
          setInicioJornada={setInicioJornada}
          dateTime={dateTime}
          setArrayDados={setArrayDados}
          arrayDados={arrayDados}
          lat={lat}
          long={long}
          setCheckState={setCheckState}
        />
        <BtnAcao icon="bed-outline" text="ENCERRAR" iniciada={iniciada} />
        <BtnDirecao
          icon="speedometer-outline"
          text="DIREÇÃO"
          iniciada={iniciada}
          setArrayDados={setArrayDados}
          arrayDados={arrayDados}
          lat={lat}
          long={long}
          dateTime={dateTime}
          checkState={checkState}
          setCheckState={setCheckState}
          tempoDirecao={tempoDirecao}
          setTempoDirecao={setTempoDirecao}
          somaDirecao={somaDirecao}
        />
        <BtnRefeicao
          icon="restaurant-outline"
          text="REFEIÇÃO"
          iniciada={iniciada}
          setArrayDados={setArrayDados}
          arrayDados={arrayDados}
          lat={lat}
          long={long}
          dateTime={dateTime}
          checkState={checkState}
          setCheckState={setCheckState}
        />
        <BtnAcao icon="hourglass-outline" text="ESPERA" iniciada={iniciada} />
        <BtnAcao
          icon="stopwatch-outline"
          text="DESCANSAR"
          iniciada={iniciada}
          dataHora={dateTime}
        />
      </View>
      <StatusBar style="light" translucent={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  header: {
    padding: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  headerText: {
    color: '#243b55',
    fontSize: 18,
  },
  bgData: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#243b55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    margin: 10,
  },
  text: {
    fontSize: 14,
    color: '#fff',
  },
  box: {
    flexDirection: 'row',
    backgroundColor: '#243b55',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
    flexWrap: 'wrap',
    flex: 1,
  },
  viewData: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
