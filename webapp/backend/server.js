const express = require('express');
const bodyParser = require('body-parser');
const redisConnection = require('./worker/redis_connection');
const ddb = require('./ops/dynamo');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/:op', async (req, res) => {
    console.log('Route requested!');
    // console.log(req);
    if (req.query.id && req.query.title && req.query.content) {
        if (req.params.op === 'create') {
            console.log('Create request');
            redisConnection.emit('add-note', {
                message: {
                    id: req.query.id,
                    title: req.query.title,
                    content: req.query.content
                }
            });
            redisConnection.on('add-note-response', async (data, channel) => {
                if (data.message) {
                    res.sendStatus(200);
                }
            });
            // await ddb.addNote(req.query.id, req.query.title, req.query.content);
            // res.sendStatus(200);
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
                    res.sendStatus(200);
                }
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
                    res.sendStatus(200);
                }
            });
        } else {
            console.log('Invalid request');
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(400);
    }

});


app.listen('5000', () => {
    console.log('Server is live on port 5000')
});
