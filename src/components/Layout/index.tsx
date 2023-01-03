import {Box, Image, Text, useColorModeValue} from 'native-base';
import React, {ReactNode} from 'react';
import {ImageBackground} from 'react-native';
import {colors} from '../../util/colors';
import Footer from '../Footer';

interface IProps {
  children: ReactNode;
}

export function Layout({children}: IProps) {
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={useColorModeValue('black', 'gray.800')}
        p={2}
      >
        <Box w={10}>
          <Image
            size={10}
            source={require('../../assets/images/logo_light.png')}
            alt="Sentinela Logo"
          />
        </Box>
        <Box>
          <Text color={'white'} style={{fontWeight: 'bold'}} fontSize={20}>
            SENTINELA
          </Text>
        </Box>
        <Box w={10}>
          <Text color={'white'} fontSize={13}>
            v2.0
          </Text>
        </Box>
      </Box>
      <Box
        backgroundColor={useColorModeValue(colors.grayBackground, 'gray.200')}
        flex={1}
        h={'100%'}
        padding={2}
        paddingTop={4}
      >
        <ImageBackground
          source={require('../../assets/images/wolf_bg_main.png')}
          resizeMode="contain"
          style={{
            flex: 1,
          }}
          imageStyle={{
            top: '40%',
          }}
        >
          {children}
        </ImageBackground>
      </Box>
      <Footer />
    </>
  );
}
