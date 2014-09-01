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
    //set schema to null
    this._schema = null;

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

      var itemValue = {};
      if (json_obj[item] instanceof Object) {
        itemValue[item] = _extractKeys(json_obj[item]);
      } else {
        itemValue[item] = typeof(json_obj[item]);
      }

      keys.push(itemValue);
    }

    return keys;
  };

  /**
   * To set the schema of JSON object
   *
   * @param {Object} schema
   */
  function _setSchema (schema) {
    if (schema instanceof Object) {
      this._schema = schema;
    } else {
      throw Error('Schema should be an object.');
    }
  }

  /**
   * To set the default schema
   *
   * @param {Object} data
   */
  function _setDefaultSchema (data) {
    _setSchema.call(this,
                    //extract keys from json
                    //only pass the first element of the array to get the keys
                    _extractKeys.call(this, data[0])
                   );
  }


  function _packValue (data_row, schema_row) {
    var values = [];

    var currentSchema = schema_row || this._schema;
    for (var i = 0; i <= currentSchema.length; i++) {
      //TODO: this loop is used to extract the key/value from schema item, do we need it?
      for (var schema_key in currentSchema[i]) {
        if (typeof (currentSchema[i][schema_key]) != 'object') {
          values.push(data_row[schema_key]);
        } else {
          values.push(_packValue.call(this, data_row[schema_key], currentSchema[i][schema_key]));
        }
      }
    }

    return values;
  }

  /**
   * Pack given JSON object to Homogenius form
   *
   */
  function _pack (data) {
    //set default schema if there is not schema
    if (this._schema == null) {
      _setDefaultSchema.call(this, data);
    }

    var packed_json = [];

    //add schema to the packed json
    packed_json.push(this._schema);

    //first loop for array items
    for (var array_item in data) {
      //add each object to the packed array
      packed_json.push(_packValue.call(this, data[array_item]));
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
    pack: function (data) {
      return _pack.call(this, data);
    },
    setSchema: function (schema) {
      _setSchema.call(this, schema);
      return this;
    }
  };

  return exports.homogenius = homogenius;
}));
