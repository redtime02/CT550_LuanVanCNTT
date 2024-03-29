import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import DirectionsService from 'react-native-maps-directions';
import {useNavigation} from '@react-navigation/native';

const MapLocateScreen = ({route}) => {
  const {latitude, longitude, id} = route.params;
  const latitudeNumber = parseFloat(latitude);
  const longitudeNumber = parseFloat(longitude);
  const navigation = useNavigation();

  console.log({latitudeNumber, longitudeNumber});

  const [position, setPosition] = useState({
    latitude: latitudeNumber,
    longitude: longitudeNumber,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [estimatedDuration, setEstimatedDuration] = useState(null);

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

  
  const calculateRouteTime = async () => {
    const origin = `${position.latitude},${position.longitude}`;
    const destination = `${latitudeNumber},${longitudeNumber}`;
    const apiKey = 'AIzaSyB56kWVOzQACkup4rS9oRNPT4Sszz8wSgY';

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );
      const data = await response.json();
      console.log(data);
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        console.log(route);
        
        const duration = route.legs.reduce((total, leg) => total + leg.duration.value, 0);
        console.log("Estimated duration:", duration);
        setEstimatedDuration(duration);
      } else {
        console.log("No route found");
      }
    } catch (error) {
      console.error("Error calculating route time:", error);
    }
  };

  useEffect(() => {
    calculateRouteTime();
  }, []); 

  const handleArrivedPress = id => {
    navigation.navigate('Quantity', {id});
  };

  return (
    <View style={styles.container}>
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
          title='You are here'
          description="This is a description"
          coordinate={{
            latitude: latitudeNumber,
            longitude: longitudeNumber,
          }}
        />

        <DirectionsService
          origin={{latitude: position.latitude, longitude: position.longitude}}
          destination={{latitude: latitudeNumber, longitude: longitudeNumber}}
          apikey="AIzaSyB56kWVOzQACkup4rS9oRNPT4Sszz8wSgY"
          strokeWidth={5}
          strokeColor="hotpink"
        />
      </MapView>
      {/* {estimatedDuration && (
        <View style={styles.durationContainer}>
          <Text>
            Thời gian ước tính: {Math.ceil(estimatedDuration / 60)} phút
          </Text>
        </View>
      )} */}

      <TouchableOpacity style={styles.arrivedButton} onPress={() => handleArrivedPress(id)}>
        <Text style={styles.arrivedButtonText}>Đã đến</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  arrivedButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  arrivedButtonText: {
    color: 'white',
    fontSize: 16,
  },
  durationContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
});


export default MapLocateScreen;
