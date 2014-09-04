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
      tempUniqueValues = (tempUniqueValues || uniqueValues)[blockIndex[i]];

      //check if there in no array for this unique value
      if (typeof (tempUniqueValues) != 'object') {
        tempUniqueValues = [];

        if (i > 0) {
          //block index is nested
          uniqueValues[blockIndex[i - 1]].push(tempUniqueValues);
        } else {
          uniqueValues.push(tempUniqueValues);
        }
      }
    }

    //lookup the index of value
    var uniqueValueIndex = tempUniqueValues.indexOf(value);

    if (uniqueValueIndex > -1) {
      return uniqueValueIndex;
    } else {
      //or add the value to the unique array
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
  function _packValue (dataRow, uniqueValues, schemaRow, parentIndex) {
    var values = [];

    var currentSchema = schemaRow || this._schema;
    for (var i = 0; i < currentSchema.length; i++) {
      //TODO: this loop is used to extract the key/value from schema item, do we need it?
      for (var schemaKey in currentSchema[i]) {
        if (typeof(currentSchema[i][schemaKey]) != 'object') {

          var blockIndex = [];
          if (typeof(parentIndex) != 'undefined') {
            blockIndex.push(parentIndex);
          }
          blockIndex.push(i);

          values.push(_getUniqueValueIndex.call(this, uniqueValues, dataRow[schemaKey], blockIndex));
        } else {
          values.push(_packValue.call(this, dataRow[schemaKey], uniqueValues, currentSchema[i][schemaKey], i));
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

    var packedJson = [];

    //add schema to the packed json
    packedJson.push(this._schema);

    //add unique values array
    packedJson.push([]);

    //first loop for array items
    for (var array_item in data) {
      //add each object to the packed array
      packedJson.push(_packValue.call(this, data[array_item], packedJson[1]));
    }

    return packedJson;
  };

  function _getFromUniqueValues (uniqueValueIndex, uniqueValues, blockIndex) {
    return uniqueValues[blockIndex][uniqueValueIndex];
  }

  function _unpackValue (dataRow, uniqueValues) {
    var unpackedRow = {};
    var currentSchema = this._schema;
    for (var i = 0; i < currentSchema.length; i++) {
      for (var schemaKey in currentSchema[i]) {

        if (typeof(currentSchema[i][schemaKey]) == 'object') {
          //nested
        } else {
          unpackedRow[schemaKey] = _getFromUniqueValues.call(this, dataRow[i], uniqueValues, i);
        }
      }
    }
    return unpackedRow;
  }

  function _unpack (packedJson) {
    //set schema
    var schema = this._schema = packedJson[0];
    //get uniquevalues array
    var uniqueValues = packedJson[1];
    //packed values array
    var values = packedJson.slice(2, packedJson.length);

    var unpackedJson = [];
    for (var i = 0;i < values.length;i++) {
      var currentPackedRow = values[i];

      unpackedJson.push(_unpackValue.call(this, currentPackedRow, uniqueValues));
    }

    return unpackedJson;
  }

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
    unpack: function (data) {
      return _unpack.call(this, data);
    },
    setSchema: function (schema) {
      _setSchema.call(this, schema);
      return this;
    }
  };

  return exports.homogenius = homogenius;
}));
