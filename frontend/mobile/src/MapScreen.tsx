import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const MapScreen = () => {
  const [position, setPosition] = useState({
    latitude: 10.04978,
    longitude: 105.77695,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
      },
      err => {
        console.log(err);
      },
    );
  }, []);

  const [confirmedLatitude, setConfirmedLatitude] = useState(null);
  const [confirmedLongitude, setConfirmedLongitude] = useState(null);
  const navigation = useNavigation();

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDRQDF3GwXpM1_rRSrvTErSCDOSxQMHFTY`,
      );
      const address = response.data.results[0].formatted_address;
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const handleConfirm = async () => {
    setConfirmedLatitude(position.latitude);
    setConfirmedLongitude(position.longitude);

    // Lấy thông tin địa chỉ từ tọa độ
    const address = await getAddressFromCoordinates(
      position.latitude,
      position.longitude,
    );
    console.log(address);

    // Chuyển hướng và truyền thông tin địa chỉ
    navigation.navigate('Đánh dấu', {
      latitude: position.latitude,
      longitude: position.longitude,
      address: address, // Truyền thông tin địa chỉ
    });
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={position}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        <Marker
          title="Yor are here"
          description="This is a description"
          coordinate={position}
        />
      </MapView>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapScreen;
