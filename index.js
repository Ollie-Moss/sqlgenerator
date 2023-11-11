const { faker } = require('@faker-js/faker');
const fs = require("fs");

// 100
const generateClient = (_, i) => {
    return {
        firstName: faker.person.firstName().replaceAll("'", ""),
        lastName: faker.person.lastName().replaceAll("'", ""),
        dob: faker.date.birthdate().toISOString().split("T")[0],
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        address: faker.location.streetAddress().replaceAll("'", ""),
        tenant: faker.number.int({min: 0, max: 1})
    }
}

// 20
const generateAdvert = (_, i) => {
    return {
        publisher: faker.person.fullName().replaceAll("'", ""),
        location: faker.location.streetAddress().replaceAll("'", ""),
        date: faker.date.future().toISOString().split("T")[0],
        time: faker.date.birthdate().toString().split(" ")[4],
    }
}

// 20
const generateMaintanence = (_, i) => {
    return {
        description: "Maintanence Description",
        date: faker.date.future().toISOString().split("T")[0],
        time: faker.date.birthdate().toString().split(" ")[4],
    }
}

// 50
const generateOwner = (_, i) => {
    return {
        firstName: faker.person.firstName().replaceAll("'", ""),
        lastName: faker.person.lastName().replaceAll("'", ""),
        dob: faker.date.birthdate().toISOString().split("T")[0],
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        address: faker.location.streetAddress().replaceAll("'", "")
    }
}

// 3
const generateManager = (_, i) => {
    return {
        managerId: null,
        firstName: faker.person.firstName().replaceAll("'", ""),
        lastName: faker.person.lastName().replaceAll("'", ""),
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        position: "manager"
    }
}

// 17
const generateAgent = (_, i) => {
    return {
        managerId: faker.number.int({min: 0, max: 3}),
        firstName: faker.person.firstName().replaceAll("'", ""),
        lastName: faker.person.lastName().replaceAll("'", ""),
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        position: "agent"
    }
}
// 50
const generateProperty = (_, i) => {
    return {
        property_number: i+1,
        street: faker.location.streetAddress().replaceAll("'", ""),
        city: faker.location.city().replaceAll("'", ""),
        suburb: faker.location.city().replaceAll("'", ""),
        postal_code: faker.location.zipCode(),
        maintanenceId: (i+1 > 20) ? null : i+1,
        advertismentId: (i+1 > 20) ? null : i+1
    }
}

// 50
const generatePropertyInstance = (_, i) => {
    return {
        numberOfTenants: faker.number.int({min: 1, max: 10}),
        available: 0,
        propertyId: i+1,
        ownerId: i+1,
        agentId: faker.number.int({min: 1, max: 20})
    }
}

// 50
const generateLease = (_, i) => {
    return {
        propertyInstanceId: i+1,
        rent: faker.number.int({min: 1000, max: 2000}),
        bond: faker.number.int({min: 3000, max: 3250}),
        leaseStart: faker.date.between({from: '2019-01-01T00:00:00.000Z', to: '2020-01-01T00:00:00.000Z'}).toISOString().split("T")[0],
        leaseEnd: faker.date.between({from: '2023-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z'}).toISOString().split("T")[0],
        rentFrquency: faker.number.int({min: 7, max: 14})
    }
}
// 50
const generateClientLease = (_, i) => {
    return {
        leaseId: faker.number.int({min: 1, max: 50}),
        clientId: faker.number.int({min: 1, max: 100})
    }
}

// 3
const generateBranch = (_, i) => {
    return {
        managerId: i+1,
        name: faker.person.firstName().replaceAll("'", ""),
        street: faker.location.streetAddress().replaceAll("'", ""),
        city: faker.location.city().replaceAll("'", "")
    }
}
// 100
const generateClientViewing = (_, i) => {
    return {
        clientId: faker.number.int({min: 1, max: 100}),
        propertyId: faker.number.int({min: 1, max: 50}),
        date: faker.date.between({from: '2022-01-01T00:00:00.000Z', to: '2023-10-10T00:00:00.000Z'}).toISOString().split("T")[0]
    }
}

