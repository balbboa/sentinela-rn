import api from '../api';
import {
  createFiliation,
  removeAllFiliations,
} from '../controllers/filiationController';

export const filiationSeed = async () => {
  try {
    const response = await api.get('filiations');
    const {filiations} = response.data;

    if (filiations.length > 0) {
      // Remove todas as filiações
      await removeAllFiliations();
      for await (const filiation of filiations) {
        try {
          await createFiliation({
            id: filiation.id,
            name: filiation.name,
          });
        } catch (error) {
          console.log('Erro ao criar a filiação local');
        }
      }
    }
  } catch (error) {
    console.log('Erro ao criar ao conectar na API');
  }
};
