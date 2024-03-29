import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const QuantityScreen = ({ route }) => {
  const { id } = route.params;
  const quantitiesRef = useRef([]);
  const [bottleName, setBottleName] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [navigateToConfirm, setNavigateToConfirm] = useState(false); // State to trigger navigation
  const navigation = useNavigation();

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    if (navigateToConfirm) {
      // Navigate to Confirm screen when navigateToConfirm state is true
      navigation.navigate('Confirm', { totalScore, id });
      console.log(totalScore);
    }
  }, [navigateToConfirm]); // Execute this effect when navigateToConfirm changes

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.1.5:3000/api/location/${id}`);
      const data = response.data;
      console.log(data);

      const tenVeChai = data;
      console.log(tenVeChai);

      setBottleName(tenVeChai);
      console.log(bottleName);

      quantitiesRef.current = new Array(tenVeChai.length).fill('');
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleChangeQuantity = (index, text) => {
    quantitiesRef.current[index] = text;
    console.log(quantitiesRef);
  };

  const handleConfirmPress = () => {
    calculateScore();
  };

  const calculateScore = () => {
    let score = 0;
    quantitiesRef.current.forEach((quantity) => {
      score += parseInt(quantity) * 50;
    });
    setTotalScore(score);
    setNavigateToConfirm(true); // Set the state to trigger navigation to Confirm screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập số lượng</Text>
      <View style={styles.table}>
        {bottleName.map((bottle, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{bottle}</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChangeQuantity(index, text)}
              value={quantitiesRef.current[index]}
              keyboardType="numeric"
              placeholder="Nhập số lượng"
            />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
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
    marginBottom: '30%',
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
    fontSize: 20
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 5,
    color: 'black',
    fontSize: 20
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
});

export default QuantityScreen;
