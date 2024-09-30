import React, {useEffect} from 'react';
import { View, StatusBar } from 'react-native';
import Header from './Telas/componentes/Header';
import Pesquisa from './Telas/Pesquisa';
import Feed from './Telas/Feed';
import FormPost from './Telas/FormPost';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Conta from './Telas/Conta';


function App() {
  const Tab = createBottomTabNavigator();



  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Header />
      <NavigationContainer>
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

              // Retorna o componente do ícone apropriado
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={Feed} options={{headerShown: false}} />
          <Tab.Screen name="Search" component={Pesquisa} options={{headerShown: false}} />
          <Tab.Screen name="Post" component={FormPost} options={{headerShown: false}} /> 
          <Tab.Screen name="Person" component={Conta} options={{headerShown: false, tabBarStyle: { display: 'none' } }} />


        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;
