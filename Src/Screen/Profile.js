import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Color from '../Constant/Color';
import axios from 'axios';

const Profile = ({navigation}) => {
  const [driverData, setDriverData] = useState({});
  const [profile, setprofile] = useState();
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, async response => {
      if (response.assets) {
        setprofile(response.assets[0]);
        const formData = new FormData();
        let profiledata = response.assets[0];
        formData.append('profileimage', {
          name: profiledata.fileName,
          type: profiledata.type,
          uri:
            Platform.OS === 'ios'
              ? profiledata.uri.replace('file://', '')
              : profiledata.uri,
        });
        formData.append('userId', driverData?._id);
        const res = await axios.put(
          'http://192.168.1.19:8051/api/v1/driver/updatedriver',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            Accept: 'application/json',
          },
        );
        if (res.status == 200) {
          await AsyncStorage.setItem(
            'driver',
            JSON.stringify(res.data.updatedriver),
          );
          navigation.reset({
            index: 0,
            routes: [{name: 'Profile'}], // Replace 'CurrentScreenName' with your current screen name
          });
        }
      }
    });
  };

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.buttonColor}}>
      <ScrollView>
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
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Feather name="arrow-left" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.profile}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
              {profile ? (
                <Image source={profile} style={styles.profileAvatar} />
              ) : (
                <Image
                  source={{
                    uri:
                      'http://192.168.1.19:8051/User/' +
                      driverData?.profileimage,
                  }}
                  style={styles.profileAvatar}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleChoosePhoto();
              }}>
              <View style={styles.profileAction}>
                <FeatherIcon color="#fff" name="edit-3" size={15} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.profileName}>{driverData?.name}</Text>
              <Text style={styles.profileAddress}>{driverData?.address}</Text>
            </View>
          </View>

          <View style={styles.logins}>
            <Text style={styles.details}>
              User Name : <Text>{driverData?.name}</Text>
            </Text>
            <Text style={styles.details}>
              Email : <Text>{driverData?.email}</Text>
            </Text>

            <Text style={styles.details}>
              Mobile No : <Text>{driverData?.phoneNumber}</Text>
            </Text>
            <Text style={styles.details}>
              Gender :{' '}
              <Text>
                {driverData?.gender !== 'undefined' ? driverData?.gender : ''}
              </Text>
            </Text>
            <Text style={styles.details}>
              Address : <Text>{driverData?.address}</Text>
            </Text>
            <Text style={styles.details}>
              Date Of Birth : <Text>{driverData?.datebirth}</Text>
            </Text>
            {/* <Text style={styles.details}>
              House No : <Text>20 'B'</Text>
            </Text> */}
            <Text style={styles.details}>
              Country : <Text>{driverData?.country}</Text>
            </Text>
            <Text style={styles.details}>
              State : <Text>{driverData?.state}</Text>
            </Text>
            <Text style={styles.details}>
              City Name : <Text>{driverData?.city}</Text>
            </Text>
            <Text style={styles.details}>
              Addhar Card No : <Text>{driverData?.aadharno}</Text>
            </Text>
            <Text style={styles.details}>
              Pan Card No : <Text>{driverData?.pancardno}</Text>
            </Text>
            <Text style={styles.details}>Addhar Card Copy</Text>
            <Image
              source={{
                uri: 'http://192.168.1.19:8051/User/' + driverData?.aadharimg,
              }}
              style={{height: 100, width: 300}}
              resizeMode="contain"
            />
            <Text style={styles.details}>Pan Card Copy</Text>
            <Image
              source={{
                uri: 'http://192.168.1.19:8051/User/' + driverData?.pancardimg,
              }}
              style={{height: 100, width: 300}}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    marginTop: 35,
  },
  icons: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  profile: {
    padding: 24,
    // backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
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
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  details: {
    backgroundColor: Color.backgroundColor,
    fontSize: 16,
    color: Color.black,
    padding: 14,
    borderBottomWidth: 2,
    borderColor: Color.grey,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
});

export default Profile;
