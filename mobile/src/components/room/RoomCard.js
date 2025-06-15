import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Button from '../common/Button';
import { COLORS } from '../../utils/constants';

const RoomCard = ({ room, onEdit, onView, onAssign }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.roomNumber}>Room {room.roomNumber}</Text>
        <Text style={[styles.status, styles[room.status]]}>{room.status.toUpperCase()}</Text>
      </View>
      <Text style={styles.detail}>Floor: {room.floor}</Text>
      <Text style={styles.detail}>Capacity: {room.capacity}</Text>
      <Text style={styles.detail}>Occupancy: {room.currentOccupancy}</Text>
      <Text style={styles.detail}>Type: {room.roomType}</Text>
      <Text style={styles.detail}>Rent: ₹{room.monthlyRent}</Text>
      <Text style={styles.detail}>Security: ₹{room.securityDeposit}</Text>
      <Text style={styles.detail}>Amenities: {room.amenities?.join(', ') || 'None'}</Text>
      <View style={styles.actions}>
        <Button title="View" onPress={() => onView(room)} small />
        <Button title="Edit" onPress={() => onEdit(room)} small style={styles.actionBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  available: { backgroundColor: '#e0f7e9', color: '#1abc9c' },
  occupied: { backgroundColor: '#ffe0e0', color: '#e74c3c' },
  maintenance: { backgroundColor: '#fffbe0', color: '#f1c40f' },
  blocked: { backgroundColor: '#e0e0e0', color: '#888' },
  detail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    marginLeft: 8,
  },
});

export default RoomCard; 