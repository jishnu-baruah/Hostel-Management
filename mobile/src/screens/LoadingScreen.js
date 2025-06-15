import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Loading from '../components/common/Loading';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
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
});

export default LoadingScreen;