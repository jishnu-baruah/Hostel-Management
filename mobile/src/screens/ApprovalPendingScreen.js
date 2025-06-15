import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

const ApprovalPendingScreen = () => {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Check approval status
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="hourglass-outline"
          size={80}
          color={COLORS.warning}
        />
      </View>

      <Text style={styles.title}>Approval Pending</Text>
      
      <Text style={styles.message}>
        Hi {user?.name}, your registration has been submitted successfully!
      </Text>
      
      <Text style={styles.description}>
        Your account is currently under review by the hostel administration. 
        You will receive a notification once your account has been approved 
        and you can start using the app.
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoText}>Name: {user?.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoText}>Email: {user?.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoText}>Phone: {user?.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoText}>College: {user?.college}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <Text style={styles.statusText}>Registration Submitted</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Ionicons name="time-outline" size={24} color={COLORS.warning} />
          <Text style={styles.statusText}>Pending Admin Review</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Ionicons name="ellipse-outline" size={24} color={COLORS.lightGray} />
          <Text style={[styles.statusText, { color: COLORS.gray }]}>Account Activation</Text>
        </View>
      </View>

      <Text style={styles.helpText}>
        Pull down to refresh and check your approval status
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Refresh Status"
          onPress={onRefresh}
          variant="outline"
          icon="refresh"
          loading={refreshing}
          style={styles.refreshButton}
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="ghost"
          icon="log-out-outline"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  content: {
    flexGrow: 1,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  
  title: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  message: {
    fontSize: FONT_SIZES.large,
    color: COLORS.black,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  infoText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.black,
    marginLeft: SPACING.md,
    flex: 1,
  },
  
  statusContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  statusText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.black,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  
  helpText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontStyle: 'italic',
  },
  
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  
  refreshButton: {
    marginBottom: SPACING.md,
  },
  
  logoutButton: {
    marginTop: SPACING.md,
  },
});

export default ApprovalPendingScreen;