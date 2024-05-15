import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';

const CollectRankingScreen = () => {
  const [users, setUsers] = useState([]);
  // Chuỗi thời gian theo định dạng ISO 8601
  // const isoTimeString = '2024-05-01T16:17:16.024+00:00';

  // // Tạo một đối tượng Date từ chuỗi thời gian
  // const date = new Date(isoTimeString);

  // // Lấy thông tin về ngày, tháng, năm, giờ, phút và giây
  // const day = date.getDate().toString().padStart(2, '0');
  // const month = (date.getMonth() + 1).toString().padStart(2, '0');
  // const year = date.getFullYear();
  // const hours = date.getHours().toString().padStart(2, '0');
  // const minutes = date.getMinutes().toString().padStart(2, '0');
  // const seconds = date.getSeconds().toString().padStart(2, '0');

  // // Tạo chuỗi mới theo định dạng dd/mm/yyyy hh:mm:ss
  // const formattedTimeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  // console.log(formattedTimeString);

  useEffect(() => {
    axios
      .get('http://10.13.128.162:3000/api/auth/users/role-collector')
      .then(response => {
        const sortedUsers = response.data.sort(
          (a, b) => b.collectCount - a.collectCount,
        );
        setUsers(sortedUsers);
        console.log(sortedUsers);
      })
      .catch(error => {
        console.log(error);

        console.error('Error fetching users:', error);
      });
  }, []);

  // const data = [
  //   {
  //     id: 1,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
  //     username: 'johndoe1',
  //   },
  //   {
  //     id: 2,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar2.png',
  //     username: 'johndoe2',
  //   },
  //   {
  //     id: 3,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar3.png',
  //     username: 'johndoe3',
  //   },
  //   {
  //     id: 4,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar4.png',
  //     username: 'johndoe4',
  //   },
  //   {
  //     id: 5,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
  //     username: 'johndoe5',
  //   },
  //   {
  //     id: 6,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
  //     username: 'johndoe6',
  //   },
  //   {
  //     id: 7,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
  //     username: 'johndoe7',
  //   },
  //   {
  //     id: 8,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar2.png',
  //     username: 'johndoe8',
  //   },
  //   {
  //     id: 9,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
  //     username: 'johndoe2',
  //   },
  //   {
  //     id: 10,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
  //     username: 'johndoe1',
  //   },
  //   {
  //     id: 11,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar2.png',
  //     username: 'johndoe2',
  //   },
  //   {
  //     id: 12,
  //     image: 'https://bootdey.com/img/Content/avatar/avatar3.png',
  //     username: 'johndoe3',
  //   },
  // ];

  // const [users, setUsers] = useState(data);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.header}>BẢNG XẾP HẠNG THU NHẶT</Text>
        <FlatList
          enableEmptySections={true}
          data={users}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity>
                <View style={styles.box}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: 'https://bootdey.com/img/Content/avatar/avatar6.png',
                    }}
                  />
                  <Text style={styles.username}>{item.name}</Text>
                  <View style={styles.iconContent}>
                    <Text style={styles.points}>{item.collectCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default CollectRankingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
  },
  body: {
    // backgroundColor: '#E6E6FA',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    color: 'black',
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
  iconContent: {
    width: 60,
    height: 60,
    backgroundColor: '#40E0D0',
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  points: {
    color: 'white', // Màu chữ
    fontSize: 20, // Kích thước chữ
    alignSelf: 'center', // Căn giữa
    // marginLeft: 'auto', // Đẩy về bên phải
    // marginRight: 10,
    // Để khoảng cách từ số điểm đến mép phải của box
  },
});
