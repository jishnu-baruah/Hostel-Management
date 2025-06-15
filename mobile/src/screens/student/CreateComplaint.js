import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import * as ImagePicker from 'expo-image-picker';
import { complaintAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import { Picker } from '@react-native-picker/picker';

const categories = [
  { label: 'Electrical', value: 'electrical' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Cleanliness', value: 'cleanliness' },
  { label: 'Security', value: 'security' },
  { label: 'Other', value: 'other' },
];
const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

const CreateComplaint = ({ navigation }) => {
  const [form, setForm] = useState({
    category: 'electrical',
    title: '',
    description: '',
    priority: 'medium',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    if (photos.length >= 5) {
      Alert.alert('Limit', 'You can upload up to 5 photos.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      Alert.alert('Validation', 'Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('category', form.category);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('priority', form.priority);
      photos.forEach((uri, idx) => {
        formData.append('photos', {
          uri,
          name: `photo_${idx}.jpg`,
          type: 'image/jpeg',
        });
      });
      await complaintAPI.createComplaint(formData);
      Alert.alert('Success', 'Complaint submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>New Complaint</Text>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={form.category}
          onValueChange={v => handleChange('category', v)}
          style={{ marginBottom: 12 }}
        >
          {categories.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
        <Input label="Title" value={form.title} onChangeText={v => handleChange('title', v)} required />
        <Input label="Description" value={form.description} onChangeText={v => handleChange('description', v)} multiline required />
        <Text style={styles.label}>Priority</Text>
        <Picker
          selectedValue={form.priority}
          onValueChange={v => handleChange('priority', v)}
          style={{ marginBottom: 12 }}
        >
          {priorities.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
        <Text style={styles.label}>Photos (optional, up to 5)</Text>
        <View style={styles.photoRow}>
          {photos.map((uri, idx) => (
            <View key={uri} style={styles.photoBox}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removePhoto(idx)}>
                <Text style={styles.removeBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 5 && (
            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
              <Text style={styles.addPhotoText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        <Button title={loading ? 'Submitting...' : 'Submit Complaint'} onPress={handleSubmit} disabled={loading} style={styles.btn} />
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
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: COLORS.primary,
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
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  photoBox: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPhotoBtn: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  addPhotoText: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  btn: {
    marginTop: 20,
  },
});

export default CreateComplaint;