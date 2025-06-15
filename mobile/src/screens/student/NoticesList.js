import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { noticeAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const NoticesList = ({ navigation }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await noticeAPI.getAllNotices();
      setNotices(data.notices || []);
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const renderNotice = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={async () => {
        await noticeAPI.markAsRead(item._id);
        const updatedNotices = notices.map(notice =>
          notice._id === item._id ? { ...notice, isRead: true } : notice
        );
        setNotices(updatedNotices);
        navigation.navigate('NoticeDetail', { notice: item });
      }}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.category} | {item.priority} | {new Date(item.createdAt).toLocaleString()}</Text>
      {!item.isRead && <Text style={styles.unread}>Unread</Text>}
      <Text numberOfLines={2} style={styles.content}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notices}
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
    textAlign: 'center',
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
  unread: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  content: {
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

export default NoticesList; 