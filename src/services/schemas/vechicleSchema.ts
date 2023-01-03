export const vehicleSchema = {
  name: 'Vehicle',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    approachId: {type: 'string?'},
    plate: {type: 'string?'},
  },
};
