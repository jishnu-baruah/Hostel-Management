import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { complaintAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const ComplaintDetail = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getComplaintById(complaintId);
      setComplaint(data.complaint);
      setRating(data.complaint.rating || 0);
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

  const handleRate = async () => {
    if (!rating || rating < 1 || rating > 5) {
      Alert.alert('Validation', 'Please select a rating (1-5 stars).');
      return;
    }
    setSubmitting(true);
    try {
      await complaintAPI.rateComplaint(complaintId, rating);
      Alert.alert('Thank you!', 'Your rating has been submitted.');
      fetchComplaint();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !complaint) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const canRate =
    (complaint.status === 'resolved' || complaint.status === 'closed') &&
    !complaint.rating;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{complaint.title}</Text>
      <Text style={styles.meta}>{complaint.category} | {complaint.priority} | {new Date(complaint.createdAt).toLocaleString()}</Text>
      <Text style={styles.status}>Status: {statusLabels[complaint.status]}</Text>
      <Text style={styles.label}>Description</Text>
      <Text style={styles.desc}>{complaint.description}</Text>
      {complaint.photos && complaint.photos.length > 0 && (
        <View style={styles.photoRow}>
          {complaint.photos.map((url, idx) => (
            <Image key={url + idx} source={{ uri: url }} style={styles.photo} />
          ))}
        </View>
      )}
      {complaint.resolution && (
        <>
          <Text style={styles.label}>Resolution</Text>
          <Text style={styles.desc}>{complaint.resolution}</Text>
        </>
      )}
      {complaint.assignedTo && (
        <Text style={styles.label}>Assigned To: {complaint.assignedTo.name}</Text>
      )}
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
      {canRate && (
        <View style={styles.ratingBox}>
          <Text style={styles.label}>Rate Resolution</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={star <= rating ? styles.starActive : styles.star}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title={submitting ? 'Submitting...' : 'Submit Rating'} onPress={handleRate} disabled={submitting} style={styles.btn} />
        </View>
      )}
      {complaint.rating && (
        <Text style={styles.label}>Your Rating: <Text style={styles.starActive}>{'★'.repeat(complaint.rating)}</Text></Text>
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
  timeline: {
    marginTop: 4,
    marginBottom: 8,
  },
  timelineItem: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  ratingBox: {
    marginTop: 16,
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 32,
    color: '#ccc',
    marginHorizontal: 2,
  },
  starActive: {
    fontSize: 32,
    color: '#FFD700',
    marginHorizontal: 2,
    fontWeight: 'bold',
  },
  btn: {
    marginTop: 8,
    minWidth: 160,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ComplaintDetail;