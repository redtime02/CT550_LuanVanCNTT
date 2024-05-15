import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const QuantityScreen = ({route}) => {
  const {id} = route.params;
  const [quantities, setQuantities] = useState([]);
  const [bottleName, setBottleName] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0.0);
  const [navigateToConfirm, setNavigateToConfirm] = useState(false);
  const navigation = useNavigation();
  const [validationMessage, setValidationMessage] = useState('');
  const [weightMax, setWeightMax] = useState(0.0);

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    if (navigateToConfirm) {
      // Navigate to Confirm screen when navigateToConfirm state is true
      navigation.navigate('Confirm', {totalScore, totalWeight, id});
      console.log(totalScore);
      console.log(totalWeight);
    }
  }, [navigateToConfirm]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://10.13.128.162:3000/api/location/${id}`,
      );
      const data = response.data;
      console.log(data);

      const tenVeChai = data;
      console.log(tenVeChai);

      setBottleName(tenVeChai);
      setQuantities(new Array(tenVeChai.length).fill('')); // Khởi tạo mảng quantities

      const response2 = await axios.get(
        `http://10.13.128.162:3000/api/location/mark/${id}`,
      );
      setWeightMax(response2.data.weightMax);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleChangeQuantity = (index, text) => {
    const newQuantities = [...quantities];
    newQuantities[index] = text;
    setQuantities(newQuantities);
    console.log(quantities);
  };

  const handleConfirmPress = () => {
    // Kiểm tra tính hợp lệ của dữ liệu nhập
    if (quantities.some(quantity => quantity === '' || isNaN(quantity))) {
      setValidationMessage('Vui lòng nhập số lượng hợp lệ');
      return;
    }

    // Tính tổng số ký
    let totalWeight = 0.0;
    quantities.forEach(quantity => {
      totalWeight += parseFloat(quantity);
    });

    // Kiểm tra nếu tổng số ký vượt quá weightMax
    if (totalWeight > weightMax) {
      setValidationMessage(
        `Tổng số ký đã vượt quá ${weightMax} ký. Vui lòng nhập lại.`,
      );
      return;
    } else {
      setValidationMessage('');
      calculateScore();
    }
  };

  const calculateScore = () => {
    let score = 0;
    let weight = 0.0;
    quantities.forEach(quantity => {
      score += parseFloat(quantity) * 50;
    });
    setTotalScore(score);
    quantities.forEach(quantity => {
      weight += parseFloat(quantity);
    });
    setTotalWeight(weight);
    setNavigateToConfirm(true);
    console.log(score);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập số ký</Text>
      <View style={styles.table}>
        {bottleName.map((bottle, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{bottle}</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => handleChangeQuantity(index, text)}
              value={quantities[index]}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
      {validationMessage !== '' && (
        <Text style={styles.validationMessage}>{validationMessage}</Text>
      )}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPress}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    marginBottom: '5%',
    fontSize: 20,
  },
  table: {
    width: '70%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  label: {
    flex: 2,
    color: 'black',
    paddingLeft: 20,
    fontSize: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 5,
    color: 'black',
    fontSize: 20,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  validationMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default QuantityScreen;
