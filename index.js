const { faker } = require('@faker-js/faker');
const fs = require("fs");

// 100
const generateClient = (_, i) => {
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
const generateAdvert = (_, i) => {
    return {
        description: "Advert Description",
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
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: faker.date.birthdate().toISOString().split("T")[0],
        phone: faker.phone.imei(),
        email: faker.internet.email(),
        address: faker.location.streetAddress()
    }
}

// 3
const generateManager = (_, i) => {
    return {
        managerId: null,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        position: "manager"
    }
}

// 17
const generateAgent = (_, i) => {
    return {
        managerId: faker.number.int({min: 0, max: 3}),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        position: "agent"
    }
}
// 50
const generateProperty = (_, i) => {
    return {
        property_number: i+1,
        street: faker.location.street(),
        city: faker.location.city(),
        suburb: faker.location.city(),
        postal_code: faker.location.zipCode(),
        maintanenceId: i+1,
        advertismentId: i+1
    }
}

// 50
const generatePropertyInstance = (_, i) => {
    return {
        numberOfTenants: faker.number.int({min: 1, max: 10}),
        available: faker.number.int({min: 0, max: 1}),
        propertyId: i+1,
        ownerId: i+1,
        agentId: i+1
    }
}

// 80
const generateLease = (_, i) => {
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
const generateClientLease = (_, i) => {
    return {
        leaseId: i+1,
        clientId: i+1
    }
}

// 3
const generateBranch = (_, i) => {
    return {
        managerId: i+1,
        name: faker.person.firstName(),
        street: faker.location.street(),
        city: faker.location.city()
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
            statement += "`" + current + "`";
        }else if(typeof(current) == "number") {
            statement += current
        }else if(current == null){
            statement += "null"
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
            finalInsertStatement += createInsertStatement("staff", "`manager_id`, `first_name`, `last_name`, `position`", row)
        });
        createData(17, generateAgent).then(result1 => {
            result1.forEach(row => {
                finalInsertStatement += createInsertStatement("staff", "`manager_id`, `first_name`, `last_name`, `position`", row)
            })
            createData(3, generateBranch).then(result2 => {
                result2.forEach(row => {
                    finalInsertStatement += createInsertStatement("branch", "`manager_id`, `name`, `street`, `city`", row)
                })
                createData(20, generateAdvert).then(result3 => {
                    result3.forEach(row => {
                        finalInsertStatement += createInsertStatement("advertisment", "`description`, `date`, `time`", row)
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
                                        createData(80, generateLease).then(result9 => {
                                            result9.forEach(row => {
                                                finalInsertStatement += createInsertStatement("lease", "`property_instance_id`, `rent`, `bond`, `lease_start`, `lease_end`, `rent_frequency`", row)
                                            })
                                            createData(80, generateClientLease).then(result10 => {
                                                result10.forEach(row => {
                                                    finalInsertStatement += createInsertStatement("client_lease", "`lease_id`, `client_id`", row)
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
    
    
    
    
    
    
    
    
    
    
    
}

createInsertScript();
