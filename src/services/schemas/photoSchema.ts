export const photoSchema = {
  name: 'Photo',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    approachId: {type: 'string?'},
    peopleId: {type: 'string?'},
    vehicleId: {type: 'string?'},
    description: {type: 'string?'},
    path: {type: 'string'},
    type: {type: 'string'},
  },
};
