import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {useDriverContext} from '../Context/DriverContext'; // Import context

export default function Menu({navigation}) {
  const {setDriverId: setContextDriverId} = useDriverContext(); // Get context function

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
            routes: [{name: 'Home'}], // Replace 'CurrentScreenName' with your current screen name
          });
        }
      }
    });
  };
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

  // console.log('driverData', driverData);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
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
                    'http://192.168.1.19:8051/User/' + driverData?.profileimage,
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

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#fe9400'}]}>
                <FeatherIcon color="#fff" name="user" size={20} />
              </View>

              <Text style={styles.rowLabel}>My Profile</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('NewPassword');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#32c759'}]}>
                <FeatherIcon color="#fff" name="navigation" size={20} />
              </View>

              <Text style={styles.rowLabel}>Change Password</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('BookingHistory');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#32c759'}]}>
                <FeatherIcon color="#fff" name="navigation" size={20} />
              </View>

              <Text style={styles.rowLabel}>Booking History</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PaymentHistory')}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.rowIcon,
                    {backgroundColor: '#38C959', position: 'relative'},
                  ]}>
                  <FeatherIcon color="#fff" name="navigation" size={20} />
                </View>

                <Text style={styles.rowLabel}>Payment History</Text>

                <View style={styles.rowSpacer} />
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, {backgroundColor: '#38C959'}]}>
                  <Ionicons color="#fff" name="wallet-outline" size={20} />
                </View>
                <Text style={styles.rowLabel}>Wallet</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Aboutus');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#8e8d91'}]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>About us</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('ChatScreen');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#8e8d91'}]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>Support</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('ChatScreen');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#8e8d91'}]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>T&C</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('ChatScreen');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#8e8d91'}]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>Privacy Policy</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('ChatScreen');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#8e8d91'}]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>Disclaimer</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Contact');
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#007afe'}]}>
                <FeatherIcon color="#fff" name="mail" size={20} />
              </View>

              <Text style={styles.rowLabel}>Contact Us</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}>
              <View style={[styles.rowIcon, {backgroundColor: '#32c759'}]}>
                <FeatherIcon color="#fff" name="star" size={20} />
              </View>

              <Text style={styles.rowLabel}>Rate in App Store</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.section}>
          <TouchableOpacity
            onPress={async () => {
              setContextDriverId(null)
              await AsyncStorage.clear();
              navigation.navigate('Login');
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, {backgroundColor: 'red'}]}>
              <AntDesign color="#fff" name="logout" size={20} />
            </View>
            <Text style={[styles.rowLabel, {color: 'red'}]}>LogOut</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Profile */
  profile: {
    padding: 24,
    backgroundColor: '#fff',
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
    color: '#414d63',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  /** Section */
  section: {
    paddingHorizontal: 21,
  },
  sectionTitle: {
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
