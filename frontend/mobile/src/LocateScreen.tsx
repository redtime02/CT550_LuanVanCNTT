import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Image, PermissionsAndroid, Alert} from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';

const LocateScreen = ({route}) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [img, setImg] = useState('');
  const [bottleType, setBottleType] = useState('');
  const [confirmedLatitude, setConfirmedLatitude] = useState(null);
  const [confirmedLongitude, setConfirmedLongitude] = useState(null);
  const [confirmedAddress, setConfirmedAddress] = useState(null);
  const [selected, setSelected] = useState([]);
  const [trashTypes, setTrashTypes] = useState([]);
  const [selectedTrashTypes, setSelectedTrashTypes] = useState([]);

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
      const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      if (checkPermission) {
        // console.log('OK');
        // Camera
        // const result:any = await launchCamera({mediaType: 'photo', cameraType: 'back'});
        // Chọn ảnh
        const result: any = await launchImageLibrary({mediaType: 'photo'});
        console.log(result.assets[0].uri);
        setImg(result.assets[0].uri);
      } else {
        console.log('NO');
        
      }
    } catch (error) {
      console.log(error);
    }
};

const handleChooseImage1 = async () => {
  try {
    const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
    if (checkPermission) {
      // console.log('OK');
      // Camera
      const result:any = await launchCamera({mediaType: 'photo', cameraType: 'back'});
      // Chọn ảnh
      // const result: any = await launchImageLibrary({mediaType: 'photo'});
      console.log(result.assets[0].uri);
      setImg(result.assets[0].uri);
    } else {
      console.log('NO');
      
    }
  } catch (error) {
    console.log(error);
  }
};

  const handleMap = () => {
    navigation.navigate('Map');
  };

  const data = [
    {key: '1', value: 'Lon', disable: true},
    {key: '2', value: 'Chai'},
    {key: '3', value: 'Giấy'},
    {key: '4', value: 'Nhôm', disable: true},
    {key: '5', value: 'Sắt'},
    {key: '6', value: 'Mủ'},
  ]

  const itemTextStyles = {
    color: 'black', // Chỉ định màu chữ là đen
  };

  useEffect(() => {
    const fetchTrashTypes = async () => {
      try {
        const response = await axios.get(
          'http://192.168.1.5:3000/api/trash-type',
        );
        const data = response.data;
        // Cập nhật state với danh sách trash type
        setTrashTypes(data);
      } catch (error) {
        console.error('Error fetching trash types:', error);
      }
    };
  
    fetchTrashTypes();
  }, []);

  // Chuyển đổi danh sách trash type thành định dạng cho dropdown-select list
  const mapTrashTypesToData = () => {
    return trashTypes.map((trashType, index) => ({
      key: trashType._id, // Sử dụng index như một key duy nhất
      value: trashType.name, // Gắn tên trash type vào value
    }));
  };

  // Hàm xử lý khi nhấn nút "Lưu"
  const handleSave = async () => {
    // Xử lý lưu dữ liệu, ví dụ: gửi dữ liệu đến server
    // console.log('Address:', confirmedAddress);
    // console.log('Latitude:', confirmedLatitude);
    // console.log('Longitude:', confirmedLongitude);
    // // console.log('Image URI:', imageUri);
    console.log('File:', img);
    console.log('Selected trash types:', selectedTrashTypes);

    try {
      // Gửi dữ liệu địa điểm mới lên server
      const locationResponse = await axios.post(
        'http://192.168.1.5:3000/api/location/mark',
        {
          name: confirmedAddress,
          latitude: confirmedLatitude,
          longitude: confirmedLongitude,
          trashTypeId: selectedTrashTypes, // Loại rác được chọn
        },
      );
  
      // Lấy id của địa điểm mới tạo
      const locationId = locationResponse.data.locationId;
      console.log(locationId);
      
      // Tạo một đối tượng FormData để gửi dữ liệu hình ảnh
      const formData = new FormData();
      formData.append('images', {
        uri: img,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // Gửi dữ liệu hình ảnh lên server
      const imageUploadResponse = await axios.post(
        `http://192.168.1.5:3000/api/location/${locationId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Thiết lập header cho form data
          },
        }
      );

      // console.log(imageUploadResponse);
      
      // In ra thông báo hoặc thực hiện hành động khác nếu thành công
      console.log('Location and image saved successfully:', locationResponse.data, imageUploadResponse.data);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.log(error);
      
      console.error('Error saving location and image:', error);
    }
  };

  useEffect(() => {
    if (route.params?.latitude && route.params?.longitude && route.params?.address) {
      setConfirmedLatitude(route.params.latitude);
      setConfirmedLongitude(route.params.longitude);
      setConfirmedAddress(route.params.address);
    }
  }, [route.params]);

  return (
    <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
      <Text style={{color: 'black'}}>Latitude: {confirmedLatitude}</Text>
      <Text style={{color: 'black'}}>Longitude: {confirmedLongitude}</Text>
      <Text style={{color: 'black'}}>Address: {confirmedAddress}</Text>
      {/* Trường nhập tọa độ */}
      <Text style={{color: 'black'}}>Đánh dấu tọa độ:</Text>
      <Button title="Đánh dấu" onPress={handleMap} />

      {/* Trường tải lên hình ảnh */}
      <Text style={{color: 'black', paddingTop: 20}}>Chọn hình ảnh:</Text>
      <Button title="Chọn ảnh" onPress={handleSelectImage} />
      {img != '' ? (
        <Image
          source={{uri: img}}
          style={{width: 200, height: 200, marginBottom: 10}}
        />
      ) : (
        ''
      )}
      <MultipleSelectList inputStyles={{color: 'black'}} dropdownTextStyles={{color: 'black'}} setSelected={(val) => setSelectedTrashTypes(val)} data={mapTrashTypesToData()} label='Loại ve chai' labelStyles={{color: 'black'}} itemTextStyles={itemTextStyles} />
      {/* Nút lưu */}
      <Button title="Lưu" onPress={handleSave} />
    </View>
  );
};

export default LocateScreen;
