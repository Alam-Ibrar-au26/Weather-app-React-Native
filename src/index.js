import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const openWeatherApi = '935241ee3f3b0b218c003064c3d08d61';
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&ppid=${openWeatherApi}`;

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);
    // ask for permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied'); // if permission is denied, show an alert
    }

    // get the current locaion
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    // fetch the weather data from openeweathermap api
    const response = await fetch(
      `${url}&lat=${location.coords.latitude}&lon${location.coords.longitude}`
    );
    const data = await response.json(); // convert the response to json

    if (!response.ok) {
      Alert.alert('Error', 'Something went wrong'); // if response is not ok show alert
    } else {
      setForecast(data); // set the data to the state
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    // if the forecast is not loaded, show a loading indicator
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    );
  }

  const current = forecast.current.Weather[0];

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadForecast()}
          />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{ alignItems: 'center', textAlign: 'center' }}>
          Your Location
        </Text>
        <View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECDBBA'
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#C84B31'
  }
})