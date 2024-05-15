import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RCTDeviceInfo from 'react-native-device-info';

const OtherScreen = () => {
  const [userInfo, setUserInfo] = useState([]);
  const navigation = useNavigation();

  // Hàm xử lý khi nhấp vào nút "Chỉnh sửa"
  const handleEditProfile = (name, email, address, mobile, image) => {
    navigation.navigate('EditProfile', {name, email, address, mobile, image});
  };
  useEffect(() => {
    axios
      .get('http://10.13.128.162:3000/api/auth/get-user')
      .then(response => {
        setUserInfo(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [userInfo]);

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              // const uniqueId = await RCTDeviceInfo.getUniqueId();
              // Xóa thông tin đăng nhập khỏi AsyncStorage
              // await AsyncStorage.removeItem('token');
              // await AsyncStorage.removeItem('user');

              // Reload ứng dụng
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, styles.border, styles.shadow]}>
        <Image
          source={{
            uri:
              userInfo?.userDetail && userInfo?.userDetail.image
                ? `http://10.13.128.162:3000/api/image/${userInfo?.userDetail.image
                    .split('\\')
                    .pop()}`
                : 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-thien-nhien-3d-002.jpg',
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userInfo?.name}</Text>
          <Text style={styles.email}>{userInfo?.email}</Text>
        </View>
      </View>
      {userInfo?.role !== 'collector' && (
        <>
          <View style={[styles.details, styles.border, styles.shadow]}>
            {/* <View style={styles.detailItem}>
          <Text style={styles.detailHeader}>Thiết lập hồ sơ</Text>
          <Text
            style={styles.editProfile}
            onPress={() =>
              handleEditProfile(
                userInfo?.name,
                userInfo?.email,
                userInfo?.address,
                userInfo?.mobile,
                userInfo?.userDetail.image,
              )
            }>
            Chỉnh sửa
          </Text>
        </View> */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Điểm thưởng</Text>
              <Text style={styles.detailText}>{userInfo?.point}</Text>
            </View>
            {/* <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Số tiền trong ví</Text>
          <Text style={styles.detailText}>
            {userInfo?.userDetail ? userInfo?.userDetail.walletAmount : 0} VND
          </Text>
        </View> */}
            <View style={styles.detailItem}>
              <Text style={styles.button}>Đổi quà</Text>
              {/* <Text style={styles.detailText}>{userInfo?.point}</Text> */}
            </View>
          </View>
        </>
      )}

      <View style={[styles.details, styles.border, styles.shadow]}>
        <View style={styles.detailItem}>
          <Text style={styles.detailHeader}>Thiết lập hồ sơ</Text>
          <Text
            style={styles.editProfile}
            onPress={() =>
              handleEditProfile(
                userInfo?.name,
                userInfo?.email,
                userInfo?.address,
                userInfo?.mobile,
                userInfo?.userDetail.image,
              )
            }>
            Chỉnh sửa
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Số điện thoại</Text>
          <Text style={styles.detailText}>{userInfo?.mobile}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Địa chỉ</Text>
          <Text style={styles.detailText}>{userInfo?.address}</Text>
        </View>
      </View>
      <View style={styles.logoutButtonContainer}>
        <Text style={styles.logoutButton} onPress={handleLogout}>
          Đăng xuất
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  details: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items with space between
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
  },
  detailText: {
    fontSize: 18,
    color: 'black',
  },
  border: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailHeader: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  editProfile: {
    fontSize: 18,
    color: '#3ec354', // Màu xanh dương để làm nổi bật
    // marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    fontSize: 18,
    color: '#3ec354', // Màu xanh dương để làm nổi bật
    // borderTopWidth: 1, // Border ở trên
    // borderBottomWidth: 1, // Border ở dưới
    // borderTopColor: 'gray', // Màu border ở trên
    // borderBottomColor: 'gray', // Màu border ở dưới
    // // paddingTop: 10, // Khoảng cách từ border đến nội dung
    // // paddingBottom: 10, // Khoảng cách từ border đến nội dung
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#e53935', // Màu đỏ
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OtherScreen;
