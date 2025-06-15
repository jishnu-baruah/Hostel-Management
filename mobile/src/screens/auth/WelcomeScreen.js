import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Button from '../../components/common/Button';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const WelcomeScreen = ({ navigation }) => {
  const handleStudentLogin = () => {
    navigation.navigate('Login', { userType: 'student' });
  };

  const handleAdminLogin = () => {
    navigation.navigate('Login', { userType: 'admin' });
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>HM</Text>
          </View>
          <Text style={styles.appName}>Hostel Manager</Text>
          <Text style={styles.tagline}>Simplifying Hostel Management</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏠</Text>
            <Text style={styles.featureText}>Room Management</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💳</Text>
            <Text style={styles.featureText}>Easy Payments</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📢</Text>
            <Text style={styles.featureText}>Instant Notifications</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🛠️</Text>
            <Text style={styles.featureText}>Quick Complaints</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <Button
            title="Student Login"
            onPress={handleStudentLogin}
            variant="primary"
            size="large"
            fullWidth
            icon="person"
            style={styles.button}
          />
          
          <Button
            title="Admin Login"
            onPress={handleAdminLogin}
            variant="outline"
            size="large"
            fullWidth
            icon="shield"
            style={styles.button}
          />
          
          <Button
            title="New Student? Register Here"
            onPress={handleRegister}
            variant="ghost"
            size="medium"
            fullWidth
            icon="person-add"
            style={styles.registerButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure • Reliable • Easy to Use
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
  },
  
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  appName: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  
  tagline: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: SPACING.xl,
  },
  
  feature: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  
  featureIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  
  featureText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.black,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  
  button: {
    marginBottom: SPACING.md,
  },
  
  registerButton: {
    marginTop: SPACING.md,
  },
  
  footer: {
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  
  footerText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default WelcomeScreen;