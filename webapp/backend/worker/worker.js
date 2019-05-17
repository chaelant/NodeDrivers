const redisConnection = require('./redis_connection');
const ddb = require('../ops/dynamo');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);

redisConnection.on('add-note', async (data, channel) => {
    console.log('received add request');
    const result = await ddb.addNote(data.message.id, data.message.title, data.message.content, data.message.author);
    redisConnection.emit('add-note-response', {
        message: result
    })
});

redisConnection.on('delete-note', async (data, channel) => {
    console.log('received delete request');
    const result = await ddb.deleteNote(data.message.id);
    redisConnection.emit('delete-note-response', {
        message: result
    })
});

redisConnection.on('update-note', async (data, channel) => {
    console.log('received update request');
    const result = await ddb.updateNote(data.message.id, data.message.title, data.message.content, data.message.newAuthor);
    redisConnection.emit('update-note-response', {
        message: result
    })
});
