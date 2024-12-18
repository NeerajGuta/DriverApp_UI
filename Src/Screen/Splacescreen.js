import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import Color from '../Constant/Color';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splacescreen = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      let timeoutId;

      const checkDriverStatus = async () => {
        try {
          let driver = await AsyncStorage.getItem('driver');
          timeoutId = setTimeout(() => {
            if (driver) {
              driver = JSON.parse(driver);

              if (driver.haveVehicle == false) {
                navigation.navigate('AddVehicleScreen', {
                  driverID: driver?._id,
                });
              } else {
                navigation.navigate('Home');
              }
            } else {
              navigation.navigate('Login');
            }
          }, 2000);
        } catch (error) {
          console.error('Error fetching driver data:', error);
        }
      };

      checkDriverStatus();

      return () => {
        // Cleanup: Clear the timeout if the screen becomes unfocused
        if (timeoutId) clearTimeout(timeoutId);
        console.log('Screen is unfocused, timeout cleared.');
      };
    }, [navigation]),
  );

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
