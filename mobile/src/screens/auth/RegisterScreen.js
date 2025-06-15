import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONT_SIZES, SPACING, VALIDATION } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FORM_STORAGE_KEY = 'studentRegistrationForm';

const RegisterScreen = ({ navigation }) => {
  const { register, adminRegister } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState('student'); // 'student' or 'admin'
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    year: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    adminCode: '', // For admin registration
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Document uploads
  const [documents, setDocuments] = useState({
    idProof: null,
    collegeId: null,
  });

  // Input refs for navigation
  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    college: useRef(null),
    course: useRef(null),
    year: useRef(null),
    emergencyName: useRef(null),
    emergencyPhone: useRef(null),
    emergencyRelation: useRef(null),
    street: useRef(null),
    city: useRef(null),
    state: useRef(null),
    pincode: useRef(null),
    adminCode: useRef(null),
  };

  // Load form state from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch {}
      }
    })();
  }, []);

  // Save form state to AsyncStorage on every change
  useEffect(() => {
    AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        } else if (!VALIDATION.NAME_REGEX.test(formData.name)) {
          newErrors.name = 'Name can only contain letters and spaces';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!VALIDATION.EMAIL_REGEX.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!VALIDATION.PHONE_REGEX.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (registrationType === 'student') {
          if (formData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
            newErrors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
          } else if (!VALIDATION.STUDENT_PASSWORD_REGEX.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
          }
        } else if (registrationType === 'admin') {
          if (formData.password.length < VALIDATION.ADMIN_PASSWORD_MIN_LENGTH) {
            newErrors.password = `Admin password must be at least ${VALIDATION.ADMIN_PASSWORD_MIN_LENGTH} characters`;
          } else if (!VALIDATION.ADMIN_PASSWORD_REGEX.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
          }
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 2: // Academic Information (Student only)
        if (registrationType === 'student') {
          if (!formData.college.trim()) {
            newErrors.college = 'College name is required';
          }
          if (!formData.course.trim()) {
            newErrors.course = 'Course is required';
          }
          if (!formData.year.trim()) {
            newErrors.year = 'Year is required';
          }
        }
        break;

      case 3: // Emergency Contact (Student only) - Optional
        if (registrationType === 'student') {
          // Only validate if any emergency contact field is filled
          if (formData.emergencyContact.name.trim() || formData.emergencyContact.phone.trim() || formData.emergencyContact.relation.trim()) {
            if (formData.emergencyContact.phone.trim() && !VALIDATION.PHONE_REGEX.test(formData.emergencyContact.phone)) {
              newErrors['emergencyContact.phone'] = 'Please enter a valid phone number';
            }
          }
        }
        break;

      case 4: // Address (Student only)
        if (registrationType === 'student') {
          if (!formData.address.street.trim()) {
            newErrors['address.street'] = 'Street address is required';
          }
          if (!formData.address.city.trim()) {
            newErrors['address.city'] = 'City is required';
          }
          if (!formData.address.state.trim()) {
            newErrors['address.state'] = 'State is required';
          }
          if (!formData.address.pincode.trim()) {
            newErrors['address.pincode'] = 'Pincode is required';
          } else if (!/^\d{6}$/.test(formData.address.pincode)) {
            newErrors['address.pincode'] = 'Please enter a valid 6-digit pincode';
          }
        }
        break;

      case 'admin': // Admin Code Validation
        if (!formData.adminCode.trim()) {
          newErrors.adminCode = 'Admin code is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (registrationType === 'admin' && currentStep === 1) {
        setCurrentStep('admin');
      } else if (registrationType === 'student') {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'admin') {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const pickDocument = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        if (file.size > VALIDATION.MAX_FILE_SIZE) {
          Alert.alert('Error', 'File size should be less than 5MB');
          return;
        }
        
        setDocuments(prev => ({
          ...prev,
          [type]: file,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmit = async () => {
    if (registrationType === 'admin') {
      if (!validateStep('admin')) return;
    } else {
      if (!validateStep(4)) return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (registrationType === 'admin') {
        // Admin registration
        const adminData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          adminCode: formData.adminCode,
        };
        
        response = await adminRegister(adminData);
        
        if (response.success) {
          if (response.autoLogin) {
            Alert.alert(
              'Success',
              'Admin registration successful! You are now logged in.',
              [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Admin' }] }) }]
            );
          } else {
            Alert.alert(
              'Success',
              response.message,
              [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
          }
        } else {
          Alert.alert('Registration Failed', response.message || 'Please try again');
        }
      } else {
        // Student registration
        const studentData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          college: formData.college,
          course: formData.course,
          year: parseInt(formData.year, 10),
          address: formData.address,
        };
        // Only include emergencyContact if at least one field is non-empty
        const ec = formData.emergencyContact;
        if (ec && (ec.name.trim() || ec.phone.trim() || ec.relation.trim())) {
          studentData.emergencyContact = {};
          if (ec.name.trim()) studentData.emergencyContact.name = ec.name.trim();
          if (ec.phone.trim()) studentData.emergencyContact.phone = ec.phone.trim();
          if (ec.relation.trim()) studentData.emergencyContact.relation = ec.relation.trim();
        }

        response = await register(studentData);
        
        if (response.success) {
          await AsyncStorage.removeItem(FORM_STORAGE_KEY);
          Alert.alert(
            'Registration Successful!',
            'Your registration has been submitted successfully. Please wait for admin approval before you can log in.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          if (response.errors && Array.isArray(response.errors)) {
            const backendErrors = {};
            response.errors.forEach(err => {
              backendErrors[err.param] = err.msg;
            });
            setErrors(backendErrors);
          }
          Alert.alert('Registration Failed', response.message || 'Please try again');
        }
      }
    } catch (error) {
      const errorsArr = error.response?.data?.errors;
      if (errorsArr && Array.isArray(errorsArr)) {
        const backendErrors = {};
        errorsArr.forEach(err => {
          backendErrors[err.param] = err.msg;
        });
        setErrors(backendErrors);
      }
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderRegistrationTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.typeSelectorTitle}>Select Registration Type</Text>
      <View style={styles.typeButtons}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            registrationType === 'student' && styles.typeButtonActive,
          ]}
          onPress={() => setRegistrationType('student')}
        >
          <Ionicons
            name="school"
            size={24}
            color={registrationType === 'student' ? COLORS.white : COLORS.primary}
          />
          <Text
            style={[
              styles.typeButtonText,
              registrationType === 'student' && styles.typeButtonTextActive,
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.typeButton,
            registrationType === 'admin' && styles.typeButtonActive,
          ]}
          onPress={() => setRegistrationType('admin')}
        >
          <Ionicons
            name="shield"
            size={24}
            color={registrationType === 'admin' ? COLORS.white : COLORS.primary}
          />
          <Text
            style={[
              styles.typeButtonText,
              registrationType === 'admin' && styles.typeButtonTextActive,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepIndicator = () => {
    if (registrationType === 'admin') {
      return (
        <View style={styles.stepIndicator}>
          <View style={styles.stepContainer}>
            <View style={[styles.step, styles.stepActive]}>
              <Text style={styles.stepText}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Basic Info</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepContainer}>
            <View style={[styles.step, currentStep === 'admin' && styles.stepActive]}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Admin Code</Text>
          </View>
        </View>
      );
    }

    const steps = ['Basic', 'Academic', 'Emergency', 'Address'];
    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.step,
                  currentStep > index && styles.stepCompleted,
                  currentStep === index + 1 && styles.stepActive,
                ]}
              >
                {currentStep > index + 1 ? (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                ) : (
                  <Text style={styles.stepText}>{index + 1}</Text>
                )}
              </View>
              <Text style={styles.stepLabel}>{step}</Text>
            </View>
            {index < steps.length - 1 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderBasicInformation = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <Input
        ref={inputRefs.name}
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.name}
        onChangeText={(value) => updateFormData('name', value)}
        error={errors.name}
        leftIcon="person"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.email.current?.focus()}
      />
      <Text style={styles.helperText}>2-50 letters/spaces only</Text>

      <Input
        ref={inputRefs.email}
        label="Email Address"
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        error={errors.email}
        leftIcon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.phone.current?.focus()}
      />
      <Text style={styles.helperText}>valid email</Text>

      <Input
        ref={inputRefs.phone}
        label="Phone Number"
        placeholder="Enter 10-digit phone number"
        value={formData.phone}
        onChangeText={(value) => updateFormData('phone', value)}
        error={errors.phone}
        leftIcon="call"
        keyboardType="phone-pad"
        maxLength={10}
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.password.current?.focus()}
      />
      <Text style={styles.helperText}>10 digits</Text>

      <Input
        ref={inputRefs.password}
        label="Password"
        placeholder="Enter password"
        value={formData.password}
        onChangeText={(value) => updateFormData('password', value)}
        error={errors.password}
        leftIcon="lock-closed"
        secureTextEntry
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.confirmPassword.current?.focus()}
      />
      <Text style={styles.helperText}>Min 6 chars, 1 uppercase, 1 lowercase, 1 number</Text>

      <Input
        ref={inputRefs.confirmPassword}
        label="Confirm Password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateFormData('confirmPassword', value)}
        error={errors.confirmPassword}
        leftIcon="lock-closed"
        secureTextEntry
        required
        returnKeyType="done"
      />
    </View>
  );

  const renderAcademicInformation = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Academic Information</Text>
      
      <Input
        ref={inputRefs.college}
        label="College/University"
        placeholder="Enter your college name"
        value={formData.college}
        onChangeText={(value) => updateFormData('college', value)}
        error={errors.college}
        leftIcon="school"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.course.current?.focus()}
      />
      <Text style={styles.helperText}>2-100 chars</Text>

      <Input
        ref={inputRefs.course}
        label="Course"
        placeholder="e.g., B.Tech Computer Science"
        value={formData.course}
        onChangeText={(value) => updateFormData('course', value)}
        error={errors.course}
        leftIcon="book"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.year.current?.focus()}
      />
      <Text style={styles.helperText}>2-50 chars</Text>

      <Input
        ref={inputRefs.year}
        label="Year of Study"
        placeholder="e.g., 1st Year, 2nd Year"
        value={formData.year}
        onChangeText={(value) => updateFormData('year', value)}
        error={errors.year}
        leftIcon="calendar"
        keyboardType="numeric"
        required
        returnKeyType="done"
      />
      <Text style={styles.helperText}>Enter a number between 1 and 6</Text>
    </View>
  );

  const renderEmergencyContact = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Emergency Contact (Optional)</Text>
      
      <Input
        ref={inputRefs.emergencyName}
        label="Contact Name"
        placeholder="Enter emergency contact name (optional)"
        value={formData.emergencyContact.name}
        onChangeText={(value) => updateFormData('emergencyContact.name', value)}
        error={errors['emergencyContact.name']}
        leftIcon="person"
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.emergencyPhone.current?.focus()}
      />
      <Text style={styles.helperText}>Enter emergency contact name (optional)</Text>

      <Input
        ref={inputRefs.emergencyPhone}
        label="Contact Phone"
        placeholder="Enter emergency contact phone (optional)"
        value={formData.emergencyContact.phone}
        onChangeText={(value) => updateFormData('emergencyContact.phone', value)}
        error={errors['emergencyContact.phone']}
        leftIcon="call"
        keyboardType="phone-pad"
        maxLength={10}
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.emergencyRelation.current?.focus()}
      />
      <Text style={styles.helperText}>Enter emergency contact phone (optional)</Text>

      <Input
        ref={inputRefs.emergencyRelation}
        label="Relation"
        placeholder="e.g., Father, Mother, Guardian (optional)"
        value={formData.emergencyContact.relation}
        onChangeText={(value) => updateFormData('emergencyContact.relation', value)}
        error={errors['emergencyContact.relation']}
        leftIcon="people"
        returnKeyType="done"
      />
      <Text style={styles.helperText}>e.g., Father, Mother, Guardian (optional)</Text>
    </View>
  );

  const renderAddress = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Address Information</Text>
      
      <Input
        ref={inputRefs.street}
        label="Street Address"
        placeholder="Enter your street address"
        value={formData.address.street}
        onChangeText={(value) => updateFormData('address.street', value)}
        error={errors['address.street']}
        leftIcon="home"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.city.current?.focus()}
      />
      <Text style={styles.helperText}>Enter your street address</Text>

      <Input
        ref={inputRefs.city}
        label="City"
        placeholder="Enter your city"
        value={formData.address.city}
        onChangeText={(value) => updateFormData('address.city', value)}
        error={errors['address.city']}
        leftIcon="location"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.state.current?.focus()}
      />
      <Text style={styles.helperText}>Enter your city</Text>

      <Input
        ref={inputRefs.state}
        label="State"
        placeholder="Enter your state"
        value={formData.address.state}
        onChangeText={(value) => updateFormData('address.state', value)}
        error={errors['address.state']}
        leftIcon="map"
        required
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.pincode.current?.focus()}
      />
      <Text style={styles.helperText}>Enter your state</Text>

      <Input
        ref={inputRefs.pincode}
        label="Pincode"
        placeholder="Enter 6-digit pincode"
        value={formData.address.pincode}
        onChangeText={(value) => updateFormData('address.pincode', value)}
        error={errors['address.pincode']}
        leftIcon="location-outline"
        keyboardType="numeric"
        maxLength={6}
        required
        returnKeyType="done"
      />
      <Text style={styles.helperText}>Enter 6-digit pincode</Text>
    </View>
  );

  const renderAdminCode = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Admin Verification</Text>
      <Text style={styles.stepSubtitle}>
        Please enter the admin registration code to complete your registration.
      </Text>
      
      <Input
        ref={inputRefs.adminCode}
        label="Admin Code"
        placeholder="Enter admin registration code"
        value={formData.adminCode}
        onChangeText={(value) => updateFormData('adminCode', value)}
        error={errors.adminCode}
        leftIcon="shield"
        secureTextEntry
        required
        returnKeyType="done"
      />
    </View>
  );

  const renderDocumentUpload = () => (
    <View style={styles.documentSection}>
      <Text style={styles.sectionTitle}>Document Upload (Optional)</Text>
      
      <TouchableOpacity
        style={styles.documentButton}
        onPress={() => pickDocument('idProof')}
      >
        <Ionicons name="document" size={24} color={COLORS.primary} />
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>ID Proof</Text>
          <Text style={styles.documentSubtitle}>
            {documents.idProof ? documents.idProof.name : 'Upload ID proof (Aadhar, PAN, etc.)'}
          </Text>
        </View>
        <Ionicons name="cloud-upload" size={20} color={COLORS.gray} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.documentButton}
        onPress={() => pickDocument('collegeId')}
      >
        <Ionicons name="school" size={24} color={COLORS.primary} />
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>College ID</Text>
          <Text style={styles.documentSubtitle}>
            {documents.collegeId ? documents.collegeId.name : 'Upload college ID card'}
          </Text>
        </View>
        <Ionicons name="cloud-upload" size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );

  const renderNavigationButtons = () => {
    const isLastStep = registrationType === 'admin' 
      ? currentStep === 'admin' 
      : currentStep === 4;
    
    const canGoBack = registrationType === 'admin' 
      ? currentStep === 'admin' 
      : currentStep > 1;

    return (
      <View style={styles.navigationButtons}>
        {canGoBack && (
          <Button
            title="Previous"
            variant="outline"
            onPress={handlePrevious}
            style={styles.navButton}
          />
        )}
        
        <Button
          title={isLastStep ? 'Register' : 'Next'}
          onPress={isLastStep ? handleSubmit : handleNext}
          loading={isLoading}
          style={[styles.navButton, !canGoBack && styles.fullWidthButton]}
        />
      </View>
    );
  };

  const renderCurrentStep = () => {
    if (registrationType === 'admin') {
      if (currentStep === 1) {
        return renderBasicInformation();
      } else if (currentStep === 'admin') {
        return renderAdminCode();
      }
    } else {
      switch (currentStep) {
        case 1:
          return renderBasicInformation();
        case 2:
          return renderAcademicInformation();
        case 3:
          return renderEmergencyContact();
        case 4:
          return (
            <>
              {renderAddress()}
              {renderDocumentUpload()}
            </>
          );
        default:
          return renderBasicInformation();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
         
        </View>

        {currentStep === 1 && renderRegistrationTypeSelector()}
        
        {currentStep !== 1 && renderStepIndicator()}
        
        {renderCurrentStep()}
        
        {renderNavigationButtons()}

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  typeSelector: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  typeSelectorTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  typeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
  },
  stepCompleted: {
    backgroundColor: COLORS.success,
  },
  stepText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.sm,
  },
  stepContent: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  stepTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  documentSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  documentInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  documentTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  documentSubtitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  navButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
  loginLink: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loginLinkText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
  },
  loginLinkBold: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
    marginLeft: 2,
  },
});

export default RegisterScreen;