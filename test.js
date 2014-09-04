//this file illustrates some examples of using homogenious

//normal json file
[
    //keys
    [{
        "boo": 1
    }, {
        "foo": 1
    }, {
        "bar": 1
    }],
    //unique values
    [
        ["val1"],
        ["val2"],
        ["val3"]
    ],
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
    [{
        "boo": 1
    }, {
        "nested": [{
            "boo_nested": 1
        }, {
            "foo_nested": 1
        }, {
            "bar_nested": 1
        }]
    }, {
        "bar": 1
    }],
    [
        ["val1"],
        [
            ["val_nested1"],
            ["val_nested2"],
            ["val_nested3"]
        ],
        ["val2"]
    ],
    [0, [0, 0, 0], 0],
    [0, [0, 0, 0], 0]
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
