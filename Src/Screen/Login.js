import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      if (!email)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Please enter your email ID!',
        });
      if (!password)
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Please enter your password!',
        });
      let config = {
        url: '/signin',
        method: 'post',
        baseURL: 'http://192.168.1.19:8051/api/v1/driver/',
        header: {'content-type': 'application/json'},
        data: {
          email: email,
          password: password,
        },
      };
      let res = await axios(config);
      if (res.status === 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Error',
          textBody: 'Successfully login',
          button: 'Ok!',
        });
        await AsyncStorage.setItem('driver', JSON.stringify(res.data.driver));
        setTimeout(() => {
          if (res.data.driver.haveVehicle == false) {
            navigation.navigate('AddVehicleScreen', {
              driverID: res.data.driver?._id,
            });
          } else {
            navigation.navigate('Home');
          }
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

  return (
    <GestureHandlerRootView style={{flex: 1, justifyContent: 'center'}}>
      <AlertNotificationRoot>
        <SafeAreaView style={{flex: 1, backgroundColor: Color.backgroundColor}}>
          <View style={{flex: 1}}>
            <View
              style={{
                backgroundColor: Color.buttonColor,
                padding: 15,
                flexDirection: 'row',
                gap: 50,
              }}>
              <TouchableOpacity onPress={() => navigation.goBack('')}>
                <Feather name="arrow-left" size={20} color={Color.black} />
              </TouchableOpacity>
              <Text
                style={{fontSize: 17, fontWeight: '600', color: Color.black}}>
                Enter Login Details
              </Text>
            </View>

            <ScrollView>
              <View style={{marginHorizontal: 20, marginTop: '50%'}}>
                <View style={{marginBottom: 8}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginVertical: 8,
                      color: Color.black,
                    }}>
                    Email
                  </Text>

                  <View style={styles.input}>
                    <TextInput
                      placeholder="Enter your email address"
                      placeholderTextColor={Color.black}
                      keyboardType="email-address"
                      style={{
                        width: '100%',
                      }}
                      value={email}
                      onChangeText={email => setEmail(email)}
                    />
                  </View>
                </View>
                <View style={{marginBottom: 8}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginVertical: 8,
                      color: Color.black,
                    }}>
                    Password
                  </Text>

                  <View style={styles.input}>
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor={Color.black}
                      keyboardType="email-address"
                      style={{
                        width: '100%',
                      }}
                      value={password}
                      onChangeText={password => setPassword(password)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: 10,
                      marginVertical: 10,
                    }}>
                    <Text>You have no Account </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Register')}>
                      <Text style={{color: 'red', fontSize: 15}}>Register</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <AnimatedButton title="Login" onPress={() => login()} />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </AlertNotificationRoot>
    </GestureHandlerRootView>
  );
};

export default Login;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 20,
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 92,
    height: 92,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    left: 10,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: Color.backgroundColor,
    borderColor: Color.grey,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
  },
  dropdownButtonStyle: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    // width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  countryPicker: {
    alignContent: 'flex-start',
  },
  upload: {
    backgroundColor: 'red',
    padding: 14,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    color: 'white',
    fontWeight: '800',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
  },
  camera: {
    width: 35,
    height: 35,
  },
  choose: {
    flexDirection: 'row',
    gap: 35,
    justifyContent: 'center',
  },
  gallercam: {
    alignItems: 'center',
  },
});
