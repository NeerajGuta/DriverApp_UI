import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Color from '../Constant/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnimatedButton from '../Constant/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import {useFocusEffect} from '@react-navigation/native';

import axios from 'axios';

const Wallet = ({navigation}) => {
  // const data = [
  //   {
  //     id: 1,
  //     title: 'Money Added to wallet',
  //     time: '27 March | 7:30 PM',
  //     price: 2000.0,
  //     balance: 12000.0,
  //   },
  //   {
  //     id: 2,
  //     title: 'Booking No #4344',
  //     time: '31 March | 9:30 PM',
  //     price: 2000.0,
  //     balance: 12000.0,
  //   },
  //   {
  //     id: 3,
  //     title: 'Money Added to wallet',
  //     time: '27 March | 7:30 PM',
  //     price: 2000.0,
  //     balance: 12000.0,
  //   },
  //   {
  //     id: 1,
  //     title: 'Money Added to wallet',
  //     time: '27 March | 7:30 PM',
  //     price: 2000.0,
  //     balance: 12000.0,
  //   },
  //   {
  //     id: 2,
  //     title: 'Booking No #4344',
  //     time: '31 March | 9:30 PM',
  //     price: 2000.0,
  //     balance: 12000.0,
  //   },
  //   {
  //     id: 3,
  //     title: 'Money Added to wallet',
  //     time: '27 March | 7:30 PM',
  //     price: 2000.0,
  //     balance: 12000.0,
  //   },
  // ];

  const [driverData, setDriverData] = useState({});
  const [amout, setamount] = useState(0);
  const [walletdata, setwalletdata] = useState({});
  const [data, setdata] = useState([]);
  const getAllwallets = async id => {
    try {
      let res = await axios.get(
        'http://192.168.1.19:8051/api/v1/driver/getwalletbyid/' + id,
      );
      if (res.status == 200) {
        setwalletdata(res.data.success);
        setamount(res.data.success?.amount || 0);
        if (res.data.success?.transactions) {
          setdata(res.data.success?.transactions?.reverse());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkDriverStatus = async () => {
        try {
          let driver = await AsyncStorage.getItem('driver');

          if (driver) {
            driver = JSON.parse(driver);
            setDriverData(driver);
            getAllwallets(driver?._id);
          }
        } catch (error) {
          console.error('Error fetching driver data:', error);
        }
      };

      checkDriverStatus();

      return () => {
        console.log('Screen is unfocused, timeout cleared.');
      };
    }, []),
  );

  const [money, setMoney] = useState('');
  const handleAdd = () => {
    setMoney(!money);
  };

  const [addamount, setaddAmount] = useState('');

  const addWalletAmout = async () => {
    if (!addamount)
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Please enter your amount',
      });
    try {
      let res = await axios.post(
        'http://192.168.1.19:8051/api/v1/driver/adddriverwallet',
        {
          driverId: driverData?._id,
          title: 'Add to wallet',
          amount: parseInt(addamount),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.status == 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Successfully added money',
          button: 'Ok',
        });
        setaddAmount('');
        handleAdd();
        getAllwallets(driverData?._id);
      }
    } catch (error) {
      console.log(error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.response.data.error,
        button: 'Try Again',
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={{flex: 1, backgroundColor: Color.backgroundColor}}>
        <View style={styles.boxes}>
          <View style={styles.conatiner}>
            <View>
              <Text style={styles.text}>Wallet Balance</Text>
              <Text style={styles.text}>₹. {amout?.toFixed(2)}</Text>
            </View>
            <AntDesign name="wallet" size={30} color={Color.buttonColor} />
          </View>
          {money ? (
            <View style={{marginBottom: 2}}>
              <View style={styles.input}>
                <TextInput
                  placeholder="E.g 500"
                  placeholderTextColor={Color.black}
                  style={{
                    width: '100%',
                  }}
                  value={addamount}
                  onChangeText={addamount => setaddAmount(addamount)}
                />
              </View>
            </View>
          ) : (
            <></>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AnimatedButton
              title={money ? 'Submit' : 'Add Money'}
              onPress={() => (money ? addWalletAmout() : handleAdd())}
            />
            <AnimatedButton
              title={money ? 'Close' : 'Transfer Money'}
              onPress={handleAdd}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <View style={styles.containt}>
                <View>
                  <Text
                    style={{
                      ...styles.text1,
                      color: item?.type == 'credit' ? 'green' : 'red',
                    }}>
                    {item?.title}
                  </Text>
                  <Text style={styles.blasnce}>{item?.date}</Text>
                </View>
                <View>
                  {item?.type == 'credit' ? (
                    <Text style={{alignSelf: 'flex-end', color: 'green'}}>
                      + ₹{item?.amount}
                    </Text>
                  ) : (
                    <Text style={{alignSelf: 'flex-end', color: 'red'}}>
                      - ₹{item?.amount}
                    </Text>
                  )}

                  <Text style={styles.blasnce}>
                    Balance ₹{item?.balanceAfterTransaction}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxes: {
    // marginVertical: 10,
    // marginHorizontal: 25,
    backgroundColor: '#f2f2f2',
    minHeight: 200,
    padding: 25,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: Color.black,
    paddingVertical: 3,
  },
  containt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    padding: 20,
    borderColor: Color.grey,
    borderRadius: 5,
  },
  text1: {
    fontSize: 15,
    color: Color.black,
    fontWeight: '500',
  },
  blasnce: {
    fontSize: 13,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: Color.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    marginTop: 10,
  },
});
