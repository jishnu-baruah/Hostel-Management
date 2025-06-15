import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { complaintAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

const Complaints = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getAllComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const statusLabels = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  const statusColors = {
    open: COLORS.warning,
    in_progress: COLORS.primary,
    resolved: COLORS.success,
    closed: COLORS.gray,
  };

  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ComplaintDetail', { complaintId: item._id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.category} | {item.priority} | {new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={[styles.status, { color: statusColors[item.status] }]}>
        Status: {statusLabels[item.status] || item.status}
      </Text>
      <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="New Complaint" onPress={() => navigation.navigate('CreateComplaint')} style={styles.createBtn} />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={item => item._id}
          renderItem={renderComplaint}
          refreshing={refreshing}
          onRefresh={fetchComplaints}
          ListEmptyComponent={<Text style={styles.empty}>No complaints found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  createBtn: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});

export default Complaints;