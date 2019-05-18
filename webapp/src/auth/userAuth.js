// REMEMBER TO ACCOUNT FOR SESSION IDs

const AWS = require('aws-sdk/index');
// const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


AWS.config.update({
    region: 'us-east-1',
    //endpoint: 'http://localhost:3000',
    accessKeyId: '***',
    secretAccessKey: '***'
});

const docClient = new AWS.DynamoDB.DocumentClient();

export async function getUsers() {
    const readParams = {
        TableName: 'Users'
    };

    docClient.scan(readParams, function(err, data) {
        if (err) {
            console.log('Error retrieving users' + '\n' + JSON.stringify(err, undefined, 2));
        } else {
            console.log('Got them!' + '\n' + JSON.stringify(data, undefined, 2))
        }
    })
}

export async function findUser(username) {
    const findParams = {
        TableName: 'Users',
        Key: {
            'username': username
        }
    };

    docClient.get(findParams, function(err, data) {
        if (err) {
            console.log('Error retrieving users' + '\n' + JSON.stringify(err, undefined, 2));
        } else {
            if (Object.entries(data).length === 0 && data.constructor === Object) {
                console.log('That user doesn\'t exist');
                return false
            } else {
                console.log('Got the user!' + '\n' + JSON.stringify(data, undefined, 2));
                return true
            }
        }
    })
}

//if this is successful, add a session id
export async function validateUser(username, password) {

    const validateParams = {
        TableName: 'Users',
        Key: {
            'username': username,
        }
    };

    return docClient.get(validateParams).promise()
        .then(async result => {
            if (Object.entries(result).length === 0 && result.constructor === Object) {
                console.log('That user doesn\'t exist');
                return false
            } else {
                return await bcrypt.compare(password, result.Item.password)
            }
        });

    //return isValid;
}

// CHECK FOR DUPLICATE USER NAMES!!!
export async function addUser(username, password) {

    const findParams = {
        TableName: 'Users',
        Key: {
            'username': username
        }
    };

    const userExists = docClient.get(findParams).promise()
        .then((data) => {
            return !(Object.entries(data).length === 0 && data.constructor === Object);
        });

    // const userExists = docClient.get(findParams, function(err, data) {
    //     if (err) {
    //         console.log('Error retrieving users' + '\n' + JSON.stringify(err, undefined, 2));
    //     } else {
    //         return !(Object.entries(data).length === 0 && data.constructor === Object);
    //     }
    // });
    //
    console.log(userExists);

    if (userExists) {
        return bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                const newUserParams = {
                    TableName: 'Users',
                    Item: {
                        'username': username,
                        'password': hash
                    }
                };
                docClient.put(newUserParams, function(err, data) {
                    if (err) {
                        console.log('Error adding user!' + '\n' + JSON.stringify(err, undefined, 2));
                        return false;
                    } else {
                        console.log('Added user!' + '\n' + JSON.stringify(data, undefined, 2));
                        return true;
                    }
                })
            })
        })
    } else {
        return false;
    }

}
