import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';

const FeedbackScreen = () => {
  // const profile = {
  //   name: 'Jane Doe',
  //   email: 'jane.doe@example.com',
  //   bio: 'Software engineer and cat lover',
  //   avatar: 'https://example.com/jane-doe-avatar.png',
  // };
  // const [name, setName] = useState(profile.name);
  // const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState('');
  // const [avatar, setAvatar] = useState(profile.avatar);

  const handleSubmit = async () => {
    try {
      await axios.post('http://10.13.128.162:3000/api/feedback', {
        message: bio,
      });
      Alert.alert('Thông báo', 'Gửi thành công!'); // Hiển thị thông báo "Gửi thành công"
      setBio(''); // Xóa nội dung trong ô input
      console.log('Feedback sent successfully!');
    } catch (error) {
      console.error('Error sending feedback:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {/* <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        /> */}
        <Text style={styles.label}>Nội dung liên hệ</Text>
        <TextInput
          style={[styles.input, {height: 150}]} // Đặt chiều cao mong muốn cho ô input
          multiline={true} // Cho phép nhiều dòng văn bản
          // placeholder="Nhập nội dung"
          value={bio}
          onChangeText={setBio}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  form: {
    width: '80%',
    top: 150,
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    color: 'black',
    backgroundColor: '#f6eeee',
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
    marginTop: 20,
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

export default FeedbackScreen;
