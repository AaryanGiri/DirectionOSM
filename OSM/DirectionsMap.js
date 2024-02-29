import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const DirectionsMap = ({ start, end }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const generateHtmlContent = () => {
      const newHtmlContent = `
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
            #map {
              width: 100%;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>
          <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
          <script>
            var startCoords = ${JSON.stringify(start)};
            var endCoords = ${JSON.stringify(end)};
            var midLatitude = (startCoords[0] + endCoords[0]) / 2;
            var midLongitude = (startCoords[1] + endCoords[1]) / 2;
            var map = L.map('map').setView([midLatitude, midLongitude], 11);
            var mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: 'Leaflet &copy; ' + mapLink + ', contribution',
              maxZoom: 20
            }).addTo(map);
            var startMarker = L.marker(startCoords).addTo(map);
            var endMarker = L.marker(endCoords).addTo(map);
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
      setHtmlContent(newHtmlContent);
    };

    generateHtmlContent();
  }, [start, end]);

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
