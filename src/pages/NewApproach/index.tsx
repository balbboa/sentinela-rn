import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  ScrollView,
  Select,
  Text,
  TextArea,
  useColorModeValue,
} from 'native-base';
// React
import React, {Fragment, useEffect, useState} from 'react';
// React Native
import {Alert} from 'react-native';
// Componentes interno
import {Card} from '../../components/Card';
// Layout
import {Layout} from '../../components/Layout';
// Icones
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
// Geolocalização
import Geolocation from '@react-native-community/geolocation';
// Funções locais
import {requestLocationPermission} from './functions';
// Dado estático
import {BRAZIL_STATES} from '../../util/staticData';
//Navegação entre paginas
import {CommonActions, useNavigation} from '@react-navigation/native';
import {TNavigate} from '../../util/types';
// Componentes interno
import ButtonCards from '../../components/buttonCards';
// Redux
import {connect} from 'react-redux';
import {setApproach, setPeople} from '../../store/actions';
// Interfaces
import {IApproachRegister, IPeopleRegister} from './interfaces';
// UUID
import uuid from 'react-native-uuid';
// Dado inicial
import {INITIAL_APPROACH, INITIAL_PEOPLE} from '../../store/initialData';
import {createApproach} from '../../services/controllers/approachController';
import {getUserSession} from '../../util/functions';

interface INewApproach {
  approach: IApproachRegister;
  people: IPeopleRegister;
  dispatch: any;
}

