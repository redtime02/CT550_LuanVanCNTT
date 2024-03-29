import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ConfirmScreen = ({ route }) => {
  const { totalScore, id } = route.params;
  const [locationData, setLocationData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.5:3000/api/location/mark/${id}`,
      );
      setLocationData(response.data);
      console.log(locationData);
    } catch (error) {
      console.error('Failed to fetch location data:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.patch(`http://192.168.1.5:3000/api/location/${id}/confirm`, {
        point: totalScore
      });
      // Xử lý sau khi xác nhận thành công (nếu cần)
      // Chẳng hạn, có thể cập nhật UI hoặc thực hiện chuyển hướng đến màn hình khác
      navigation.replace('Collector', {screen: 'Home'});
    } catch (error) {
      console.error('Failed to confirm location:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin xác nhận</Text>
      <View style={styles.infoWrapper}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Họ tên người đăng:</Text>
          <Text style={styles.text}>{locationData?.markedBy?.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Địa chỉ tìm thấy:</Text>
          <Text style={styles.text}>{locationData?.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Số điểm thưởng:</Text>
          <Text style={styles.text}>{totalScore}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    padding: 20,
    marginBottom: 150,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  infoWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white'
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  confirmButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ConfirmScreen;
