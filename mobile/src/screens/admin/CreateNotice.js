import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { noticeAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import { Picker } from '@react-native-picker/picker';

const priorities = ['low', 'medium', 'high', 'urgent'];
const categories = ['general', 'maintenance', 'events'];

const CreateNotice = ({ navigation }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'medium',
    category: 'general',
    scheduledFor: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      Alert.alert('Validation', 'Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        scheduledFor: form.scheduledFor ? new Date(form.scheduledFor) : undefined,
      };
      await noticeAPI.createNotice(payload);
      Alert.alert('Success', 'Notice created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create notice');
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
        <Text style={styles.header}>Create Notice</Text>
        <Input label="Title" value={form.title} onChangeText={v => handleChange('title', v)} required />
        <Input label="Content" value={form.content} onChangeText={v => handleChange('content', v)} multiline required />
        <Text style={styles.label}>Priority</Text>
        <Picker
          selectedValue={form.priority}
          onValueChange={v => handleChange('priority', v)}
          style={{ marginBottom: 12 }}
        >
          <Picker.Item label="Select Priority" value="" />
          {priorities.map(p => (
            <Picker.Item key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} value={p} />
          ))}
        </Picker>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={form.category}
          onValueChange={v => handleChange('category', v)}
          style={{ marginBottom: 12 }}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map(c => (
            <Picker.Item key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} value={c} />
          ))}
        </Picker>
        <Input label="Schedule For (optional)" value={form.scheduledFor} onChangeText={v => handleChange('scheduledFor', v)} placeholder="YYYY-MM-DDTHH:mm" />
        <Button title={loading ? 'Creating...' : 'Create Notice'} onPress={handleSubmit} disabled={loading} style={styles.btn} />
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default CreateNotice;