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
import axios from 'axios';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const Register = () => {
  const navigation = useNavigation();
  const [profile, setprofile] = useState('');
  const [aadharimg, setaadharimg] = useState('');
  const [aadharimgback, setaadharimgback] = useState('');
  const [pancardimg, setpancardimg] = useState('');
  const [pancardimgback, setpancardimgback] = useState('');
  const [driveLicense, setdriveLicense] = useState('');
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setprofile(response.assets[0]);
      }
    });
  };
  // country,state,city
  const [selectedItem, setselectedItem] = useState('');

  const [selectedCountry, setSelectedCountry] = useState(null);
  console.log(selectedCountry, 'selectedCountry');

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
  console.log(date, 'DATE');

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

  const handleChoosePhotoaadhar = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setaadharimg(response.assets[0]);
      }
    });
  };

  const handleChoosePhotoaadharback = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setaadharimgback(response.assets[0]);
      }
    });
  };
  const handleChoosePhotopan = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setpancardimg(response.assets[0]);
      }
    });
  };
  const handleChoosePhotopanback = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setpancardimgback(response.assets[0]);
      }
    });
  };
  const handleChooseLicense = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setdriveLicense(response.assets[0]);
      }
    });
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [houseno, setHouseno] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [aadharno, setAadharno] = useState('');
  const [pancardno, setPancardno] = useState('');
  const [imageSource, setImageSource] = useState(null);

  const Register = async () => {
    if (!name)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter your name!',
      });
    if (!email)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter your email ID!',
      });
    if (!phone)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter your mobile number!',
      });
    if (!password)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter your password!',
      });

    if (!password)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter your password!',
      });
    if (!date)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select your date of birth!',
      });
    if (!selectedCountry?.name)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select your country!',
      });

    if (!selectedState)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select your state!',
      });

    if (!selectedCity)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select your city!',
      });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phone);
    formData.append('password', password);
    formData.append('gender', selectedItem.title);
    let dob = moment(date).format('DD-MM-YYYY');
    formData.append('datebirth', dob);
    formData.append('address', address);
    formData.append('country', selectedCountry?.name);
    formData.append('state', selectedState);
    formData.append('city', selectedCity);
    formData.append('aadharno', aadharno);
    formData.append('pancardno', pancardno);
    formData.append('lat', '2.348208420');
    formData.append('long', '2.304032');
    formData.append('profileimage', {
      name: profile.fileName,
      type: profile.type,
      uri:
        Platform.OS === 'ios'
          ? profile.uri.replace('file://', '')
          : profile.uri,
    });
    formData.append('aadharimg', {
      name: aadharimg.fileName,
      type: aadharimg.type,
      uri:
        Platform.OS === 'ios'
          ? aadharimg.uri.replace('file://', '')
          : aadharimg.uri,
    });
    formData.append('aadharimgback', {
      name: aadharimgback.fileName,
      type: aadharimgback.type,
      uri:
        Platform.OS === 'ios'
          ? aadharimgback.uri.replace('file://', '')
          : aadharimgback.uri,
    });

    formData.append('pancardimg', {
      name: pancardimg.fileName,
      type: pancardimg.type,
      uri:
        Platform.OS === 'ios'
          ? pancardimg.uri.replace('file://', '')
          : pancardimg.uri,
    });
    formData.append('pancardimgback', {
      name: pancardimgback.fileName,
      type: pancardimgback.type,
      uri:
        Platform.OS === 'ios'
          ? pancardimgback.uri.replace('file://', '')
          : pancardimgback.uri,
    });
    formData.append('driveLicense', {
      name: driveLicense.fileName,
      type: driveLicense.type,
      uri:
        Platform.OS === 'ios'
          ? driveLicense.uri.replace('file://', '')
          : driveLicense.uri,
    });

    try {
      const res = await axios.post(
        'http://192.168.1.19:8051/api/v1/driver/signup',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          Accept: 'application/json',
        },
      );

      if (res.status === 200) {
        navigation.navigate('AddVehicleScreen', {
          driverID: res.data.newDriver?._id,
        });
      }
    } catch (error) {
      if (error.response) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: error.response.data?.error || 'Something went wrong!',
          button: 'Try Again!',
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error('Request Error:', error.request);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'No response from server. Please try again later.',
          button: 'Try Again!',
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: error.message || 'An unknown error occurred.',
          button: 'Try Again!',
        });
      }
    }
  };
  console.log(moment(date).format('DD-MM-YYYY'));

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
                      value={name}
                      onChangeText={name => setName(name)}
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
                      value={phone}
                      onChangeText={phone => setPhone(phone)}
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
                        console.log(selectedItem.title, index);
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
                {/* <View style={{marginBottom: 8}}>
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
                      value={houseno}
                      onChangeText={houseno => setHouseno(houseno)}
                    />
                  </View>
                </View> */}
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
                      value={address}
                      onChangeText={address => setAddress(address)}
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
                    Aadhar Card No
                  </Text>

                  <View style={styles.input}>
                    <TextInput
                      placeholder="Enter your aadhar card no"
                      placeholderTextColor={Color.black}
                      value={aadharno}
                      onChangeText={aadharno => setAadharno(aadharno)}
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
                      value={pancardno}
                      onChangeText={pancardno => setPancardno(pancardno)}
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
                    Aadhar Card Front Copy
                  </Text>

                  <View
                    style={[
                      aadharimg ? '' : styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    {aadharimg ? (
                      <View style={{marginTop: 8}}>
                        <Image
                          source={{uri: aadharimg.uri}}
                          style={{width: 100, height: 100, borderRadius: 8}}
                        />
                      </View>
                    ) : (
                      <>
                        <Text style={{color: 'black'}}>
                          Upload your Aadhar Card
                        </Text>
                        <TouchableOpacity onPress={handleChoosePhotoaadhar}>
                          <Text style={styles.upload}>Upload</Text>
                        </TouchableOpacity>
                      </>
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
                    Aadhar Card Back Copy
                  </Text>

                  <View
                    style={[
                      aadharimgback ? '' : styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    {aadharimgback ? (
                      <View style={{marginTop: 8}}>
                        <Image
                          source={{uri: aadharimgback.uri}}
                          style={{width: 100, height: 100, borderRadius: 8}}
                        />
                      </View>
                    ) : (
                      <>
                        <Text style={{color: 'black'}}>
                          {' '}
                          Upload your aadhar Card
                        </Text>
                        <TouchableOpacity onPress={handleChoosePhotoaadharback}>
                          <Text style={styles.upload}>Upload</Text>
                        </TouchableOpacity>
                      </>
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
                    Pan Card Front Copy
                  </Text>

                  <View
                    style={[
                      pancardimg ? '' : styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    {pancardimg ? (
                      <View style={{marginTop: 8}}>
                        <Image
                          source={{uri: pancardimg.uri}}
                          style={{width: 100, height: 100, borderRadius: 8}}
                        />
                      </View>
                    ) : (
                      <>
                        <Text style={{color: 'black'}}>
                          {' '}
                          Upload your Pan Card
                        </Text>
                        <TouchableOpacity onPress={handleChoosePhotopan}>
                          <Text style={styles.upload}>Upload</Text>
                        </TouchableOpacity>
                      </>
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
                    Pan Card Back Copy
                  </Text>

                  <View
                    style={[
                      pancardimgback ? '' : styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    {pancardimgback ? (
                      <View style={{marginTop: 8}}>
                        <Image
                          source={{uri: pancardimgback.uri}}
                          style={{width: 100, height: 100, borderRadius: 8}}
                        />
                      </View>
                    ) : (
                      <>
                        <Text style={{color: 'black'}}>
                          {' '}
                          Upload your Pan Card
                        </Text>
                        <TouchableOpacity onPress={handleChoosePhotopanback}>
                          <Text style={styles.upload}>Upload</Text>
                        </TouchableOpacity>
                      </>
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
                    Driver License
                  </Text>

                  <View
                    style={[
                      driveLicense ? '' : styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    {driveLicense ? (
                      <View style={{marginTop: 8}}>
                        <Image
                          source={{uri: driveLicense.uri}}
                          style={{width: 100, height: 100, borderRadius: 8}}
                        />
                      </View>
                    ) : (
                      <>
                        <Text style={{color: 'black'}}>
                          Upload your Driver License
                        </Text>
                        <TouchableOpacity onPress={handleChooseLicense}>
                          <Text style={styles.upload}>Upload</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                <AnimatedButton title="Register" onPress={() => Register()} />
              </View>
            </ScrollView>

            {/* <BottomSheetModalProvider>
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
          </BottomSheetModalProvider> */}
            {/* 2 */}
            {/* <BottomSheetModalProvider>
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
                    onPress={takePhotoFromCamera2}
                    style={styles.gallercam}>
                    <Image
                      source={require('../Assets/camera.png')}
                      style={styles.camera}
                    />
                    <Text style={{color: Color.black}}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onselect3}
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
          </BottomSheetModalProvider> */}
            {/* 3 */}
            {/* <BottomSheetModalProvider>
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
                    onPress={takePhotoFromCamera3}
                    style={styles.gallercam}>
                    <Image
                      source={require('../Assets/camera.png')}
                      style={styles.camera}
                    />
                    <Text style={{color: Color.black}}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onselectpan}
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
          </BottomSheetModalProvider> */}
            {/* 4 */}
            {/* <BottomSheetModalProvider>
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
                    onPress={takePhotoFromCamera4}
                    style={styles.gallercam}>
                    <Image
                      source={require('../Assets/camera.png')}
                      style={styles.camera}
                    />
                    <Text style={{color: Color.black}}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onselectpanback}
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
          </BottomSheetModalProvider> */}
            {/* 5 */}
            {/* <BottomSheetModalProvider>
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
                    onPress={takePhotoFromCamera5}
                    style={styles.gallercam}>
                    <Image
                      source={require('../Assets/camera.png')}
                      style={styles.camera}
                    />
                    <Text style={{color: Color.black}}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onselectdriveLicense}
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
          </BottomSheetModalProvider> */}
          </View>
        </SafeAreaView>
      </AlertNotificationRoot>
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
