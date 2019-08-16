'use strict';
const {
  flatProperties
} = require('../lib/flat-properties');

describe('model-helpers.js', function () {
  describe('flatProperties', function () {
    beforeEach(function () {
      this.data = {
        cardNumber: '2222-xxxx-xxxxx-2323',
        client: function () {
          return {
            department: 'xyz',
            person: function () {
              return {
                firstName: 'fulano',
                addresses: [
                  {
                    buildingNumber: 32,
                    street: function () {
                      return {
                        name: 'Simon orozco',
                        sector: function () {
                          return {
                            name: 'Invivienda'
                          };
                        }
                      };
                    }
                  }
                ]
              };
            }
          };
        }
      };
      this.schema = {
        cardNumber: 'cardNumber',
        clientName: 'client.person.firstName',
        clientDepartment: 'client.department'
      };
    });
    it('should return the data flatted', function () {
      const dataExpect = {
        cardNumber: '2222-xxxx-xxxxx-2323',
        clientName: 'fulano',
        clientDepartment: 'xyz'
      };
      expect(flatProperties(this.data, this.schema)).toEqual(dataExpect);
    });
    it('should work fine if the data is null', function () {
      expect(flatProperties(null, { id: 'id', person: 'client.person' }), {});
      expect(flatProperties({ id: '23' }, {}), {});
    });
    it('should flat a array of object', function () {
      const schema = {
        cardNumber: 'cardNumber',
        clientName: 'client.person.firstName',
        clientDepartment: 'client.department',
        addresses: {
          path: 'client.person.addresses',
          schema: {
            missingProp: 'missingProp',
            buildingNumber: 'buildingNumber',
            streetName: 'street.name',
            sector: 'street.sector.name'
          }
        }
      };
      const dataExpect = {
        cardNumber: '2222-xxxx-xxxxx-2323',
        clientName: 'fulano',
        clientDepartment: 'xyz',
        addresses: [
          {
            buildingNumber: 32,
            streetName: 'Simon orozco',
            sector: 'Invivienda'
          }
        ]
      };
      expect(flatProperties(this.data, schema)).toEqual(dataExpect);
    });
    it('should return the data flatted without error', function () {
      const dataExpect = {
        cardNumber: '2222-xxxx-xxxxx-2323',
        clientName: 'fulano',
        clientDepartment: 'xyz'
      };
      const schema = {
        id: 'id',
        cardNumber: 'cardNumber',
        clientName: 'client.person.firstName',
        clientDepartment: 'client.department',
        messengerName: 'messenger.person.firstName',
        messengerId: 'messenger.id'
      };
      expect(flatProperties(this.data, schema)).toEqual(dataExpect);
    });
  });
});
