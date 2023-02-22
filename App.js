import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { API_KEY } from '@env';


export default function App() {

  const [initialLocation, setInitialLocation] = useState(null);
  const [location, setLocation] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null)
  const [marker, setMarker] = useState(null);
  
  const key = API_KEY;

  // Getting location when opened
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      const firstLocation = await Location.getCurrentPositionAsync({});
      const firstLat = firstLocation.coords.latitude;
      const firstLng = firstLocation.coords.longitude;
      setInitialLocation({ latitude: firstLat, longitude: firstLng, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
      setMarker({ latitude: firstLat, longitude: firstLng });
    })();
  }, []);

  // Getting location from API when Search Button pressed
  const getLocation = async () => {
    try {
      const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${location}`);
      const data = await response.json();
        const lat = data.results[0].locations[0].latLng.lat;
        const lng = data.results[0].locations[0].latLng.lng;
        setSearchedLocation({ latitude: lat, longitude: lng, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
        setMarker({ latitude: lat, longitude: lng });
      }
      catch(error) {
        Alert.alert('Error', error);
      }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.button}>
        <TextInput
          style={styles.textInputStyle}
          placeholder='Location'
          value={location}
          onChangeText={text => setLocation(text)} 
        />
        <Button title="Find" onPress={getLocation} />
      </View>
      <MapView
        style={styles.mapStyle}
        initialRegion={initialLocation}
        region={searchedLocation}
      >
        <Marker
          coordinate={marker}
          title={location}
        />
      </MapView>
    </View>        
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  mapStyle: {
    flex: 1, 
    height: '100%', 
    width: '100%'
  },

  textInputStyle: {
    fontSize: 18, 
    width: 150, 
    height: 35, 
    borderColor: 'black', 
    borderWidth: 1
  }

});
