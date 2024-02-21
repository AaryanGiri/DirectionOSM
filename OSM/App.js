import React from 'react';
import { View, StyleSheet } from 'react-native';
import DirectionsMap from './DirectionsMap';

const App = () => {
  const startPoint = "28.7041,77.1025"; // 
  const endPoint = "28.6139,77.2090"; // 
  const apiKey = "OPENROUTE SERVICE API"; // Replace with your API key

  return (
    <View style={styles.container}>
      <DirectionsMap
        startPoint={startPoint}
        endPoint={endPoint}
        apiKey={apiKey}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
