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

    //data types
    this._dataType = {
      'object': 0,
      'string': 1,
      'number': 2,
      'boolean': 3
    };
  };

  /**
   * To extract keys from JSON object
   *
   * @param {Object} jsonObj
   */
  function _extractKeys (jsonObj) {
    var keys = [];
    for (var item in jsonObj) {

      var itemValue = {};
      if (jsonObj[item] instanceof Object) {
        //nested object
        itemValue[item] = _extractKeys.call(this, jsonObj[item]);
      } else {
        //add schema key and data type
        itemValue[item] = this._dataType[typeof(jsonObj[item])];
      }

      keys.push(itemValue);
    }

    return keys;
  };

  /**
   * To set the schema of JSON object
   *
   * @param {Array} schema
   */
  function _setSchema (schema) {
    if (schema instanceof Object) {
      this._schema = schema;
    } else {
      throw Error('Schema should be an object.');
    }
  }

  /**
   * To set the default schema from given data array
   *
   * @param {Array} data
   */
  function _setDefaultSchema (data) {
    _setSchema.call(this,
                    //extract keys from json
                    //only pass the first element of the array to get the keys
                    _extractKeys.call(this, data[0])
                   );
  }

  /**
   * Returns the index of unique value or create it if does not exist
   *
   * @param {Array} uniqueValues
   * @param {Object|Number|String|Boolean} value
   * @param {Array} blockIndex
   */
  function _getUniqueValueIndex (uniqueValues, value, blockIndex) {
    var tempUniqueValues = null;
    for (var i = 0; i < blockIndex.length; i++) {
      tempUniqueValues = uniqueValues[blockIndex[i]];
    }

    //check if there in no array for this unique value
    if (typeof (tempUniqueValues) != 'object') {
      tempUniqueValues = [];
      uniqueValues.push(tempUniqueValues);
    }

    var uniqueValueIndex = tempUniqueValues.indexOf(value);

    if (uniqueValueIndex > -1) {
      return uniqueValueIndex;
    } else {
      return tempUniqueValues.push(value) - 1;
    }
  }

  /**
   * Packs a single value
   *
   * @param {Array} dataRow
   * @param {Array} uniqueValues
   * @param {Array} schemaRow
   */
  function _packValue (dataRow, uniqueValues, schemaRow) {
    var values = [];

    var currentSchema = schemaRow || this._schema;
    for (var i = 0; i < currentSchema.length; i++) {
      //TODO: this loop is used to extract the key/value from schema item, do we need it?
      for (var schemaKey in currentSchema[i]) {
        if (typeof (currentSchema[i][schemaKey]) != 'object') {
          values.push(_getUniqueValueIndex.call(this, uniqueValues, dataRow[schemaKey], [i]));
        } else {
          values.push(_packValue.call(this, dataRow[schemaKey], currentSchema[i][schemaKey]));
        }
      }
    }

    return values;
  }

  /**
   * Pack given JSON object to Homogenius form
   *
   * @param {Array} data
   */
  function _pack (data) {
    //set default schema if there is not schema
    if (this._schema == null) {
      _setDefaultSchema.call(this, data);
    }

    var packed_json = [];

    //add schema to the packed json
    packed_json.push(this._schema);

    //add unique values array
    packed_json.push([]);

    //first loop for array items
    for (var array_item in data) {
      //add each object to the packed array
      packed_json.push(_packValue.call(this, data[array_item], packed_json[1]));
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
