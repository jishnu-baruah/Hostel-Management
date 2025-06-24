import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import Loading from '../components/common/Loading';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

const LoadingScreen = () => {
  return (
    <ImageBackground 
      source={require('../../assets/bg.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.centeredContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>HM</Text>
              </View>
              <Text style={styles.appName}>Hostel Manager</Text>
              <Text style={styles.tagline}>Simplifying Hostel Management</Text>
            </View>
            
            <Loading
              visible={true}
              text="Loading..."
              style={styles.loading}
              textStyle={styles.loadingText}
            />
          </View>
        </View>
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
  
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  appName: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  
  tagline: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  
  loading: {
    backgroundColor: 'transparent',
  },
  
  loadingText: {
    color: COLORS.white,
  },
});

export default LoadingScreen;