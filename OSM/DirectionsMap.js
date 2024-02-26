import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const DirectionsMap = ({ start, end }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>

    <head>
      <title>Geolocation</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />

      <style>
        body {
          margin: 0;
          padding: 0;
        }
      </style>

    </head>

    <body>
      <!-- Map container -->
      <div id="map" style="width:100%; height: 100vh"></div>

      <!-- Include Leaflet and Leaflet Routing Machine scripts -->
      <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>

      <script>
        // Starting and ending coordinates
        var startCoords = ${JSON.stringify(start)};
        var endCoords = ${JSON.stringify(end)};

        // Calculate the midpoint between start and end coordinates
        var midLatitude = (startCoords[0] + endCoords[0]) / 2;
        var midLongitude = (startCoords[1] + endCoords[1]) / 2;

        // Create a Leaflet map centered at the midpoint with zoom level 11
        var map = L.map('map').setView([midLatitude, midLongitude], 11);

        // Attribution for the tile layer
        mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";

        // Add a tile layer to the map using OpenStreetMap tiles
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'Leaflet &copy; ' + mapLink + ', contribution',
          maxZoom: 10
        }).addTo(map);

        // Create markers for the starting and ending points and add them to the map
        var startMarker = L.marker(startCoords).addTo(map);
        var endMarker = L.marker(endCoords).addTo(map);

        // Create a Leaflet Routing Machine control with waypoints set to the starting and ending coordinates
        L.Routing.control({
          waypoints: [
            L.latLng(startCoords[0], startCoords[1]),
            L.latLng(endCoords[0], endCoords[1])
          ]
        }).addTo(map);

      </script>

    </body>

    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default DirectionsMap;