const generateRegistration = (_, i) => {
    return {
        clientId: i+1,
        branchId: faker.number.int({min: 1, max: 3}),
        date: faker.date.between({from: '2020-01-01T00:00:00.000Z', to: '2023-10-10T00:00:00.000Z'}).toISOString().split("T")[0]
    }
}
const createData = async (num, generateData) => {
    return Array.from({length: num}, generateData);
}

const createInsertStatement = (table, columns, data) => {
    statement = `INSERT INTO ${table} (${columns}) VALUES (`
    for(let i = 0; i < Object.keys(data).length; i++){
        let current = data[Object.keys(data)[i]];
        if(typeof(current) == "string"){
            statement += "'" + current + "'";
        }else if(typeof(current) == "number") {
            statement += current
        }else if(current == null){
            statement += "NULL"
        }
        if(i+1 >= Object.keys(data).length){
            statement += ");\n";
        }else{
            statement += ",";
        }
    }
    return statement;
}

const createInsertScript = () => {
    let finalInsertStatement = "";

    createData(3, generateManager).then(result => {
        result.forEach(row => {
            finalInsertStatement += createInsertStatement("staff", "`manager_id`, `first_name`, `last_name`, `phone`, `email`, `position`", row)
        });
        createData(17, generateAgent).then(result1 => {
            result1.forEach(row => {
                finalInsertStatement += createInsertStatement("staff", "`manager_id`, `first_name`, `last_name`, `phone`, `email`, `position`", row)
            })
            createData(3, generateBranch).then(result2 => {
                result2.forEach(row => {
                    finalInsertStatement += createInsertStatement("branch", "`manager_id`, `name`, `street`, `city`", row)
                })
                createData(20, generateAdvert).then(result3 => {
                    result3.forEach(row => {
                        finalInsertStatement += createInsertStatement("advertisment", "`publisher`, `location`, `date`, `time`", row)
                    })
                    createData(20, generateMaintanence).then(result4 => {
                        result4.forEach(row => {
                            finalInsertStatement += createInsertStatement("maintanence", "`description`, `date`, `time`", row)
                        })
                        createData(50, generateOwner).then(result5 => {
                            result5.forEach(row => {
                                finalInsertStatement += createInsertStatement("owner", "`first_name`, `last_name`, `date_of_birth`, `phone`, `email`, `address`", row)
                            })
                            createData(100, generateClient).then(result6 => {
                                result6.forEach(row => {
                                    finalInsertStatement += createInsertStatement("client", "`first_name`, `last_name`, `date_of_birth`, `phone`, `email`, `address`, `tenant`", row)
                                })
                                createData(50, generateProperty).then(result7 => {
                                    result7.forEach(row => {
                                        finalInsertStatement += createInsertStatement("property", "`property_number`, `street`, `city`, `suburb`, `postal_code`, `maintanence_id`, `advertisment_id`", row)
                                    })
                                    createData(50, generatePropertyInstance).then(result8 => {
                                        result8.forEach(row => {
                                            finalInsertStatement += createInsertStatement("property_instance", "`number_of_tenants`, `available`, `property_id`, `owner_id`, `agent_id`", row)
                                        })
                                        createData(50, generateLease).then(result9 => {
                                            result9.forEach(row => {
                                                finalInsertStatement += createInsertStatement("lease", "`property_instance_id`, `rent`, `bond`, `lease_start`, `lease_end`, `rent_frequency`", row)
                                            })
                                            createData(50, generateClientLease).then(result10 => {
                                                result10.forEach(row => {
                                                    finalInsertStatement += createInsertStatement("client_lease", "`lease_id`, `client_id`", row)
                                                })
                                                createData(50, generateClientViewing).then(result11 => {
                                                    result11.forEach(row => {
                                                        finalInsertStatement += createInsertStatement("client_viewing", "`client_id`, `property_instance_id`, `viewing_date`", row)
                                                    })
                                                    createData(100, generateRegistration).then(result11 => {
                                                        result11.forEach(row => {
                                                            finalInsertStatement += createInsertStatement("registration", "`client_id`, `branch_id`, `registration_date`", row)
                                                        })
                                                        fs.writeFile("./insertScript.sql", finalInsertStatement, (err) => err && console.log(err));
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        
    })
    
    
    
    
    
    
    
    
    
    
    
}

createInsertScript();
