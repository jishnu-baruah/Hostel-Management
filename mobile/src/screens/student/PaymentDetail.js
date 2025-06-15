import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { paymentAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

const PaymentDetail = ({ route }) => {
  const { paymentId } = route.params;
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  const fetchPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentAPI.getPaymentReceipt(paymentId);
      setPayment(res.data.payment || res.data); // fallback for mock
    } catch (err) {
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    Alert.alert('Mock Download', 'Receipt download is mocked in this MVP.');
  };

  if (loading) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  if (error || !payment) {
    return <View style={styles.container}><Text style={styles.error}>{error || 'Payment not found.'}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Receipt</Text>
      <Text style={styles.label}>Type: <Text style={styles.value}>{payment.type}</Text></Text>
      <Text style={styles.label}>Amount: <Text style={styles.value}>₹{payment.amount}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{payment.status}</Text></Text>
      <Text style={styles.label}>Month: <Text style={styles.value}>{payment.month || '-'}</Text></Text>
      <Text style={styles.label}>Paid At: <Text style={styles.value}>{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '-'}</Text></Text>
      <Text style={styles.label}>Receipt #: <Text style={styles.value}>{payment._id}</Text></Text>
      <Button title="Download Receipt (Mock)" onPress={handleDownload} style={styles.btn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.gray,
  },
  value: {
    fontWeight: 'normal',
    color: '#222',
  },
  btn: {
    marginTop: 30,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PaymentDetail;