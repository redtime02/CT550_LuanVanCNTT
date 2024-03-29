import axios from 'axios';
import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://192.168.100.66:3000/api/auth/login',
        {
          email,
          password,
        },
      );
      // Phản hồi từ backend có thể được truy cập qua response.data
      // Ví dụ: nếu backend trả về một đối tượng user, bạn có thể lưu thông tin người dùng hoặc chuyển đến màn hình khác
      console.log(response.data); // Hiển thị dữ liệu từ backend trong console

      // Kiểm tra role từ phản hồi của backend
      const {user} = response.data;
      

      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem('token', response.data.token);
      console.log(response.data.token);
      
      const role = user.role;
      console.log(role);
        

      // Điều hướng tùy thuộc vào vai trò
      if (role === 'user') {
        // Đăng nhập thành công với vai trò là user, chuyển hướng đến trang Home
        navigation.replace('Main', {screen: 'Home'});
      } else if (role === 'collector') {
        // Đăng nhập thành công với vai trò là collector, hiển thị thông báo
        // Đăng nhập thành công với vai trò là user, chuyển hướng đến trang Home
        navigation.replace('Collector', {screen: 'Home'});
      }
    } catch (error) {
      console.log(error);

      // Xử lý khi đăng nhập không thành công (ví dụ: hiển thị thông báo lỗi)
      Alert.alert('Error', 'Đăng nhập không thành công');
    }
  };

  // Thêm interceptor để tự động thêm token vào Header cho mỗi yêu cầu
  axios.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <TextInput
    //     style={{
    //       borderWidth: 1,
    //       borderColor: 'gray',
    //       width: 200,
    //       height: 40,
    //       marginBottom: 10,
    //       paddingHorizontal: 10,
    //       color: 'black',
    //     }}
    //     placeholder="email"
    //     placeholderTextColor="gray" // Màu sắc của văn bản placeholder
    //     value={email}
    //     onChangeText={setEmail}
    //   />
    //   <TextInput
    //     style={{
    //       borderWidth: 1,
    //       borderColor: 'gray',
    //       width: 200,
    //       height: 40,
    //       marginBottom: 10,
    //       paddingHorizontal: 10,
    //       color: 'black',
    //     }}
    //     placeholder="Password"
    //     placeholderTextColor="gray" // Màu sắc của văn bản placeholder
    //     value={password}
    //     onChangeText={setPassword}
    //     secureTextEntry
    //   />
    //   <Button title="Đăng nhập" onPress={handleLogin} />
    // </View>
    <View style={styles.container}>
    <View style={styles.inputContainer}>
      <Image
        style={[styles.icon, styles.inputIcon]}
        source={{ uri: 'https://img.icons8.com/ios-filled/512/circled-envelope.png' }}
      />
      <TextInput
        style={styles.inputs}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        underlineColorAndroid="transparent"
        value={email}
        onChangeText={setEmail}
      />
    </View>

    <View style={styles.inputContainer}>
      <Image
        style={[styles.icon, styles.inputIcon]}
        source={{ uri: 'https://img.icons8.com/ios-glyphs/512/key.png' }}
      />
      <TextInput
        style={styles.inputs}
        placeholder="Mật khẩu"
        placeholderTextColor="gray"
        secureTextEntry={true}
        underlineColorAndroid="transparent"
        value={password}
        onChangeText={setPassword}
      />
    </View>

    <TouchableOpacity style={styles.restoreButtonContainer}>
      <Text style={{ color: 'black' }}>Quên mật khẩu?</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={handleLogin}>
        <Text style={styles.loginText}>Đăng nhập</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonContainer}>
      <Text style={{ color: 'black' }}>Đăng ký</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}>
      <View style={styles.socialButtonContent}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/facebook.png' }}
        />
        <Text style={styles.loginText}>Đăng nhập bằng Facebook</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.buttonContainer, styles.googleButton]}>
      <View style={styles.socialButtonContent}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/youtube.png' }}
        />
        <Text style={styles.loginText}>Đăng nhập bằng Google</Text>
      </View>
    </TouchableOpacity>
  </View>
  );
};

export default LoginScreen;

// // LoginScreen.js

// import React, {useState} from 'react';
// import {View, TextInput, Button} from 'react-native';

// const LoginScreen = ({navigation, onLogin}) => {
//   // Thêm onLogin vào props
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Thực hiện kiểm tra đăng nhập, ví dụ đơn giản là kiểm tra username và password
//     if (username.trim() === 'admin' && password.trim() === 'admin') {
//       // Nếu đăng nhập thành công, gửi thông báo đến thành phần cha
//       onLogin(); // Gọi hàm onLogin để thông báo đăng nhập thành công
//     } else {
//       // Xử lý khi đăng nhập không thành công (ví dụ: hiển thị thông báo lỗi)
//       alert('Đăng nhập không thành công');
//     }
//   };

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <TextInput
//         style={{
//           borderWidth: 1,
//           borderColor: 'gray',
//           width: 200,
//           height: 40,
//           marginBottom: 10,
//           paddingHorizontal: 10,
//           color: 'black',
//         }}
//         placeholder="Username"
//         placeholderTextColor="gray"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         style={{
//           borderWidth: 1,
//           borderColor: 'gray',
//           width: 200,
//           height: 40,
//           marginBottom: 10,
//           paddingHorizontal: 10,
//           color: 'black',
//         }}
//         placeholder="Password"
//         placeholderTextColor="gray"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Đăng nhập" onPress={handleLogin} />
//     </View>
//   );
// };

// export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B0E0E6',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    color: 'black'
  },
  icon: {
    width: 30,
    height: 30,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#3498db',
  },
  fabookButton: {
    backgroundColor: '#3b5998',
  },
  googleButton: {
    backgroundColor: '#ff0000',
  },
  loginText: {
    color: 'white',
  },
  restoreButtonContainer: {
    width: 250,
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  socialButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    color: '#FFFFFF',
    marginRight: 5,
  },
})
