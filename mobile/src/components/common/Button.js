import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhost);
        break;
      case 'danger':
        baseStyle.push(styles.buttonDanger);
        break;
      case 'success':
        baseStyle.push(styles.buttonSuccess);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }
    
    // State styles
    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.textSmall);
        break;
      case 'large':
        baseStyle.push(styles.textLarge);
        break;
      default:
        baseStyle.push(styles.textMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'outline':
        baseStyle.push(styles.textOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.textGhost);
        break;
      default:
        baseStyle.push(styles.textSolid);
    }
    
    if (disabled) {
      baseStyle.push(styles.textDisabled);
    }
    
    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white} 
          />
          {title && <Text style={[getTextStyle(), { marginLeft: SPACING.sm }]}>{title}</Text>}
        </View>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <View style={styles.contentContainer}>
          <Ionicons 
            name={icon} 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
            style={{ marginRight: title ? SPACING.sm : 0 }}
          />
          {title && <Text style={getTextStyle()}>{title}</Text>}
        </View>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <View style={styles.contentContainer}>
          {title && <Text style={getTextStyle()}>{title}</Text>}
          <Ionicons 
            name={icon} 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
            style={{ marginLeft: title ? SPACING.sm : 0 }}
          />
        </View>
      );
    }

    return <Text style={getTextStyle()}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'visible',
  },
  
  // Size styles
  buttonSmall: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    minHeight: 32,
  },
  buttonMedium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    minHeight: 40,
  },
  buttonLarge: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 10,
    minHeight: 48,
  },
  
  // Variant styles
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  
  // State styles
  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.lightGray,
  },
  buttonFullWidth: {
    width: '100%',
  },
  
  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: FONT_SIZES.small,
  },
  textMedium: {
    fontSize: FONT_SIZES.medium,
  },
  textLarge: {
    fontSize: FONT_SIZES.large,
  },
  textSolid: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textGhost: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.gray,
  },
  
  // Content styles
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;