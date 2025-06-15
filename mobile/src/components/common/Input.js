import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  containerStyle,
  labelStyle,
  errorStyle,
  required = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (error) {
      baseStyle.push(styles.containerError);
    } else if (isFocused) {
      baseStyle.push(styles.containerFocused);
    }
    
    if (!editable) {
      baseStyle.push(styles.containerDisabled);
    }
    
    return baseStyle;
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconContainer}
        >
          <Ionicons
            name={rightIcon}
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={[getContainerStyle(), style]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={COLORS.gray}
            />
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text style={styles.helperText}>
          {helperText}
        </Text>
      )}
      
      {maxLength && (
        <Text style={styles.characterCount}>
          {value ? value.length : 0}/{maxLength}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  
  required: {
    color: COLORS.error,
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    minHeight: 44,
  },
  
  containerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  
  containerError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  
  containerDisabled: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.lightGray,
  },
  
  input: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.black,
    paddingVertical: SPACING.sm,
  },
  
  iconContainer: {
    padding: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
  
  errorText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  
  helperText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  
  characterCount: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
});

Input.displayName = 'Input';

export default Input;