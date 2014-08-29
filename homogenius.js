(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else {
    // Browser globals
    factory(root);
  }
} (this, function (exports) {

  var VERSION = '0.1.0';

  function Homogenius () {
    this._options = {};
  };

  /**
   * To extract keys from JSON object
   *
   * @param {Object} json_obj
   */
  function _extractKeys (json_obj) {
    var keys = [];
    for (var item in json_obj) {
      keys.push(item);

      //nested keys
      if (json_obj[item] instanceof Object) {
        keys.push(_extractKeys(json_obj[item]));
      }
    }

    return keys;
  };

  /**
   * Pack given JSON object to Homogenius form
   *
   * @param {Object} json_obj
   */
  function _pack (json_obj) {
    if (!json_obj instanceof Array) {
      throw Error('Invalid data type.');
    }

    var packed_json = [];

    //extract keys from json
    //only pass the first element of the array to get the keys
    var keys = _extractKeys.call(this, json_obj[0]);

    //add keys to the packed json
    packed_json.push(keys);

    //first loop for array items
    for (var array_item in json_obj) {

      var values = [];
      //second loop for iterating each object items
      for (var object_item in json_obj[array_item]) {
        values.push(json_obj[array_item][object_item]);
      }

      //add each object to the packed array
      packed_json.push(values);
    }

    return packed_json;
  };

  var homogenius = function () {
    return new Homogenius();
  };

  //set version
  homogenius.version = VERSION;

  homogenius.fn = Homogenius.prototype = {
    clone: function () {
      return new homogenius(this);
    },
    pack: function (json_obj) {
      return _pack.call(this, json_obj);
    }
  };

  return exports.homogenius = homogenius;
}));
