import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AnimatedIconProps = {
  name?: string;
  size?: number;
  color?: string;
};

export function AnimatedIcon({
  name = '•',
  size = 24,
  color = '#f5a400',
}: AnimatedIconProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { fontSize: size, color }]}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontWeight: 'bold',
  },
});
