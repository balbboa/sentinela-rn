export const peopleSchema = {
  name: 'People',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    approachId: {type: 'string?'},
    organizationsId: {type: 'int'},
    name: {type: 'string?'},
    aka: {type: 'string?'},
    motherName: {type: 'string?'},
    sex: {type: 'string?'},
    birthday: {type: 'string?'},
    filiation: {type: 'int?'},
    document: {type: 'string?'},
  },
};
