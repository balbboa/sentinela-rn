import {Box, useColorModeValue} from 'native-base';
import {InterfaceBoxProps} from 'native-base/lib/typescript/components/primitives/Box/types';
import React, {ReactNode} from 'react';
import {colors} from '../../util/colors';

interface IProps {
  children: ReactNode;
  style?: InterfaceBoxProps;
}

export function Card({children, style}: IProps) {
  return (
    <Box
      rounded="lg"
      overflow="hidden"
      backgroundColor={useColorModeValue(colors.grayCard, 'gray.50')}
      padding={2}
      mb={4}
      {...style}
    >
      {children}
    </Box>
  );
}
