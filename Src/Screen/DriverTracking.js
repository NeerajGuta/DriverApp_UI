import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
  Text,
} from 'react-native';
import AnimatedButton from '../Constant/Button';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  DirectionsRenderer,
} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useDriverContext} from '../Context/DriverContext';
import axios from 'axios';
import {Image} from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const DriverTracking = ({navigation}) => {
  const mapRef = useRef(null); // Initialize mapRef with null
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
  const [longi, setLongi] = useState(null);
  const [lati, setLati] = useState(null);
  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
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

  // console.log('polylineCoordinates', polylineCoordinates);

  // Function to request location permission
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
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }

      setLocationPermissionRequested(true);
    } catch (error) {
      console.log('Location permission request error:', error);
    }
  };

  useEffect(() => {
    if (!locationPermissionRequested) {
      requestLocationPermission();
    }
  }, [locationPermissionRequested]);
  const [address, setAddress] = useState('');
  const fetchAddress = async (lat, lng) => {
    const API_KEY = '511ee4a684a7432389e220e510e77a73'; // Replace with your OpenCage API Key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${API_KEY}`;

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
  const handleGetLocation = () => {
    if (!longi) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLongi(longitude);
          setLati(latitude);
          setPolylineCoordinates(prevCoords => [
            ...prevCoords,
            {latitude, longitude},
          ]);
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        },
        error => {
          console.error('Error getting current location:', error);
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

  useEffect(() => {
    if (lati && longi) {
      fetchAddress(lati, longi);
    }
  }, [lati, longi]);

  const vehicleIcon = require('../Assets/carmap.png'); // Custom icon for vehicle

  const marker2 = {
    latitude: rideRequest?.droplocation.lat,
    longitude: rideRequest?.droplocation.lng,
  };
  const marker1 = {latitude: lati, longitude: longi}; // Marker 1 coordinates
  //5b3ce3597851110001cf6248e13d8aea1cfc48608519434fa229d942
  const [routeCordinate, setroutecordinat] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRouteFromOSRM = async (origin, destination) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
      console.log('Request URL:', url);

      const response = await axios.get(url);

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const coordinates = route.geometry.coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));
        setLoading(false);
        // console.log('Route Coordinates:', coordinates);
        setroutecordinat(coordinates);
        return coordinates;
      } else {
        console.error('No route found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching route:', error.message);
      return [];
    }
  };

  useEffect(() => {
    if (lati && longi) {
      fetchRouteFromOSRM(marker1, marker2);
    }
  }, [lati, longi]);
  const navigateToDropLocation = () => {
    const {latitude, longitude} = marker2;
    const address = rideRequest?.droplocation?.address || 'Drop Location';

    if (latitude && longitude) {
      const location = `${latitude},${longitude}`;
      let url;

      if (Platform.OS === 'ios') {
        // iOS: Apple Maps with driving directions
        url = `maps://?q=${address}&ll=${location}&directionsmode=driving`;
      } else {
        // Android: Google Maps with directions for car
        url = `google.navigation:q=${location}&mode=d`;
      }

      // Open the map app (Google Maps or Apple Maps)
      Linking.openURL(url).catch(err =>
        console.error('Error opening navigation app:', err),
      );
    } else {
      console.error('Invalid coordinates for navigation');
    }
  };
  const [remark, setremark] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const stopRide = async () => {
    try {
      const config = {
        url: '/updatebooking/' + rideRequest?._id,
        method: 'patch',
        baseURL: 'http://192.168.1.19:8051/api/v1/user',
        headers: {'Content-Type': 'application/json'},
        data: {
          tripStatus: 'Stop Ride',
          remark: remark,
        },
      };
      let res = await axios(config);
      if (res.status == 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Successfully stoped ride.',
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
          navigation.navigate('DropLocation');
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
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}>
          {routeCordinate.length > 0 && (
            <Polyline
              coordinates={routeCordinate}
              strokeWidth={4}
              strokeColor="black"
            />
          )}

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
        {rideRequest?.droplocation && (
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Navigate to Drop Location"
              onPress={navigateToDropLocation}
            />
          </View>
        )}
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 30,
          }}>
          <AnimatedButton
            title="Stop ride"
            style={{
              marginTop: 40,
              marginBottom: 6,
            }}
            onPress={() => {
              setIsModalVisible(true);
            }}
          />
        </View>

        {/* Modal for stopping the ride */}
        <Modal
          visible={isModalVisible} // Control visibility based on state
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)} // Close on Android back press
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Stop Ride</Text>
              <View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter any feedback or comments..."
                  value={remark}
                  onChangeText={text => setremark(text)} // Update state when the input changes
                  multiline
                />
              </View>

              <View style={styles.buttonContainer1}>
                <AnimatedButton
                  title="Cancel"
                  onPress={() => setIsModalVisible(false)} // Close the modal
                />
                <AnimatedButton title="Confirm" onPress={stopRide} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </AlertNotificationRoot>
  );
};

export default DriverTracking;

const styles = StyleSheet.create({
  markerIcon: {
    width: 60, // Resize the icon width
    height: 60, // Resize the icon height
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 111,
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    width: 250,
    height: 100,
    // marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingRight: 15,
  },
});
