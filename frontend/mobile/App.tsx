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
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" options={{headerShown: false}}>
          {() => (
            <Tab.Navigator>
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
              />
              <Tab.Screen
                name="Locate"
                component={LocateScreen}
                options={{headerShown: false}}
              />
              <Tab.Screen
                name="Other"
                component={OtherScreen}
                options={{headerShown: false}}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Collector" options={{headerShown: false}}>
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="List" component={ListScreen} />
              <Tab.Screen name="Collected" component={CollectedScreen} />
              <Tab.Screen
                name="Other"
                component={OtherScreen}
                options={{headerShown: false}}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="MapLocate" component={MapLocateScreen} />
        <Stack.Screen name="Quantity" component={QuantityScreen} />
        <Stack.Screen name="Confirm" component={ConfirmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
