import {AntDesign, Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
// Native Base
import {
  Divider,
  Heading,
  useColorModeValue,
  Button,
  Text,
  Box,
  Input,
  Select,
  Center,
  HStack,
} from 'native-base';
// React
import React, {useEffect, useState} from 'react';
// React Native
import {Alert, Platform, ScrollView, TouchableOpacity} from 'react-native';
// Componentes interno
import ButtonCards from '../../../components/buttonCards';
import {Card} from '../../../components/Card';
import {Layout} from '../../../components/Layout';
// Dado estático
import {BRAZIL_STATES} from '../../../util/staticData';
// Tipos
import {TNavigate} from '../../../util/types';
import {IApproachRegister, IPeopleRegister} from '../interfaces';
// Data
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
// Funções global
import {getFullDateUTC} from '../../../util/functions';
// Redux
import {connect} from 'react-redux';
import {setApproach, setPeople} from '../../../store/actions';
import {
  getFiliations,
  IFiliation,
} from '../../../services/controllers/filiationController';

interface INewPerson {
  approach: IApproachRegister;
  people: IPeopleRegister;
  dispatch: any;
}

// Componente principal
const NewPerson = ({people, approach, dispatch}: INewPerson) => {
  // hooks
  // Caixa de data
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  // Filiaçao
  const [filiation, setFiliation] = useState<IFiliation[]>([]);
  // Navegação
  const navigation = useNavigation<TNavigate>();

  // Funções

  // Verifica a data de aniversário
  const handleOnChangeDateBirthday = async (
    selectedDate: DateTimePickerEvent,
  ) => {
    const currentDate = selectedDate.nativeEvent.timestamp || people.birthday;
    setShowDatePicker(Platform.OS === 'ios');
    await dispatch(
      setPeople(people, {
        ...people,
        birthday: getFullDateUTC(new Date(currentDate)),
      }),
    );
  };

  // Salva a pessoa
  const handleSavePeople = async () => {
    // Adiciona  apessoa ao array de pessoas
    if (people.name.length > 0 || people.aka.length > 0) {
      approach.peoples.push(people);
      // Salva o novo array
      await dispatch(
        setApproach(approach, {...approach, peoples: approach.peoples}),
      );
      Alert.alert('Sucesso! ✨', 'Pessoa cadastrada'), [{text: 'FECHAR'}];
      navigation.navigate('NewApproach');
    } else {
      Alert.alert(
        'Ocorreu um erro no cadastro! 🚨',
        'Você precisa cadastrar um NOME ou Vulgo',
        [{text: 'FECHAR'}],
      );
    }
  };

  // Obtem as filiações
  const handleGetFilliation = async () => {
    const res = await getFiliations();
    const filiationsResult: IFiliation[] = [];
    for (let i = 0; i < res.length; i++) {
      filiationsResult.push({id: res[i].id, name: res[i].name});
    }
    setFiliation(filiationsResult);
  };

  useEffect(() => {
    handleGetFilliation();
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
          CADASTRAR PESSOA{' '}
          <Ionicons
            name="person-add-outline"
            size={17}
            color={useColorModeValue('white', 'gray')}
          />
        </Heading>
        <Divider mb={4} bg={useColorModeValue('gray.500', 'gray.300')} />

        {/* Cadastrar pessoas */}
        <ButtonCards
          icon={
            <Ionicons
              name="images"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR FOTOS"
          description="Cadastrar fotos desta pessoa"
          onPressPage="RegisterPhoto"
        />

        {/* Cadastrar documentos */}
        <ButtonCards
          icon={
            <SimpleLineIcons
              name="docs"
              size={40}
              color={useColorModeValue('white', 'gray')}
            />
          }
          name="CADASTRAR DOCUMENTOS"
          description="Cadastrar fotos dos documentos"
          onPressPage="RegisterDocument"
        />

        {/* Dados pessoais */}

        {/* Dados básicos */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Dados básicos
        </Heading>
        <Card>
          {/* Nome */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
          >
            Nome
          </Text>
          <Input
            placeholder="Nome completo"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            p={1}
            pl={2}
            value={people.name}
            onChange={async data => {
              await dispatch(
                setPeople(people, {
                  ...people,
                  name: data.nativeEvent.text,
                }),
              );
            }}
          />
          {/* Vulgo */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
            mt={2}
          >
            Vulgo
          </Text>
          <Input
            placeholder="Como o chamam"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            p={1}
            pl={2}
            value={people.aka}
            onChange={async data => {
              await dispatch(
                setPeople(people, {
                  ...people,
                  aka: data.nativeEvent.text,
                }),
              );
            }}
          />

          {/* Nome da mãe */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
            mt={2}
          >
            Filiação 2
          </Text>
          <Input
            placeholder="Nome completo da filiação 2"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            p={1}
            pl={2}
            value={people.motherName}
            onChange={async data => {
              await dispatch(
                setPeople(people, {
                  ...people,
                  motherName: data.nativeEvent.text,
                }),
              );
            }}
          />

          {/* Documento */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
            mt={2}
          >
            Documento (CPF ou RG)
          </Text>
          <Input
            placeholder="00000000000"
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            borderColor={'gray.500'}
            maxLength={11}
            p={1}
            pl={2}
            value={people.document}
            onChange={async data => {
              await dispatch(
                setPeople(people, {
                  ...people,
                  document: data.nativeEvent.text,
                }),
              );
            }}
          />

          {/* Sexo e Nascimento */}
          <HStack mt={2} space={3} justifyContent="center">
            <Box w={'49%'}>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mb={2}
              >
                Sexo
              </Text>
              <Select
                p={1}
                pl={2}
                borderColor={'gray.500'}
                color={useColorModeValue('white', 'gray.600')}
                bg={useColorModeValue('gray.600', 'gray.100')}
                defaultValue={'MASCULINO'}
                accessibilityLabel="Selecione um sexo"
                placeholder="Selecione um sexo"
                selectedValue={people.sex === '' ? 'MASCULINO' : people.sex}
                onValueChange={async data => {
                  await dispatch(
                    setPeople(people, {
                      ...people,
                      sex: data,
                    }),
                  );
                }}
              >
                <Select.Item label={'MASCULINO'} value={'MASCULINO'} />
                <Select.Item label={'FEMININO'} value={'FEMININO'} />
              </Select>
            </Box>
            <Box w={'49%'}>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mb={2}
              >
                Nascimento
              </Text>

              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Center
                  display={'flex'}
                  alignItems={'center'}
                  justifyItems={'center'}
                  bg={useColorModeValue('gray.800', 'gray.200')}
                  borderRadius={4}
                  h={38}
                >
                  <Text
                    fontSize={15}
                    style={{fontWeight: 'bold'}}
                    color={useColorModeValue('white', 'gray.800')}
                  >
                    {people.birthday === ''
                      ? 'Data não cadastrada'
                      : people.birthday}
                  </Text>
                </Center>
              </TouchableOpacity>
            </Box>
          </HStack>

          {/* Filiação */}
          <Text
            fontSize={15}
            color={useColorModeValue('white', 'gray.600')}
            style={{fontWeight: 'bold'}}
            mb={2}
            mt={2}
          >
            Filiação
          </Text>
          <Select
            p={1}
            pl={2}
            borderColor={'gray.500'}
            color={useColorModeValue('white', 'gray.600')}
            bg={useColorModeValue('gray.600', 'gray.100')}
            accessibilityLabel="Selecione uma filiação"
            placeholder="Selecione uma filiação"
            selectedValue={String(people.filiation)}
            defaultValue={'1'}
            onValueChange={async data => {
              await dispatch(
                setPeople(people, {
                  ...people,
                  filiation: Number(data),
                }),
              );
            }}
          >
            {filiation.map((item, index) => (
              <Select.Item
                label={item.name}
                value={String(item.id)}
                key={index}
              />
            ))}
          </Select>
        </Card>

        {/* Localidade */}
        <Heading
          size="sm"
          fontWeight="bold"
          color={useColorModeValue('white', 'gray.600')}
          style={{fontWeight: 'bold'}}
          mb={2}
        >
          Endereço
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
            value={people.address.street}
            onChange={async data => {
              await dispatch(
                setPeople(people, {
                  ...people,
                  address: {
                    ...people.address,
                    street: data.nativeEvent.text,
                  },
                }),
              );
            }}
          />

          {/* Número e  Bairro */}
          <HStack mt={2} space={3} justifyContent="center">
            <Box w={'48%'}>
              <Text
                fontSize={15}
                color={useColorModeValue('white', 'gray.600')}
                style={{fontWeight: 'bold'}}
                mb={2}
              >
                Número
              </Text>
              <Input
                color={useColorModeValue('white', 'gray.600')}
                bg={useColorModeValue('gray.600', 'gray.100')}
                borderColor={'gray.500'}
                p={1}
                pl={2}
                value={people.address.number}
                onChange={async data => {
                  await dispatch(
                    setPeople(people, {
                      ...people,
                      address: {
                        ...people.address,
                        number: data.nativeEvent.text,
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
                Bairro
              </Text>
              <Input
                placeholder="Nome do bairro"
                color={useColorModeValue('white', 'gray.600')}
                bg={useColorModeValue('gray.600', 'gray.100')}
                borderColor={'gray.500'}
                p={1}
                pl={2}
                value={people.address.district}
                onChange={async data => {
                  await dispatch(
                    setPeople(people, {
                      ...people,
                      address: {
                        ...people.address,
                        district: data.nativeEvent.text,
                      },
                    }),
                  );
                }}
              />
            </Box>
          </HStack>

          {/* Cidade e Estado*/}
          <HStack mt={2} space={3} justifyContent="center">
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
                value={people.address.city}
                onChange={async data => {
                  await dispatch(
                    setPeople(people, {
                      ...people,
                      address: {
                        ...people.address,
                        city: data.nativeEvent.text,
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
                selectedValue={people.address.state}
                onValueChange={async data => {
                  await dispatch(
                    setPeople(people, {
                      ...people,
                      address: {...people.address, state: data},
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
            </Box>
          </HStack>
        </Card>

        {/* Datepicker */}
        {showDatePicker && (
          <>
            <DateTimePicker
              value={new Date()}
              display="spinner"
              onChange={data => handleOnChangeDateBirthday(data)}
              mode="date"
            />
          </>
        )}

        {/* Botão de salvar */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="plussquareo" size={18} color="white" />}
          colorScheme="success"
          onPress={async () => await handleSavePeople()}
          mb={5}
          mt={5}
        >
          <Text style={{fontWeight: 'bold'}} color={'white'}>
            SALVAR PESSOA
          </Text>
        </Button>
        {/* Botão de voltar */}
        <Button
          size={'lg'}
          rightIcon={<AntDesign name="back" size={18} color="white" />}
          colorScheme="gray"
          onPress={() => navigation.goBack()}
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
)(NewPerson);
