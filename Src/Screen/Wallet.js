import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../Constant/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnimatedButton from '../Constant/Button';

const Wallet = () => {
  const data = [
    {
      id: 1,
      title: 'Money Added to wallet',
      time: '27 March | 7:30 PM',
      price: 2000.0,
      balance: 12000.0,
    },
    {
      id: 2,
      title: 'Booking No #4344',
      time: '31 March | 9:30 PM',
      price: 2000.0,
      balance: 12000.0,
    },
    {
      id: 3,
      title: 'Money Added to wallet',
      time: '27 March | 7:30 PM',
      price: 2000.0,
      balance: 12000.0,
    },
    {
      id: 1,
      title: 'Money Added to wallet',
      time: '27 March | 7:30 PM',
      price: 2000.0,
      balance: 12000.0,
    },
    {
      id: 2,
      title: 'Booking No #4344',
      time: '31 March | 9:30 PM',
      price: 2000.0,
      balance: 12000.0,
    },
    {
      id: 3,
      title: 'Money Added to wallet',
      time: '27 March | 7:30 PM',
      price: 2000.0,
      balance: 12000.0,
    },
  ];
  const [money, setMoney] = useState('');
  const handleAdd = () => {
    setMoney(!money);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.backgroundColor}}>
      <View style={styles.boxes}>
        <View style={styles.conatiner}>
          <View>
            <Text style={styles.text}>Wallet Balance</Text>
            <Text style={styles.text}>₹12000.00</Text>
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
              />
            </View>
          </View>
        ) : (
          <></>
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AnimatedButton title="Add Money" onPress={handleAdd} />
          <AnimatedButton title="Transfer Money" />
        </View>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <View style={styles.containt}>
              <View>
                <Text style={styles.text1}>{item?.title}</Text>
                <Text style={styles.blasnce}>{item?.time}</Text>
              </View>
              <View>
                <Text style={{alignSelf: 'flex-end'}}>₹{item?.price}</Text>
                <Text style={styles.blasnce}>Balance ₹{item?.balance}</Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
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
