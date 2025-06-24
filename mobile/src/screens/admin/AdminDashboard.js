import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ImageBackground } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';

const AdminDashboard = ({ navigation }) => {
  const { dashboardData, loadDashboardData, loading } = useApp();

  // Example fallback data structure
  const students = dashboardData?.students || 0;
  const rooms = dashboardData?.rooms || 0;
  const complaints = dashboardData?.complaints || 0;
  const notices = dashboardData?.notices || 0;
  const payments = dashboardData?.payments || 0;

  return (
    <ImageBackground 
      source={require('../../../assets/bg.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={!!loading?.dashboard}
              onRefresh={loadDashboardData}
            />
          }
        >
          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Students')}> 
              <Ionicons name="people-outline" size={32} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Students</Text>
              <Text style={styles.cardValue}>{students}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Rooms')}> 
              <Ionicons name="business-outline" size={32} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Rooms</Text>
              <Text style={styles.cardValue}>{rooms}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Complaints')}> 
              <Ionicons name="chatbubbles-outline" size={32} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Complaints</Text>
              <Text style={styles.cardValue}>{complaints}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Notices')}> 
              <Ionicons name="megaphone-outline" size={32} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Notices</Text>
              <Text style={styles.cardValue}>{notices}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Payments')}> 
              <Ionicons name="card-outline" size={32} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Payments</Text>
              <Text style={styles.cardValue}>{payments}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay for better text readability
  },
  
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  refreshBtn: {
    height: 36,
    backgroundColor: COLORS.info,
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default AdminDashboard;