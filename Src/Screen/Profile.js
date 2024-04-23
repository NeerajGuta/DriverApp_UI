import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../Constant/Color';
import AnimatedButton from '../Constant/Button';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import Color from '../Constant/Color';
const Profile = ({navigation}) => {
  const [profile, setprofile] = useState();
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setprofile(response.assets[0]);
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.buttonColor}}>
      <ScrollView>
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
          <View style={styles.profile}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
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
                <FeatherIcon color="#fff" name="edit-3" size={15} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.profileName}>Raghavendra Chaubey</Text>
              <Text style={styles.profileAddress}>
                123 Maple Street. Singapura, Bangalore
              </Text>
            </View>
          </View>

          <View style={styles.logins}>
            <Text style={styles.details}>
              User Name : <Text>Raghavendra Chaubey</Text>
            </Text>
            <Text style={styles.details}>
              Email : <Text>parnetstech8@gmail.com</Text>
            </Text>

            <Text style={styles.details}>
              Mobile No : <Text>9473925485</Text>
            </Text>
            <Text style={styles.details}>
              Gender : <Text>Male</Text>
            </Text>
            <Text style={styles.details}>
              Address : <Text>123 Maple Street. Singapura, Bangalore</Text>
            </Text>
            <Text style={styles.details}>
              Date Of Birth : <Text>29 Dec 1998</Text>
            </Text>
            <Text style={styles.details}>
              House No : <Text>20 'B'</Text>
            </Text>
            <Text style={styles.details}>
              Country : <Text>India</Text>
            </Text>
            <Text style={styles.details}>
              State : <Text>Karnataka</Text>
            </Text>
            <Text style={styles.details}>
              City Name : <Text>Bangalore</Text>
            </Text>
            <Text style={styles.details}>
              Addhar Card No : <Text>844894383042</Text>
            </Text>
            <Text style={styles.details}>
              Pan Card No : <Text>BH94JHD0942</Text>
            </Text>
            <Text style={styles.details}>Addhar Card Copy</Text>
            <Image
              source={require('../Assets/DL.jpeg')}
              style={{height: 100, width: 300}}
              resizeMode="contain"
            />
            <Text style={styles.details}>Pan Card Copy</Text>
            <Image
              source={require('../Assets/DL.jpeg')}
              style={{height: 100, width: 300}}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
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
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    marginTop: 35,
  },
  icons: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  profile: {
    padding: 24,
    // backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
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
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  details: {
    backgroundColor: Color.backgroundColor,
    fontSize: 16,
    color: Color.black,
    padding: 14,
    borderBottomWidth: 2,
    borderColor: Color.grey,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
});

export default Profile;
