//this file illustrates some examples of using homogenious

//normal json file
[
  //keys
  ['boo', 'foo', 'bar'],
  //unique values
  [['val1'], ['val2'], ['val3']]
  //values
  [0, 0, 0],
  [0, 0, 0]
]


[{
  'boo': 'val1',
  'foo': 'val2',
  'bar': 'val3'
}, {
  'boo': 'val1',
  'foo': 'val2',
  'bar': 'val3'
}]


//json file with nested values
[
  //keys
  ['boo', 'nested', ['boo_nested', 'foo_nested', 'bar_nested'], 'bar'],
  //values
  ['val1', ['val_nested1', 'val_nested2', 'val_nested3'], 'val2'],
  ['val1', ['val_nested1', 'val_nested2', 'val_nested3'], 'val2']
]


[{
  'boo': 'val1',
  'nested': {
    'boo_nested': 'val_nested1',
    'foo_nested': 'val_nested2',
    'bar_nested': 'val_nested3'
  },
  'bar': 'val2'
}, {
  'boo': 'val1',
  'nested': {
    'boo_nested': 'val_nested1',
    'foo_nested': 'val_nested2',
    'bar_nested': 'val_nested3'
  },
  'bar': 'val2'
}]
