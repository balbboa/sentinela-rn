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
  TextArea,
} from 'native-base';
// React
import React, {useState} from 'react';
// React Native
import {Alert, ScrollView} from 'react-native';
// Componentes interno
import {Layout} from '../../../components/Layout';
import {Card} from '../../../components/Card';
// Tipos
import {TNavigate} from '../../../util/types';
// Expo
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
// UUID
import uuid from 'react-native-uuid';
// Interfaces
import {IApproachRegister, IPhotoRegister} from '../interfaces';
// Redux
import {connect} from 'react-redux';
import {setApproach} from '../../../store/actions';
import {requestCameraPermission} from '../../../util/functions';

interface IRegisterImages {
  approach: IApproachRegister;
  dispatch: any;
}

// Componente principal
const RegisterImages = ({approach, dispatch}: IRegisterImages) => {
  // Navegação
  const navigation = useNavigation<TNavigate>();
  // Fotos selecionadas
  const [photos, setPhotos] = useState<IPhotoRegister[]>(
    approach.photos.filter(photo => photo.type === 'Materiabilidade'),
  );
  // Descrição
  const [description, setDescription] = useState<string>('');

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
                type: 'Materiabilidade',
                description: description,
              },
            ]);
            setDescription('');
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

  // Deleta a foto
  const handleDeletePhoto = (id: string) => {
    const photo = photos.filter(photo => photo.id !== id);
    setPhotos(photo);
  };

  // Salva as fotos
  const handleSavePhoto = async () => {
    const savedPhotos = approach.photos.filter(
      photo => photo.type !== 'Materiabilidade',
    );

    // Adiciona as novas fotos
    photos.map(photo => {
      savedPhotos.push(photo);
    });

    // Salva o Redux
    await dispatch(
      setApproach(approach, {
        ...approach,
        photos: photos,
      }),
    );
    setPhotos([]);
    Alert.alert('Sucesso! ✨', 'Fotos cadastradas com sucesso'),
      [{text: 'FECHAR'}];
    navigation.navigate('NewApproach');
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
          FOTOS DA ABORDAGEM{' '}
          <Ionicons
            name="images"
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
            Descrição
          </Text>
          <TextArea
            placeholder="Descrição da foto"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            value={description}
            autoCompleteType={''}
            p={1}
            pl={2}
            onChange={data => setDescription(data.nativeEvent.text)}
          />
          {/* Botão de salvar */}
          <Button
            size={'lg'}
            rightIcon={<AntDesign name="plussquareo" size={18} color="white" />}
            colorScheme="success"
            onPress={() => handlePickImage()}
            mt={2}
          >
            <Text style={{fontWeight: 'bold'}} color={'white'}>
              TIRAR FOTO
            </Text>
          </Button>
        </Card>

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
              <Card>
                <Image
                  rounded={3}
                  source={{
                    uri: photo.path,
                  }}
                  alt="Alternate Text"
                  size={'full'}
                  style={{height: 400, width: '100%'}}
                />
                <Text
                  color={useColorModeValue('white', 'gray.600')}
                  mt={2}
                  mb={2}
                >
                  {photo.description}
                </Text>
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
                >
                  <Text style={{fontWeight: 'bold'}} color={'white'}>
                    Remover
                  </Text>
                </Button>
              </Card>
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
          mt={2}
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

export default connect((state: {approach: IApproachRegister}) => ({
  approach: state.approach,
}))(RegisterImages);
