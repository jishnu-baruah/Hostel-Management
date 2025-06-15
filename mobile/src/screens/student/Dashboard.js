import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { dashboardData, loading, refetchDashboardData } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    await refetchDashboardData?.();
    setRefreshing(false);
  };

  // Example fallback data structure
  const room = dashboardData?.room;
  const complaints = dashboardData?.complaints || [];
  const notices = dashboardData?.notices || [];
  const payments = dashboardData?.payments || [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchDashboardData} />
      }
    >
      <View style={styles.cardsRow}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MyRoom')}> 
          <Ionicons name="bed-outline" size={32} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Room</Text>
          <Text style={styles.cardValue}>{room ? room.roomNumber : 'Not Assigned'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Complaints')}> 
          <Ionicons name="chatbubbles-outline" size={32} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Complaints</Text>
          <Text style={styles.cardValue}>{Array.isArray(complaints) ? complaints.length : complaints}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsRow}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Notices')}> 
          <Ionicons name="notifications-outline" size={32} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Notices</Text>
          <Text style={styles.cardValue}>{Array.isArray(notices) ? notices.length : notices}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Payments')}> 
          <Ionicons name="card-outline" size={32} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Payments</Text>
          <Text style={styles.cardValue}>{Array.isArray(payments) ? payments.length : payments}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  
  welcome: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    opacity: 0.8,
  },
  
  name: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  title: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
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

export default Dashboard;