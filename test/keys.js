var assert = require("assert");
var homogenius = require('../homogenius.js').homogenius;


//sample JSON to test
var sample_json = [{ key1: 1, key2: 'hello', key3: true },
                   { key1: 4, key2: 'world', key3: false },
                   { key1: 7, key2: 'hello', key3: false },
                   { key1: 5, key2: 'world', key3: true }];

//sample JSON to test
var sample_nested_json = [{ key1: 1, key2: { nested_key1: 'hello', nested_key2: true }, key3: 'hello' },
                          { key1: 4, key2: { nested_key1: 'world', nested_key2: false }, key3: 'world' },
                          { key1: 7, key2: { nested_key1: 'hello', nested_key2: true }, key3: 'hello' },
                          { key1: 4, key2: { nested_key1: 'world', nested_key2: false }, key3: 'world' }];

describe('keys', function () {
  it('should be the same as JSON object', function () {
    assert.deepEqual([{'key1': 'number'}, {'key2': 'string'}, {'key3': 'boolean'}], homogenius().pack(sample_json)[0]);
  });

  it('should extract from JSON object.', function () {
    assert.equal(3, homogenius().pack(sample_json)[0].length);
  });

  it('should be the same as nested JSON object', function() {
    assert.deepEqual([{'key1': 'number'}, {'key2': [{'nested_key1': 'string'}, {'nested_key2': 'boolean'}]}, {'key3': 'string'}], homogenius().pack(sample_nested_json)[0]);
  });

  it('should extract nested keys from JSON object', function() {
    assert.equal(3, homogenius().pack(sample_nested_json)[0].length);
  });
});
