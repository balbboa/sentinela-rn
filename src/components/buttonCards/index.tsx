// Native Base
import {Box, Text, useColorModeValue} from 'native-base';
// React
import React from 'react';
// React Native
import {TouchableOpacity} from 'react-native';
// Tipos
import {TNavigate} from '../../util/types';
// Navigate
import {useNavigation} from '@react-navigation/native';
// Componentes interno
import {Card} from '../Card';

interface ButtonCardsProps {
  icon: JSX.Element;
  name: string;
  description: string;
  onPressPage: string;
}

export default function ButtonCards(props: ButtonCardsProps) {
  const navigation = useNavigation<TNavigate>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(props.onPressPage)}>
      <Card>
        <Box flexDirection={'row'} alignItems={'center'} h={60}>
          <Box ml={2}>{props.icon}</Box>
          <Box>
            <Text
              color={useColorModeValue('white', 'gray.500')}
              ml={4}
              fontSize={'lg'}
              fontFamily="heading"
              style={{fontWeight: 'bold'}}
            >
              {props.name}
            </Text>
            <Text
              color={useColorModeValue('white', 'gray.500')}
              ml={4}
              mr={10}
              mb={1}
              fontSize={'xs'}
              fontFamily="body"
            >
              {props.description}
            </Text>
          </Box>
          <Box></Box>
        </Box>
      </Card>
    </TouchableOpacity>
  );
}
