import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


export default function App() {

  const [location, setLocation] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null)
  const [marker, setMarker] = useState({ latitude: 60.200692, longitude: 24.934302 });
  
  const key='KhUkVsnIK0YyoSMjZ6SYGwFioGYG5d0d';

  const getLocation = async () => {
    try {
      const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${location}`);
      const data = await response.json();
        const lat = data.results[0].locations[0].latLng.lat;
        const lng = data.results[0].locations[0].latLng.lng;
        setSearchedLocation({ latitude: lat, longitude: lng });
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
        initialRegion={{
          latitude: 60.200692,
          longitude: 24.934302,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
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
    margin: 20,
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
    height: 40, 
    borderColor: 'black', 
    borderWidth: 1
  }

});
