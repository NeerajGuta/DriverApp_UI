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
import COLORS from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useDriverContext} from '../Context/DriverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const DropLocation = ({navigation}) => {
  const mapRef = useRef();

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

  const [longi, setlongi] = useState(null);
  const [lati, setlati] = useState(null);
  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);

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
    const interval = setInterval(() => {
      handleGetLocation();
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  console.log('longi', longi, lati);
  const [loading, setLoading] = useState(true);
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
  const vehicleIcon = require('../Assets/carmap.png'); // Custom icon for vehicle
  const marker2 = {
    latitude: rideRequest?.droplocation.lat,
    longitude: rideRequest?.droplocation.lng,
  };

  const completeRide = async () => {
    try {
      const config = {
        url: '/updatebooking/' + rideRequest?._id,
        method: 'patch',
        baseURL: 'http://192.168.1.19:8051/api/v1/user',
        headers: {'Content-Type': 'application/json'},
        data: {
          tripStatus: 'Completed Ride',
          bookingstatus: 'completed',
          driverdroplocation: {address, lat: lati, lng: longi},
        },
      };
      let res = await axios(config);
      if (res.status == 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Successfully completed Ride.',
          button: 'Ok',
        });
        await AsyncStorage.setItem(
          'ride',
          JSON.stringify({
            ride: res.data.data,
            driverLocation,
            page: 'DropLocation',
          }),
        );
        setTimeout(() => {
          navigation.navigate('Payment');
        }, 500);
      }
    } catch (error) {
      console.log(error);
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
          {rideRequest?.droplocation && (
            <Marker
              coordinate={marker2}
              title={rideRequest?.droplocation?.address}
            />
          )}
        </MapView>

        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,

            elevation: 18,
          }}>
          <View>
            <Text
              style={{fontSize: 18, fontWeight: '700', color: COLORS.black}}>
              Drop off Location
            </Text>
            <View>
              <Text
                style={{fontSize: 15, fontWeight: '500', color: COLORS.black}}>
                Destination
              </Text>
              <Text>{rideRequest?.droplocation?.address}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <Text
                style={[
                  styles.animatedButton,
                  {
                    backgroundColor: 'white',
                    color: COLORS.black,
                    borderWidth: 2,
                    borderColor: COLORS.grey,
                  },
                ]}>
                Price :{' '}
                {rideRequest?.totalfare && rideRequest?.totalfare?.toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => completeRide()}>
                <Text style={styles.animatedButton}>COMPLETE RIDE</Text>
              </TouchableOpacity>
            </View>
          </View>
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

export default DropLocation;

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
