import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Color from '../Constant/Color';

const PaymentHistory = () => {
  return (
    <SafeAreaView styles={{flex: 1, backgroundColor: Color.backgroundColor}}>
      <ScrollView>
        <View style={styles.loaction}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Color.buttonColor,
              padding: 8,
            }}>
            <Text style={{fontSize: 17, color: Color.black}}>
              Id : 49639473463
            </Text>
            <Text style={{fontSize: 17, color: Color.black}}>
              12 April 2024
            </Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={styles.paymentlocation}>
              From : Singapura Village, Varadharaja Nagar, Bengaluru,{' '}
            </Text>
            <Text style={styles.paymentlocation}>
              End : Singapura Village, Varadharaja Nagar, Bengaluru,{' '}
            </Text>
            <Text style={styles.paymentlocation}>
              Payment Id : t34h284348443
            </Text>
            <Text style={styles.paymentlocation}>Payment Status : Pending</Text>
            <Text style={styles.paymentlocation}>Payment : ₹ 454</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  loaction: {
    marginHorizontal: 5,
    backgroundColor: Color.backgroundColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  paymentlocation: {color: Color.black, fontSize: 16},
});
