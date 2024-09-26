
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Perfil from './Perfil'; // Tela de registro, que você deve implementar.

const Stack = createNativeStackNavigator();

const Conta = () => {


  return (
  
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Perfil" component={Perfil} options={{headerShown: false}}/>
      </Stack.Navigator>
 
  );
};

export default Conta;
