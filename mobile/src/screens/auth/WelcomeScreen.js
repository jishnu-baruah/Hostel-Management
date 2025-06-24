import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
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
    <ImageBackground 
      source={require('../../../assets/bg.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
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
                variant="secondary"
                size="large"
                fullWidth
                icon="shield"
                style={styles.button}
              />
              
              <Button
                title="New Student? Register Here"
                onPress={handleRegister}
                variant="primary"
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
    color: COLORS.white, // Changed to white for better contrast on dark background
    marginBottom: SPACING.sm,
  },
  
  tagline: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white, // Changed to white for better contrast on dark background
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
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
    color: COLORS.white, // Changed to white for better contrast on dark background
    textAlign: 'center',
  },
});

export default WelcomeScreen;