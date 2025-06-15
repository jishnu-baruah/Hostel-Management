import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../utils/constants';
import Button from '../../components/common/Button';
import { studentAPI } from '../../services/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await studentAPI.getAllStudents();
      setStudents(data.students || []);
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (text) => setSearch(text);
  const handleFilter = () => {
    setFilter(filter === 'all' ? 'pending' : filter === 'pending' ? 'approved' : 'all');
  };
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, []);

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
  };

  const handleApprove = async (studentId) => {
    setActionLoading(l => ({ ...l, [studentId]: true }));
    try {
      await studentAPI.approveStudent(studentId);
      fetchStudents();
      closeModal();
    } catch (err) {}
    setActionLoading(l => ({ ...l, [studentId]: false }));
  };
  const handleReject = async (studentId) => {
    setActionLoading(l => ({ ...l, [studentId]: true }));
    try {
      await studentAPI.rejectStudent(studentId, 'Rejected by admin');
      fetchStudents();
      closeModal();
    } catch (err) {}
    setActionLoading(l => ({ ...l, [studentId]: false }));
  };
  const handleRemove = async (studentId) => {
    Alert.alert(
      'Remove Student',
      'Are you sure you want to permanently remove this student? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive', onPress: async () => {
            setRemoveLoading(true);
            try {
              await studentAPI.deleteStudent(studentId);
              fetchStudents();
              closeModal();
            } catch (err) {}
            setRemoveLoading(false);
          }
        }
      ]
    );
  };

  const filteredStudents = students.filter(s =>
    (filter === 'all' || (filter === 'pending' ? !s.isApproved : s.isApproved)) &&
    (s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.infoCol}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentStatus}>{item.isApproved ? 'approved' : 'pending'}</Text>
        <Text style={styles.studentInfo} numberOfLines={1} ellipsizeMode="tail">Email: {item.email}</Text>
        <Text style={styles.studentInfo} numberOfLines={1} ellipsizeMode="tail">Phone: {item.phone}</Text>
        <Text style={styles.studentInfo} numberOfLines={1} ellipsizeMode="tail">College: {item.college}</Text>
      </View>
      <Button title="View" onPress={() => openModal(item)} small style={styles.viewBtn} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.search}
          placeholder="Search students..."
          value={search}
          onChangeText={handleSearch}
        />
        <Button
          title={filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Approved'}
          onPress={handleFilter}
          small
          style={styles.filterBtn}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item._id}
          renderItem={renderStudent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={<Text style={styles.text}>No students found.</Text>}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Student Details</Text>
              {selectedStudent && (
                <>
                  <Text style={styles.studentName}>{selectedStudent.name}</Text>
                  <Text style={styles.studentStatus}>{selectedStudent.isApproved ? 'approved' : 'pending'}</Text>
                  <Text style={styles.studentInfo}>Email: {selectedStudent.email}</Text>
                  <Text style={styles.studentInfo}>Phone: {selectedStudent.phone}</Text>
                  <Text style={styles.studentInfo}>College: {selectedStudent.college}</Text>
                  <Text style={styles.studentInfo}>Course: {selectedStudent.course}</Text>
                  <Text style={styles.studentInfo}>Year: {selectedStudent.year}</Text>
                  <Text style={styles.studentInfo}>Registration Date: {selectedStudent.registrationDate ? new Date(selectedStudent.registrationDate).toLocaleDateString() : '-'}</Text>
                  <Text style={styles.studentInfo}>Status: {selectedStudent.isApproved ? 'Approved' : 'Pending'}</Text>
                  {!selectedStudent.isApproved && (
                    <View style={{ marginTop: 16 }}>
                      <Button title="Approve" onPress={() => handleApprove(selectedStudent._id)} loading={!!actionLoading[selectedStudent._id]} style={{ marginBottom: 8 }} />
                      <Button title="Reject" onPress={() => handleReject(selectedStudent._id)} variant="danger" loading={!!actionLoading[selectedStudent._id]} style={{ marginBottom: 8 }} />
                      <Button title="Remove" onPress={() => handleRemove(selectedStudent._id)} variant="danger" loading={removeLoading} />
                    </View>
                  )}
                  {selectedStudent.isApproved && (
                    <View style={{ marginTop: 16 }}>
                      <Button title="Remove" onPress={() => handleRemove(selectedStudent._id)} variant="danger" loading={removeLoading} />
                    </View>
                  )}
                </>
              )}
              <Button title="Close" onPress={closeModal} variant="outline" style={{ marginTop: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  search: {
    flex: 1,
    height: 40,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 8,
  },
  filterBtn: {
    height: 40,
    backgroundColor: COLORS.info,
    marginLeft: 8,
  },
  studentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  studentStatus: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  studentInfo: {
    fontSize: 13,
    color: COLORS.gray,
  },
  text: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewBtn: {
    alignSelf: 'center',
    flexShrink: 0,
  },
});

export default ManageStudents;