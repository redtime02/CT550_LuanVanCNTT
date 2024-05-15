import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  PermissionsAndroid,
  Alert,
  ScrollView,
} from 'react-native';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
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
  const [noteText, setNoteText] = useState('');
  const [expectedWeight, setExpectedWeight] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    address: '',
    image: '',
    trashTypes: '',
  });

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

  const handleExpectedWeightChange = text => {
    setExpectedWeight(text);
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
        setImg(result.assets[0].uri);
      } else {
        console.log('NO');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMap = () => {
    navigation.navigate('Bản đồ đánh dấu');
  };

  const data = [
    {key: '1', value: 'Lon', disable: true},
    {key: '2', value: 'Chai'},
    {key: '3', value: 'Giấy'},
    {key: '4', value: 'Nhôm', disable: true},
    {key: '5', value: 'Sắt'},
    {key: '6', value: 'Mủ'},
  ];

  const itemTextStyles = {
    color: 'black', // Chỉ định màu chữ là đen
  };

  useEffect(() => {
    const fetchTrashTypes = async () => {
      try {
        const response = await axios.get(
          'http://10.13.128.162:3000/api/trash-type',
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
    // Kiểm tra các điều kiện như trước
    if (!confirmedAddress || !confirmedLatitude || !confirmedLongitude) {
      setErrorMessages(prevState => ({
        ...prevState,
        address: 'Vui lòng đánh dấu địa chỉ trên bản đồ.',
      }));
      return;
    } else {
      setErrorMessages(prevState => ({...prevState, address: ''}));
    }

    if (!img) {
      setErrorMessages(prevState => ({
        ...prevState,
        image: 'Vui lòng chọn một hình ảnh.',
      }));
      return;
    } else {
      setErrorMessages(prevState => ({...prevState, image: ''}));
    }

    if (!selectedTrashTypes.length || !expectedWeight) {
      setErrorMessages(prevState => ({
        ...prevState,
        trashTypes:
          'Vui lòng chọn loại ve chai và nhập tổng số ký tối đa dự kiến.',
      }));
      return;
    } else {
      setErrorMessages(prevState => ({...prevState, trashTypes: ''}));
    }

    // Hiển thị thông báo xác nhận trước khi lưu dữ liệu
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đánh dấu địa điểm này?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: async () => {
            try {
              // Gửi dữ liệu địa điểm mới lên server
              const locationResponse = await axios.post(
                'http://10.13.128.162:3000/api/location/mark',
                {
                  name: confirmedAddress,
                  latitude: confirmedLatitude,
                  longitude: confirmedLongitude,
                  trashTypeId: selectedTrashTypes,
                  otherDetails: noteText,
                  weightMax: expectedWeight,
                },
              );

              // Lấy id của địa điểm mới tạo
              const locationId = locationResponse.data.locationId;

              // Tạo một đối tượng FormData để gửi dữ liệu hình ảnh
              const formData = new FormData();
              formData.append('images', {
                uri: img,
                type: 'image/jpeg',
                name: 'photo.jpg',
              });

              // Gửi dữ liệu hình ảnh lên server
              const imageUploadResponse = await axios.post(
                `http://10.13.128.162:3000/api/location/${locationId}/images`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );

              // Hiển thị thông báo xác nhận và chuyển hướng đến trang Lịch sử
              Alert.alert(
                'Thông báo',
                'Bạn đã đánh dấu địa điểm thành công.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.navigate('Lịch sử');
                    },
                  },
                ],
                {cancelable: false},
              );
            } catch (error) {
              console.error('Error saving location and image:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    if (
      route.params?.latitude &&
      route.params?.longitude &&
      route.params?.address
    ) {
      setConfirmedLatitude(route.params.latitude);
      setConfirmedLongitude(route.params.longitude);
      setConfirmedAddress(route.params.address);
    }
  }, [route.params]);

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh dấu tọa độ:</Text>
          <TouchableOpacity onPress={handleMap} style={styles.button}>
            <Text style={styles.buttonText}>Đánh dấu</Text>
          </TouchableOpacity>
          <View style={styles.sectionWrapper}>
            <Text style={styles.infoText}>Địa chỉ: {confirmedAddress}</Text>
          </View>
          {errorMessages.address ? (
            <Text style={styles.errorMessage}>{errorMessages.address}</Text>
          ) : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tải lên hình ảnh:</Text>
          <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
            <Text style={styles.buttonText}>Chọn ảnh</Text>
          </TouchableOpacity>
          <View style={styles.sectionWrapper}>
            <Text style={styles.infoText}>Hình ảnh:</Text>
            {img != '' ? (
              <Image source={{uri: img}} style={styles.image} />
            ) : null}
          </View>
          {errorMessages.image ? (
            <Text style={styles.errorMessage}>{errorMessages.image}</Text>
          ) : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loại ve chai:</Text>
          <MultipleSelectList
            inputStyles={{color: 'black'}}
            dropdownTextStyles={{color: 'black'}}
            setSelected={val => setSelectedTrashTypes(val)}
            data={mapTrashTypesToData()}
            label="Loại ve chai"
            labelStyles={{color: 'black'}}
            itemTextStyles={itemTextStyles}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng số ký tối đa dự kiến: </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={handleExpectedWeightChange}
            value={expectedWeight}
            keyboardType="numeric"
          />
          {errorMessages.trashTypes ? (
            <Text style={styles.errorMessage}>{errorMessages.trashTypes}</Text>
          ) : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú: </Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            onChangeText={text => setNoteText(text)}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleSave} style={styles.fixedButton}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocateScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f1f5f8',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  infoText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  sectionButton: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f1f5f8',
    color: 'black',
  },
  fixedButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f1f5f8',
    color: 'black',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
