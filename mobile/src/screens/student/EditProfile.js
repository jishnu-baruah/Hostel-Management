import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const EditProfile = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Edit Profile</Text>
    <Text style={styles.text}>Update your personal information and account settings will appear here.</Text>
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

export default EditProfile;