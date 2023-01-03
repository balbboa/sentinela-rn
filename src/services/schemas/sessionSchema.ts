export const sessionSchema = {
  name: 'Session',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    userId: {type: 'int'},
    remember: {type: 'bool'},
    created_at: {type: 'date'},
  },
};
