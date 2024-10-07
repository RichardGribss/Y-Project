import { createStackNavigator } from '@react-navigation/stack';
import Feed from './Feed'; 
import Usuario from './Usuario';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }}/>
      <Stack.Screen name="Usuario" component={Usuario} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
