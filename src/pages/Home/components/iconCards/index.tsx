// React
import {Box, Center, Text, useColorModeValue} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Card} from '../../../../components/Card';

interface IconCardsProps {
  icon: JSX.Element;
  name: string;
  onPress: () => void;
}

export default function IconCards(props: IconCardsProps) {
  return (
    <Card style={{w: '30%'}}>
      <TouchableOpacity onPress={props.onPress}>
        <Center flexDirection={'column'} alignItems={'center'}>
          <Box>{props.icon}</Box>
          <Box>
            <Text
              color={useColorModeValue('white', 'gray.500')}
              fontSize={'md'}
              fontFamily="heading"
              style={{fontWeight: 'bold'}}
            >
              {props.name}
            </Text>
          </Box>
        </Center>
      </TouchableOpacity>
    </Card>
  );
}
