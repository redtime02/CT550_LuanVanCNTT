import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import axios from 'axios';

const UncollectListScreen = ({navigation}) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu từ localhost:3000/api/blog
    axios
      .get('http://10.13.128.162:3000/api/location/uncollect-by')
      .then(response => {
        // Nếu thành công, cập nhật state với dữ liệu từ API
        const sortedComments = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setComments(sortedComments);
        console.log(sortedComments);
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Error fetching data:', error);
      });
  }, [comments]);

  // Hàm chuyển đổi định dạng của createdAt
  const formatDateTime = datetime => {
    const date = new Date(datetime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Hàm xử lý khi nhấp vào phần tử trong danh sách
  //   const handlePress = item => {
  //     // Điều hướng đến màn hình BlogDetail và chuyển dữ liệu của phần tử được nhấp vào
  //     navigation.navigate('BlogDetail', {blogItem: item});
  //   };

  return (
    <FlatList
      style={styles.root}
      data={comments}
      ItemSeparatorComponent={() => {
        return <View style={styles.separator} />;
      }}
      keyExtractor={item => {
        return item._id.toString(); // Chuyển id sang chuỗi vì key phải là chuỗi
      }}
      renderItem={item => {
        const List = item.item;
        const imageName = List?.images[0].split('\\').pop();
        return (
          <TouchableOpacity>
            <View style={styles.container}>
              <Image
                style={styles.image}
                source={{
                  uri: `http://10.13.128.162:3000/api/image/${imageName}`,
                }}
              />
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <Text style={styles.name}>{List?.name}</Text>
                </View>
                {/* <Text
                  style={styles.comment}
                  rkType="primary3 mediumLine"
                  numberOfLines={1}>
                  {Notification.content.length > 50
                    ? `${Notification.content.substring(0, 50)}...`
                    : Notification.content}
                </Text> */}
                <Text style={styles.time}>
                  Ngày đánh dấu: {formatDateTime(List.createdAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default UncollectListScreen;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginLeft: 20,
  },
  time: {
    fontSize: 12,
    color: '#221a1a',
    marginTop: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  comment: {
    color: 'black',
    overflow: 'hidden',
  },
});
