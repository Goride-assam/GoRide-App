import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GoRide</Text>
      <Text style={styles.text}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f5a400',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#555',
  },
});
