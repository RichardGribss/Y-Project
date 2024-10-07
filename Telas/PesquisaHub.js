import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Pesquisa from './Pesquisa'
import Usuario from './Usuario';

const Stack = createStackNavigator();

export default function PesquisaHub() {
  return (

      <Stack.Navigator >
        <Stack.Screen name="Pesquisa" component={Pesquisa} options={{ headerShown: false }} />
        <Stack.Screen name="Usuario" component={Usuario} />
      </Stack.Navigator>

  );
}
