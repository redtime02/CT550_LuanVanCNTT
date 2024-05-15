import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
// import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
// import * as geolib from 'geolib';

const ListScreen = ({route}) => {
  // const {user} = route.params || {};
  // console.log(user);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    latitude: 10.04978,
    longitude: 105.77695,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [radius, setRadius] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
        },
      );
    };

    fetchUserLocation();

    axios
      .get('http://10.13.128.162:3000/api/location/uncollected')
      .then(response => {
        const modifiedData = response.data.map(item => ({
          ...item,
          images: item.images.map(image => image.replace(/^.*[\\\/]/, '')),
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            item.latitude,
            item.longitude,
          ),
        }));

        modifiedData.sort((a, b) => a.distance - b.distance);

        const filteredLocations = modifiedData.filter(
          item => item.distance <= radius,
        );

        setLocations(filteredLocations.sort((a, b) => a.distance - b.distance));

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
        setLoading(false);
      });
  }, [userLocation, radius]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính của trái đất tính bằng kilometer
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Khoảng cách giữa hai điểm, tính bằng kilometer
    return distance;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  const handleRadiusChange = newRadius => {
    setRadius(newRadius);
  };

  // Nếu đang tải dữ liệu, hiển thị màn hình Loading Indicator
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // Nếu không có địa điểm nào, hiển thị thông báo
  if (locations.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No locations found.</Text>
      </View>
    );
  }

  const handleNavigate = (latitude, longitude, id, locations) => {
    navigation.navigate('MapLocate', {latitude, longitude, id, locations});
  };
  // Nếu có địa điểm, hiển thị danh sách
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.radiusText}>Bán kính:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={{color: 'black'}}
            selectedValue={radius}
            onValueChange={itemValue => handleRadiusChange(itemValue)}>
            <Picker.Item label="1km" value={1} />
            <Picker.Item label="2km" value={2} />
            <Picker.Item label="3km" value={3} />
            <Picker.Item label="4km" value={4} />
          </Picker>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : locations.length === 0 ? (
        <Text>No locations found.</Text>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.box}>
              <Image
                style={styles.image}
                source={{
                  uri: `http://10.13.128.162:3000/api/image/${item.images[0]}`,
                }}
              />
              <View style={styles.boxContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.distance}>
                  Khoảng cách: {item.distance.toFixed(2) * 1000} mét
                </Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.button, styles.view]}
                    onPress={() =>
                      handleNavigate(
                        item.latitude,
                        item.longitude,
                        item._id,
                        locations,
                      )
                    }>
                    <Text style={styles.buttonText}>Xem bản đồ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
  },
  radiusText: {
    marginRight: 10,
    color: 'black',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    // marginBottom: 10,
    // width: '50%',
    backgroundColor: 'white',
  },
  image: {
    width: 100,
    height: 100,
  },
  box: {
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  boxContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    color: '#151515',
  },
  distance: {
    fontSize: 18,
    color: '#151515',
  },
  description: {
    fontSize: 15,
    color: '#646464',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 100,
    marginRight: 5,
    marginTop: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  view: {
    backgroundColor: '#1E90FF',
  },
  profile: {
    backgroundColor: '#1E90FF',
  },
  message: {
    backgroundColor: '#228B22',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ListScreen;
