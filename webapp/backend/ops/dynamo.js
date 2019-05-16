const AWS = require('aws-sdk/index');
// const uuid = require('uuid/v4');

AWS.config.update({
    region: 'us-east-1',
    //endpoint: 'http://localhost:3000',
    accessKeyId: 'AKIARU7XA6HVDS5P5GCN',
    secretAccessKey: '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'
});

const docClient = new AWS.DynamoDB.DocumentClient();

// export async function addNote(id, title, content) {
//     const originParams = {
//         TableName: "Notes",
//         Item: {
//             "id": id,
//             "title": title,
//             "content": content
//         }
//     };
//
//     docClient.put(originParams, function(err, data) {
//         if (err) {
//             console.log('Error adding note!' + '\n' + JSON.stringify(err, undefined, 2));
//             return false;
//         } else {
//             console.log('Added note!' + '\n' + JSON.stringify(data, undefined, 2));
//             return true;
//         }
//     });
// }
//
// export async function updateNote(id, title, content) {
//     const updateParams = {
//         TableName: "Notes",
//         Key: {
//             "id": id
//         },
//         UpdateExpression: "set content = :c, title = :t ",
//         ExpressionAttributeValues: {
//             ":c": content,
//             ":t": title
//         },
//         ReturnValues: "UPDATED_NEW"
//     };
//
//     docClient.update(updateParams, function(err, data) {
//         if (err) {
//             console.log('Error updating note!' + '\n' + JSON.stringify(err, undefined, 2));
//             return false;
//         } else {
//             console.log('Updated note!' + '\n' + JSON.stringify(data, undefined, 2));
//             return true;
//         }
//     });
// }
//
// export async function deleteNote(id) {
//     const deleteParams = {
//         TableName: "Notes",
//         Key: {
//             "id": id
//         },
//     };
//
//     docClient.delete(deleteParams, function(err, data) {
//         if (err) {
//             console.log('Error deleting note!' + '\n' + JSON.stringify(err, undefined, 2));
//             return false;
//         } else {
//             console.log('Deleted note!' + '\n' + JSON.stringify(data, undefined, 2));
//             return true;
//         }
//     });
// }

let exportedMethods = {

    async addNote(id, title, content) {
        const originParams = {
            TableName: "Notes",
            Item: {
                "id": id,
                "title": title,
                "content": content
            }
        };

        docClient.put(originParams, function(err, data) {
            if (err) {
                console.log('Error adding note!' + '\n' + JSON.stringify(err, undefined, 2));
                return false;
            } else {
                console.log('Added note!' + '\n' + JSON.stringify(data, undefined, 2));
                return true;
            }
        });
    },

    async updateNote(id, title, content) {

        const updateParams = {
            TableName: "Notes",
            Key: {
                "id": id
            },
            UpdateExpression: "set content = :c, title = :t ",
            ExpressionAttributeValues: {
                ":c": content,
                ":t": title
            },
            ReturnValues: "UPDATED_NEW"
        };

        docClient.update(updateParams, function(err, data) {
            if (err) {
                console.log('Error updating note!' + '\n' + JSON.stringify(err, undefined, 2));
                return false;
            } else {
                console.log('Updated note!' + '\n' + JSON.stringify(data, undefined, 2));
                return true;
            }
        });
    },

    async deleteNote(id) {
        const deleteParams = {
            TableName: "Notes",
            Key: {
                "id": id
            },
        };

        docClient.delete(deleteParams, function(err, data) {
            if (err) {
                console.log('Error deleting note!' + '\n' + JSON.stringify(err, undefined, 2));
                return false;
            } else {
                console.log('Deleted note!' + '\n' + JSON.stringify(data, undefined, 2));
                return true;
            }
        });
    }
};

module.exports = exportedMethods;


// SEARCH FOR NOTE WILL BE BASED ON THE IMPLEMENTATION OF ELASTICSEARCH
//
// const searchParams = {
//     TableName: "Notes",
//     Key: {
//         "id": 1
//     }
// };
//
// docClient.get(searchParams, function(err, data) {
//     if (err) {
//         console.log('Error retrieving note!' + '\n' + JSON.stringify(err, undefined, 2));
//     } else {
//         console.log('Retrieved note!' + '\n' + JSON.stringify(data, undefined, 2));
//     }
// });