// Componente principal
const NewApproach = ({approach, people, dispatch}: INewApproach) => {
  // Hooks
  // Navegação
  const navigation = useNavigation<TNavigate>();
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Funções

  // Obtem a geolocalização
  const getLocation = async () => {
    if (await requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        async info => {
          await dispatch(
            setApproach(approach, {
              ...approach,
              location: {
                ...approach.location,
                id: String(uuid.v4()),
                latitude: String(info.coords.latitude),
                longitude: String(info.coords.longitude),
              },
            }),
          );
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 200000,
          maximumAge: 3600000,
        },
      );
    } else {
      navigation.navigate('Home');
      Alert.alert(
        'Ocorreu um erro! 🚨',
        'Você precisa permitir o acesso a localização',
        [{text: 'FECHAR'}],
      );
    }
  };

  // Remove a pessoa
  const handleRemovePeople = async (id: string) => {
    const peoples = approach.peoples.filter(people => people.id !== id);
    await dispatch(
      setApproach(approach, {
        ...approach,
        peoples: peoples,
      }),
    );
  };

  // Remove o carro
  const handleRemoveVechile = async (id: string) => {
    const newVehicles = approach.vehicles.filter(vehicle => vehicle.id !== id);
    await dispatch(
      setApproach(approach, {
        ...approach,
        vehicles: newVehicles,
      }),
    );
  };

  // Inicia a abordagem sem dados
  const startPeople = async () => {
    const user = await getUserSession();
    await dispatch(
      setPeople(people, {
        ...INITIAL_PEOPLE,
        id: String(uuid.v4()),
        organizationsId: user.organizationsId,
      }),
    );
  };

  const handleGoHome = async () => {
    const user = await getUserSession();
    // Inicia a abordagem sem dados
    const newApproach: IApproachRegister = {
      ...INITIAL_APPROACH,
      id: String(uuid.v4()),
      organizationsId: user.organizationsId,
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

  const handleSaveApproach = async () => {
    if (description.length > 0) {
      const user = await getUserSession();
      const newApproach = {
        id: approach.id,
        userId: user.id,
        organizationsId: user.organizationsId,
        description: description,
        address: {
          approachId: approach.id,
          city: approach.addres.city,
          createdAt: new Date(),
          district: approach.addres.district,
          id: approach.addres.id,
          number: approach.addres.number,
          state: approach.addres.state,
          street: approach.addres.street,
        },
        latitude: approach.location.latitude,
        longitude: approach.location.longitude,
        photos: approach.photos,
        people: approach.peoples,
        vehicles: approach.vehicles,
        createdAt: new Date(),
      };

      try {
        await createApproach(newApproach);
        setDescription('');
        Alert.alert('Sucesso! ✨', 'Abordagem cadastrada'), [{text: 'FECHAR'}];
        await handleGoHome();
      } catch (error) {
        Alert.alert(
          'Ocorreu um erro no cadastro! 🚨',
          'Não foi possível realizar o cadastro da abordagem',
          [{text: 'FECHAR'}],
        );
        console.log('======start======');
        console.log(error);
        console.log('======end======');
      }
    } else {
      setFormError('description');
      Alert.alert(
        'Ocorreu um erro no cadastro! 🚨',
        'Você precisa cadastrar uma descrição da abordagem',
        [{text: 'FECHAR'}],
      );
    }
  };

  useEffect(() => {
    startPeople();
    getLocation();
  }, []);

  // JSX
  return (
    <Layout>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* Titulo da página */}
        <Heading
          size="md"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          textAlign={'center'}
          mb={2}
        >
          NOVA ABORDAGEM{' '}
          <MaterialIcons
            name="local-police"
            size={17}
            color={useColorModeValue('white', 'gray')}
          />
        </Heading>
        <Divider mb={4} bg={useColorModeValue('gray.500', 'gray.300')} />
        {/* Cadastrar pessoas */}
        <ButtonCards
          icon={
            <AntDesign
              name="addusergroup"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR PESSOAS"
          description="Cadastrar dados e fotos das pessoas abordada"
          onPressPage="NewPerson"
        />

        {/* Registro fotográfico */}
        <ButtonCards
          icon={
            <Ionicons
              name="images"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR IMAGENS"
          description="Cadastrar imagens da abordagem como: Drogas, armas, artefatos, localidade etc"
          onPressPage="RegisterImages"
        />

        {/* Veículos */}
        <ButtonCards
          icon={
            <AntDesign
              name="car"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR VEÍCULOS"
          description="Cadastrar placa e imagens do veículo"
          onPressPage="RegisterCars"
        />

        {/* Pessoas cadastradas */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Pessoas cadastradas
        </Heading>
        <Card>
          {approach.peoples.length > 0 ? (
            approach.peoples.map((people, index) => (
              <Fragment key={index}>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                  >
                    <Text color={useColorModeValue('white', 'gray.600')}>
                      <Text style={{fontWeight: 'bold'}}>Nome:</Text>{' '}
                      {people.name.toUpperCase()}
                    </Text>
                    <Text color={useColorModeValue('white', 'gray.600')} ml={2}>
                      <Text style={{fontWeight: 'bold'}}>Vulgo:</Text>{' '}
                      {people.aka.toUpperCase()}
                    </Text>
                  </Box>

                  <Button
                    size={'xs'}
                    rightIcon={
                      <FontAwesome name="times" size={18} color="white" />
                    }
                    colorScheme="danger"
                    onPress={() =>
                      Alert.alert(
                        'Atenção! 🚨',
                        'Deseja remover esta pessoa?',
                        [
                          {
                            text: 'REMOVER',
                            onPress: () => handleRemovePeople(people.id),
                          },
                          {text: 'FECHAR'},
                        ],
                      )
                    }
                  ></Button>
                </Box>
                <Divider mb={2} mt={2} bg="gray.500" />
              </Fragment>
            ))
          ) : (
            <Text
              color={useColorModeValue('white', 'gray.600')}
              style={{fontWeight: 'bold'}}
            >
              Nenhuma pessoa cadastrada
            </Text>
          )}
        </Card>

        {/* Veículos cadastrados */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Veículos cadastrados
        </Heading>
        <Card>
          {approach.vehicles.length > 0 ? (
            approach.vehicles.map((vehicle, index) => (
              <Fragment key={index}>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Text color={useColorModeValue('white', 'gray.600')}>
                    <Text style={{fontWeight: 'bold'}}>Placa:</Text>{' '}
                    {vehicle.plate.toUpperCase()}
                  </Text>
                  <Button
                    size={'xs'}
                    rightIcon={
                      <FontAwesome name="times" size={18} color="white" />
                    }
                    colorScheme="danger"
                    onPress={async () => await handleRemoveVechile(vehicle.id)}
                  ></Button>
                </Box>
                <Divider mb={2} mt={2} bg="gray.500" />
              </Fragment>
            ))
          ) : (
            <Text
              color={useColorModeValue('white', 'gray.600')}
              style={{fontWeight: 'bold'}}
            >
              Nenhum veículo cadastrado
            </Text>
          )}
        </Card>

        {/* Localidade */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Localidade
        </Heading>
        <Card>
          {/* Rua */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
          >
            Rua
          </Text>
          <Input
            placeholder="Nome da rua, travessa, lograduro etc."
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            p={1}
            pl={2}
            onChange={async data => {
              await dispatch(
                setApproach(approach, {
                  ...approach,
                  addres: {
                    ...approach.addres,
                    street: data.nativeEvent.text,
                  },
                }),
              );
            }}
          />

          {/* Bairro e cidade*/}
          <HStack mt={2} space={3} justifyContent="center">
            <Box w={'48%'}>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mb={2}
              >
                Bairro
              </Text>
              <Input
                placeholder="Nome do bairro"
                color={useColorModeValue('white', 'gray.600')}
                bg={useColorModeValue('gray.600', 'gray.100')}
                borderColor={'gray.500'}
                p={1}
                pl={2}
                onChange={async data => {
                  await dispatch(
                    setApproach(approach, {
                      ...approach,
                      addres: {
                        ...approach.addres,
                        district: data.nativeEvent.text,
                      },
                    }),
                  );
                }}
              />
            </Box>
            <Box w={'48%'}>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mb={2}
              >
                Cidade
              </Text>
              <Input
                placeholder="Nome da cidade"
                color={useColorModeValue('white', 'gray.600')}
                bg={useColorModeValue('gray.600', 'gray.100')}
                borderColor={'gray.500'}
                p={1}
                pl={2}
                onChange={async data => {
                  await dispatch(
                    setApproach(approach, {
                      ...approach,
                      addres: {
                        ...approach.addres,
                        city: data.nativeEvent.text,
                      },
                    }),
                  );
                }}
              />
            </Box>
          </HStack>
          {/* Estado */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
            mt={2}
          >
            Estado
          </Text>
          <Select
            p={1}
            pl={2}
            borderColor={'gray.500'}
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            accessibilityLabel="Selecione um Estado"
            placeholder="Selecione um Estado"
            onValueChange={async data => {
              await dispatch(
                setApproach(approach, {
                  ...approach,
                  addres: {
                    ...approach.addres,
                    state: data,
                  },
                }),
              );
            }}
          >
            {BRAZIL_STATES.map((state, index) => (
              <Select.Item
                key={index}
                label={state.label}
                value={state.value}
              />
            ))}
          </Select>
        </Card>

        {/* Localização */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Localização
        </Heading>
        <Card>
          <Text color={useColorModeValue('white', 'gray.600')}>
            <Text style={{fontWeight: 'bold'}}>Latitude:</Text>{' '}
            {approach.location.latitude}
          </Text>
          <Text color={useColorModeValue('white', 'gray.600')}>
            <Text style={{fontWeight: 'bold'}}>Longitude:</Text>{' '}
            {approach.location.longitude}
          </Text>
        </Card>

        {/* Descrição da abordagem */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Descrição
        </Heading>
        <Card>
          <TextArea
            autoCompleteType={''}
            type="text"
            placeholder="Descrição da abordagem como: Verificação de atividade suspeita na área X"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            isInvalid={formError === 'description'}
            p={1}
            pl={2}
            value={description}
            onChange={data => {
              setDescription(data.nativeEvent.text);
              setFormError('');
            }}
          />
        </Card>

        {/* Botão de salvar */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="plussquareo" size={18} color="white" />}
          colorScheme="success"
          onPress={async () => await handleSaveApproach()}
          mt={5}
          mb={5}
        >
          <Text style={{fontWeight: 'bold'}} color={'white'}>
            SALVAR ABORDAGEM
          </Text>
        </Button>
        {/* Botão de voltar */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="back" size={18} color="white" />}
          colorScheme="gray"
          onPress={async () => await handleGoHome()}
          mb={5}
        >
          <Text style={{fontWeight: 'bold'}} color={'white'}>
            VOLTAR
          </Text>
        </Button>
      </ScrollView>
    </Layout>
  );
};

export default connect(
  (state: {approach: IApproachRegister; people: IPeopleRegister}) => ({
    approach: state.approach,
    people: state.people,
  }),
)(NewApproach);
