import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const DirectionsMap = ({ startPoint, endPoint, apiKey }) => {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startPoint}&end=${endPoint}`
        );
        const data = await response.json();
        console.log('API Response:', data); // Log the response data
        setRoute(data);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [startPoint, endPoint, apiKey]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>

    <head>
      <title>OpenStreetMap</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
      <style>
        #map { height: 100vh; }
      </style>
    </head>

    <body>
      <div id="map"></div>

      <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${startPoint}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
