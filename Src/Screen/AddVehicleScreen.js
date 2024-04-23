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

const AddVehicleScreen = ({navigation}) => {
  const [profile, setprofile] = useState();
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setprofile(response.assets[0]);
      }
    });
  };
  // country,state,city

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

  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
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
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Vehicle Brand
              </Text>

              <Picker
                style={styles.input}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                }>
                <Picker.Item
                  label="Select Vehicle Brand"
                  value="Select Vehicle Brand"
                />
                <Picker.Item label="Toyota" value="Toyota" />
                <Picker.Item label="Tata" value="Tata" />
                <Picker.Item label="MarutiSuzuki" value="MarutiSuzuki" />
              </Picker>
            </View>
            <View style={{marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Vehicle Modal
              </Text>

              <Picker
                style={styles.input}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                }>
                <Picker.Item
                  label="Select  Vehicle Modal"
                  value="Select  Vehicle Modal"
                />
                <Picker.Item label="Toyota" value="Toyota" />
                <Picker.Item label="Tata" value="Tata" />
                <Picker.Item label="MarutiSuzuki" value="MarutiSuzuki" />
              </Picker>
            </View>
            <View style={{marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Select Fuel Type
              </Text>

              <Picker
                style={styles.input}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
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
                  fontWeight: 400,
                  marginVertical: 8,
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
                />
              </View>
            </View>
            <View style={{marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Vehicle Registration Date
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
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Vehicle Insurance Date
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
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Driver License Doc
              </Text>

              <View
                style={[
                  styles.input,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text style={{color: 'black'}}>
                  {' '}
                  Uplaod your Driver License
                </Text>
                <TouchableOpacity onPress={handleChoosePhoto}>
                  <Text style={styles.upload}>Uplaod</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                RC Doc
              </Text>

              <View
                style={[
                  styles.input,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text style={{color: 'black'}}> Uplaod your RC</Text>
                <TouchableOpacity onPress={handleChoosePhoto}>
                  <Text style={styles.upload}>Uplaod</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Emission Doc
              </Text>

              <View
                style={[
                  styles.input,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text style={{color: 'black'}}> Uplaod your Emission</Text>
                <TouchableOpacity onPress={handleChoosePhoto}>
                  <Text style={styles.upload}>Uplaod</Text>
                </TouchableOpacity>
              </View>
            </View>

            <AnimatedButton
              title="Add Vehicle"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
