import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ThankYouScreen = () => {
  const navigation = useNavigation();

  const handleNavigateHome = () => {
    navigation.replace('Collector', {screen: 'Home'});
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../uploads/tick_icon.png')} // Đường dẫn tới hình dấu tích
        style={styles.tickIcon}
      />
      <Text style={styles.confirmationText}>Xác nhận thu nhặt thành công!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleNavigateHome} style={styles.button}>
          <Text style={styles.buttonText}>Trở lại Trang Địa Điểm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#163e93',
  },
  tickIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20, // Cách phía dưới 20 pixel
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ThankYouScreen;
