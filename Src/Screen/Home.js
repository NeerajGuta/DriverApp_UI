import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  BackHandler,
  Vibration,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import COLORS from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../Constant/Color';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useFocusEffect} from '@react-navigation/native';

import {useDriverContext} from '../Context/DriverContext'; // Import context
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import moment from 'moment';
import axios from 'axios';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
// import song from '../Assets/ridealert.mp3';
const Home = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [acc, setacc] = useState(true);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const mapRef = useRef(null);
  const [longi, setlongi] = useState(null);
  const [lati, setlati] = useState(null);
  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);

  // Location Permission
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Taxi app needs access to your location for using the map.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Handle permission granted
        console.log('Location permission granted');
      } else {
        // Handle permission denied
        console.log('Location permission denied');
      }

      // Mark that permission has been requested to avoid multiple requests
      setLocationPermissionRequested(true);
    } catch (error) {
      console.log('Location permission request error:', error);
      // Handle the error or display an error message
    }
  };

  const [driverData, setDriverData] = useState({});

  useEffect(() => {
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
    return;
  }, []);

  // console.log('driverData==>', driverData);

  useEffect(() => {
    if (!locationPermissionRequested) {
      requestLocationPermission();
    }
  }, [locationPermissionRequested]);

  const handleGetLocation = () => {
    if (!longi) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setlongi(longitude);
          setlati(latitude);
          getLocation({
            lat: latitude,
            lng: longitude,
          });
          if (mapRef) {
            mapRef?.current?.animateToRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        },

        error => {
          // Handle error
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };
  useEffect(() => {
    handleGetLocation();
    const interval = setInterval(() => {
      handleGetLocation();
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [address, setAddress] = useState('');

  const getGeocodingData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyACW1po0qU1jptIybBPGdFY-_MrycQPjfk`,
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting geocoding data:', error);
    }
  };

  const [loading, setLoading] = useState(true);
  const fetchAddress = async (lat, lng) => {
    const API_KEY = '511ee4a684a7432389e220e510e77a73'; // Replace with your OpenCage API Key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${API_KEY}`;
    setLoading(false);
    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.results && data.results.length > 0) {
        console.log('Address:', data.results[0].formatted); // Get the formatted address
        setAddress(data.results[0].formatted);
        return data.results[0].formatted;
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const [isModalVisible1, setModalVisible1] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setModalVisible1(true); // Show the modal when back is pressed
        return true; // Prevent default back action
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const closeApp = async () => {
    setModalVisible1(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Splacescreen'}],
    });
    setTimeout(() => BackHandler.exitApp(), 500);
  };

  const [position, setposition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const {
    driverLocation,
    getLocation,
    socket,
    rideRequest,
    setRideRequest,
    acceptRide,
    rejectRide,
    setDriverId,
  } = useDriverContext(); // Use context

  let alertSound = new Sound(
    require('../Assets/phonealert.mp3'),
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
    },
  );
  const playAlertSound = () => {
    // Play the sound in a loop
    console.log('calling');
    // alertSound.setNumberOfLoops(-1);
    alertSound.play(() => {});
    // Vibration.vibrate(1000);
  };

  const stopAlertSound = () => {
    alertSound.stop(() => {});
  };

  useEffect(() => {
    if (socket && driverData?._id) {
      socket.on(`newRide${driverData?._id}`, ride => {
        setRideRequest(ride);
        // PushNotification.localNotification({
        //   title: 'New Ride Request',
        //   message: `Ride ID: ${ride.id}`,
        //   userInfo: {rideId: ride.id, accepted: false},
        // });
        setModalVisible(true);
        playAlertSound();

        // Automatically stop sound after 1 minute
        const timer = setTimeout(() => {
          setModalVisible(false);
        }, 60000);
        console.log(`newRide${driverData?._id}`, ride);

        return () => clearTimeout(timer);
      });
    }

    // Fetch current location
  }, [socket, driverData?._id]);

  useEffect(() => {
    if (lati && longi) {
      fetchAddress(lati, longi);
    }
  }, [lati, longi]);

  const sendOtp = async () => {
    try {
      const res = await axios.put(
        'http://192.168.1.19:8051/api/v1/user/sendOtpCustomer',
        {id: rideRequest?._id},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          Accept: 'application/json',
        },
      );
      if (res.status == 200) {
        await AsyncStorage.setItem(
          'ride',
          JSON.stringify({
            ride: rideRequest,
            driverLocation,
            page: 'VerifyOtp',
          }),
        );
        setTimeout(() => {
          navigation.navigate('VerifyOtp');
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRideResponse = async accepted => {
    stopAlertSound();
    if (accepted == 'Accepted') {
      setModalVisible(false);
      acceptRide();

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Ride Accepted',
        textBody: 'You are assigned to ride',
        button: 'Ok',
      });
      sendOtp();
    } else {
      setModalVisible(false);

      rejectRide();
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Ride Rejected',
        textBody: 'Your ride successfully rejected',
        button: 'Ok',
      });
      // Alert.alert('Ride Rejected', `You have rejected ride ${rideRequest._id}`);
    }
  };
  const marker2 = {
    latitude: rideRequest?.pickuplocation.lat,
    longitude: rideRequest?.pickuplocation.lng,
  };

  const vehicleIcon = require('../Assets/carmap.png'); // Custom icon for vehicle
  const userIcon = require('../Assets/walkman.png'); // Custom icon for user

  return (
    <AlertNotificationRoot>
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          initialRegion={position}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={false}
          showsMyLocationButton={false}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}>
          {lati && longi && (
            <Marker
              coordinate={{
                latitude: parseFloat(lati),
                longitude: parseFloat(longi),
              }}
              title={address}>
              <Image
                source={vehicleIcon}
                style={styles.markerIcon} // Apply style for resizing
                resizeMode="contain" // Ensures aspect ratio is maintained
              />
            </Marker>
          )}
          {rideRequest?.pickuplocation && (
            <Marker
              coordinate={marker2}
              title={rideRequest?.pickuplocation?.address}>
              <Image
                source={userIcon}
                style={styles.markerIcon} // Apply style for resizing
                resizeMode="contain" // Ensures aspect ratio is maintained
              />
            </Marker>
          )}
        </MapView>
        <View
          style={{
            position: 'absolute',
            right: 18,
            top: 15,
            left: 18,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View style={styles.iconmenu}>
              <Ionicons name="menu" size={27} color={Color.black} />
            </View>
          </TouchableOpacity>
          <View style={styles.circle}>
            <Entypo name="circle" size={18} color="green" />
            <TextInput
              style={{flex: 1}}
              numberOfLines={2}
              placeholder={address ? address : 'Current location'}
              placeholderTextColor={Color.black}
            />
          </View>
          <View style={styles.iconmenu1}>
            {acc ? (
              <TouchableOpacity
                onPress={() => {
                  setacc(!acc);
                  setDriverId(driverData?._id);
                }}>
                <Text style={{fontSize: 20, fontWeight: '600', color: 'red'}}>
                  <AntDesign name="poweroff" size={25} color="red" />
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setacc(!acc);
                  setDriverId(null);
                }}>
                <Text style={{fontSize: 20, fontWeight: '600', color: 'green'}}>
                  <AntDesign name="poweroff" size={25} color="green" />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View>
          {/* <Button title="Show modal" onPress={toggleModal} /> */}

          <Modal isVisible={isModalVisible}>
            <View style={styles.modelPickup}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '800',
                    color: COLORS.black,
                  }}>
                  Pick Up
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // height: 120,
                  gap: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Octicons name="dot" size={25} color="green" />
                  <Text
                    style={{
                      borderWidth: 1,
                      borderStyle: 'dotted',
                      height: 40,
                      width: 1,
                      borderColor: 'red',
                    }}></Text>
                  <Octicons name="dot" size={25} color="blue" />
                </View>
                <View>
                  <View>
                    <Text
                      style={{
                        paddingBottom: 2,
                        fontSize: 15,
                        fontWeight: '600',
                      }}>
                      From Location
                    </Text>
                    <Text
                      style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                      {rideRequest?.pickuplocation?.address.slice(0, 45)}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        paddingBottom: 2,
                        fontSize: 15,
                        fontWeight: '600',
                      }}>
                      End Location
                    </Text>
                    <Text
                      style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                      {rideRequest?.droplocation?.address.slice(0, 45)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.distance}>
                <Text style={styles.texted}>
                  {' '}
                  Distance : {rideRequest?.totalkm} km
                </Text>
                <Text style={styles.texted}>
                  {' '}
                  Price :{' '}
                  {rideRequest?.totalfare && rideRequest?.totalfare?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.distance}>
                <Text style={styles.texted}>
                  {' '}
                  Date : {moment(rideRequest?.bookedtimedate).format('ll')}
                </Text>
                <Text style={styles.texted}>
                  {' '}
                  Time : {moment(rideRequest?.bookedtimedate).format('LT')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    handleRideResponse('Accepted');
                  }}>
                  <Text
                    style={[styles.animatedButton, {backgroundColor: 'green'}]}>
                    ACCEPT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRideResponse('Rejected')}>
                  <Text style={styles.animatedButton}>REJECT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            isVisible={isModalVisible1}
            onBackdropPress={() => setModalVisible1(false)} // Close when tapping outside
            animationIn="slideInUp"
            animationOut="slideOutDown">
            <View style={styles.modalContent}>
              <Text style={styles.title}>Exit App</Text>
              <Text style={styles.message}>
                Are you sure you want to close the app?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible1(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={closeApp}>
                  <Text style={styles.confirmText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}
      </View>
    </AlertNotificationRoot>
  );
};

export default Home;

const styles = StyleSheet.create({
  local: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 50,
  },
  carimage: {
    height: 25,
    width: 35,
  },
  containttext: {
    fontSize: 14,
    fontWeight: '600',
  },
  net: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.black,
  },
  texted: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  circle: {
    backgroundColor: 'white',
    flex: 1,
    // paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#dbd3d340',
  },
  iconmenu: {
    height: 59,
    width: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: 35,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#dbd3d340',
  },
  conatintLocal: {
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dbd3d340',
  },
  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  animatedButton: {
    borderRadius: 1,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 5,
    borderRadius: 5,
    color: COLORS.backgroundColor,
    fontWeight: '700',
  },
  modelPickup: {
    backgroundColor: 'white',
    paddingHorizontal: 7,
    paddingVertical: 10,
    minheight: 330,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 5,
    borderRadius: 5,
  },
  iconmenu1: {
    height: 59,
    width: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    markerIcon: {
      width: 60, // Resize the icon width
      height: 60, // Resize the icon height
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: 35,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#dbd3d340',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#ff5252',
  },
  cancelText: {
    color: '#555',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the overlay is above all other UI elements
  },
  markerIcon: {
    width: 60, // Resize the icon width
    height: 60, // Resize the icon height
  },
});
