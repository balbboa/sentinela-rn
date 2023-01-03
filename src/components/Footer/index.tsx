import {Feather, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {
  Box,
  Center,
  HStack,
  Icon,
  Pressable,
  Text,
  useColorMode,
  useColorModeValue,
} from 'native-base';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {IApproachRegister} from '../../pages/NewApproach/interfaces';
import {setApproach} from '../../store/actions';
import {TNavigate} from '../../util/types';
// UUID
import uuid from 'react-native-uuid';
import {INITIAL_APPROACH} from '../../store/initialData';
import {Alert} from 'react-native';

interface IFooter {
  approach: IApproachRegister;
  syncApproachLength: number;
  dispatch: any;
}

const Footer = ({approach, dispatch, syncApproachLength}: IFooter) => {
  const [selected, setSelected] = useState(-1);
  const navigation = useNavigation<TNavigate>();
  const {toggleColorMode, colorMode} = useColorMode();

  const handleGoHome = async () => {
    // Inicia a abordagem sem dados
    const newApproach: IApproachRegister = {
      ...INITIAL_APPROACH,
      id: String(uuid.v4()),
      peoples: [],
      photos: [],
      vehicles: [],
    };
    await dispatch(setApproach(approach, newApproach));
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}],
      }),
    );
  };

  // JSX
  return (
    <Box bg="white" safeAreaTop width="100%" alignSelf="center">
      <HStack
        bg={useColorModeValue('black', 'gray.800')}
        alignItems="center"
        safeAreaBottom
        shadow={6}
      >
        <Pressable
          py="3"
          flex={1}
          onPress={async () => {
            setSelected(0), await handleGoHome();
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={
                <MaterialCommunityIcons
                  name={selected === 0 ? 'home' : 'home-outline'}
                />
              }
              color="white"
              size="sm"
            />
            <Text color="white" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>
        <Pressable
          py="2"
          flex={1}
          onPress={() => {
            setSelected(1);
            navigation.navigate('Sync');
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={
                <MaterialCommunityIcons
                  name={selected === 1 ? 'cloud-sync' : 'cloud-sync-outline'}
                />
              }
              color="white"
              size="sm"
            />
            <Text color="white" fontSize="12">
              Sincronizar ({syncApproachLength})
            </Text>
          </Center>
        </Pressable>
        <Pressable
          py="2"
          flex={1}
          onPress={() => {
            setSelected(2), toggleColorMode();
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={
                colorMode === 'dark' ? (
                  <Ionicons name={'moon'} />
                ) : (
                  <Feather name="sun" />
                )
              }
              color="white"
              size="sm"
            />
            <Text color="white" fontSize="12">
              Cor
            </Text>
          </Center>
        </Pressable>
        <Pressable
          py="2"
          flex={1}
          onPress={() => {
            setSelected(3),
              Alert.alert('Atenção! 🚨', 'Deseja sair do aplicativo?', [
                {
                  text: 'SAIR DO APLICATIVO',
                  onPress: () =>
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [{name: 'Login'}],
                      }),
                    ),
                },
                {text: 'FECHAR'},
              ]);
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={
                <Ionicons
                  name={selected === 3 ? 'exit-outline' : 'exit-outline'}
                />
              }
              color="white"
              size="sm"
            />
            <Text color="white" fontSize="12">
              Sair
            </Text>
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default connect(
  (state: {approach: IApproachRegister; syncApproachLength: number}) => ({
    approach: state.approach,
    syncApproachLength: state.syncApproachLength,
  }),
)(Footer);
