// Icones
import {AntDesign, FontAwesome, Ionicons} from '@expo/vector-icons';
// Navegação
import {useNavigation} from '@react-navigation/native';
// Native Base
import {
  Heading,
  useColorModeValue,
  Button,
  Text,
  Image,
  Box,
  Divider,
  Input,
} from 'native-base';
// React
import React, {useState} from 'react';
// React Native
import {Alert, ScrollView} from 'react-native';
// Componentes interno
import {Layout} from '../../../components/Layout';
// Tipos
import {TNavigate} from '../../../util/types';
// Expo
import * as ImagePicker from 'expo-image-picker';
// UUID
import uuid from 'react-native-uuid';
import {Card} from '../../../components/Card';
import {
  IApproachRegister,
  IPhotoRegister,
  IVehicleRegister,
} from '../interfaces';
import {connect} from 'react-redux';
import {setApproach} from '../../../store/actions';
import {requestCameraPermission} from '../../../util/functions';

// Componente principal
interface IRegisterCars {
  approach: IApproachRegister;
  dispatch: any;
}

// Componente principal
const RegisterCars = ({approach, dispatch}: IRegisterCars) => {
  // Navegação
  const navigation = useNavigation<TNavigate>();
  // Fotos selecionadas
  const [photos, setPhotos] = useState<IPhotoRegister[]>([]);
  // Placa selecionada
  const [plate, setPlate] = useState<string>('');

  // Ontem a imagem da câmera
  const handlePickImage = async () => {
    if (await requestCameraPermission()) {
      try {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });

        // Adiciona a imagem ao array de fotos
        if (!result.cancelled) {
          setPhotos([
            ...photos,
            {
              id: String(uuid.v4()),
              path: result.uri,
              type: 'Veículo',
            },
          ]);

          Alert.alert('Sucesso! ✨', 'Foto cadastrada'), [{text: 'FECHAR'}];
        }
      } catch (error) {
        Alert.alert(
          'Atenção! 🚨',
          'Não foi possivel carregar a imagem, por favor tente novamente',
          [{text: 'FECHAR'}],
        );
        console.log(error);
      }
    } else {
      Alert.alert(
        'Atenção! 🚨',
        'Você precisa dar permissão de acesso a câmera',
        [{text: 'FECHAR'}],
      );
      navigation.navigate('Home');
    }
  };

  const handleDeletePhoto = (id: string) => {
    const photo = photos.filter(photo => photo.id !== id);
    setPhotos(photo);
  };

  const handleSaveCar = async () => {
    const car: IVehicleRegister = {
      id: String(uuid.v4()),
      photos: photos,
      plate: plate,
    };
    setPhotos([]);
    setPlate('');
    // Salva o Redux
    await dispatch(
      setApproach(approach, {
        ...approach,
        vehicles: [...approach.vehicles, car],
      }),
    );
    Alert.alert('Sucesso! ✨', 'Veículo cadastrado com sucesso'),
      [{text: 'FECHAR'}];
  };

  const handleDeleteVehicle = async (id: string) => {
    const newVehicles = approach.vehicles.filter(vehicle => vehicle.id !== id);
    await dispatch(
      setApproach(approach, {
        ...approach,
        vehicles: newVehicles,
      }),
    );
    Alert.alert('Sucesso! ✨', 'Veículo removido com sucesso'),
      [{text: 'FECHAR'}];
  };

  // JSX
  return (
    <Layout>
      <ScrollView>
        {/* Titulo da página */}
        <Heading
          size="md"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          textAlign={'center'}
          mb={2}
        >
          CADASTRAR CARROS{' '}
          <AntDesign
            name="car"
            size={17}
            color={useColorModeValue('white', 'gray')}
          />
        </Heading>
        <Divider mb={4} bg={useColorModeValue('gray.500', 'gray.300')} />
        <Card>
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
          >
            Placa
          </Text>
          <Input
            placeholder="Placa do carro"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            value={plate}
            p={1}
            pl={2}
            type="text"
            onChange={data => setPlate(data.nativeEvent.text)}
          />
          {/* Botão de salvar foto */}
          <Button
            size={'lg'}
            rightIcon={<Ionicons name="images" size={18} color="white" />}
            colorScheme="darkBlue"
            onPress={() => handlePickImage()}
            mt={2}
          >
            <Text style={{fontWeight: 'bold'}} color={'white'}>
              TIRAR FOTO
            </Text>
          </Button>

          {/* Listagem de fotos */}
          <Heading
            size="sm"
            fontWeight="bold"
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mt={2}
          >
            Fotos cadastradas
          </Heading>

          {photos.map((photo, index) => {
            return (
              <Box mt={2} key={index}>
                <Image
                  rounded={3}
                  source={{
                    uri: photo.path,
                  }}
                  alt="Alternate Text"
                  style={{height: 250, width: '100%'}}
                />

                <Button
                  size={'xs'}
                  rightIcon={
                    <FontAwesome name="times" size={18} color="white" />
                  }
                  colorScheme="danger"
                  onPress={() => {
                    Alert.alert('Atenção! 🚨', 'Deseja remover esta foto?', [
                      {
                        text: 'REMOVER',
                        onPress: () => handleDeletePhoto(photo.id),
                      },
                      {text: 'FECHAR'},
                    ]);
                  }}
                  mt={1}
                >
                  <Text style={{fontWeight: 'bold'}} color={'white'}>
                    Remover
                  </Text>
                </Button>
              </Box>
            );
          })}
          {photos.length === 0 && (
            <Text color={useColorModeValue('white', 'gray.600')}>
              - Nenhuma foto cadastrada
            </Text>
          )}
        </Card>
        {/* Botão de salvar foto */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="plussquareo" size={18} color="white" />}
          colorScheme="success"
          onPress={async () => await handleSaveCar()}
          mt={2}
        >
          <Text style={{fontWeight: 'bold'}} color={'white'}>
            SALVAR O VEÍCULO
          </Text>
        </Button>

        <Divider mb={4} mt={4} bg={useColorModeValue('gray.500', 'gray.300')} />

        {/* Listagem de veículos */}

        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mt={2}
          mb={2}
        >
          Veículos cadastrados
        </Heading>

        {approach.vehicles.map((vehicle, index) => {
          return (
            <Card key={index}>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mb={2}
              >
                Placa
              </Text>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                mb={2}
              >
                {vehicle.plate}
              </Text>
              {/* Listagem de fotos */}
              <Heading
                size="sm"
                fontWeight="bold"
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mt={2}
              >
                Fotos cadastradas
              </Heading>

              {vehicle.photos.map((photo, index) => {
                return (
                  <Box mt={2} key={index}>
                    <Image
                      rounded={3}
                      source={{
                        uri: photo.path,
                      }}
                      alt="Alternate Text"
                      size={'full'}
                      style={{height: 400, width: '100%'}}
                    />
                  </Box>
                );
              })}

              {/* Remover veículo */}
              <Button
                size={'xs'}
                rightIcon={<FontAwesome name="times" size={18} color="white" />}
                colorScheme="danger"
                onPress={() => {
                  Alert.alert('Atenção! 🚨', 'Deseja remover esta foto?', [
                    {
                      text: 'REMOVER',
                      onPress: async () =>
                        await handleDeleteVehicle(vehicle.id),
                    },
                    {text: 'FECHAR'},
                  ]);
                }}
                mt={1}
              >
                <Text style={{fontWeight: 'bold'}} color={'white'}>
                  Remover veículo
                </Text>
              </Button>

              {vehicle.photos.length === 0 && (
                <Text color={useColorModeValue('white', 'gray.600')}>
                  - Nenhuma foto cadastrada
                </Text>
              )}
            </Card>
          );
        })}
        {approach.vehicles.length === 0 && (
          <Text color={useColorModeValue('white', 'gray.600')}>
            - Nenhum veículo cadastrado
          </Text>
        )}

        {/* Botão de voltar */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="back" size={18} color="white" />}
          colorScheme="gray"
          onPress={() => navigation.goBack()}
          mb={5}
          mt={5}
        >
          <Text style={{fontWeight: 'bold'}} color={'white'}>
            VOLTAR
          </Text>
        </Button>
      </ScrollView>
    </Layout>
  );
};

export default connect((state: {approach: IApproachRegister}) => ({
  approach: state.approach,
}))(RegisterCars);
