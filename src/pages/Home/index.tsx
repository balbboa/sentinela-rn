import React, {useEffect, useState} from 'react';
// React Native
import {Linking} from 'react-native';
// Native Base
import {
  Divider,
  Heading,
  HStack,
  ScrollView,
  Text,
  useColorModeValue,
} from 'native-base';
// Componentes customizados
import {Layout} from '../../components/Layout';
import ButtonCards from '../../components/buttonCards';
// Icones
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
// Componentes interno
import IconCards from './components/iconCards';
import {Card} from '../../components/Card';
// Dados estáticos
import {INITIAL_APPROACH} from '../../store/initialData';
// Redux
import {connect} from 'react-redux';
import {setApproach, setSyncApproachLength} from '../../store/actions';
// Interfaces
import {IApproachRegister} from '../NewApproach/interfaces';
// UUID
import uuid from 'react-native-uuid';
// Usuário local
import {IUser} from '../../services/controllers/userController';
import {getUserSession} from '../../util/functions';
// Seeds
import {filiationSeed} from '../../services/seeds/filiationSeeds';
import {getApproachs} from '../../services/controllers/approachController';
// Sync
import Sync from '../Sync';
// Expo
import * as Network from 'expo-network';

interface IHome {
  approach: IApproachRegister;
  syncApproachLength: number;
  dispatch: any;
}

const Home = ({approach, dispatch, syncApproachLength}: IHome) => {
  // hooks
  const [user, setUser] = useState<IUser>();
  // Sync
  const [isSync, setIsSync] = useState<boolean>(false);

  // Inicia a abordagem sem dados
  const startApproach = async () => {
    const newApproach: IApproachRegister = {
      ...INITIAL_APPROACH,
      id: String(uuid.v4()),
      peoples: [],
      photos: [],
      vehicles: [],
    };
    await dispatch(setApproach(approach, newApproach));
  };

  const handleGetUserSession = async () => {
    const user = await getUserSession();
    setUser(user);
  };

  const handleSeeds = async () => {
    // Verifica a conexão
    const network = await Network.getNetworkStateAsync();
    if (network.isConnected) {
      await filiationSeed();
    }
  };

  const handleGetApproachLenght = async () => {
    const res = await getApproachs();
    await dispatch(setSyncApproachLength(syncApproachLength, res.length));
  };

  useEffect(() => {
    handleGetApproachLenght();
    handleGetUserSession();
    startApproach();
    handleSeeds();
  }, []);

  return (
    <Layout>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* Bem-vindos */}

        <Heading
          size="sm"
          fontFamily={'heading'}
          color={useColorModeValue('white', 'gray.600')}
          mb={1}
        >
          Bem-vindo,
        </Heading>
        <Text
          color={useColorModeValue('white', 'gray.600')}
          fontFamily={'body'}
          style={{fontWeight: 'bold'}}
          fontSize={'md'}
        >
          {user?.name || 'Carregando...'}
        </Text>
        <Text
          color={useColorModeValue('white', 'gray.600')}
          fontFamily={'body'}
          style={{fontWeight: 'bold'}}
          fontSize={'sm'}
          mb={2}
        >
          {user?.organizationName || 'Carregando...'}
        </Text>

        <Divider mb={4} bg="gray.500" />

        {/* Cartóes do sistema */}

        <ButtonCards
          icon={
            <MaterialIcons
              name="local-police"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR ABORDAGEM"
          description="Cadastra os dados de uma nova abordagem policial"
          onPressPage="NewApproach"
        />

        <ButtonCards
          icon={
            <Ionicons
              name="person-add"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR PESSOA"
          description="Cadastre uma pessoa no sistema"
          onPressPage=""
        />

        <ButtonCards
          icon={
            <FontAwesome
              name="search"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="PESQUISAR PESSOAS"
          description="Pesquise por pessoas através do Nome, Documento ou vulgo"
          onPressPage=""
        />

        <Divider mb={4} bg="gray.500" />

        {/* Avisos */}
        {/* <Heading
            size="sm"
            fontWeight="bold"
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
          >
            Avisos importantes
          </Heading>
          <Card>
            <Text
              color={useColorModeValue('white', 'gray.600')}
              fontSize={'sm'}
              style={{fontWeight: 'bold'}}
            >
              Intensividade na ronda
            </Text>
            <Text color={useColorModeValue('white', 'gray.600')}>
              O bairro do Tirol está com uma grande quantidade de assaltos a
              carros
            </Text>
            <Text
              color={useColorModeValue('white', 'gray.600')}
              fontSize={'xs'}
              textAlign={'right'}
            >
              03/09/2022 22:00
            </Text>
            <Divider mb={2} mt={2} bg="gray.500" />
            <Text
              color={useColorModeValue('white', 'gray.600')}
              fontSize={'sm'}
              style={{fontWeight: 'bold'}}
            >
              Sem disponibilidade de viaturas
            </Text>
            <Text color={useColorModeValue('white', 'gray.600')}>
              Estamos sem viaturas para novas rotas
            </Text>
            <Text
              color={useColorModeValue('white', 'gray.600')}
              fontSize={'xs'}
              textAlign={'right'}
            >
              02/09/2022 08:00
            </Text>
          </Card> 

          <Divider mb={4} bg="gray.500" />
          */}

        {/* Links de acesso rápido */}
        <HStack space={4} justifyContent="center" p={0}>
          <IconCards
            icon={
              <Feather
                name="briefcase"
                size={40}
                color={useColorModeValue('white', 'gray')}
              />
            }
            onPress={() =>
              Linking.openURL(
                'https://portalbnmp.cnj.jus.br/#/pesquisa-peca',
              ).catch(err => console.error("Couldn't load page", err))
            }
            name="BMND"
          />
          <IconCards
            icon={
              <FontAwesome5
                name="user-ninja"
                size={40}
                color={useColorModeValue('white', 'gray')}
              />
            }
            onPress={() =>
              Linking.openURL('https://www.areapolicial.pc.pr.gov.br/').catch(
                err => console.error("Couldn't load page", err),
              )
            }
            name="DEA"
          />
          <IconCards
            icon={
              <FontAwesome
                name="car"
                size={40}
                color={useColorModeValue('white', 'gray')}
              />
            }
            onPress={() =>
              Linking.openURL('https://sicop.prf.gov.br/sicop/sinal').catch(
                err => console.error("Couldn't load page", err),
              )
            }
            name="PRF"
          />
        </HStack>
      </ScrollView>
    </Layout>
  );
};

export default connect(
  (state: {approach: IApproachRegister; syncApproachLength: number}) => ({
    approach: state.approach,
    syncApproachLength: state.syncApproachLength,
  }),
)(Home);
