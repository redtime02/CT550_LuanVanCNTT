import React, {useState} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    try {
      // Kiểm tra các trường đầu vào
      let hasError = false;
      if (!name.trim()) {
        setNameError('Vui lòng điền vào trường Họ tên');
        hasError = true;
      } else {
        setNameError('');
      }
      if (!email.trim()) {
        setEmailError('Vui lòng điền vào trường Email');
        hasError = true;
      } else {
        setEmailError('');
      }
      if (!address.trim()) {
        setAddressError('Vui lòng điền vào trường Địa chỉ');
        hasError = true;
      } else {
        setAddressError('');
      }
      if (!mobile.trim()) {
        setMobileError('Vui lòng điền vào trường Số điện thoại');
        hasError = true;
      } else {
        setMobileError('');
      }
      if (!password.trim()) {
        setPasswordError('Vui lòng điền vào trường Mật khẩu');
        hasError = true;
      } else {
        setPasswordError('');
      }
      if (!confirmPassword.trim()) {
        setConfirmPasswordError('Vui lòng điền vào trường Xác nhận mật khẩu');
        hasError = true;
      } else {
        setConfirmPasswordError('');
      }

      if (password !== confirmPassword) {
        // setPasswordError('Mật khẩu và xác nhận mật khẩu không khớp');
        setConfirmPasswordError('Mật khẩu và xác nhận mật khẩu không khớp');
        hasError = true;
      } else {
        setPasswordError('');
        setConfirmPasswordError('');
      }

      if (hasError) {
        return;
      }

      // Nếu tất cả các trường đã được điền, thực hiện đăng ký
      const response = await axios.post(
        'http://10.13.128.162:3000/api/auth/register',
        {
          name,
          email,
          address,
          mobile,
          password,
        },
      );

      if (response.status === 201) {
        Alert.alert('Đăng ký thành công!');
        // Đăng ký thành công, điều hướng sang trang đăng nhập
        navigation.replace('Login', {email, password});
      } else {
        console.log(response);

        // Đăng ký thất bại, hiển thị thông báo lỗi
        Alert.alert('Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      Alert.alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
    }
  };

  const handleLogin = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng Ký Tài Khoản Mới</Text>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ tên</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={text => {
                setName(text);
                setNameError('');
              }}
              placeholder="Nhập họ tên"
              placeholderTextColor="#999"
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError('');
              }}
              placeholder="Nhập email"
              placeholderTextColor="#999"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={text => {
                setAddress(text);
                setAddressError('');
              }}
              placeholder="Nhập địa chỉ"
              placeholderTextColor="#999"
            />
            {addressError ? (
              <Text style={styles.errorText}>{addressError}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={text => {
                setMobile(text);
                setMobileError('');
              }}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
            />
            {mobileError ? (
              <Text style={styles.errorText}>{mobileError}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError('');
              }}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#999"
              secureTextEntry
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#999"
              secureTextEntry
            />
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={{color: 'black', marginBottom: 20}}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = {
  container: {
    flexGrow: 1,
    backgroundColor: '#B0E0E6',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'contain',
  },

  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    paddingLeft: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
};
