import Realm from 'realm';
// Schemas
import {userSchema} from './schemas/userSchema';
import {sessionSchema} from './schemas/sessionSchema';
import {filiationSchema} from './schemas/filiationSchema';
import {addressSchema} from './schemas/addressSchema';
import {peopleSchema} from './schemas/peopleSchema';
import {photoSchema} from './schemas/photoSchema';
import {vehicleSchema} from './schemas/vechicleSchema';
import {approachSchema} from './schemas/approachSchema';

const getRealm = () => {
  return Realm.open({
    path: 'sentinela-database',
    schema: [
      userSchema,
      sessionSchema,
      filiationSchema,
      addressSchema,
      peopleSchema,
      photoSchema,
      vehicleSchema,
      approachSchema,
    ],
    schemaVersion: 1,
  });
};

export default getRealm;
