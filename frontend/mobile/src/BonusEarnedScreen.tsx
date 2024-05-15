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
import moment from 'moment';

const BonusEarnedScreen = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, [locations]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://10.13.128.162:3000/api/reward/user',
      );
      const modifiedData = response.data.map(item => {
        return {
          ...item,
          bonusItemId: {
            _id: item.bonusItemId._id,
            name: item.bonusItemId.name,
            // Modify image path
            image: item.bonusItemId.image.replace(/^.*[\\\/]/, ''),
          },
        };
      });
      // se(modifiedData);
      setLocations(modifiedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  //   const extractFilenameFromUrl = url => {
  //     const parts = url.split('\\');
  //     return parts[parts.length - 1];
  //   };

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

  const handleNavigate = (latitude, longitude, id) => {
    navigation.navigate('MapLocate', {latitude, longitude, id});
  };
  // Nếu có địa điểm, hiển thị danh sách
  return (
    <FlatList
      data={locations}
      keyExtractor={item => item._id}
      renderItem={({item}) => (
        // <View style={styles.item}>
        //   <Text style={styles.text}>{item.name}</Text>
        //   {/* Hiển thị các thông tin khác về địa điểm ở đây */}
        // </View>
        // { uri: `${UPLOADS_BASE_URL}${item.images[0]}` }
        <View style={styles.box}>
          {/* <Text
            style={{
              color: 'black',
            }}>{`${UPLOADS_BASE_URL}${item._id}/images/${item.images[0]}`}</Text> */}
          <Image
            style={styles.image}
            source={{
              uri: `http://10.13.128.162:3000/api/image/${item.bonusItemId.image}`,
            }}
          />
          <View style={styles.boxContent}>
            <Text style={styles.title}>{item.bonusItemId.name}</Text>
            <Text style={styles.title}>
              Ngày đổi quà:{' '}
              {moment(item.rewardedId.bonusDate).format('DD-MM-YYYY')}
            </Text>
            <View style={styles.buttons}>
              {/* <TouchableOpacity
              style={[styles.button, styles.view]}
              onPress={() => handleNavigate(item.latitude, item.longitude, item._id)}>
              <Text style={styles.buttonText}>Xem bản đồ</Text>
            </TouchableOpacity> */}

              {/* <TouchableOpacity
              style={[styles.button, styles.profile]}
              onPress={handleNavigate}>
              <Image
                style={styles.icon}
                source={{ uri: 'https://img.icons8.com/color/70/000000/cottage.png' }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.message]}
              onPress={handleNavigate}>
              <Image
                style={styles.icon}
                source={{ uri: 'https://img.icons8.com/color/70/000000/plus.png' }}
              />
            </TouchableOpacity> */}
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
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

export default BonusEarnedScreen;
