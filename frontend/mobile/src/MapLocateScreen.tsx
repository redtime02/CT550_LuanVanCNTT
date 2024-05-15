import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  Image,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import DirectionsService from 'react-native-maps-directions';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const MapLocateScreen = ({route}) => {
  const {latitude, longitude, id, locations} = route.params;
  const latitudeNumber = parseFloat(latitude);
  const longitudeNumber = parseFloat(longitude);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedLatitude, setSelectedLatitude] = useState(null);
  const [selectedLongitude, setSelectedLongitude] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [returnFromQuantity, setReturnFromQuantity] = useState(false);
  const [outdatedLocations, setOutdatedLocations] = useState([]);
  const [showActionButtons, setShowActionButtons] = useState(true);
  const [selectedCollectingLatitude, setSelectedCollectingLatitude] =
    useState(null);
  const [selectedCollectingLongitude, setSelectedCollectingLongitude] =
    useState(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [userCloser, setUserCloser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [reportContent, setReportContent] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    // Log thành phần name trong tất cả các phần tử của mảng outdatedLocations
    outdatedLocations.forEach(location => {
      console.log(location.name);
    });
  }, [outdatedLocations]);

  useEffect(() => {
    // Hàm này được gọi khi màn hình được tải lên
    checkOutdatedLocations(); // Kiểm tra các địa điểm đã bị lỗi khi màn hình được tải lên
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem('user');
      // Kiểm tra điều kiện để xác định xem có hiển thị nút "Đường đi" và "Đã đến" hay không
      if (
        selectedLocation &&
        selectedLocation.collectingBy &&
        JSON.stringify(selectedLocation.collectingBy._id) !== user
      ) {
        setShowActionButtons(false); // Ẩn nút nếu điều kiện được đáp ứng
      } else {
        setShowActionButtons(true); // Hiển thị nút trong trường hợp còn lại
      }
    };

    getUser();
  }, [selectedLocation]);

  const checkOutdatedLocations = async () => {
    try {
      const response = await axios.get(
        'http://10.13.128.162:3000/api/location/out-dated',
      );
      if (response.data && response.data.length > 0) {
        // Nếu có địa điểm bị lỗi, cập nhật danh sách và hiển thị thông báo
        setOutdatedLocations(response.data);
        Alert.alert(
          'Thông báo',
          `Các địa điểm sau đã bị hủy do không đến thu nhặt trong một khoảng thời gian: ${response.data
            .map(location => location.name)
            .join('; ')}.`,
        );
      }
    } catch (error) {
      console.error('Error checking outdated locations:', error);
    }
  };
  // console.log(selectedLocation);

  // console.log({latitudeNumber, longitudeNumber});
  // console.log(locations);

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
    const apiKey = 'AIzaSyCzd_MuSixtCcp4-cR80LT02u66byL7cWg';

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`,
      );
      const data = await response.json();
      // console.log(data);

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        console.log(route);

        const duration = route.legs.reduce(
          (total, leg) => total + leg.duration.value,
          0,
        );
        console.log('Estimated duration:', duration);
        setEstimatedDuration(duration);
      } else {
        console.log('No route found');
      }
    } catch (error) {
      console.error('Error calculating route time:', error);
    }
  };

  useEffect(() => {
    calculateRouteTime();
  }, []);

  useEffect(() => {
    if (returnFromQuantity && selectedLocation) {
      setShowModal(false); // Set showModal to false when returning from Quantity and no location selected
      setReturnFromQuantity(false); // Reset the returnFromQuantity state
    }
  }, [returnFromQuantity, selectedLocation]);

  const handleMarkerPress = async location => {
    setSelectedLocation(location);
    setSelectedLatitude(location.latitude);
    setSelectedLongitude(location.longitude);
    console.log('Selected Location:', location);
    if (
      location?.collectingLatitude !== null &&
      location?.collectingLongitude !== null &&
      location?.collectingLatitude !== undefined
    ) {
      setSelectedCollectingLatitude(location?.collectingLatitude);
      setSelectedCollectingLongitude(location?.collectingLongitude);
      console.log(location?.collectingLatitude);
      // console.log(location.collectingLongitude);
    }
    const user = await AsyncStorage.getItem('user');
    // Kiểm tra xem vị trí đã chọn có thuộc tính collectingBy không
    if (
      location.collectingBy &&
      JSON.stringify(selectedLocation?.collectingBy._id) !== user
    ) {
      console.log(user);
      console.log(JSON.stringify(selectedLocation?.collectingBy._id));

      setLocationSelected(true); // Đã chọn vị trí thành công
    }
  };

  useEffect(() => {
    if (locationSelected) {
      compareDistance(); // Gọi hàm compareDistance khi đã chọn vị trí thành công
    }
  }, [locationSelected]);

  const handleClosePopup = () => {
    setSelectedLocation(null);
    setUserCloser(false);
    setLocationSelected(false);
  };

  const handleGetDirections = async () => {
    // const user = await AsyncStorage.getItem('user');
    try {
      // if (
      //   selectedLocation.collectingBy &&
      //   JSON.stringify(selectedLocation.collectingBy._id) !== user
      // ) {
      //   // console.log('collectingBy:', selectedLocation.collectingBy._id);
      //   Alert.alert(
      //     'Thông báo',
      //     'Địa điểm này đã được chọn rồi! Hãy chọn địa điểm thu nhặt khác',
      //   );
      // } else {
      Geolocation.getCurrentPosition(
        async pos => {
          const {latitude, longitude} = pos.coords;
          try {
            // Gửi yêu cầu cập nhật vị trí thu nhặt lên server
            const response = await axios.patch(
              `http://10.13.128.162:3000/api/location/${selectedLocation._id}/collecting`,
              {
                collectingLatitude: latitude,
                collectingLongitude: longitude,
              },
            );
            console.log(selectedLocation._id);
            console.log(response.data);

            setShowModal(false);
            setShowDirections(true); // Khi nhấn vào "Get Directions", hiển thị vạch đường
            setSelectedLocation(null);
          } catch (error) {
            console.error('Error updating data:', error);
          }
        },
        err => {
          console.log(err);
        },
      );
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleArrivedPress = async id => {
    setReturnFromQuantity(true);
    const user = await AsyncStorage.getItem('user');
    try {
      if (user !== null) {
        console.log(user);
        console.log(selectedLocation?.collectingBy?._id);
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    if (
      selectedLocation?.collectingBy &&
      JSON.stringify(selectedLocation?.collectingBy?._id) !== user
    ) {
      // console.log('collectingBy:', selectedLocation.collectingBy._id);
      Alert.alert(
        'Thông báo',
        'Địa điểm này đã được chọn rồi! Hãy chọn địa điểm thu nhặt khác',
      );
    } else {
      navigation.navigate('Quantity', {id});
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [selectedLocation]);

  const compareDistance = async () => {
    const user = await AsyncStorage.getItem('user');
    // Tính toán khoảng cách giữa vị trí của người dùng và vị trí đã chọn
    const userLocation = {
      latitude: position.latitude,
      longitude: position.longitude,
    };
    console.log(userLocation);

    const selectLocation = {
      latitude: parseFloat(selectedLatitude),
      longitude: parseFloat(selectedLongitude),
    };

    console.log(selectLocation);

    const distanceUserToSelected = calculateDistance(
      userLocation,
      selectLocation,
    );

    // Tính toán khoảng cách giữa vị trí của người đã chọn và vị trí của người collectingBy
    const collectingByLocation = {
      latitude: parseFloat(selectedCollectingLatitude),
      longitude: parseFloat(selectedCollectingLongitude),
    };

    console.log(collectingByLocation);

    const distanceSelectedToCollectingBy = calculateDistance(
      selectLocation,
      collectingByLocation,
    );

    console.log({distanceUserToSelected, distanceSelectedToCollectingBy});

    // So sánh khoảng cách và hiển thị thông báo phù hợp trên Modal
    if (
      distanceUserToSelected < distanceSelectedToCollectingBy &&
      JSON.stringify(selectedLocation?.collectingBy?._id) !== user
    ) {
      // Alert.alert(
      //   'Thông báo',
      //   'Vị trí hiện tại của bạn gần hơn so với vị trí của người đã chọn.',
      // );
      setUserCloser(true);
      // } else {
      //   Alert.alert(
      //     'Thông báo',
      //     'Vị trí của người collectingBy gần hơn vị trí bạn đã chọn.',
      //   );
      // }
    }
  };

  const calculateDistance = (location1, location2) => {
    // Sử dụng công thức haversine để tính khoảng cách giữa hai điểm trên bề mặt trái đất
    const R = 6371e3; // Bán kính trái đất trong mét
    const φ1 = (location1.latitude * Math.PI) / 180; // Latitude 1 in radians
    const φ2 = (location2.latitude * Math.PI) / 180; // Latitude 2 in radians
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180; // Δ Latitude in radians
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180; // Δ Longitude in radians

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    return distance;
  };

  const handleSearch = query => {
    const trimmedQuery = query.trim();
    const filteredLocations = locations.filter(location => {
      // Chuyển đổi tên địa điểm và query tìm kiếm về chữ thường và kiểm tra xem tên địa điểm có chứa query không
      return location.name.toLowerCase().includes(trimmedQuery.toLowerCase());
    });
    setSuggestedLocations(filteredLocations);
    console.log(suggestedLocations?.length);
  };

  const [showReportModal, setShowReportModal] = useState(false);

  const handleOpenReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleReportContentChange = text => {
    setReportContent(text);
  };

  const handleSendReport = async () => {
    try {
      const response = await axios.post(
        'http://10.13.128.162:3000/api/feedback',
        {
          message: reportContent,
          locationName: selectedLocation?.name, // Dữ liệu báo cáo từ state
        },
      );
      console.log(selectedLocation?.name);

      console.log('Report content:', reportContent);
      // console.log('Feedback sent:', response.data);
      // Sau khi gửi báo cáo thành công, bạn có thể đóng modal bằng cách gọi handleCloseReportModal()
      Alert.alert(
        'Thành công',
        'Báo cáo của bạn đã được gửi thành công.',
        [
          {
            text: 'OK',
            onPress: handleCloseReportModal, // Đóng modal sau khi nhấn OK
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
    // Xử lý việc gửi báo cáo
    // Sau khi gửi báo cáo, bạn có thể đóng modal bằng cách gọi handleCloseReportModal()
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
          title="You are here"
          description="This is a description"
          coordinate={{
            latitude: latitudeNumber,
            longitude: longitudeNumber,
          }}
        />
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            title={location.name}
            onPress={() => handleMarkerPress(location)}
          />
        ))}

        {showDirections && ( // Hiển thị DirectionsService nếu showDirections là true
          <DirectionsService
            origin={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
            destination={{
              latitude: parseFloat(selectedLatitude),
              longitude: parseFloat(selectedLongitude),
            }}
            apikey="AIzaSyDRQDF3GwXpM1_rRSrvTErSCDOSxQMHFTY"
            strokeWidth={5}
            strokeColor="hotpink"
          />
        )}

        {/* <DirectionsService
          origin={{latitude: position.latitude, longitude: position.longitude}}
          destination={{latitude: latitudeNumber, longitude: longitudeNumber}}
          apikey="AIzaSyCqZbFAVAgCOX-gMvjkC3F87c4puqaIgPo"
          strokeWidth={5}
          strokeColor="hotpink"
        /> */}
      </MapView>
      {/* {estimatedDuration && (
        <View style={styles.durationContainer}>
          <Text>
            Thời gian ước tính: {Math.ceil(estimatedDuration / 60)} phút
          </Text>
        </View>
      )} */}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePopup}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleClosePopup}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {selectedLocation && (
              <View>
                <Text style={styles.locationName}>{selectedLocation.name}</Text>
                <Image
                  source={{
                    uri: `http://10.13.128.162:3000/api/image/${selectedLocation.images}`,
                  }}
                  style={styles.image}
                />
                {selectedLocation.collectingBy !== null && (
                  <View>
                    <Text style={styles.collectingText}>Đã được chọn bởi:</Text>
                    <TouchableOpacity>
                      <View style={styles.box}>
                        <Image
                          style={styles.userImage}
                          source={{
                            uri: 'https://bootdey.com/img/Content/avatar/avatar6.png',
                          }}
                        />
                        <Text style={styles.username}>
                          {selectedLocation.collectingBy.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {userCloser && (
                  <View style={styles.backgroundCloser}>
                    <Text style={styles.closerText}>
                      Vị trí hiện tại của bạn gần hơn so với vị trí của người đã
                      chọn, bạn có muốn chọn địa điểm này không?
                    </Text>
                    <TouchableOpacity style={styles.closerButton}>
                      <Text
                        style={styles.closerButtonText}
                        onPress={handleGetDirections}>
                        Chọn địa điểm
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* <Button title="Get Directions" onPress={handleGetDirections} />
                <Button
                  title="Đã đến"
                  onPress={() => handleArrivedPress(selectedLocation._id)}
                /> */}
                <View style={styles.buttonsContainer}>
                  {showActionButtons && ( // Hiển thị nút chỉ khi showActionButtons là true
                    <>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleGetDirections}>
                        <Text style={styles.buttonText}>Đường đi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                          handleArrivedPress(selectedLocation?._id)
                        }>
                        <Text style={styles.buttonText}>Đã đến</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleOpenReportModal}>
                        <Text style={styles.buttonText}>Báo cáo</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                {/* Add more information and buttons as needed */}
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseReportModal}>
        <View style={styles.modalReportContainer}>
          <View style={styles.modalReportContent}>
            <TouchableOpacity
              onPress={handleCloseReportModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.reportTitle}>Nội dung báo cáo</Text>
            <TextInput
              style={styles.reportInput}
              multiline={true}
              numberOfLines={4}
              placeholder="Nhập nội dung báo cáo..."
              value={reportContent}
              onChangeText={handleReportContentChange}
            />
            <TouchableOpacity
              style={styles.sendReportButton}
              onPress={handleSendReport}>
              <Text style={styles.sendReportButtonText}>Gửi báo cáo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <TouchableOpacity
        style={styles.arrivedButton}
        onPress={() => handleArrivedPress(id)}>
        <Text style={styles.arrivedButtonText}>Đã đến</Text>
      </TouchableOpacity> */}
      <View style={styles.searchContainer}>
        <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập địa điểm cần tìm..."
          placeholderTextColor="gray"
          onChangeText={text => {
            setSearchQuery(text);
            handleSearch(text); // Gọi hàm handleSearch khi có thay đổi trong TextInput
          }}
          value={searchQuery}
          color="black"
        />
        {/* Nút tìm kiếm hoặc biểu tượng tìm kiếm có thể được thêm vào ở đây */}
      </View>
      {suggestedLocations.length > 0 && searchQuery.length > 0 && (
        <FlatList
          data={suggestedLocations}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                handleMarkerPress(item);
                setSearchQuery('');
              }}>
              <View style={styles.flatListItem}>
                <Text style={{color: 'black'}}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item._id.toString()}
          style={styles.suggestedList}
        />
      )}
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
  searchContainer: {
    position: 'absolute',
    top: 10, // Điều chỉnh vị trí thanh tìm kiếm ở đây
    left: 10, // Điều chỉnh vị trí thanh tìm kiếm ở đây
    right: 10, // Điều chỉnh vị trí thanh tìm kiếm ở đây
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    width: '75%',
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền, có thể điều chỉnh độ mờ tùy ý
    height: '50%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalContent: {
    // flex: 1,
    justifyContent: 'center', // Hiển thị nội dung ở dưới
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // height: '50%',
  },
  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    marginTop: 15,
    backgroundColor: '#DCDCDC',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00008B',
    marginRight: 10,
  },
  buttonText: {
    color: '#00008B',
  },
  collectingByText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  userImage: {
    width: 60,
    height: 60,
  },
  box: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 2,
  },
  username: {
    color: '#20B2AA',
    fontSize: 22,
    alignSelf: 'center',
    marginLeft: 10,
  },
  collectingText: {
    color: 'black',
    fontSize: 20,
  },
  backgroundCloser: {
    justifyContent: 'center', // Canh giữa theo chiều dọc
    alignItems: 'center',
  },
  closerText: {
    color: 'black',
    fontSize: 14,
    margin: 2,
  },
  closerButton: {
    marginTop: 10,
    backgroundColor: '#DCDCDC',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00008B',
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '50%',
    justifyContent: 'center',
  },
  closerButtonText: {
    color: '#00008B',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonClose: {
    backgroundColor: '#2196F3', // Màu nền của nút "Không"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  suggestedList: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 5,
    maxHeight: 230,
    zIndex: 1,
    color: 'black',
    padding: 5,
  },
  flatListItem: {
    borderBottomWidth: 1, // Độ dày của border dưới
    borderBottomColor: 'lightgray', // Màu của border dưới
    paddingVertical: 10, // Padding top và bottom của mỗi phần tử trong FlatList
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalReportContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền, có thể điều chỉnh độ mờ tùy ý
  },
  modalReportContent: {
    // flex: 1,
    justifyContent: 'center', // Hiển thị nội dung ở dưới
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    // height: '50%',
  },
  reportInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    color: 'black',
  },
  sendReportButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  sendReportButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapLocateScreen;
