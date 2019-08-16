'use strict';
/**
 *  Flat properties
 *
 *  Example:
 *    ````
 *    let data = {
 *      name: "jon",
 *      person: {
 *        idCard: "23023434230",
 *        addresses: [
 *          {
 *            buildingNumber: 2,
 *            sector: {
 *              name: "Invivienda"
 *            }
 *          }
 *        ]
 *      }
 *    }
 *    ````
 *    ````
 *    let schema = {
 *      personName: "name",
 *      personIdCard: "person.idCard",
 *      personAddress: {
 *        {
 *          path: "person.addresses",
 *          schema: {
 *            buildingNumber: "buildingNumber",
 *            sectorName: "sector.name"
 *          }
 *        }
 *      }
 *    }
 *    ````
 * @param {*} data
 * @param {*} schema
 */
const flatProperties = (data, schema) => {
  const resultObject = {};

  /**
     * Split properties into array
     *
     * @param {object} schema
     * @param {string} key
     */
  const splitProperties = (schema, key) => {
    if (typeof schema[key] === 'string') {
      return [...schema[key].split('.')];
    } else if (typeof schema[key] === 'object') {
      return Object.keys(schema[key]).map(x => splitProperties(schema[key], x));
    }
  };

  /**
     *  Get value from a data.
     *
     * @param {object} data
     * @param {string} key
     */
  const getValue = (data, key) => {
    if (data && typeof data[key] === 'function') {
      return data[key]();
    } else {
      return data && data[key];
    }
  };
  /**
     *  Flat object from hierachy data
     *
     * @param {array} properties
     * @param {object} data
     * @param {string} key
     */
  const flatObject = (properties, data, key = '') => {
    if (properties.length === 1 &&
          typeof properties[0] === 'string' &&
          getValue(data, key)) {
      return getValue(data, key);
    }
    return properties.reduce((previusValue = {}, currentValue) => {
      return getValue(data, currentValue) ||
          getValue(previusValue, currentValue);
    }, {});
  };

  Object.keys(schema).forEach(key => {
    const properties = splitProperties(schema, key);

    if (properties.length > 0 && typeof properties[0] === 'object') {
      // Flat a object into a array, it should have the correct schema.
      // properties[0] = paths of array
      // properties[1] = schema of array
      const dataList = flatObject(properties[0], data);

      resultObject[key] = dataList.map((item) => {
        const object = properties[1].reduce((previus, current, index) => {
          const keys = Object.keys(schema[key]['schema']);
          const value = flatObject(current, item);
          if (value) {
            previus[keys[index]] = value;
          }
          return Object.assign({}, previus);
        }, {});

        return object;
      });
    } else {
      // Flat a simple object.
      const value = flatObject(properties, data, key);
      if (value) {
        resultObject[key] = value;
      }
    }
  });

  return resultObject;
};

module.exports = { flatProperties };
