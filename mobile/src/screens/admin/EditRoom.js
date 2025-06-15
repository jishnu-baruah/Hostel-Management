import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { roomAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import { Picker } from '@react-native-picker/picker';

const EditRoom = ({ navigation, route }) => {
  const { roomId } = route.params;
  const [form, setForm] = useState({
    roomNumber: '',
    floor: '',
    capacity: '',
    monthlyRent: '',
    securityDeposit: '',
    roomType: '',
    amenities: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      setFetching(true);
      try {
        const res = await roomAPI.getRoomDetails(roomId);
        const room = res.data.room;
        setForm({
          roomNumber: room.roomNumber || '',
          floor: String(room.floor || ''),
          capacity: String(room.capacity || ''),
          monthlyRent: String(room.monthlyRent || ''),
          securityDeposit: String(room.securityDeposit || ''),
          roomType: room.roomType || '',
          amenities: (room.amenities || []).join(', '),
          description: room.description || '',
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to load room details');
        navigation.goBack();
      } finally {
        setFetching(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.roomNumber || !form.floor || !form.capacity || !form.monthlyRent || !form.securityDeposit || !form.roomType) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        floor: parseInt(form.floor, 10),
        capacity: parseInt(form.capacity, 10),
        monthlyRent: parseFloat(form.monthlyRent),
        securityDeposit: parseFloat(form.securityDeposit),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
      };
      await roomAPI.updateRoom(roomId, payload);
      Alert.alert('Success', 'Room updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loading}><Text>Loading...</Text></View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Edit Room</Text>
        <Input label="Room Number" value={form.roomNumber} onChangeText={v => handleChange('roomNumber', v)} required />
        <Input label="Floor" value={form.floor} onChangeText={v => handleChange('floor', v)} keyboardType="numeric" required />
        <Input label="Capacity" value={form.capacity} onChangeText={v => handleChange('capacity', v)} keyboardType="numeric" required />
        <Input label="Monthly Rent" value={form.monthlyRent} onChangeText={v => handleChange('monthlyRent', v)} keyboardType="numeric" required />
        <Input label="Security Deposit" value={form.securityDeposit} onChangeText={v => handleChange('securityDeposit', v)} keyboardType="numeric" required />
        <Text style={styles.label}>Room Type</Text>
        <Picker
          selectedValue={form.roomType}
          onValueChange={v => handleChange('roomType', v)}
          style={{ marginBottom: 12 }}
        >
          <Picker.Item label="Select Room Type" value="" />
          {['single', 'double', 'triple', 'quad', 'dormitory'].map(type => (
            <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
          ))}
        </Picker>
        <Input label="Amenities" value={form.amenities} onChangeText={v => handleChange('amenities', v)} placeholder="Comma separated (AC, WiFi, etc.)" />
        <Input label="Description" value={form.description} onChangeText={v => handleChange('description', v)} multiline />
        <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={handleSubmit} disabled={loading} style={styles.btn} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  btn: {
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default EditRoom;