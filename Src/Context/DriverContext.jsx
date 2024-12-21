// DriverContext.js
import React, {createContext, useState, useContext, useEffect} from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DriverContext = createContext();

const SOCKET_SERVER_URL = 'http://192.168.1.19:8051'; // Replace with your server URL

export const DriverProvider = ({children}) => {
  const [driverId, setDriverId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);

  useEffect(() => {
    if (driverId) {
      // Setup Socket.IO connection
      const socketConnection = io(SOCKET_SERVER_URL);
      setSocket(socketConnection);

      // Emit driver join event
      socketConnection.emit('driverJoin', {driverId, location: driverLocation});
      // console.log('driver', driverId);

      // Cleanup on unmount
      return () => {
        socketConnection.disconnect();
      };
    }
  }, [driverId]);
  // console.log('driver', driverId);
  const getLocation = location => {
    setDriverLocation(location);
  };

  const acceptRide = () => {
    if (socket && rideRequest) {
      socket.emit('driverResponse', {
        rideId: rideRequest?._id,
        accepted: true,
      });

      setRideRequest(null); // Clear the ride request after accepting
    }
  };

  const rejectRide = () => {
    if (socket && rideRequest) {
      socket.emit('driverResponse', {
        rideId: rideRequest?._id,
        accepted: false,
      });

      setRideRequest(null); // Clear the ride request after rejecting
    }
  };

  return (
    <DriverContext.Provider
      value={{
        driverId,
        setDriverId,
        socket,
        driverLocation,
        getLocation,
        rideRequest,
        setRideRequest,
        acceptRide,
        rejectRide,
      }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriverContext = () => useContext(DriverContext);
