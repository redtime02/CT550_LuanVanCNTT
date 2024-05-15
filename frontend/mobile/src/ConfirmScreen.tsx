import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {WebView} from 'react-native-webview';
// import {PayPalButton} from 'react-native-paypal';

const ConfirmScreen = ({route}) => {
  const {totalScore, totalWeight, id} = route.params;
  const [locationData, setLocationData] = useState(null);
  const [markedByName, setMarkedByName] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const navigation = useNavigation();
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axios.get(
        `http://10.13.128.162:3000/api/location/mark/${id}`,
      );
      setLocationData(response.data);
      setMarkedByName(response.data?.markedBy?.name);
      setLocationName(response.data?.name);
      console.log(locationData);
    } catch (error) {
      console.error('Failed to fetch location data:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.patch(
        `http://10.13.128.162:3000/api/location/${id}/confirm`,
        {
          point: totalScore,
          weight: totalWeight,
        },
      );
      // Xử lý sau khi xác nhận thành công (nếu cần)
      // Chẳng hạn, có thể cập nhật UI hoặc thực hiện chuyển hướng đến màn hình khác
      // navigation.replace('Collector', {screen: 'Home'});
      navigation.navigate('ThankYou');
    } catch (error) {
      console.error('Failed to confirm location:', error);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // const handlePayment = async details => {
  //   try {
  //     // Gửi dữ liệu thanh toán đến máy chủ của bạn để xác nhận thanh toán
  //     await axios.patch(`http://10.13.128.162:3000/api/location/${id}/confirm`, {
  //       point: totalScore,
  //       paymentDetails: details,
  //       totalAmount: totalAmount,
  //     });

  //     // Xử lý kết quả sau khi thanh toán thành công
  //     // Chẳng hạn, cập nhật giao diện người dùng hoặc chuyển hướng đến màn hình khác
  //     navigation.navigate('ThankYou');
  //   } catch (error) {
  //     console.error('Failed to process payment:', error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin xác nhận</Text>
      <View style={styles.infoWrapper}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Họ tên người đăng:</Text>
          <Text style={styles.text}>{markedByName || 'Đang tải...'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Địa chỉ tìm thấy:</Text>
          <Text style={styles.text}>{locationName || 'Đang tải...'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Số điểm thưởng:</Text>
          <Text style={styles.text}>{totalScore}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tổng số ký:</Text>
          <Text style={styles.text}>{totalWeight} kg</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>

      {/* <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Đóng</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{
              uri: 'http://localhost:3001/paypal',
            }}
            style={styles.webview}
          />
        </View>
      </Modal> */}
      {/* <PayPalButton
        amount={totalAmount}
        currency="USD"
        environment="sandbox"
        onApprove={details => handlePayment(details)}
        onError={error => console.log(error)}
      /> */}
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
    backgroundColor: 'white',
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
  webview: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ConfirmScreen;
