const { faker } = require('@faker-js/faker');
const fs = require("fs");

// 100
const generateClient = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: faker.date.birthdate().toISOString().split("T")[0],
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        tenant: faker.number.int({min: 0, max: 1})
    }
}

// 20
const generateAdvert = () => {
    return {
        description: "Advert Description",
        date: faker.date.future().toISOString().split("T")[0],
        time: faker.date.birthdate().toString().split(" ")[4],
    }
}

// 20
const generateMaintanence = () => {
    return {
        description: "Maintanence Description",
        date: faker.date.future().toISOString().split("T")[0],
        time: faker.date.birthdate().toString().split(" ")[4],
    }
}

// 50
const generateOwner = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: faker.date.birthdate().toISOString().split("T")[0],
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        address: faker.location.streetAddress()
    }
}

// 3
const generateManager = () => {
    return {
        managerId: null,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        position: "manager"
    }
}

// 17
const generateAgent = () => {
    return {
        managerId: faker.number.int({min: 0, max: 3}),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        position: "agent"
    }
}
// 50
const generateProperty = (i) => {
    return {
        property_number: i,
        street: faker.location.street(),
        city: faker.location.city(),
        suburb: faker.location.suburb(),
        maintanenceId: i,
        advertismentId: i
    }
}

// 50
const generatePropertyInstance = (i) => {
    return {
        numberOfTenants: faker.number.int({min: 1, max: 10}),
        available: faker.number.int({min: 0, max: 1}),
        propertyId: i,
        ownerId: i,
        agentId: i
    }
}

// 80
const generateLease = (i) => {
    return {
        propertyInstanceId: faker.number.int({min: 1, max: 50}),
        rent: faker.number.int({min: 1000, max: 2000}),
        bond: faker.number.int({min: 3000, max: 3250}),
        leaseStart: faker.date.birthdate().toISOString().split("T")[0],
        leaseEnd: faker.date.birthdate().toISOString().split("T")[0],
        rentFrquency: faker.number.int({min: 7, max: 14})
    }
}
// 80
const generateClientLease = (i) => {
    return {
        leaseId: i,
        clientId: i
    }
}

// 3
const generateBranch = (i) => {
    return {
        managerId: i,
        name: faker.person.firstName(),
        street: faker.location.street(),
        city: faker.location.city()
    }
}

const createData = (length, generateData) => {
    final = [];
    for(let i = 0; i++; i < length){
        final.push(generateData(i));
    }
    return final;
}

const createInsertStatement = (table, columns, data) => {
    statement = `INSERT INTO ${table} (${columns}) VALUES (`
    for(let i = 0; i++; i < data.keys()){
        if(typeof(data[i]) == "string"){
            statement += "`" + data[i] + "`";
        }else{
            statement += data[i];
        }
        if(!i+1 > data.keys()){
            statement += ",";
        }else{
            statement += ");";
        }
        
    }
    return statement;
}

const createInsertScript = () => {
    finalInsertStatement = "";

    createData(3, generateManager()).forEach(row => {
        finalInsertStatement += createInsertStatement("staff", "")
    });
    createData(17, generateAgent()).forEach(row => {
        finalInsertStatement += createInsertStatement("staff")
    })
}
