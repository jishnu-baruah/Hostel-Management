import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { roomAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const MyRoom = () => {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.roomId) {
      fetchRoom(user.roomId);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRoom = async (roomId) => {
    setLoading(true);
    setError('');
    try {
      const res = await roomAPI.getRoomDetails(roomId);
      setRoom(res.data.room);
    } catch (err) {
      setError('Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (user?.roomId) {
      setRefreshing(true);
      await fetchRoom(user.roomId);
      setRefreshing(false);
    }
  };

  if (loading) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  if (!user?.roomId) {
    return <View style={styles.container}><Text style={styles.info}>You are not assigned to any room yet.</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <FlatList
      data={room.occupants?.filter(o => o._id !== user._id) || []}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <View style={styles.roommateCard}>
          <Text style={styles.roommateName}>{item.name}</Text>
          <Text style={styles.roommateDetail}>{item.email} | {item.phone}</Text>
          <Text style={styles.roommateDetail}>{item.college} | {item.course} | Year {item.year}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.info}>No roommates assigned yet.</Text>}
      ListHeaderComponent={
        <View>
          <Text style={styles.label}>Room Number: <Text style={styles.value}>{room.roomNumber}</Text></Text>
          <Text style={styles.label}>Status: <Text style={styles.value}>{room.status}</Text></Text>
          <Text style={styles.label}>Floor: <Text style={styles.value}>{room.floor}</Text></Text>
          <Text style={styles.label}>Capacity: <Text style={styles.value}>{room.capacity}</Text></Text>
          <Text style={styles.label}>Type: <Text style={styles.value}>{room.roomType}</Text></Text>
          <Text style={styles.label}>Monthly Rent: <Text style={styles.value}>₹{room.monthlyRent}</Text></Text>
          <Text style={styles.label}>Security Deposit: <Text style={styles.value}>₹{room.securityDeposit}</Text></Text>
          <Text style={styles.label}>Amenities: <Text style={styles.value}>{room.amenities?.join(', ') || 'None'}</Text></Text>
          <Text style={styles.label}>Description: <Text style={styles.value}>{room.description || '-'}</Text></Text>
          <Text style={styles.sectionHeader}>Roommates:</Text>
        </View>
      }
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    color: COLORS.gray,
  },
  value: {
    fontWeight: 'normal',
    color: '#222',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: COLORS.primary,
  },
  roommateCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  roommateName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  roommateDetail: {
    fontSize: 13,
    color: COLORS.gray,
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

export default MyRoom;