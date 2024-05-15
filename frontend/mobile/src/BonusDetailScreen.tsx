// BonusDetailScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const BonusDetailScreen = ({route}) => {
  const {id, name, image, description, point} = route.params;
  const navigation = useNavigation();
  console.log({id, name, image, description, point});

  const clickEventListener = async () => {
    // Hiển thị cảnh báo yêu cầu xác nhận
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đổi thưởng này?',
      [
        {
          text: 'Không',
          onPress: () => console.log('Không chọn đổi thưởng'),
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: async () => {
            try {
              await axios.post('http://10.13.128.162:3000/api/reward', {
                bonusItemId: id,
              });
              // Hiển thị thông báo thành công
              Alert.alert('Thành công', 'Bạn đã đổi thưởng thành công', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Đã nhận'), // Điều hướng đến màn hình Bonus sau khi xác nhận thành công
                },
              ]);
            } catch (error) {
              console.error('Failed to confirm location:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 30,
            marginBottom: 200,
          }}>
          <Image
            style={styles.productImg}
            source={{
              uri: `http://10.13.128.162:3000/api/image/${image}`,
            }}
          />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>Điểm: {point}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {/* <View style={styles.starContainer}>
          <Image
            style={styles.star}
            source={{uri: 'https://img.icons8.com/color/40/000000/star.png'}}
          />
          <Image
            style={styles.star}
            source={{uri: 'https://img.icons8.com/color/40/000000/star.png'}}
          />
          <Image
            style={styles.star}
            source={{uri: 'https://img.icons8.com/color/40/000000/star.png'}}
          />
          <Image
            style={styles.star}
            source={{uri: 'https://img.icons8.com/color/40/000000/star.png'}}
          />
          <Image
            style={styles.star}
            source={{uri: 'https://img.icons8.com/color/40/000000/star.png'}}
          />
        </View>
        <View style={styles.contentColors}>
          <TouchableOpacity
            style={[
              styles.btnColor,
              {backgroundColor: '#00BFFF'},
            ]}></TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnColor,
              {backgroundColor: '#FF1493'},
            ]}></TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnColor,
              {backgroundColor: '#00CED1'},
            ]}></TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnColor,
              {backgroundColor: '#228B22'},
            ]}></TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnColor,
              {backgroundColor: '#20B2AA'},
            ]}></TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnColor,
              {backgroundColor: '#FF4500'},
            ]}></TouchableOpacity>
        </View>
        <View style={styles.contentSize}>
          <TouchableOpacity style={styles.btnSize}>
            <Text>S</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSize}>
            <Text>M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSize}>
            <Text>L</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSize}>
            <Text>XL</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.separator}></View>
        <View style={styles.addToCarContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => clickEventListener()}>
            <Text style={styles.shareButtonText}>Đổi thưởng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BonusDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  productImg: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    color: '#696969',
    fontSize: 16,
  },
  star: {
    width: 40,
    height: 40,
  },
  btnColor: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginHorizontal: 3,
  },
  btnSize: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderColor: '#778899',
    borderWidth: 1,
    marginHorizontal: 3,
    backgroundColor: 'white',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {
    justifyContent: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    marginTop: 20,
  },
  contentColors: {
    justifyContent: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    marginTop: 20,
  },
  contentSize: {
    justifyContent: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: '#eeeeee',
    marginTop: 20,
    marginHorizontal: 30,
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  addToCarContainer: {
    marginHorizontal: 30,
  },
});
