import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import COLORS from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../Constant/Color';

const CELL_COUNT = 6;

const OTP = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setdata] = useState(false);
  const toggleModal = () => {
    setdata(true);
    setModalVisible(!isModalVisible);
  };

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.buttonColor}}>
      <View style={{flex: 1}}>
        <View
          style={{
            width: 35,
            backgroundColor: COLORS.backgroundColor,
            padding: 7,
            borderRadius: 60,
            top: 10,
            marginLeft: 10,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack('')}>
            <Feather name="arrow-left" size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View
          style={{marginVertical: 22, marginHorizontal: 22, paddingTop: 25}}>
          <Text style={styles.welcome}>Phone Verification ! 👋</Text>
        </View>

        <View style={styles.logins}>
          <View style={styles.root}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                textAlign: 'center',
              }}>
              Please enter the code we just sent to phone ********85 !
            </Text>

            <CodeField
              ref={ref}
              {...props}
              caretHidden={false}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete={Platform.select({
                android: 'sms-otp',
                default: 'one-time-code',
              })}
              testID="my-code-input"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <AnimatedButton
              title="Verify"
              style={{
                marginTop: 28,
                marginBottom: 4,
              }}
              onPress={() => {
                navigation.navigate('Register');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    color: COLORS.black,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
  },
  logins: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 20,
    paddingVertical: 50,
    marginTop: 50,
    borderTopLeftRadius: 120,
  },
  icons: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 40},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderColor: Color.grey,
    borderWidth: 1,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 12,
  },
  focusCell: {
    borderColor: '#000',
  },
});

export default OTP;
