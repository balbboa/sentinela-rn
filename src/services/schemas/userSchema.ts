export const userSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: {type: 'int', indexed: true},
    name: {type: 'string'},
    email: {type: 'string'},
    password: {type: 'string'},
    registration: {type: 'string'},
    status: {type: 'bool'},
    organizationName: {type: 'string'},
    organizationsId: {type: 'int'},
    token: {type: 'string'},
  },
};
