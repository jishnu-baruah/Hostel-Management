import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../../utils/constants';
import Button from '../../components/common/Button';
import { roomAPI, studentAPI } from '../../services/api';

const RoomDetail = ({ route, navigation }) => {
  const { roomId } = route.params;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [removing, setRemoving] = useState({});

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const { data } = await roomAPI.getRoomDetails(roomId);
      setRoom(data.room);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchRoom(); }, [roomId]);

  const openAssignModal = async () => {
    setAssignModal(true);
    try {
      const { data } = await studentAPI.getAllStudents();
      // Only approved, unassigned students
      setStudents((data.students || []).filter(s => s.isApproved && !s.roomId));
    } catch {}
  };
  const closeAssignModal = () => setAssignModal(false);

  const handleAssign = async (studentId) => {
    setAssigning(true);
    try {
      await roomAPI.assignRoom(studentId, roomId);
      fetchRoom();
      closeAssignModal();
    } catch (err) { Alert.alert('Error', 'Assignment failed'); }
    setAssigning(false);
  };

  const handleRemove = async (studentId) => {
    Alert.alert('Remove Student', 'Remove this student from the room?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        setRemoving(r => ({ ...r, [studentId]: true }));
        try {
          await roomAPI.removeStudentFromRoom(studentId, roomId);
          fetchRoom();
        } catch (err) { Alert.alert('Error', 'Failed to remove student'); }
        setRemoving(r => ({ ...r, [studentId]: false }));
      }}
    ]);
  };

  if (loading || !room) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Room {room.roomNumber}</Text>
      <Text style={styles.info}>Floor: {room.floor}</Text>
      <Text style={styles.info}>Capacity: {room.capacity}</Text>
      <Text style={styles.info}>Occupancy: {room.currentOccupancy}</Text>
      <Text style={styles.info}>Type: {room.roomType}</Text>
      <Text style={styles.info}>Rent: ₹{room.monthlyRent}</Text>
      <Text style={styles.info}>Security: ₹{room.securityDeposit}</Text>
      <Text style={styles.info}>Status: {room.status}</Text>
      <Text style={styles.info}>Amenities: {room.amenities?.join(', ') || 'None'}</Text>
      <Button title="Assign Student" onPress={openAssignModal} style={{ marginVertical: 16 }} />
      <Text style={styles.subHeader}>Occupants:</Text>
      <FlatList
        data={room.occupants}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.occupantCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.occupantName}>{item.name}</Text>
              <Text style={styles.occupantInfo}>Email: {item.email}</Text>
              <Text style={styles.occupantInfo}>Phone: {item.phone}</Text>
              <Text style={styles.occupantInfo}>College: {item.college}</Text>
              <Text style={styles.occupantInfo}>Course: {item.course}</Text>
              <Text style={styles.occupantInfo}>Year: {item.year}</Text>
            </View>
            <Button title="Remove" onPress={() => handleRemove(item._id)} variant="danger" loading={!!removing[item._id]} small style={{ alignSelf: 'center' }} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.occupantInfo}>No occupants.</Text>}
      />
      <Modal visible={assignModal} animationType="slide" onRequestClose={closeAssignModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Assign Student</Text>
          <FlatList
            data={students}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.studentRow} onPress={() => handleAssign(item._id)} disabled={assigning}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.occupantName}>{item.name}</Text>
                  <Text style={styles.occupantInfo}>Email: {item.email}</Text>
                  <Text style={styles.occupantInfo}>Phone: {item.phone}</Text>
                  <Text style={styles.occupantInfo}>College: {item.college}</Text>
                </View>
                {assigning && <ActivityIndicator size="small" color={COLORS.primary} />}
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.occupantInfo}>No eligible students.</Text>}
          />
          <Button title="Close" onPress={closeAssignModal} variant="outline" style={{ marginTop: 16 }} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  subHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  info: { fontSize: 15, color: COLORS.gray, marginBottom: 2 },
  occupantCard: { flexDirection: 'row', backgroundColor: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 10, alignItems: 'center' },
  occupantName: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  occupantInfo: { fontSize: 13, color: COLORS.gray },
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  studentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
});

export default RoomDetail;