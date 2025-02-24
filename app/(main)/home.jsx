import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Dimensions, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_API_KEY } from "@env"; // Correct import


console.log("Google API Key:", GOOGLE_API_KEY); // Debugging log

const Home = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  // 📌 Fetch user location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable location services to use this feature.");
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // Fetch restaurants after setting location
      fetchRestaurants(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  // 📌 Fetch nearby restaurants using Google Places API
  const fetchRestaurants = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.error("Invalid location");
      return;
    }

    console.log("Fetching restaurants for:", latitude, longitude);

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_API_KEY}`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.error_message) {
        console.error("Google API Error:", data.error_message);
        Alert.alert("Error", data.error_message);
        return;
      }

      if (data.results && data.results.length > 0) {
        setRestaurants(data.results);
      } else {
        console.log("No restaurants found.");
        Alert.alert("No Results", "No restaurants found in this area.");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            provider="google"
            showsUserLocation={true}
            showsMyLocationButton={true}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* User Location */}
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Your Location"
              pinColor="blue"
            />

            {/* Restaurants */}
            {restaurants.map((restaurant, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: restaurant.geometry.location.lat,
                  longitude: restaurant.geometry.location.lng,
                }}
                title={restaurant.name}
                description={restaurant.vicinity}
                onPress={() =>
                  Alert.alert(restaurant.name, `Rating: ${restaurant.rating || "N/A"}\nAddress: ${restaurant.vicinity}`)
                }
              />
              ))}
          </MapView>

          {/* Button to manually refresh restaurant list */}
          <Button title="Find Restaurants" onPress={() => fetchRestaurants(location?.latitude, location?.longitude)} />
        </>
      ) : (
        <Text>Loading map...</Text>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
