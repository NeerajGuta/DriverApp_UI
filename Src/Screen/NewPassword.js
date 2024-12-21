import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../Constant/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedButton from '../Constant/Button';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const NewPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [oldPassword, setoldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [driverData, setDriverData] = useState({});

  useFocusEffect(
    useCallback(() => {
      const checkDriverStatus = async () => {
        try {
          let driver = await AsyncStorage.getItem('driver');

          if (driver) {
            driver = JSON.parse(driver);
            setDriverData(driver);
          }
        } catch (error) {
          console.error('Error fetching driver data:', error);
        }
      };

      checkDriverStatus();

      return () => {
        console.log('Screen is unfocused, timeout cleared.');
      };
    }, [navigation]),
  );

  const handlePress = async () => {
    try {
      if (!oldPassword)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Please enter your old password!',
        });
      if (!password)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Please enter your new password!',
        });
      if (!newPassword)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Please enter your new password!',
        });
      if (oldPassword == newPassword)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody:
            'Your new password must be different from your old password!',
        });
      if (password !== newPassword)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Confirm password dose not match!',
        });

      let config = {
        url: '/updatepassword',
        method: 'put',
        baseURL: 'http://192.168.1.19:8051/api/v1/driver/',
        header: {'content-type': 'application/json'},
        data: {
          email: driverData?.email,
          oldPassword: oldPassword,
          newPassword: password,
        },
      };
      let res = await axios(config);
      if (res.status === 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Successfully Changed Password',
          button: 'Ok!',
        });
        await AsyncStorage.clear();
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1000);

        // Alert.alert('Login success');
      }
    } catch (error) {
      console.log('Error:', error.message);
      if (error.response) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: error.response.data?.error || 'Something went wrong!',
          button: 'Try Again!',
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: error.response.data?.error || 'Network Issue!',
          button: 'Try Again!',
        });
      }
    }
  };

  const [isPasswordShown, setIsPasswordShown] = useState(true);

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.buttonColor}}>
        <View style={{flex: 1}}>
          <View
            style={{
              width: 35,
              backgroundColor: COLORS.backgroundColor,
              padding: 7,
              borderRadius: 60,
              top: 10,
              marginLeft: 10,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack('')}>
              <Feather name="arrow-left" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <View
            style={{marginVertical: 22, marginHorizontal: 22, paddingTop: 25}}>
            <Text style={styles.welcome}>Set New Password ! 👋</Text>

            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
              }}>
              Your new password must be different from previously used password!
            </Text>
          </View>

          <View style={styles.logins}>
            <View style={{marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginVertical: 8,
                  color: COLORS.black,
                }}>
                Old Password
              </Text>
              <Feather
                name="lock"
                size={20}
                style={styles.icons}
                color={COLORS.buttonColor}
              />
              <View style={styles.input}>
                <TextInput
                  placeholder="Enter your old password"
                  placeholderTextColor={COLORS.black}
                  keyboardType="text"
                  value={oldPassword}
                  onChangeText={oldPassword => setoldPassword(oldPassword)}
                  style={{
                    width: '100%',
                  }}
                />
              </View>
            </View>
            <View style={{marginBottom: 12}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginVertical: 8,
                  color: COLORS.black,
                }}>
                New Password
              </Text>
              <Feather
                name="lock"
                size={20}
                style={styles.icons}
                color={COLORS.buttonColor}
              />
              <View style={styles.input}>
                <TextInput
                  placeholder="Enter your new password"
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={isPasswordShown}
                  value={password}
                  onChangeText={password => setPassword(password)}
                  style={{
                    width: '100%',
                  }}
                />

                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                    position: 'absolute',
                    right: 12,
                  }}>
                  {isPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.black} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 12}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginVertical: 8,
                  color: COLORS.black,
                }}>
                Confirm Password
              </Text>
              <Feather
                name="lock"
                size={20}
                style={styles.icons}
                color={COLORS.buttonColor}
              />
              <View style={styles.input}>
                <TextInput
                  placeholder="Enter your new password"
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={isPasswordShown}
                  value={newPassword}
                  onChangeText={newPassword => setNewPassword(newPassword)}
                  style={{
                    width: '100%',
                  }}
                />

                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                    position: 'absolute',
                    right: 12,
                  }}>
                  {isPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.black} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <AnimatedButton
              title="Create new password"
              style={{
                marginTop: 18,
                marginBottom: 4,
              }}
              onPress={handlePress}
            />
          </View>
        </View>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    color: COLORS.black,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
  },
  logins: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 20,
    paddingVertical: 50,
    marginTop: 50,
    borderTopLeftRadius: 120,
  },
  icons: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  forget: {
    color: 'red',
    fontWeight: '600',
  },
});

export default NewPassword;
