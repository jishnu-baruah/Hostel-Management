import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const NoticeDetail = ({ route }) => {
  const { notice } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{notice.title}</Text>
      <Text style={styles.meta}>{notice.category} | {notice.priority} | {new Date(notice.createdAt).toLocaleString()}</Text>
      <Text style={styles.content}>{notice.content}</Text>
      <Text style={styles.footer}>By: {notice.createdBy?.name || 'Admin'}</Text>
      {notice.isRead && <Text style={styles.readStatus}>Read</Text>}
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
    marginBottom: 8,
    textAlign: 'center',
  },
  meta: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    color: '#222',
    marginBottom: 20,
  },
  footer: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 20,
    textAlign: 'right',
  },
  readStatus: {
    color: COLORS.success,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default NoticeDetail;