import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { noticeAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

const ManageNotices = ({ navigation }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await noticeAPI.getAllNotices();
      setNotices(data.notices || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (noticeId) => {
    Alert.alert('Delete Notice', 'Are you sure you want to delete this notice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await noticeAPI.deleteNotice(noticeId);
            setNotices(notices.filter(n => n._id !== noticeId));
          } catch (err) {
            Alert.alert('Error', 'Failed to delete notice');
          }
        }
      }
    ]);
  };

  const filteredNotices = (Array.isArray(notices) ? notices : []).filter(n =>
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())) &&
    (filter ? n.category === filter : true)
  );

  const renderNotice = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditNotice', { noticeId: item._id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.category} | {item.priority} | {new Date(item.createdAt).toLocaleString()}</Text>
      <Text numberOfLines={2} style={styles.content}>{item.content}</Text>
      <View style={styles.actions}>
        <Button title="Edit" onPress={() => navigation.navigate('EditNotice', { noticeId: item._id })} small />
        <Button title="Delete" onPress={() => handleDelete(item._id)} small style={styles.deleteBtn} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.search}
          placeholder="Search notices..."
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Create" onPress={() => navigation.navigate('CreateNotice')} small style={styles.createBtn} />
      </View>
      {/* Optionally add filter dropdown for category */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredNotices}
          keyExtractor={item => item._id}
          renderItem={renderNotice}
          refreshing={refreshing}
          onRefresh={fetchNotices}
          ListEmptyComponent={<Text style={styles.empty}>No notices found.</Text>}
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
  createBtn: {
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    marginLeft: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});

export default ManageNotices; 