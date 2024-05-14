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
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../Constant/Color';
import {launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import {State, City} from 'country-state-city';
import CountryPicker from 'react-native-country-picker-modal';
import AnimatedButton from '../Constant/Button';
import ImagePicker from 'react-native-image-crop-picker';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Register = ({navigation}) => {
  const [profile, setprofile] = useState();
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setprofile(response.assets[0]);
      }
    });
  };
  // country,state,city

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const onCountrySelect = country => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);

    setSelectedCountryCode(country.cca2);
  };

  const fetchStatesAndCities = () => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.cca2).map(
        state => ({
          label: state.name,
          value: state.name,
        }),
      );
      setSelectedState(null);
      setSelectedCity(null);
      setStates(countryStates);
    }
  };

  useEffect(() => {
    if (selectedCountry && selectedCountry.cca2) {
      fetchStatesAndCities();
    }
  }, [selectedCountry]);

  const [states, setStates] = useState([]);

  const emojisWithIcons = [
    {title: 'Male', icon: 'emoticon-happy-outline'},
    {title: 'Female', icon: 'emoticon-cool-outline'},
  ];
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };
  // ref
  const bottomSheetModalRef = useRef();

  // variables
  const snapPoints = useMemo(() => ['20%', '30%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  // camera
  const takePhotoFromCamera1 = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      useFrontCamera: true,
      compressImageQuality: 0.7,
    }).then(image => {
      setprofile(image);
    });
  };
  // const onselect = () => {
  //   Alert.alert('Profile Picture', 'choose an option', [
  //     {text: 'Camera', onPress: () => takePhotoFromCamera1()},
  //     {text: 'Gallery', onPress: () => onselect2()},
  //     {text: 'Cancel', onPress: () => {}},
  //   ]);
  // };

  const onselect2 = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 600,
      cropping: true,
    }).then(profile => {
      setprofile(profile);
    });
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
            <Text style={{fontSize: 17, fontWeight: '600', color: Color.black}}>
              Enter Personal Details
            </Text>
          </View>
          <View style={styles.profile}>
            <TouchableOpacity>
              {profile ? (
                <Image source={profile} style={styles.profileAvatar} />
              ) : (
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
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
                <Feather color="#fff" name="edit-3" size={15} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={{marginHorizontal: 20}}>
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  User Name
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
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
                  Email
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your email addres"
                    placeholderTextColor={Color.black}
                    keyboardType="email-address"
                    style={{
                      width: '100%',
                    }}
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
                  Mobile No
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your mobile no"
                    placeholderTextColor={Color.black}
                    keyboardType="numeric"
                    style={{
                      width: '100%',
                    }}
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
                  Gender
                </Text>
                <View style={styles.input}>
                  <SelectDropdown
                    data={emojisWithIcons}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <View style={styles.dropdownButtonStyle}>
                          {selectedItem && (
                            <Icon
                              name={selectedItem.icon}
                              style={styles.dropdownButtonIconStyle}
                            />
                          )}
                          <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem.title) ||
                              'Select Gender'}
                          </Text>
                          <Icon
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            style={styles.dropdownButtonArrowStyle}
                          />
                        </View>
                      );
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <View
                          style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && {backgroundColor: '#D2D9DF'}),
                          }}>
                          <Icon
                            name={item.icon}
                            style={styles.dropdownItemIconStyle}
                          />
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.title}
                          </Text>
                        </View>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
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
                  Date Of Birth
                </Text>
                <View style={[styles.input, {marginLeft: 0}]}>
                  <TouchableOpacity onPress={() => setShow(true)}>
                    <Text style={{marginLeft: -30}}>{date.toString()}</Text>
                  </TouchableOpacity>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
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
                  House No
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your house no"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
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
                  Address
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your Address"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
                  />
                </View>
              </View>
              <View>
                <View style={{marginBottom: 8}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginVertical: 8,
                      color: Color.black,
                    }}>
                    Select Country:
                  </Text>
                  <View style={[styles.input, {alignItems: 'flex-start'}]}>
                    <CountryPicker
                      onSelect={onCountrySelect}
                      countryCode={selectedCountryCode}
                      withFilter
                      withFlag
                      withCountryNameButton
                      withAlphaFilter
                      withCallingCode
                      withEmoji
                      containerButtonStyle={styles.countryPicker}
                    />
                  </View>
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
                  Select State:
                </Text>
                <View style={[styles.input, {backgroundColor: 'white'}]}>
                  <RNPickerSelect
                    placeholder={{label: 'Select State', value: null}}
                    onValueChange={value => setSelectedState(value)}
                    items={states}
                    value={selectedState}
                    style={{
                      inputIOS: {
                        color: 'black', // Set the text color for iOS
                      },
                      inputAndroid: {
                        color: 'black', // Set the text color for Android
                      },
                      placeholder: {color: 'black'}, // Set the placeholder text color
                    }}
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
                  Enter City Name:
                </Text>
                <View style={[styles.input, {alignItems: 'flex-start'}]}>
                  <TextInput
                    keyboardType="name-phone-pad"
                    placeholder="Enter City Name *"
                    value={selectedCity}
                    placeholderTextColor={'black'}
                    onChangeText={text => setSelectedCity(text)}
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
                  Addhar Card No
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your addhar card no"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
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
                  Pan Card No
                </Text>

                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your pan card no"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
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
                  Addhar Card Copy
                </Text>

                <View
                  style={[
                    styles.input,
                    {flexDirection: 'row', justifyContent: 'space-between'},
                  ]}>
                  <Text style={{color: 'black'}}> upload your Addhar Card</Text>
                  <TouchableOpacity onPress={handlePresentModalPress}>
                    <Text style={styles.upload}>upload</Text>
                  </TouchableOpacity>
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
                  Pan Card Copy
                </Text>

                <View
                  style={[
                    styles.input,
                    {flexDirection: 'row', justifyContent: 'space-between'},
                  ]}>
                  <Text style={{color: 'black'}}> upload your Pan Card</Text>
                  <TouchableOpacity onPress={handlePresentModalPress}>
                    <Text style={styles.upload}>upload</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <AnimatedButton
                title="Register"
                onPress={() => navigation.navigate('AddVehicleScreen')}
              />
            </View>
          </ScrollView>

          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              style={{
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.0,
                elevation: 24,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <BottomSheetView style={styles.contentContainer}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: Color.black,
                      textAlign: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}>
                    Complete action using
                  </Text>
                </View>
                <View style={styles.choose}>
                  <TouchableOpacity
                    onPress={takePhotoFromCamera1}
                    style={styles.gallercam}>
                    <Image
                      source={require('../Assets/camera.png')}
                      style={styles.camera}
                    />
                    <Text style={{color: Color.black}}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onselect2}
                    style={styles.gallercam}>
                    <Image
                      source={require('../Assets/gallery.png')}
                      style={styles.camera}
                    />
                    <Text style={{color: Color.black}}>Gallery</Text>
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Register;

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
