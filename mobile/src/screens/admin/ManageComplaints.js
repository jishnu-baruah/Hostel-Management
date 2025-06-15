import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { complaintAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const ManageComplaints = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getAllComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(c =>
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter ? c.status === statusFilter : true)
  );

  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ComplaintDetail', { complaintId: item._id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.category} | {item.priority} | {new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.status}>Status: {statusLabels[item.status]}</Text>
      {item.assignedTo && <Text style={styles.assigned}>Assigned: {item.assignedTo.name}</Text>}
      <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.search}
          placeholder="Search complaints..."
          value={search}
          onChangeText={setSearch}
        />
        <Button
          title={statusFilter ? statusLabels[statusFilter] : 'All Statuses'}
          onPress={() => setStatusFilter(statusFilter ? '' : 'open')}
          small
          style={styles.filterBtn}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredComplaints}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 8,
  },
  filterBtn: {
    height: 40,
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
    marginBottom: 2,
  },
  assigned: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
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

export default ManageComplaints;