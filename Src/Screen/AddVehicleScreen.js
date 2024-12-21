import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../Constant/Color';
import {launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedButton from '../Constant/Button';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const AddVehicleScreen = ({navigation, route}) => {
  const {driverID} = route.params || '';
  console.log('driver', driverID);
  const [profile, setprofile] = useState();
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setprofile(response.assets[0]);
      }
    });
  };

  const [show, setShow] = useState(false);
  const [vehicleregistration, setvehicleregistration] = useState(new Date());
  const [insurancedate, setinsurancedate] = useState(new Date());
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || vehicleregistration;
    setShow(Platform.OS === 'ios');
    setvehicleregistration(currentDate);
  };
  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || insurancedate;
    setShow(Platform.OS === 'ios');
    setinsurancedate(currentDate);
  };
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [brand, setBrand] = useState('');
  const [vehiclemodel, setVehiclemodel] = useState('');
  const [vehicleColor, setVhicleColor] = useState('');
  const [fueltype, setfueltype] = useState('');
  const [vehicleNumber, setvehicleNumber] = useState('');
  const [seat, setSeat] = useState('');

  const [rcdoc, setrcdoc] = useState('');
  const [emissiondoc, setemissiondoc] = useState('');

  const [AllCategory, setAllCategory] = useState([]);

  const getCategory = async () => {
    try {
      let res = await axios.get(
        'http://192.168.1.19:8051/api/v1/admin/getvehicle',
      );

      if (res.status == 200) {
        setAllCategory(res.data.success);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [Allbrand, setAllbrands] = useState([]);
  const getAllbrands = async () => {
    try {
      let res = await axios.get(
        'http://192.168.1.19:8051/api/v1/admin/getVehiclebrand',
      );

      if (res.status == 200) {
        setAllbrands(res.data.success);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
    getAllbrands();
  }, []);

  const handleChooseDoc = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setrcdoc(response.assets[0]);
      }
    });
  };
  const handleChooseEmission = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setemissiondoc(response.assets[0]);
      }
    });
  };

  const addVehicle = async () => {
    if (!selectedLanguage)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select vehicle catrgory!',
      });
    if (!brand)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select vehicle brand!',
      });
    if (!fueltype)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select vehicle fuel type!',
      });
    if (!vehicleColor)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter vehicle color!',
      });
    if (!seat)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter vehicle seat!',
      });
    if (!vehicleNumber)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter vehicle number!',
      });

    if (!profile)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select vehicle image!',
      });
    if (!rcdoc)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select vehicle rc document!',
      });

    if (!emissiondoc)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please select vehicle emission document!',
      });
    const formData = new FormData();
    formData.append('vehicaltype', selectedLanguage);
    formData.append('brand', brand);
    formData.append('driverId', driverID);
    formData.append('model', vehiclemodel);
    formData.append('fueltype', fueltype);
    formData.append('color', vehicleColor);
    formData.append('seat', seat);
    let reg = moment(vehicleregistration).format('DD-MM-YYYY');
    formData.append('regno', reg);
    formData.append('vehicleNumber', vehicleNumber);
    let inc = moment(insurancedate).format('DD-MM-YYYY');
    formData.append('insurancedate', inc);
    formData.append('vehicalimage', {
      name: profile.fileName,
      type: profile.type,
      uri:
        Platform.OS === 'ios'
          ? profile.uri.replace('file://', '')
          : profile.uri,
    });
    formData.append('insurandoc', {
      name: rcdoc.fileName,
      type: rcdoc.type,
      uri: Platform.OS === 'ios' ? rcdoc.uri.replace('file://', '') : rcdoc.uri,
    });
    formData.append('emissiondoc', {
      name: emissiondoc.fileName,
      type: emissiondoc.type,
      uri:
        Platform.OS === 'ios'
          ? emissiondoc.uri.replace('file://', '')
          : emissiondoc.uri,
    });
    formData.append('rcdoc', {
      name: rcdoc.fileName,
      type: rcdoc.type,
      uri: Platform.OS === 'ios' ? rcdoc.uri.replace('file://', '') : rcdoc.uri,
    });
    try {
      // Send the POST request using Axios
      const response = await axios.post(
        'http://192.168.1.19:8051/api/v1/driver/postvehicle',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          Accept: 'application/json',
        },
      );
      if (response.status == 200) {
        await AsyncStorage.setItem(
          'driver',
          JSON.stringify(response.data.driver),
        );
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Successfully Aadded vehicle details',
          button: 'Ok!',
        });
        await setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      }
      // Process the response
    } catch (error) {
      // console.error('Error in addVehicle:', error.message);

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
              Add Vehicle Details
            </Text>
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
                  Vehicle Category
                </Text>

                <Picker
                  style={styles.input}
                  selectedValue={selectedLanguage}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedLanguage(itemValue)
                  }>
                  <Picker.Item
                    label="Select Vehicle Category"
                    value="Select Vehicle Category"
                  />
                  {AllCategory?.map(ele => {
                    return (
                      <Picker.Item
                        label={ele?.vehicletype}
                        value={ele?.vehicletype}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  Vehicle Brand
                </Text>

                <Picker
                  style={styles.input}
                  selectedValue={brand}
                  onValueChange={(itemValue, itemIndex) => setBrand(itemValue)}>
                  <Picker.Item
                    label="Select Vehicle Brand"
                    value="Select Vehicle Brand"
                  />
                  {Allbrand?.filter(
                    ele => ele?.vehiclecategory == selectedLanguage,
                  )?.map(item => {
                    return (
                      <Picker.Item
                        label={item?.vehiclebrand}
                        value={item?.vehiclebrand}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  Vehicle Model
                </Text>

                <Picker
                  style={styles.input}
                  selectedValue={vehiclemodel}
                  onValueChange={(itemValue, itemIndex) =>
                    setVehiclemodel(itemValue)
                  }>
                  <Picker.Item
                    label="Select  Vehicle Modal"
                    value="Select  Vehicle Modal"
                  />
                  {Allbrand?.filter(
                    ele =>
                      ele?.vehiclecategory === selectedLanguage &&
                      ele?.vehiclebrand === brand,
                  )?.flatMap(item =>
                    item?.vehiclemodel?.map(a => (
                      <Picker.Item
                        key={a?.model}
                        label={a?.model}
                        value={a?.model}
                      />
                    )),
                  )}
                </Picker>
              </View>
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  Select Fuel Type
                </Text>

                <Picker
                  style={styles.input}
                  selectedValue={fueltype}
                  onValueChange={(itemValue, itemIndex) =>
                    setfueltype(itemValue)
                  }>
                  <Picker.Item
                    label="Select Fuel Type"
                    value="Select Fuel Type"
                  />
                  <Picker.Item label="Petrol" value="Petrol" />
                  <Picker.Item label="Diesel" value="Diesel" />
                  <Picker.Item label="Gasoline" value="Gasoline" />
                  <Picker.Item label="Electric" value="Electric" />
                </Picker>
              </View>
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  Vehicle Color
                </Text>
                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter your vehicle color"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
                    value={vehicleColor}
                    onChangeText={vehicleColor => setVhicleColor(vehicleColor)}
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
                  Vehicle Number
                </Text>
                <View style={styles.input}>
                  <TextInput
                    placeholder="KA02 SD 2034"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
                    value={vehicleNumber}
                    onChangeText={vehicleNumber =>
                      setvehicleNumber(vehicleNumber)
                    }
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
                  Vehicle Seat
                </Text>
                <View style={styles.input}>
                  <TextInput
                    placeholder="Enter inside vehicle seat"
                    placeholderTextColor={Color.black}
                    keyboardType="default"
                    style={{
                      width: '100%',
                    }}
                    value={seat}
                    onChangeText={seat => setSeat(seat)}
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
                  Vehicle Registration Date
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      marginLeft: 0,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    },
                  ]}>
                  <TouchableOpacity onPress={() => setShow(true)}>
                    <Text style={{fontSize: 16, color: 'black'}}>
                      {moment(vehicleregistration.toString()).format(
                        'DD-MM-YYYY',
                      )}
                    </Text>
                  </TouchableOpacity>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={vehicleregistration}
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
                  Vehicle Insurance Date
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      marginLeft: 0,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    },
                  ]}>
                  <TouchableOpacity onPress={() => setShow(true)}>
                    <Text style={{fontSize: 16, color: 'black'}}>
                      {moment(insurancedate.toString()).format('MM-DD-YY')}
                    </Text>
                  </TouchableOpacity>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={insurancedate}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onChange2}
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
                  Vehicle Image
                </Text>
                {profile ? (
                  <View style={{marginTop: 8}}>
                    <Image
                      source={{uri: profile.uri}}
                      style={{width: 100, height: 100, borderRadius: 8}}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    <Text style={{color: 'black'}}>
                      {' '}
                      Upload your Vehicle Image
                    </Text>
                    <TouchableOpacity onPress={handleChoosePhoto}>
                      <Text style={styles.upload}>Upload</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  RC Doc
                </Text>
                {rcdoc ? (
                  <View style={{marginTop: 8}}>
                    <Image
                      source={{uri: rcdoc.uri}}
                      style={{width: 100, height: 100, borderRadius: 8}}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    <Text style={{color: 'black'}}> Upload your RC</Text>
                    <TouchableOpacity onPress={handleChooseDoc}>
                      <Text style={styles.upload}>Upload</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginVertical: 8,
                    color: Color.black,
                  }}>
                  Emission Doc
                </Text>
                {emissiondoc ? (
                  <View style={{marginTop: 8}}>
                    <Image
                      source={{uri: emissiondoc.uri}}
                      style={{width: 100, height: 100, borderRadius: 8}}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.input,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    <Text style={{color: 'black'}}> Upload your Emission</Text>
                    <TouchableOpacity onPress={handleChooseEmission}>
                      <Text style={styles.upload}>Upload</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <AnimatedButton
                title="Add Vehicle"
                onPress={() => addVehicle()}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default AddVehicleScreen;

const styles = StyleSheet.create({
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
});
