export const filiationSchema = {
  name: 'Filiation',
  primaryKey: 'id',
  properties: {
    id: {type: 'int', indexed: true},
    name: {type: 'string'},
  },
};
