import React, {useState} from 'react';
import {View, Text, Modal, Button} from 'react-native';

const MarkerInfoModal = ({visible, onClose, markerData}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <View>
        <Text>{markerData?.name}</Text>
        {/* Thêm các thông tin khác của marker tại đây */}
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default MarkerInfoModal;
