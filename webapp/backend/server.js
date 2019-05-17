const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const redisConnection = require('./worker/redis_connection');
const redis = require('redis');
const bluebird = require('bluebird');
const es = require('./ops/es');
const client = redis.createClient();
const key = 'notes';

const app = express();

bluebird.promisifyAll(redis.RedisClient.prototype);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const loadCache = async function(req, res, next) {
    if (req.loadedCache === true) {
        next()
    } else {
        const existingNotes = await es.getAllNotes();
        for (let note in existingNotes) {
            await client.lpushAsync(key, JSON.stringify(existingNotes[note]))
        }
        req.loadedCache = true;
        next()
    }
};

app.use(loadCache);

app.get('/:op', async (req, res, next) => {
    console.log('operation route requested!');
    // console.log(req);
    if (req.params.op === 'cache') {
        next()
    } else if (req.query.id && req.query.title && req.query.content) {
        if (req.params.op === 'create') {
            console.log('Create request');
            redisConnection.emit('add-note', {
                message: {
                    id: req.query.id,
                    title: req.query.title,
                    content: req.query.content,
                    author: req.query.author
                }
            });
            redisConnection.on('add-note-response', async (data, channel) => {
                if (data.message) {
                    res.sendStatus(200)
                }
                res.send()
            });
        } else if (req.params.op === 'update') {
            console.log('Update request');
            redisConnection.emit('update-note', {
                message: {
                    id: req.query.id,
                    title: req.query.title,
                    content: req.query.content
                }
            });
            redisConnection.on('update-note-response', async (data, channel) => {
                if (data.message) {
                    res.sendStatus(200)
                }
                res.send()
            });
        } else if (req.params.op === 'delete') {
            console.log('Delete request');
            redisConnection.emit('delete-note', {
                message: {
                    id: req.query.id,
                    title: req.query.title,
                    content: req.query.content
                }
            });
            redisConnection.on('delete-note-response', async (data, channel) => {
                if (data.message) {
                    res.sendStatus(200)
                }
                res.send()
            });
        } else {
            console.log('Invalid request');
            res.sendStatus(500).send()
        }
    } else {
        res.sendStatus(400).send();
    }

});

app.get('/cache', async (req, res) => {
    console.log('cache route requested!');

    let toCheck = {
        id: req.query.id,
        title: req.query.title,
        content: req.query.content
    };

    const existingNotes = await client.lrangeAsync(key, 0, -1);

    const foundInCache = existingNotes.find(elem => {
        let parsedElem = JSON.parse(elem);
        return parsedElem.id === toCheck.id;
    });

    // console.log(foundInCache);
    // console.log(existingNotes);

    if (foundInCache) {
        res.send(true);
    } else {
        await client.lpushAsync(key, JSON.stringify(toCheck));
        res.send(false);
    }
    // res.sendStatus(200);
});

app.listen('5000', () => {
    console.log('Server is live on port 5000')
});
