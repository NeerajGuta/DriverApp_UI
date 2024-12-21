import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDriverContext} from '../Context/DriverContext';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import moment from 'moment';
import axios from 'axios';

const Payment = ({navigation}) => {
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

  const pickUpPlace = '123 Main St, Springfield';
  const dropPlace = '456 Elm St, Shelbyville';
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [paymethod, setPayMethod] = useState(''); // Track selected payment method

  useEffect(() => {
    const check = async () => {
      let data = await AsyncStorage.getItem('ride');
      if (data) {
        data = JSON.parse(data);
        setRideRequest(data?.ride);
      }
    };
    check();
  }, []);

  console.log('paymethod', paymethod);

  const handlePayment = async () => {
    if (!paymethod) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Select Payment Method',
        textBody: 'Please select a payment method (Online or Cash).',
        button: 'Ok',
      });
      return;
    }

    try {
      const config = {
        url: '/updatebooking/' + rideRequest?._id,
        method: 'patch',
        baseURL: 'http://192.168.1.19:8051/api/v1/user',
        headers: {'Content-Type': 'application/json'},
        data: {
          tripStatus: 'Payment Completed',
          completeDate: moment().format('LT'),
          payAmount: rideRequest?.totalfare,
          paymenttype: paymethod, // Send selected payment method to backend
          paymentstatus: 'completed',
        },
      };
      let res = await axios(config);
      if (res.status == 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Successfully completed your payment.',
          button: 'Ok',
        });
        setRideRequest(null);
        await AsyncStorage.removeItem('ride');
        setTimeout(() => {
          navigation.navigate('Home');
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <Text style={styles.paymentAmount}>
          Amount to Pay:{' '}
          {rideRequest?.totalfare && rideRequest?.totalfare?.toFixed(2)}
        </Text>
        <Text style={styles.header}>Payment Details</Text>
        <Text style={styles.label}>Pick Up Place:</Text>
        <Text style={styles.displayText}>
          {rideRequest?.pickuplocation?.address}
        </Text>
        <Text style={styles.label}>Drop Place:</Text>
        <Text style={styles.displayText}>
          {rideRequest?.driverdroplocation?.address}
        </Text>

        {/* Payment Method Options */}
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={styles.checkBox}
            onPress={() =>
              setPayMethod(paymethod === 'online' ? '' : 'online')
            }>
            <Text style={styles.checkBoxText}>
              {paymethod === 'online' ? '✔' : '☐'} Online Payment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkBox}
            onPress={() => setPayMethod(paymethod === 'cash' ? '' : 'cash')}>
            <Text style={styles.checkBoxText}>
              {paymethod === 'cash' ? '✔' : '☐'} Cash Payment
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  paymentAmount: {
    width: '100%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  displayText: {
    width: '100%',
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  paymentOptions: {
    width: '100%',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkBoxText: {
    fontSize: 16,
  },
  payButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Payment;
