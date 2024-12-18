import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Payment = () => {
  const pickUpPlace = '123 Main St, Springfield';
  const dropPlace = '456 Elm St, Shelbyville';

  const handlePayment = () => {
    // Handle payment logic here
    alert('Payment processed');
  };
  const paymentAmount = 220;
  return (
    <View style={styles.container}>
      <Text style={styles.paymentAmount}>Amount to Pay:{paymentAmount}</Text>
      <Text style={styles.header}>Payment Details</Text>
      <Text style={styles.label}>Pick Up Place:</Text>
      <Text style={styles.displayText}>{pickUpPlace}</Text>
      <Text style={styles.label}>Drop Place:</Text>
      <Text style={styles.displayText}>{dropPlace}</Text>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
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
