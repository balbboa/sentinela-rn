// React
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Button, Center, Heading, HStack, Spinner, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
// React Native
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import api from '../../services/api';
import {
  getApproachs,
  IApproach,
  removeApproachById,
} from '../../services/controllers/approachController';
import {TNavigate} from '../../util/types';
import uuid from 'react-native-uuid';

interface IPhotosAPI {
  userId: number;
  description: string;
  path: string;
  type: string;
}

interface AddressAPI {
  userId: number;
  street: string;
  district: string;
  number: string;
  city: string;
  state: string;
}

interface VehicleAPI {
  userId: number;
  plate: string;
  photos: IPhotosAPI[];
}

interface IPeopleAPI {
  userId: number;
  name: string;
  aka: string;
  motherName: string;
  sex: string;
  birthday: string;
  filiation: number;
  document: string;
  organizationsId: number;
  address?: AddressAPI;
  photos: IPhotosAPI[];
}
interface ApproachAPI {
  userId: number;
  organizationsId: number;
  description: string;
  latitude: string;
  longitude: string;
  address?: AddressAPI;
  photos?: IPhotosAPI[];
  people?: IPeopleAPI[];
  vehicles?: VehicleAPI[];
}

const Sync = () => {
  const [approachs, setApproachs] = useState<IApproach[]>([]);
  // Navegação
  const navigation = useNavigation<TNavigate>();
  // Sincronizando
  const [isSync, setIsSync] = useState<boolean>(false);

  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }

  const handleGetApproachs = async () => {
    const start = await getApproachs();
    setApproachs(start);
  };

  const handleSyncApproachs = async () => {
    let error = false;

    if (approachs.length > 0) {
      setIsSync(true);
      for await (const approach of approachs) {
        await timeout(100);
        // Envia as fotos
        const approachPhotos: IPhotosAPI[] = [];
        for await (const photo of approach.photos) {
          await timeout(100);
          var form = new FormData();
          form.append('image', {
            uri: photo.path,
            name: `${uuid.v4()}.jpg`,
            type: 'image/jpeg',
          });
          await api
            .post('uploads', form, {
              headers: {'Content-Type': 'multipart/form-data'},
            })
            .then(request => {
              approachPhotos.push({
                description: photo.description || '',
                path: request.data.filename,
                type: photo.type,
                userId: approach.userId,
              });
            })
            .catch(erro => {
              console.log(erro);
            });
        }

        // Cria as pessoas
        const peopleAPI: IPeopleAPI[] = [];
        for await (const people of approach.people) {
          // Envia as fotos
          const peoplePhotos: IPhotosAPI[] = [];
          for await (const photo of people.photos) {
            var form = new FormData();
            form.append('image', {
              uri: photo.path,
              name: `${uuid.v4()}.jpg`,
              type: 'image/jpeg',
            });
            await api
              .post('uploads', form, {
                headers: {'Content-Type': 'multipart/form-data'},
              })
              .then(request => {
                peoplePhotos.push({
                  description: photo.description || '',
                  path: request.data.filename,
                  type: photo.type,
                  userId: approach.userId,
                });
              })
              .catch(erro => {
                console.log(erro);
              });
          }
          // Ceia a pessoa
          peopleAPI.push({
            address: {
              userId: approach.userId,
              city: people.address.city.toUpperCase(),
              district: people.address.district.toUpperCase(),
              number: people.address.number.toUpperCase(),
              state: people.address.state.toUpperCase(),
              street: people.address.street.toUpperCase(),
            },
            userId: approach.userId,
            organizationsId: people.organizationsId,
            name: people.name.toUpperCase(),
            aka: people.aka.toUpperCase(),
            motherName: people.motherName.toUpperCase(),
            sex: people.sex.toUpperCase(),
            birthday: people.birthday,
            filiation: people.filiation,
            document: people.document.toUpperCase(),
            photos: peoplePhotos,
          });
        }

        // Veículos
        const vehicleAPI: VehicleAPI[] = [];
        for await (const vehicle of approach.vehicles) {
          // Envia as fotos
          const vehiclePhotos: IPhotosAPI[] = [];
          for await (const photo of vehicle.photos) {
            var form = new FormData();
            form.append('image', {
              uri: photo.path,
              name: `${uuid.v4()}.jpg`,
              type: 'image/jpeg',
            });
            await api
              .post('uploads', form, {
                headers: {'Content-Type': 'multipart/form-data'},
              })
              .then(request => {
                vehiclePhotos.push({
                  description: photo.description || '',
                  path: request.data.filename,
                  type: photo.type,
                  userId: approach.userId,
                });
              })
              .catch(erro => {
                console.log(erro);
              });
          }
          // Ceia a pessoa
          vehicleAPI.push({
            plate: vehicle.plate.toUpperCase(),
            photos: vehiclePhotos,
            userId: approach.userId,
          });
        }

        const newApproach: ApproachAPI = {
          organizationsId: approach.organizationsId,
          userId: approach.userId,
          description: approach.description.toUpperCase() || '',
          latitude: approach.latitude,
          longitude: approach.longitude,
          address: {
            userId: approach.userId,
            street: approach.address.street.toUpperCase(),
            district: approach.address.district.toUpperCase(),
            number: approach.address.number.toUpperCase(),
            city: approach.address.city.toUpperCase(),
            state: approach.address.state.toUpperCase(),
          },
          photos: approachPhotos,
          people: peopleAPI,
          vehicles: vehicleAPI,
        };

        try {
          await api
            .post('approachs', newApproach)
            .then(async () => {
              await removeApproachById(approach.id);
            })
            .catch(response => {
              error = true;
              console.log('======start======');
              console.log(response);
              console.log('======end======');
            });
        } catch (error) {
          console.log('Erro ao remover a abordagem');
          console.log(error);
        }
      }
      if (error) {
        Alert.alert(
          'Ocorreu um erro! 🚨',
          'Ocorreu um erro na sincronização, por favor tente mais tarde',
          [{text: 'FECHAR'}],
        );
      } else {
        const end = await getApproachs();
        setApproachs(end);
        await timeout(1000);
        setIsSync(false);

        if (approachs.length === 0) {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Home'}],
            }),
          );
        }
      }
    }
  };

  useEffect(() => {
    handleGetApproachs();
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
          <Center w="100%" h="100%">
            <Button
              rightIcon={<Ionicons name="sync" size={24} color="white" />}
              onPress={async () => await handleSyncApproachs()}
              size="lg"
              colorScheme="light"
            >
              {'Clique para sincronizar'}
            </Button>
            {isSync ? (
              <>
                <HStack
                  space={2}
                  justifyContent="center"
                  mt={5}
                  flexDirection="column"
                >
                  <Spinner color="white" size={50} />
                  <Heading color="white" fontSize="md">
                    Sincronizando...
                  </Heading>
                </HStack>
              </>
            ) : (
              <Text
                style={{fontWeight: 'bold'}}
                color={'white'}
                mt={5}
                fontSize={18}
              >
                {approachs.length > 0
                  ? 'Em espera: ' + approachs.length
                  : 'Sincronizado!'}
              </Text>
            )}
            {/* Botão de voltar */}
            <Button
              size={'lg'}
              rightIcon={<AntDesign name="back" size={18} color="white" />}
              colorScheme="gray"
              onPress={() =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{name: 'Home'}],
                  }),
                )
              }
              mb={5}
              w={200}
              mt={5}
            >
              <Text style={{fontWeight: 'bold'}} color={'white'}>
                VOLTAR
              </Text>
            </Button>
          </Center>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
};

export default Sync;
