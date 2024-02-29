import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import DirectionsMap from "./DirectionsMap";

const geocodeAddress = (address, callback) => {
  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
  const params = {
    q: address,
    format: "json",
    addressdetails: 1,
    polygon_geojson: 0,
  };
  const queryString = new URLSearchParams(params).toString();
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0];
        const coordinates = [parseFloat(lat), parseFloat(lon)];
        callback(coordinates);
      } else {
        console.error("No coordinates found for the address:", address);
        callback(null);
      }
    })
    .catch((error) => {
      console.error("Error geocoding address:", address, error);
      callback(null);
    });
};

const App = () => {
  const [start, setStart] = useState("New Delhi"); // Default start point Delhi
  const [end, setEnd] = useState("Mumbai"); // Default end point Mumbai

  const handleSearch = () => {
    geocodeAddress(start, (startCoords) => {
      geocodeAddress(end, (endCoords) => {
        if (startCoords && endCoords) {
          console.log("Start coordinates:", startCoords);
          console.log("End coordinates:", endCoords);
          setStartCoordinates(startCoords);
          setEndCoordinates(endCoords);
        } else {
          console.error("Failed to obtain coordinates for start or end address.");
        }
      });
    });
  };

  const [startCoordinates, setStartCoordinates] = useState([28.6139, 77.209]);
  const [endCoordinates, setEndCoordinates] = useState([19.076, 72.8777]);

  return (
    <View style={styles.container}>
      <DirectionsMap start={startCoordinates} end={endCoordinates} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Start address"
          value={start}
          onChangeText={(text) => setStart(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="End address"
          value={end}
          onChangeText={(text) => setEnd(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default App;
