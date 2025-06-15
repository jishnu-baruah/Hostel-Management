import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateUser({ name: form.name, phone: form.phone });
    setLoading(false);
    if (res.success) {
      Alert.alert('Profile updated!');
    } else {
      Alert.alert('Error', res.message || 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        <Image
          source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name) }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{form.name}</Text>
        <Text style={styles.email}>{form.email}</Text>
      </View>
      <View style={styles.formBox}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={v => handleChange('name', v)}
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={v => handleChange('phone', v)}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: COLORS.lightGray }]}
          value={form.email}
          editable={false}
        />
        <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={loading} style={styles.saveBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.lightGray,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 8,
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  saveBtn: {
    marginTop: 20,
  },
});

export default AdminProfile;