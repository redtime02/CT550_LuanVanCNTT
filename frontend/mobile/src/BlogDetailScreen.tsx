import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const post = {
  id: 1,
  title: 'Blog post title',
  image: 'https://www.bootdey.com/image/280x280/00BFFF/000000',
  author: 'Jane Doe',
  date: 'January 1, 2020',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.',
};

const BlogDetailScreen = ({route}) => {
  const {blogItem} = route.params;
  console.log(blogItem);
  const imageName = blogItem.image.split('\\').pop();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{blogItem.title}</Text>
      <View style={styles.meta}>
        {/* <Text style={styles.author}>by {blogItem.author}</Text> */}
        <Text style={styles.date}>{formatDateTime(blogItem.createdAt)}</Text>
      </View>
      <Image
        source={{uri: `http://10.13.128.162:3000/api/image/${imageName}`}}
        style={styles.image}
      />
      <Text style={styles.content}>{blogItem.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  author: {
    fontSize: 14,
    color: '#999',
    marginRight: 10,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginTop: 20,
    color: 'black',
  },
});

export default BlogDetailScreen;
