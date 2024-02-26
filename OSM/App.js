import React from 'react';
import { View, StyleSheet } from 'react-native';
import DirectionsMap from './DirectionsMap';

const App = () => {
  // Define the start and end coordinates
  const start = [28.7041, 77.1025]; // Delhi
  const end = [19.076, 72.8777]; // Mumbai

  return (
    <View style={styles.container}>
      <DirectionsMap start={start} end={end} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
