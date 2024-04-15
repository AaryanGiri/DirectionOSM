import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const DirectionsMap = ({ start, end }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [intermediatePoints, setIntermediatePoints] = useState([]);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const apiKey = '5b3ce3597851110001cf62482b3f5e147fba4e8586b457a5f4e6943c'; // Replace with your OpenRouteService API key
        const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`);
        const data = await response.json();

        if (!data || !data.features || data.features.length === 0 || !data.features[0].geometry || data.features[0].geometry.coordinates.length === 0) {
          throw new Error('No route data found');
        }

        const routeCoordinates = data.features[0].geometry.coordinates;

        // Calculate intermediate points at 100km intervals
        const intermediatePoints = [];
        let accumulatedDistance = 0;
        let lastPoint = routeCoordinates[0];

        for (let i = 1; i < routeCoordinates.length; i++) {
          const distanceToNext = haversineDistance(lastPoint[1], lastPoint[0], routeCoordinates[i][1], routeCoordinates[i][0]);
          accumulatedDistance += distanceToNext;

          if (accumulatedDistance >= 100) {
            intermediatePoints.push(routeCoordinates[i]);
            accumulatedDistance = 0;
          }

          lastPoint = routeCoordinates[i];
        }

        setIntermediatePoints(intermediatePoints);

        // Generate HTML content
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

              // Draw route
              L.Routing.control({
                waypoints: [
                  L.latLng(startCoords[0], startCoords[1]),
                  L.latLng(endCoords[0], endCoords[1])
                ]
              }).addTo(map);

              // Add intermediate points markers
              var intermediatePoints = ${JSON.stringify(intermediatePoints)};
              intermediatePoints.forEach(point => {
                L.marker([point[0], point[1]]).addTo(map);
              });
            </script>
          </body>
          </html>
        `;
        setHtmlContent(newHtmlContent);
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    fetchRouteData();
  }, [start, end]);

  // Function to calculate haversine distance between two points
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Log intermediate points
  useEffect(() => {
    console.log("Intermediate Points:", intermediatePoints);
  }, [intermediatePoints]);

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
