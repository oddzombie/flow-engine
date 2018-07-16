export const rules = [
  {
    id: '1',
    body: 'return !!obj;',
    true_id: '2',
    false_id: '3',
  },
  {
    id: '2',
    body: 'return !!obj;',
    true_id: '4',
    false_id: '3',
  },
  {
    id: '3',
    body: 'return !!obj;',
    true_id: '4',
    false_id: null,
  },
  {
    id: '4',
    body: 'return !!obj;',
    true_id: null,
    false_id: null,
  },
];

export const obj = '{}';
