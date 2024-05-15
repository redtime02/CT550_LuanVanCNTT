import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// const NavigationBar = () => {
//   const [selectedItem, setSelectedItem] = useState('Bonus');
//   const navigation = useNavigation();

//   const handlePress = item => {
//     setSelectedItem(item);
//     navigation.navigate(item);
//   };

//   return (
//     <View style={styles.navBar}>
//       <TouchableOpacity
//         onPress={() => handlePress('Bonus')}
//         style={[
//           styles.navItem,
//           selectedItem === 'Bonus' && styles.selectedNavItem,
//         ]}>
//         <Text style={styles.navItemText}>Danh sách quà</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => handlePress('BonusEarned')}
//         style={[
//           styles.navItem,
//           selectedItem === 'BonusEarned' && styles.selectedNavItem,
//         ]}>
//         <Text style={styles.navItemText}>Qùa đã nhận</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const BonusScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://10.13.128.162:3000/api/bonus');
      const modifiedData = response.data.bonusItems.map(item => {
        return {
          ...item,
          image: extractFilenameFromUrl(item.image),
        };
      });
      setProducts(modifiedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNavigate = (id, name, image, description, point) => {
    navigation.navigate('BonusDetail', {id, name, image, description, point});
  };

  const extractFilenameFromUrl = url => {
    const parts = url.split('\\');
    return parts[parts.length - 1];
  };

  return (
    <View style={styles.container}>
      {/* <NavigationBar /> */}
      <View style={styles.content}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={products}
          horizontal={false}
          numColumns={2}
          keyExtractor={item => item._id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={post => {
            const item = post.item;
            return (
              <TouchableWithoutFeedback
                onPress={() =>
                  handleNavigate(
                    item._id,
                    item.name,
                    item.image,
                    item.description,
                    item.point,
                  )
                }>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.title}>{item?.name}</Text>
                    </View>
                  </View>
                  <Image
                    style={styles.cardImage}
                    source={{
                      uri: `http://10.13.128.162:3000/api/image/${item?.image}`,
                    }}
                  />
                  <View style={styles.cardFooter}>
                    <View style={styles.socialBarContainer}>
                      <View style={styles.socialBarSection}>
                        <TouchableOpacity style={styles.socialBarButton}>
                          <Image
                            style={styles.icon}
                            source={{
                              uri: 'https://img.icons8.com/color/50/000000/hearts.png',
                            }}
                          />
                          <Text style={styles.socialBarlabel}>
                            {item?.point}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    height: 50,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    color: '#fff',
  },
  selectedNavItem: {
    height: 50,
    backgroundColor: '#3498db',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
    width: '100%',
  },
  listContainer: {
    flexDirection: 'column',
  },
  separator: {
    marginTop: 10,
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: {width: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor: 'white',
    flexBasis: '47%',
    marginHorizontal: '1.5%',
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  title: {
    fontSize: 18,
    flex: 1,
    color: 'black',
  },
  icon: {
    width: 25,
    height: 25,
  },
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    color: 'black',
  },
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BonusScreen;
