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
} from 'native-base';
// React
import React, {useEffect, useState} from 'react';
// React Native
import {Alert, ScrollView} from 'react-native';
// Componentes interno
import {Layout} from '../../../../components/Layout';
// Tipos
import {TNavigate} from '../../../../util/types';
// Expo
import * as ImagePicker from 'expo-image-picker';
// UUID
import uuid from 'react-native-uuid';
// Interfaces
import {IPeopleRegister, IPhotoRegister} from '../../interfaces';
import {connect} from 'react-redux';
import {setPeople} from '../../../../store/actions';
import {requestCameraPermission} from '../../../../util/functions';

interface IRegisterPhoto {
  people: IPeopleRegister;
  dispatch: any;
}

// Componente principal
const RegisterPhoto = ({people, dispatch}: IRegisterPhoto) => {
  // Navegação
  const navigation = useNavigation<TNavigate>();
  // Fotos selecionadas
  const [photos, setPhotos] = useState<IPhotoRegister[]>(
    people.photos.filter(photo => photo.type === 'Pessoal'),
  );

  // Ontem a imagem da câmera
  const handlePickImage = async () => {
    if (await requestCameraPermission()) {
      const {status} = await ImagePicker.getCameraPermissionsAsync();
      if (status === 'granted') {
        try {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
          });

          // Adiciona a imagem ao array de documentos
          if (!result.cancelled) {
            setPhotos([
              ...photos,
              {
                id: String(uuid.v4()),
                path: result.uri,
                type: 'Pessoal',
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

  const handleSavePhoto = async () => {
    setPhotos([]);
    // Salva o Redux
    const savedPhotos = people.photos.filter(photo => photo.type !== 'Pessoal');

    // Adiciona as novas fotos
    photos.map(photo => {
      savedPhotos.push(photo);
    });

    await dispatch(
      setPeople(people, {
        ...people,
        photos: savedPhotos,
      }),
    );
    Alert.alert('Sucesso! ✨', 'Fotos cadastradas com sucesso'),
      [{text: 'FECHAR'}];
    navigation.navigate('NewPerson');
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
          FOTOS DA PESSOA{' '}
          <Ionicons
            name="images"
            size={17}
            color={useColorModeValue('white', 'gray')}
          />
        </Heading>
        <Divider mb={4} bg={useColorModeValue('gray.500', 'gray.300')} />
        {/* Botão de salvar */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="plussquareo" size={18} color="white" />}
          colorScheme="success"
          onPress={handlePickImage}
          mb={5}
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
          mb={2}
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
                size={'full'}
                style={{height: 400, width: '100%'}}
              />
              <Button
                size={'xs'}
                rightIcon={<FontAwesome name="times" size={18} color="white" />}
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

        {/* Botão de salvar foto */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="plussquareo" size={18} color="white" />}
          colorScheme="success"
          onPress={async () => await handleSavePhoto()}
          mt={10}
        >
          <Text style={{fontWeight: 'bold'}} color={'white'}>
            SALVAR FOTOS
          </Text>
        </Button>
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

export default connect((state: {people: IPeopleRegister}) => ({
  people: state.people,
}))(RegisterPhoto);
