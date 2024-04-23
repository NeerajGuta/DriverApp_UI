import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from '../Constant/Color';

const BookingHistory = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <ScrollView>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '400',
              color: 'black',
              paddingLeft: 10,
            }}>
            BookingHistory
          </Text>
          <View style={{width: 120}}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
              }>
              <Picker.Item label="Today" value="Today" />
            </Picker>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,
            elevation: 23,
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
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
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: 'black',
                  }}>
                  {' '}
                  Singapura Village, Varadharaja Nagar, Bengaluru, Karnataka
                  560014, India
                </Text>
              </View>
              <View>
                <Text
                  style={{paddingBottom: 2, fontSize: 15, fontWeight: '600'}}>
                  End Location
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: 'black',
                  }}>
                  Singapura Village, Varadharaja Nagar, Bengaluru, Karnataka
                  560014, India
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Color.buttonColor,
              padding: 5,
            }}>
            <View style={{flexDirection: 'row', gap: 10, paddingVertical: 7}}>
              <Fontisto name="date" size={20} color="black" />
              <Text style={{color: 'black', fontWeight: '600'}}>
                22 April 2024
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 12, paddingVertical: 7}}>
              <FontAwesome name="rupee" size={20} color="black" />
              <Text style={{color: 'black', fontWeight: '600'}}>
                Price : 234
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default BookingHistory;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
