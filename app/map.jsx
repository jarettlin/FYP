import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker

const Index = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,  // Example latitude
    longitude: -122.4324,  // Example longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Map</Text>
      <MapView
        style={styles.map}
        region={region}  // Set the map region
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}  // Optionally track region changes
      >
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} title="Marker" description="Here is a marker" />
        {/* Add more markers if needed */}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  title: {
    position: 'absolute',
    top: 40,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Index;
