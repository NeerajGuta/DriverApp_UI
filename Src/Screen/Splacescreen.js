import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Color from '../Constant/Color';

const Splacescreen = ({navigation}) => {
  setTimeout(() => {
    navigation.navigate('Register');
  }, 3000);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.buttonColor,
      }}>
      <StatusBar backgroundColor={Color.buttonColor}></StatusBar>
      <View style={styles.screens}>
        <Image source={require('../Assets/taxi.png')} style={styles.img} />
      </View>
    </SafeAreaView>
  );
};

export default Splacescreen;

const styles = StyleSheet.create({
  screens: {
    alignSelf: 'center',
  },
  img: {
    width: 150,
    height: 110,
  },
});
