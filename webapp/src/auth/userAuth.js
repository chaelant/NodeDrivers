// REMEMBER TO ACCOUNT FOR SESSION IDs

const AWS = require('aws-sdk/index');
// const uuid = require('uuid/v4');

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
        .then(result => {
            if (Object.entries(result).length === 0 && result.constructor === Object) {
                console.log('That user doesn\'t exist');
                return false
            } else {
                if (result.Item.username === username && result.Item.password === password) {
                    console.log('Validated!');
                    return true
                } else {
                    console.log('Invalid credentials');
                    return false
                }
            }
        });

    //return isValid;
}

export async function addUser(username, password) {
    const newUserParams = {
        TableName: 'Users',
        Item: {
            'username': username,
            'password': password,
            'sessionIds': []
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
}
