export const approachSchema = {
  name: 'Approach',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    userId: {type: 'int'},
    organizationsId: {type: 'int'},
    description: {type: 'string?'},
    latitude: {type: 'string?'},
    longitude: {type: 'string?'},
    createdAt: {type: 'date'},
  },
};
