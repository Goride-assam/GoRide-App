import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

export function Collapsible({
  title,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.arrow}>
          {open ? '⌄' : '›'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  header: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  arrow: {
    fontSize: 26,
    color: '#f5a400',
  },

  content: {
    padding: 16,
    paddingTop: 4,
  },
});
