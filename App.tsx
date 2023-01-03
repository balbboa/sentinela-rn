import 'expo-dev-client';
import React from 'react';
// Native Base
import { extendTheme, NativeBaseProvider, StatusBar } from 'native-base';
// Rotas
import Routes from './src/routes';
// Redux
import { Provider } from 'react-redux';
import store from './src/store/store.redux';
// Tema
const theme = extendTheme({
  fontConfig: {
    Roboto: {
      100: {
        normal: 'Roboto-Light',
        italic: 'Roboto-LightItalic',
      },
      200: {
        normal: 'Roboto-Light',
        italic: 'Roboto-LightItalic',
      },
      300: {
        normal: 'Roboto-Light',
        italic: 'Roboto-LightItalic',
      },
      400: {
        normal: 'Roboto-Regular',
        italic: 'Roboto-Italic',
      },
      500: {
        normal: 'Roboto-Medium',
      },
      600: {
        normal: 'Roboto-Medium',
        italic: 'Roboto-MediumItalic',
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
    mono: 'Roboto',
  },
});

// Componente principal
export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <StatusBar />
        <Routes />
      </NativeBaseProvider>
    </Provider>
  );
}
