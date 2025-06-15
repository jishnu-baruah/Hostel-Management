import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const Profile = () => (
  <View style={styles.container}>
    <Text style={styles.text}>View and edit your personal information, documents, and account settings will appear here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default Profile;