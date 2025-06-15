import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING, VALIDATION } from '../../utils/constants';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(VALIDATION.EMAIL_REGEX, 'Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .required('Password is required'),
});

const LoginScreen = ({ navigation, route }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const userType = route.params?.userType || 'student';
  const isAdmin = userType === 'admin';

  React.useEffect(() => {
    clearError();
  }, []);

  const handleLogin = async (values) => {
    try {
      const result = await login(values, isAdmin);
      
      if (result.success) {
        // Navigation will be handled by AppNavigator based on auth state
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isAdmin ? 'Admin Login' : 'Student Login'}
          </Text>
          <Text style={styles.subtitle}>
            {isAdmin 
              ? 'Access your admin dashboard' 
              : 'Welcome back! Please sign in to continue'
            }
          </Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail-outline"
                required
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password}
                secureTextEntry={!showPassword}
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                required
              />

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Button
                title={isAdmin ? 'Login as Admin' : 'Login'}
                onPress={handleSubmit}
                loading={isLoading}
                fullWidth
                size="large"
                icon={isAdmin ? 'shield' : 'log-in'}
                style={styles.loginButton}
              />

              {!isAdmin && (
                <Button
                  title="Forgot Password?"
                  onPress={handleForgotPassword}
                  variant="ghost"
                  size="medium"
                  style={styles.forgotButton}
                />
              )}
            </View>
          )}
        </Formik>

        {!isAdmin && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Button
              title="Register Here"
              onPress={handleRegister}
              variant="ghost"
              size="medium"
              icon="person-add-outline"
            />
          </View>
        )}

        {isAdmin && (
          <View style={styles.adminNote}>
            <Text style={styles.adminNoteText}>
              Admin access is restricted to authorized personnel only.
            </Text>
          </View>
        )}
      </ScrollView>

      <Loading visible={isLoading} overlay />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  
  title: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  form: {
    marginBottom: SPACING.xl,
  },
  
  errorContainer: {
    backgroundColor: COLORS.error + '10',
    borderColor: COLORS.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.small,
    textAlign: 'center',
  },
  
  loginButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  
  forgotButton: {
    alignSelf: 'center',
  },
  
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  
  footerText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  
  adminNote: {
    backgroundColor: COLORS.warning + '20',
    borderColor: COLORS.warning,
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  
  adminNoteText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.warning,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoginScreen;