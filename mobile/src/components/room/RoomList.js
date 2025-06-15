import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RoomCard from './RoomCard';
import Loading from '../common/Loading';
import Input from '../common/Input';
import { roomAPI } from '../../services/api';
import { COLORS, ROOM_STATUS } from '../../utils/constants';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Available', value: ROOM_STATUS.AVAILABLE },
  { label: 'Occupied', value: ROOM_STATUS.OCCUPIED },
  { label: 'Maintenance', value: ROOM_STATUS.MAINTENANCE },
  { label: 'Blocked', value: 'blocked' },
];

const RoomList = ({ onEdit, onView, onAssign }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [floor, setFloor] = useState('');
  const [type, setType] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (floor) params.floor = floor;
      if (type) params.roomType = type;
      const res = await roomAPI.getAllRooms(params);
      setRooms(res.data.rooms || []);
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [search, status, floor, type]);

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Input
          placeholder="Search by room number"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={setStatus}
          >
            {statusOptions.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
          <Text style={styles.label}>Floor:</Text>
          <TextInput
            style={styles.floorInput}
            value={floor}
            onChangeText={setFloor}
            placeholder="Any"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Type:</Text>
          <TextInput
            style={styles.typeInput}
            value={type}
            onChangeText={setType}
            placeholder="Any"
          />
        </View>
      </View>
      {loading ? (
        <Loading />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              onEdit={onEdit}
              onView={onView}
              onAssign={onAssign}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshing={loading}
          onRefresh={fetchRooms}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 8,
  },
  filters: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    marginRight: 4,
    color: COLORS.gray,
  },
  picker: {
    height: 32,
    width: 120,
    marginRight: 8,
  },
  floorInput: {
    width: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: 8,
    fontSize: 14,
    padding: 2,
  },
  typeInput: {
    width: 80,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    fontSize: 14,
    padding: 2,
  },
  input: {
    marginBottom: 4,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RoomList; 