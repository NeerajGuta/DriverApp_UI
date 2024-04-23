import React, {useRef} from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';

const AnimatedButton = ({title, onPress}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Animation completed, you can trigger any action here
    });
  };

  const resetAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{scale: scaleValue}],
        // You can add more styles as needed
      }}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={startAnimation}
        onPressOut={resetAnimation}
        onPress={onPress}
        activeOpacity={1} // Disables the default opacity change on press
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00a551',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 30,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AnimatedButton;
