import React from 'react';
import { View } from 'react-native';
import Header from './Telas/componentes/Header';
import PesquisaHub from './Telas/PesquisaHub';
import FeedHub from './Telas/FeedHub';
import FormPost from './Telas/FormPost';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Conta from './Telas/Conta';

function App() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Person') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Post') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: route.name !== 'Person', // Oculta o Header na tela 'Person'
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={FeedHub} options={{ headerShown: false,  tabBarLabel: () => null, }} />
          <Tab.Screen name="Search" component={PesquisaHub} options={{ headerShown: false,  tabBarLabel: () => null, }} />
          <Tab.Screen name="Post" component={FormPost} options={{ headerShown: false,  tabBarLabel: () => null, }} />
          <Tab.Screen name="Person" component={Conta} options={{ headerShown: false,  tabBarLabel: () => null, tabBarStyle: { display: 'none' } }} />
        </Tab.Navigator>
     
   
      </View>
    </NavigationContainer>
  );
}

export default App;
