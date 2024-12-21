import React, {useEffect, useState, useRef} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import COLORS from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import Color from '../Constant/Color';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useDriverContext} from '../Context/DriverContext';
import haversine from 'haversine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from 'react-native-alert-notification';

const CELL_COUNT = 6;

const VerifyOtp = ({navigation}) => {
  const {
    driverLocation,
    getLocation,
    socket,
    rideRequest,
    setRideRequest,
    acceptRide,
    rejectRide,
    setDriverId,
  } = useDriverContext();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    const check = async () => {
      let data = await AsyncStorage.getItem('ride');
      if (data) {
        data = JSON.parse(data);
        setRideRequest(data?.ride);
      }
    };
    check();
    return;
  }, []);
  const mapRef = useRef();
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
            mapRef.current.animateToRegion({
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

  console.log('longi', longi, lati);
  const [address, setAddress] = useState('');
  console.log(address);
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

  useEffect(() => {
    if (lati && longi) {
      fetchAddress(lati, longi);
    }
  }, [lati, longi]);
  const [position, setposition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const marker1 = {latitude: lati, longitude: longi}; // Marker 1 coordinates
  const marker2 = {
    latitude: rideRequest?.pickuplocation.lat,
    longitude: rideRequest?.pickuplocation.lng,
  }; // Marker 2 coordinates

  // Calculate the distance
  const calculateDistance = (coord1, coord2) => {
    const distance = haversine(coord1, coord2, {unit: 'km'});
    return distance.toFixed(2); // Round off to 2 decimal places
  };

  // console.log('rideRequest', rideRequest);
  const vehicleIcon = require('../Assets/carmap.png'); // Custom icon for vehicle
  const userIcon = require('../Assets/walkman.png'); // Custom icon for user

  const distance = calculateDistance(marker1, marker2);

  const VerifyOtpSend = async () => {
    if (!value)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: 'Please enter otp!',
      });
    try {
      const config = {
        url: '/verifyOtpCustomer',
        method: 'put',
        baseURL: 'http://192.168.1.19:8051/api/v1/user',
        headers: {'Content-Type': 'application/json'},
        data: {
          id: rideRequest?._id,
          otp: parseInt(value),
        },
      };
      let res = await axios(config);
      if (res.status == 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Your are successfully verified and ride is start now.',
          button: 'Ok',
        });
        await AsyncStorage.setItem(
          'ride',
          JSON.stringify({
            ride: res.data.data,
            driverLocation,
            page: 'DriverTracking',
          }),
        );
        setTimeout(() => {
          navigation.navigate('DriverTracking');
        }, 500);
      }
    } catch (error) {
      console.log(error);
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

        <View style={{backgroundColor: 'white', paddingHorizontal: 20}}>
          <CodeField
            ref={ref}
            {...props}
            caretHidden={false}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.select({
              android: 'sms-otp',
              default: 'one-time-code',
            })}
            testID="my-code-input"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <AnimatedButton
            title="Start ride"
            style={{
              marginTop: 28,
              marginBottom: 4,
            }}
            onPress={() => VerifyOtpSend()}
          />
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

export default VerifyOtp;

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 40},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderColor: COLORS.black,
    textAlign: 'center',
    borderRadius: 10,
  },
  markerIcon: {
    width: 60, // Resize the icon width
    height: 60, // Resize the icon height
  },
  focusCell: {
    borderColor: '#000',
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
});
