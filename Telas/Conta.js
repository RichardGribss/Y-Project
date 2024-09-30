
import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Perfil from './Perfil'; 
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const Conta = () => {
  const navigation = useNavigation();

  return (
  <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
<TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/566/566095.png'}} style={{width:25,height:25, margin:5}} />
</TouchableOpacity>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Perfil" component={Perfil} options={{headerShown: false}}/>
      </Stack.Navigator>
 </View>
  );
};

export default Conta;
