# Flat-Properties
Flat properties from hierarchy object data.

## How to Install

```npm i flat-properties```

## Example:

```flatProperties(data, schema);```

#### Data
```
{
    name: "Ulises",
    person: {
        idCard: "23023434230",
        addresses: [
            {
                buildingNumber: 2,
                sector: {
                    name: "Invivienda"
                }
            }
        ]
    }
}
```
#### Schema
```
{
    personName: "name",
    personIdCard: "person.idCard",
    personAddress: {
        path: "person.addresses",
        schema: {
            buildingNumber: "buildingNumber",
            sectorName: "sector.name"
        }
    }
}
```

#### Result
```
{
    personName: "Ulises",
    personIdCard: "23023434230",
    personAddress: [
        {
            buildingNumber: 2,
            sectorName: "Invivienda
        }
    ]
}
```
