/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits. Awespdrgdrg
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '100',
//   },
// });

// export default App;

// App.tsx

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faUser,
  faList,
  faMarker,
  faEnvelope,
  faClockRotateLeft,
  faCheck,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import OtherScreen from './src/OtherScreen';
import LocateScreen from './src/LocateScreen';
import MapScreen from './src/MapScreen';
import ListScreen from './src/ListScreen';
import MapLocateScreen from './src/MapLocateScreen';
import QuantityScreen from './src/QuantityScreen';
import ConfirmScreen from './src/ConfirmScreen';
import CollectedScreen from './src/CollectedScreen';
import ThankYouScreen from './src/ThankYouScreen';
import BonusScreen from './src/BonusScreen';
import BonusDetailScreen from './src/BonusDetailScreen';
import BonusEarnedScreen from './src/BonusEarnedScreen';
import CollectRankingScreen from './src/CollectRankingScreen';
import BlogScreen from './src/BlogScreen';
import NotifyScreen from './src/NotifyScreen';
import BlogDetailScreen from './src/BlogDetailScreen';
import RegisterScreen from './src/RegisterScreen';
import CollectListScreen from './src/CollectListScreen';
import UncollectListScreen from './src/UncollectListScreen';
import CollectingListScreen from './src/CollectingListScreen';
import EditProfileScreen from './src/EditProfileScreen';
import FeedbackScreen from './src/FeedbackScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const BonusStack = createMaterialTopTabNavigator();
const NotifyStack = createMaterialTopTabNavigator();
const ListStack = createMaterialTopTabNavigator();

const BonusStackScreen = () => (
  <BonusStack.Navigator>
    <BonusStack.Screen name="Danh sách quà" component={BonusScreen} />
    <BonusStack.Screen name="Đã nhận" component={BonusEarnedScreen} />
  </BonusStack.Navigator>
);

const NotifyStackScreen = () => (
  <NotifyStack.Navigator>
    <NotifyStack.Screen name="Hệ thống" component={BlogScreen} />
    <NotifyStack.Screen name="Người dùng" component={NotifyScreen} />
  </NotifyStack.Navigator>
);

const ListStackScreen = () => (
  <ListStack.Navigator>
    <ListStack.Screen name="Yêu cầu thu nhặt" component={UncollectListScreen} />
    <ListStack.Screen
      name="Xác nhận thu nhặt"
      component={CollectingListScreen}
    />
    <ListStack.Screen name="Đã thu nhặt" component={CollectListScreen} />
  </ListStack.Navigator>
);

const MainDrawer = () => (
  <Drawer.Navigator initialRouteName="Trang chủ">
    <Drawer.Screen name="Home" component={TabNavigator} options={{title: ''}} />
    {/* <Drawer.Screen name="Home" component={HomeScreen} /> */}
    <Drawer.Screen name="Đổi quà" component={BonusStackScreen} />
    <Drawer.Screen name="Liên hệ" component={FeedbackScreen} />
  </Drawer.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Trang chủ"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon icon={faHome} color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Đánh dấu"
      component={LocateScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon icon={faMarker} color={color} size={size} />
        ),
      }}
    />
    {/* <Tab.Screen
      name="Feedback"
      component={BonusStackScreen}
      options={{headerShown: false}}
    /> */}
    <Tab.Screen
      name="Thông báo"
      component={NotifyStackScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon icon={faEnvelope} color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Lịch sử"
      component={ListStackScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon icon={faClockRotateLeft} color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Tôi"
      component={OtherScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon icon={faUser} color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          options={{headerShown: false}}
          component={MainDrawer}
        />
        <Stack.Screen name="Collector" options={{headerShown: false}}>
          {() => (
            <Tab.Navigator>
              <Tab.Screen
                name="Danh sách"
                component={ListScreen}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <FontAwesomeIcon icon={faList} color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Đã thu nhặt"
                component={CollectedScreen}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <FontAwesomeIcon icon={faCheck} color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Xếp hạng"
                component={CollectRankingScreen}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <FontAwesomeIcon
                      icon={faRankingStar}
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Tôi"
                component={OtherScreen}
                options={{
                  headerShown: false,
                  tabBarIcon: ({color, size}) => (
                    <FontAwesomeIcon icon={faUser} color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Bản đồ đánh dấu" component={MapScreen} />
        <Stack.Screen name="MapLocate" component={MapLocateScreen} />
        <Stack.Screen name="Quantity" component={QuantityScreen} />
        <Stack.Screen name="Confirm" component={ConfirmScreen} />
        <Stack.Screen name="BonusDetail" component={BonusDetailScreen} />
        <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="ThankYou"
          component={ThankYouScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
