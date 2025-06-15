import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const Loading = ({
  visible = true,
  text = 'Loading...',
  size = 'large',
  color = COLORS.primary,
  overlay = false,
  style,
  textStyle,
}) => {
  if (overlay) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size={size} color={color} />
            {text && (
              <Text style={[styles.overlayText, textStyle]}>
                {text}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  text: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  overlayContent: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  
  overlayText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.black,
    textAlign: 'center',
  },
});

export default Loading;