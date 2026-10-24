import { View, Text, StyleSheet } from 'react-native';

export default function RidesScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        My Rides 🚕
      </Text>

      <View style={styles.card}>

        <Text style={styles.text}>
          Ride 1
        </Text>

        <Text style={styles.text}>
          Pickup: Home
        </Text>

        <Text style={styles.text}>
          Drop: Market
        </Text>

        <Text style={styles.status}>
          Status: Completed
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.text}>
          Ride 2
        </Text>

        <Text style={styles.text}>
          Pickup: Office
        </Text>

        <Text style={styles.text}>
          Drop: Station
        </Text>

        <Text style={styles.status}>
          Status: Completed
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  text: {
    fontSize: 16,
    marginBottom: 8,
  },

  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});
