import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { complaintAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
];
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

const ComplaintDetail = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState({ status: '', priority: '', resolution: '' });

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getComplaintById(complaintId);
      setComplaint(data.complaint);
      setEdit({
        status: data.complaint.status,
        priority: data.complaint.priority,
        resolution: data.complaint.resolution || '',
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to load complaint.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const handleChange = (key, value) => {
    setEdit({ ...edit, [key]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await complaintAPI.updateComplaintStatus(complaintId, edit.status, edit.resolution, edit.priority);
      Alert.alert('Success', 'Complaint updated.');
      fetchComplaint();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !complaint) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{complaint.title}</Text>
      <Text style={styles.meta}>{complaint.category} | {complaint.priority} | {new Date(complaint.createdAt).toLocaleString()}</Text>
      <Text style={styles.status}>Status: {complaint.status}</Text>
      <Text style={styles.label}>Submitted By</Text>
      <Text style={styles.desc}>{complaint.userId?.name} ({complaint.userId?.email})</Text>
      <Text style={styles.label}>Description</Text>
      <Text style={styles.desc}>{complaint.description}</Text>
      {complaint.photos && complaint.photos.length > 0 && (
        <View style={styles.photoRow}>
          {complaint.photos.map((url, idx) => (
            <Image key={url + idx} source={{ uri: url }} style={styles.photo} />
          ))}
        </View>
      )}
      <Text style={styles.label}>Priority</Text>
      <View style={styles.pickerRow}>
        {priorityOptions.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pickerBtn, edit.priority === opt.value && styles.pickerBtnActive]}
            onPress={() => handleChange('priority', opt.value)}
          >
            <Text style={edit.priority === opt.value ? styles.pickerTextActive : styles.pickerText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerRow}>
        {statusOptions.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pickerBtn, edit.status === opt.value && styles.pickerBtnActive]}
            onPress={() => handleChange('status', opt.value)}
          >
            <Text style={edit.status === opt.value ? styles.pickerTextActive : styles.pickerText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input label="Resolution (optional)" value={edit.resolution} onChangeText={v => handleChange('resolution', v)} multiline />
      <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={saving} style={styles.btn} />
      <Text style={styles.label}>Timeline</Text>
      <View style={styles.timeline}>
        <Text style={styles.timelineItem}>• Opened: {new Date(complaint.createdAt).toLocaleString()}</Text>
        {complaint.status !== 'open' && (
          <Text style={styles.timelineItem}>• In Progress</Text>
        )}
        {(complaint.status === 'resolved' || complaint.status === 'closed') && (
          <Text style={styles.timelineItem}>• Resolved: {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : ''}</Text>
        )}
        {complaint.status === 'closed' && (
          <Text style={styles.timelineItem}>• Closed</Text>
        )}
      </View>
      {complaint.rating && (
        <Text style={styles.label}>Student Rating: <Text style={styles.starActive}>{'★'.repeat(complaint.rating)}</Text></Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.primary,
    textAlign: 'center',
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: COLORS.primary,
  },
  desc: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  pickerBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  pickerBtnActive: {
    backgroundColor: COLORS.primary,
  },
  pickerText: {
    color: COLORS.primary,
  },
  pickerTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btn: {
    marginTop: 20,
    minWidth: 160,
  },
  timeline: {
    marginTop: 4,
    marginBottom: 8,
  },
  timelineItem: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  starActive: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ComplaintDetail;