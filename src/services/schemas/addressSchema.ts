export const addressSchema = {
  name: 'Address',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    approachId: {type: 'string?'},
    peopleId: {type: 'string?'},
    street: {type: 'string?'},
    district: {type: 'string?'},
    number: {type: 'string?'},
    city: {type: 'string?'},
    state: {type: 'string?'},
    createdAt: {type: 'date'},
  },
};
