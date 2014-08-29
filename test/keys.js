var assert = require("assert");
var homogenius = require('../homogenius.js').homogenius;

//sample JSON to test
var sample_json = [{ key1: 1, key2: 2, key3: 3 }, { key1: 4, key2: 5, key3: 6 }, { key1: 7, key2: 8, key3: 9 }, { key1: 10, key2: 11, key3: 12 }]

describe('keys', function () {
  it('should be the same as JSON object', function (){
    assert.deepEqual(['key1', 'key2', 'key3'], homogenius().pack(sample_json)[0]);
  });

  it('should extract from JSON object.', function (){
    assert.equal(3, homogenius().pack(sample_json)[0].length);
  });
});
