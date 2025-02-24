import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, View, Dimensions, Text, Button, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_API_KEY } from "@env";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";


console.log("Google API Key:", GOOGLE_API_KEY); // Debugging log

const Home = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Store selected restaurant
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null); // ✅ Create Bottom Sheet Ref

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

  useEffect(() => {
    if (selectedRestaurant && bottomSheetRef.current) {
      console.log("Expanding BottomSheet for:", selectedRestaurant.name);
    
      // Ensure index is within valid range (0, 1, or 2)
      bottomSheetRef.current?.snapToIndex(0); // Expanding to "50%"
    }
  }, [selectedRestaurant]); // Runs every time a restaurant is selected
  
  

  // 📌 Fetch nearby restaurants using Google Places API
  const fetchRestaurants = async (latitude, longitude, nextPageToken = "") => {
    if (!latitude || !longitude) return;
  
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${GOOGLE_API_KEY}`;
  
    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
    }
  
    try {
      let response = await fetch(url);
      let data = await response.json();
  
      if (data.error_message) {
        console.error("Google API Error:", data.error_message);
        Alert.alert("Error", data.error_message);
        return;
      }
  
      if (data.results) {
        setRestaurants((prev) => [...prev, ...data.results]); // Append new results
      }
  
      if (data.next_page_token) {
        setTimeout(() => {
          fetchRestaurants(latitude, longitude, data.next_page_token);
        }, 2000); // Google requires a small delay before fetching the next page
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMarkerPress = (restaurant) => {
    console.log("Restaurant selected:", restaurant);
    setSelectedRestaurant(restaurant);
    if (bottomSheetRef.current) {
      console.log("Expanding BottomSheet..."); // Debugging log
      bottomSheetRef.current.expand(); // Try forcing the expansion
    } else {
      console.log("BottomSheet ref is null!"); // Debugging log
    }
  };



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            ref={mapRef} // ✅ Now this will work!
            style={styles.map}
            index={-1}
            provider="google"
            showsUserLocation={true}
            showsMyLocationButton={false}
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
                onPress={() => handleMarkerPress(restaurant)}
                pinColor="red"
              />
            ))}
          </MapView>

          {/* 📌 Custom Floating Button */}
          <TouchableOpacity style={styles.locationButton} onPress={centerMap}>
            <Ionicons name="locate" size={30} color="white" />
          </TouchableOpacity>

          {/* 📌 Bottom Sheet for Restaurant Details */}
          <BottomSheet ref={bottomSheetRef} index={0} snapPoints={["25%", "50%", "75%"]} enablePanDownToClose={true}>
            <View style={styles.bottomSheetContent}>
              {selectedRestaurant ? (
                <>
                  <Text style={styles.title}>{selectedRestaurant.name}</Text>
                  <Text style={styles.details}>⭐ Rating: {selectedRestaurant.rating || "N/A"}</Text>
                  <Text style={styles.details}>📍 Address: {selectedRestaurant.vicinity}</Text>
                  <Button title="Close" onPress={() => bottomSheetRef.current?.close()} />
                </>
              ) : (
                <Text>No restaurant selected</Text>
              )}
            </View>
          </BottomSheet>

          {/* Button to manually refresh restaurant list */}
          <Button title="Find Restaurants" onPress={() => fetchRestaurants(location?.latitude, location?.longitude)} />
        </>
      ) : (
        <Text>Loading map...</Text>
      )}
    </View>
    </GestureHandlerRootView>
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
  locationButton: {
    position: "absolute",
    bottom: 50, // 📌 Adjust this to move button up/down
    right: 20, // 📌 Adjust this to move button left/right
    backgroundColor: "#007AFF", // 📌 iOS Blue (change to any color)
    padding: 12,
    borderRadius: 30, // 📌 Makes it circular
    elevation: 5, // 📌 Shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bottomSheetContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  details: {
    fontSize: 16,
    marginTop: 5,
  },
});
