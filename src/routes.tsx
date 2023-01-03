import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import NewApproach from './pages/NewApproach';
import RegisterCars from './pages/NewApproach/RegisterCars';
import NewPerson from './pages/NewApproach/NewPerson';
import RegisterPhoto from './pages/NewApproach/NewPerson/RegisterPhoto';
import RegisterDocument from './pages/NewApproach/NewPerson/RegisterDocument';
import RegisterImages from './pages/NewApproach/RegisterImages';
import Sync from './pages/Sync';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Em desenvolvimento */}

        {/* Lista de páginas */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NewApproach" component={NewApproach} />
        <Stack.Screen name="NewPerson" component={NewPerson} />
        <Stack.Screen name="RegisterPhoto" component={RegisterPhoto} />
        <Stack.Screen name="RegisterDocument" component={RegisterDocument} />
        <Stack.Screen name="RegisterCars" component={RegisterCars} />
        <Stack.Screen name="RegisterImages" component={RegisterImages} />
        <Stack.Screen name="Sync" component={Sync} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
