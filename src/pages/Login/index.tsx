import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Input,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
// React
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
// Tipos
import {TNavigate} from '../../util/types';
// React Native
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
// Icons
import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
// Cores
import {colors} from '../../util/colors';
// API
import axios from 'axios';
import {baseURL} from '../../services/api';
// Controllers
import {
  createUser,
  findUser,
  findUserByUsername,
  IUser,
  updateUser,
} from '../../services/controllers/userController';
import {
  createSession,
  destroySessions,
  getSession,
} from '../../services/controllers/sessionController';
// UUID
import uuid from 'react-native-uuid';
// BASE64
import {Base64} from 'js-base64';
// Expo
import * as Network from 'expo-network';
interface IUserRequest {
  user: {
    id: number;
    name: string;
    email: string;
    registration: string;
    organizationId: 1;
    status: boolean;
    organizations: {
      id: 1;
      name: string;
    };
    groups: [
      {
        group: {
          id: number;
          name: string;
        };
      },
    ];
  };
  token: string;
}

export default function Login() {
  // Hooks
  // Navegação
  const navigation = useNavigation<TNavigate>();
  // Login
  const [login, setLogin] = useState({
    username: '',
    password: '',
    remember: false,
  });

  // Funções

  // Realiza o login na API
  const handleAPILogin = async () => {
    // Verifica a conexão
    const network = await Network.getNetworkStateAsync();
    // Verifica se está conectado com a internet e faz o login online
    if (network.isConnected) {
      // Remove a sessão anterior
      await destroySessions();
      await axios
        .post(baseURL + 'api/auth/login', {
          email: login.username,
          password: login.password,
        })
        .then(async function (response) {
          const userRequest: IUserRequest = response.data;
          // Verifica se o usuário está bloqueado
          if (userRequest.user.status) {
            const localUser = await findUser(userRequest.user.id);
            // Cria ou atualiza os dados do usuário
            const newUser: IUser = {
              id: userRequest.user.id,
              name: userRequest.user.name,
              email: userRequest.user.email,
              password: Base64.encode(login.password),
              registration: userRequest.user.registration,
              organizationsId: userRequest.user.organizationId,
              status: userRequest.user.status,
              organizationName: userRequest.user.organizations.name,
              token: userRequest.token,
            };
            // Caso exista um usuário local, ele é atualizado
            if (localUser) {
              try {
                await updateUser(newUser);
              } catch (error) {
                console.log('======start======');
                console.log(error);
                console.log('======end======');
                console.log('Erro ao atualizar o usuário local');
              }
            } else {
              // cria o usuário local e a sessão
              try {
                await createUser(newUser);
              } catch (error) {
                console.log('======start======');
                console.log(error);
                console.log('======end======');
                console.log('Erro ao criar o usuário local');
              }
            }
            // Remove a sessão anterior
            await destroySessions();
            // Cria uma sessão
            try {
              await createSession({
                created_at: new Date(),
                id: String(uuid.v4()),
                remember: login.remember,
                userId: userRequest.user.id,
                organizationsId: userRequest.user.organizationId,
              });
              navigation.navigate('Home');
            } catch (error) {
              console.log('Erro ao criar a sessão');
            }
          } else {
            Alert.alert(
              'Ocorreu um erro no login! 🚨',
              'O seu usuário encontra-se bloqueado, entre em contato com o responsável pelo sistema',
              [{text: 'FECHAR'}],
            );
          }
        })
        .catch(function (error) {
          Alert.alert(
            'Ocorreu um erro no login! 🚨',
            'Seu usuário ou senha pode estar incorretos, tente novamente mais tarde ou entre em contato com o setor de TI',
            [{text: 'FECHAR'}],
          );
          console.log(error);
        });
    } else {
      // Realiza o login offline

      try {
        const localUser = await findUserByUsername(login.username);
        if (localUser) {
          if (localUser.password === Base64.encode(login.password)) {
            try {
              try {
                // Cadastra uma nova sessão
                await createSession({
                  id: String(uuid.v4()),
                  userId: localUser.id,
                  remember: login.remember,
                  organizationsId: localUser.organizationsId,
                  created_at: new Date(),
                });
                navigation.navigate('Home');
              } catch (error) {
                console.log('Erro ao criar a sessão: ' + error);
              }
            } catch (error) {
              console.log('Erro ao deletar as sessões:' + error);
            }
          } else {
            Alert.alert(
              'Erro nos dados digitados! 🚨',
              'A senha digitada é inválida',
              [{text: 'FECHAR'}],
            );
          }
        } else {
          Alert.alert(
            'Erro na autenticação! 🚨',
            'Usuário inválido, se for o seu primeiro acesso, necessita estar conectado a internet',
            [{text: 'FECHAR'}],
          );
        }
      } catch (error: any) {
        Alert.alert('Erro ao buscar o usuário! 🚨', String(error.message), [
          {text: 'FECHAR'},
        ]);
      }
    }
  };

  // Verifica se a ultima sessão foi lembrada
  const handleRememberSession = async () => {
    try {
      const session = await getSession();
      if (session)
        if (session.remember) {
          const user = await findUser(session.userId);
          setLogin({
            username: user.email,
            password: Base64.decode(user.password),
            remember: session.remember,
          });
        }
    } catch (error) {
      console.log('======start======');
      console.log(error);
      console.log('======end======');
      console.log('Erro ao lembrar a ultima sessão');
    }
  };

  useEffect(() => {
    handleRememberSession();
  }, []);

  // JSX
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        resizeMode="cover"
        style={{justifyContent: 'center', flex: 1}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
        >
          {/* Login */}

          <Center w="100%" h="100%">
            <Center mb={5}>
              <Image
                size={150}
                source={require('../../assets/images/logo_light.png')}
                alt="Sentinela Logo"
              />
            </Center>
            <Heading
              size="lg"
              fontWeight="bold"
              color="gray.50"
              style={{fontWeight: 'bold'}}
            >
              SENTINELA
            </Heading>

            {/* Formulário */}

            <Box
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              p="5"
              w="90%"
              maxW="290"
            >
              <VStack space={3}>
                <Text
                  fontSize={18}
                  color={'white'}
                  style={{fontWeight: 'bold'}}
                >
                  Usuário
                </Text>
                <Input
                  size="lg"
                  placeholder="Login de acesso"
                  color={useColorModeValue('white', 'gray.600')}
                  bg={useColorModeValue('gray.600', 'gray.100')}
                  borderColor={'gray.500'}
                  value={login.username}
                  onChange={data =>
                    setLogin({...login, username: data.nativeEvent.text})
                  }
                />
                <Text
                  fontSize={18}
                  color={'white'}
                  style={{fontWeight: 'bold'}}
                >
                  Senha
                </Text>
                <Input
                  size="lg"
                  type="password"
                  placeholder="************"
                  borderColor={'gray.500'}
                  color={useColorModeValue('white', 'gray.600')}
                  bg={useColorModeValue('gray.600', 'gray.100')}
                  value={login.password}
                  onChange={data =>
                    setLogin({...login, password: data.nativeEvent.text})
                  }
                />
                <Button
                  rightIcon={
                    login.remember ? (
                      <AntDesign name="checksquareo" size={18} color="white" />
                    ) : (
                      <MaterialIcons
                        name="cancel-presentation"
                        size={18}
                        color="white"
                      />
                    )
                  }
                  onPress={() => {
                    setLogin({...login, remember: !login.remember});
                  }}
                  size="sm"
                  colorScheme="light"
                >
                  Lembrar minha senha
                </Button>
                {/* Botão de entrar */}
                <Button
                  size={'lg'}
                  rightIcon={
                    <Ionicons name="enter-outline" size={24} color="white" />
                  }
                  colorScheme="light"
                  onPress={async () => await handleAPILogin()}
                  bg={useColorModeValue(colors.graySky, colors.graySkyHover)}
                >
                  ENTRAR
                </Button>
              </VStack>
            </Box>
          </Center>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
}
