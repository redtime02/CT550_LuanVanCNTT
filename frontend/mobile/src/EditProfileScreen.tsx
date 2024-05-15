import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

const EditProfileScreen = ({route}) => {
  // console.log(route.params);

  const {name, email, address, mobile, image} = route.params;

  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userAddress, setUserAddress] = useState(address);
  const [userAvatar, setUserAvatar] = useState(
    image
      ? `http://10.13.128.162:3000/api/image/${image.split('\\').pop()}`
      : 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-thien-nhien-3d-002.jpg',
  );
  const [userMobile, setUserMobile] = useState(mobile);
  console.log(userAvatar);
  const navigation = useNavigation();

  const handleSelectImage = () => {
    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chọn ảnh từ camera hay thư viện ảnh?',
      [
        {
          text: 'Camera',
          onPress: () => handleChooseImage1(),
        },
        {
          text: 'Thư viện ảnh',
          onPress: () => handleChooseImage2(),
        },
        {
          text: 'Hủy',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const handleChooseImage2 = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (checkPermission) {
        // console.log('OK');
        // Camera
        // const result:any = await launchCamera({mediaType: 'photo', cameraType: 'back'});
        // Chọn ảnh
        const result: any = await launchImageLibrary({mediaType: 'photo'});
        console.log(result.assets[0].uri);
        setUserAvatar(result.assets[0].uri);
      } else {
        console.log('NO');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChooseImage1 = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (checkPermission) {
        // console.log('OK');
        // Camera
        const result: any = await launchCamera({
          mediaType: 'photo',
          cameraType: 'back',
        });
        // Chọn ảnh
        // const result: any = await launchImageLibrary({mediaType: 'photo'});
        console.log(result.assets[0].uri);
        setUserAvatar(result.assets[0].uri);
      } else {
        console.log('NO');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    const data = {
      name: userName,
      email: userEmail,
      address: userAddress,
      mobile: userMobile,
    };

    // Gửi yêu cầu POST đến route localhost:3000/api/auth/put-user để lưu thông tin người dùng
    axios
      .put('http://10.13.128.162:3000/api/auth/put-user', data)
      .then(response => {
        console.log('User data updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });

    // Gửi yêu cầu POST đến route 10.13.128.162:3000/api/auth/upload để tải lên ảnh đại diện mới
    const formData = new FormData();
    formData.append('image', {
      uri: userAvatar,
      type: 'image/jpeg', // Điều này phụ thuộc vào loại ảnh bạn đang sử dụng
      name: 'avatar.jpg',
    });

    axios
      .post('http://10.13.128.162:3000/api/auth/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Thiết lập header cho form data
        },
      })
      .then(response => {
        console.log('User data updated successfully:', response.data);
        // Show success message
        Alert.alert('Thông báo', 'Cập nhật hồ sơ thành công', [
          {text: 'OK', onPress: () => navigation.navigate('Other')},
        ]);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
        // Show error message
        Alert.alert('Thông báo', 'Lỗi cập nhật hồ sơ');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: userAvatar,
            }}
          />
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={handleSelectImage}>
            <Text style={styles.changeAvatarButtonText}>
              Thay đổi ảnh đại diện
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Họ tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={userName}
            onChangeText={setUserName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={userEmail}
            onChangeText={setUserEmail}
          />
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bio"
            value={userMobile}
            onChangeText={setUserMobile}
          />
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={userAddress}
            onChangeText={setUserAddress}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  form: {
    width: '80%',
  },
  label: {
    marginTop: 20,
    color: 'black',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    color: 'gray',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  avatarContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarButtonText: {
    color: '#1E90FF',
    fontSize: 18,
  },
});

export default EditProfileScreen;
