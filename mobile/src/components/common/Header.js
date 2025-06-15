import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
  showBackButton = false,
  onBackPress,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const renderLeftComponent = () => {
    if (showBackButton) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      );
    }

    if (leftIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftPress}
        >
          <Ionicons
            name={leftIcon}
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconButton} />;
  };

  const renderRightComponent = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightPress}
        >
          <Ionicons
            name={rightIcon}
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconButton} />;
  };

  return (
    <>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={backgroundColor === COLORS.white ? 'dark-content' : 'light-content'}
      />
      <View style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.content}>
          {renderLeftComponent()}
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: textColor }, titleStyle]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: textColor }, subtitleStyle]}>
                {subtitle}
              </Text>
            )}
          </View>
          
          {renderRightComponent()}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: FONT_SIZES.small,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
  },
  
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default Header;