import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function AppTabs() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>GoRide</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: 1,
  },

  text: {
    fontSize: 1,
  },
});
