import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { paymentAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { COLORS, PAYMENT_STATUS } from '../../utils/constants';

const ManagePayments = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentAPI.getAllPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleMockPay = async (paymentId) => {
    setPayingId(paymentId);
    try {
      await paymentAPI.updatePaymentStatus(paymentId, PAYMENT_STATUS.COMPLETED);
      Alert.alert('Success', 'Payment marked as completed!');
      fetchPayments();
    } catch (err) {
      Alert.alert('Error', 'Failed to update payment status');
    } finally {
      setPayingId(null);
    }
  };

  const handleViewReceipt = (paymentId) => {
    navigation.navigate('PaymentDetail', { paymentId });
  };

  const handleGenerateBills = async () => {
    setGenerating(true);
    try {
      await paymentAPI.generateMonthlyBills();
      Alert.alert('Success', 'Monthly bills generated (mock)!');
      fetchPayments();
    } catch (err) {
      Alert.alert('Error', 'Failed to generate bills');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Button title={generating ? 'Generating...' : 'Generate Bills (Mock)'} onPress={handleGenerateBills} disabled={generating} style={styles.genBtn} />
      </View>
      <FlatList
        data={payments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.type.toUpperCase()} ({item.month || '-'})</Text>
            <Text style={styles.detail}>Student: {item.studentName || item.userName || '-'}</Text>
            <Text style={styles.detail}>Email: {item.studentEmail || item.userEmail || '-'}</Text>
            <Text style={styles.detail}>Amount: ₹{item.amount}</Text>
            <Text style={styles.detail}>Status: <Text style={[styles.status, styles[item.status]]}>{item.status}</Text></Text>
            <Text style={styles.detail}>Due Date: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</Text>
            {item.status === PAYMENT_STATUS.PENDING && (
              <Button
                title={payingId === item._id ? 'Paying...' : 'Mark as Paid (Mock)'}
                onPress={() => handleMockPay(item._id)}
                disabled={payingId === item._id}
                style={styles.payBtn}
              />
            )}
            {item.status === PAYMENT_STATUS.COMPLETED && (
              <Button
                title="View Receipt"
                onPress={() => handleViewReceipt(item._id)}
                style={styles.payBtn}
              />
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.info}>No payments found.</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshing={loading}
        onRefresh={fetchPayments}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  genBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  status: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  pending: { color: COLORS.warning },
  completed: { color: COLORS.success },
  failed: { color: COLORS.error },
  payBtn: {
    marginTop: 8,
  },
  info: {
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
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

export default ManagePayments;