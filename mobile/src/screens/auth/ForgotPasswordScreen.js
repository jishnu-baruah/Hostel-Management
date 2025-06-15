import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const ForgotPasswordScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
      <Text style={styles.description}>
        Password reset functionality is currently under development.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
});

export default ForgotPasswordScreen;