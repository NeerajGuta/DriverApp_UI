import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Splacescreen from '../Screen/Splacescreen';
import Phone from '../Screen/Phone';
import OTP from '../Screen/OTP';
import Register from '../Screen/Register';
import AddVehicleScreen from '../Screen/AddVehicleScreen';
import Home from '../Screen/Home';
import VerifyOtp from '../Screen/VerifyOtp';
import DropLocation from '../Screen/DropLocation';
import Menu from '../Screen/Menu';
import BookingHistory from '../Screen/BookingHistory';
import Wallet from '../Screen/Wallet';
import Profile from '../Screen/Profile';
import DriverTracking from '../Screen/DriverTracking';
import ChangePassword from '../Screen/ChangePassword';
import ChangeOtp from '../Screen/ChangeOtp';
import NewPassword from '../Screen/NewPassword';
import PaymentHistory from '../Screen/PaymentHistory';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={Menu}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splacescreen">
        <Stack.Screen
          name="Splacescreen"
          component={Splacescreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Phone"
          component={Phone}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddVehicleScreen"
          component={AddVehicleScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={MyDrawer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VerifyOtp"
          component={VerifyOtp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DropLocation"
          component={DropLocation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingHistory"
          component={BookingHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DriverTracking"
          component={DriverTracking}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangeOtp"
          component={ChangeOtp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentHistory"
          component={PaymentHistory}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
