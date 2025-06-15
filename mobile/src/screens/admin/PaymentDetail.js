import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const PaymentDetail = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Payment Details (Admin)</Text>
    <Text style={styles.text}>View and manage payment information, approve/reject payments, and generate reports will appear here.</Text>
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

export default PaymentDetail;