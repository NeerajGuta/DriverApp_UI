import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, PermissionsAndroid} from 'react-native';

import AnimatedButton from '../Constant/Button';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  DirectionsRenderer,
} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const DriverTracking = ({navigation}) => {
  const mapRef = useRef(null); // Initialize mapRef with null

  const [longi, setLongi] = useState(null);
  const [lati, setLati] = useState(null);
  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);
  const [polylineCoordinates, setPolylineCoordinates] = useState([
    {latitude: 13.076685, longitude: 77.57837873333334},
  ]);

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

  // Function to fetch current location
  //   const handleGetLocation = () => {
  //     if (!longi) {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           const {latitude, longitude} = position.coords;
  //           setLongi(longitude);
  //           setLati(latitude);
  //           setPolylineCoordinates(prevCoords => [
  //             ...prevCoords,
  //             {latitude, longitude},
  //           ]);
  //           if (mapRef.current) {
  //             // Check if mapRef.current exists before accessing its properties
  //             mapRef.current.animateToRegion({
  //               latitude,
  //               longitude,
  //               latitudeDelta: 0.005,
  //               longitudeDelta: 0.005,
  //             });
  //           }
  //         },
  //         error => {
  //           console.error('Error getting current location:', error);
  //         },
  //         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //       );
  //     }
  //   };

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

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef} // Assign mapRef to the MapView component
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        showsMyLocationButton={false}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        {polylineCoordinates.length > 0 && (
          <Polyline
            coordinates={polylineCoordinates}
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
          />
        )}
      </MapView>

      <View style={{backgroundColor: 'white', paddingHorizontal: 20}}>
        <AnimatedButton
          title="Stop ride"
          style={{
            marginTop: 28,
            marginBottom: 4,
          }}
          onPress={() => {
            navigation.navigate('DropLocation');
          }}
        />
      </View>
    </View>
  );
};

export default DriverTracking;

const styles = StyleSheet.create({});
