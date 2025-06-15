import React from 'react';
import { View, StyleSheet } from 'react-native';
import RoomList from '../../components/room/RoomList';
import Button from '../../components/common/Button';

const ManageRooms = ({ navigation }) => {
  const handleView = (room) => {
    navigation.navigate('RoomDetail', { roomId: room._id });
  };
  const handleEdit = (room) => {
    navigation.navigate('EditRoom', { roomId: room._id });
  };
  const handleAssign = (room) => {
    navigation.navigate('RoomDetail', { roomId: room._id, assignMode: true });
  };
  const handleCreate = () => {
    navigation.navigate('CreateRoom');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Button title="+ Add Room" onPress={handleCreate} style={styles.addBtn} />
      </View>
      <RoomList onView={handleView} onEdit={handleEdit} onAssign={handleAssign} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default ManageRooms;