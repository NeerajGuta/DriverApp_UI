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

const Home = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [acc, setacc] = useState(true);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
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

  useEffect(() => {
    if (lati && longi) {
      getGeocodingData(lati, longi);
    }
  }, [lati, longi]);
  const [position, setposition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
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
          />
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
            placeholder="Current location"
            placeholderTextColor={Color.black}
          />
        </View>
        <View style={styles.iconmenu1}>
          {acc ? (
            <TouchableOpacity
              onPress={() => {
                setacc(!acc);
                toggleModal();
              }}>
              <Text style={{fontSize: 20, fontWeight: '600', color: 'red'}}>
                <AntDesign name="poweroff" size={25} color="red" />
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setacc(!acc);
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
                style={{fontSize: 20, fontWeight: '800', color: COLORS.black}}>
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
                    style={{paddingBottom: 2, fontSize: 15, fontWeight: '600'}}>
                    From Location
                  </Text>
                  <Text
                    style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                    {address.slice(0, 45)}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{paddingBottom: 2, fontSize: 15, fontWeight: '600'}}>
                    End Location
                  </Text>
                  <Text
                    style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                    {address.slice(0, 45)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.distance}>
              <Text style={styles.texted}> Distance : 1.2 km</Text>
              <Text style={styles.texted}> Price : 393</Text>
            </View>
            <View style={styles.distance}>
              <Text style={styles.texted}> Date : 22 April 2024</Text>
              <Text style={styles.texted}> Time : 7:40 pm</Text>
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
                  navigation.navigate('VerifyOtp');
                  toggleModal();
                }}>
                <Text
                  style={[styles.animatedButton, {backgroundColor: 'green'}]}>
                  ACCEPT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.animatedButton}>REJECT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
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
});
