# CS 554 Final Project
### Group Name: NodeChasers
Group Members:
- Alan Lobo
- Zion Fung 
- Michael Ramos

---

#### Project Overview

This project is a note sharing application. Users sign up for the service and can author notes that they can then share with other users via their email.

#### Technical Details

##### Course Technologies

This project implements the following technologies covered in CS-554:

| Technology | Purpose | Location |
|------------|---------|----------|
| [React](https://reactjs.org)      | Implementing user interface and component-based architecture | `webapp/src`
| [Redis](https://redis.io)      | Caching data, pub/sub operations on the backend | `webapp/backend/worker` `webapp/backend/server.js`
| Workers    | Moving heavy operations off of the backend server | `webapp/backend/worker/worker.js` 
| [Express](https://expressjs.com)    | Leveraging a REST API to make database & cache requests | `webapp/backend/server.js`
| [Webpack](https://webpack.js.org)   | Serving the frontend | `webapp/webpack.config.js`

The project implements the following technologies **not** covered in CS-554:

| Technology | Origin | Purpose | Location |
|------------|--------|---------|----------|
| [DynamoDB](https://aws.amazon.com/dynamodb/)   | AWS | A NoSQL database solution in lieu of MongoDB | `webapp/backend/ops/dynamo.js`
| [Elasticsearch](https://github.com/elastic/elasticsearch) | Elastic with AWS endpoint | A data indexing solution to retrieve notes instead of frequent DB querying | `webapp/backend/ops/elasticsearch.js` `webapp/backend/ops/es.js`
| [Lambda](https://aws.amazon.com/lambda/)     | AWS    | Trigger function to update Elasticsearch index when DynamoDB has create, update, delete functions executed | AWS servers


#### Serving the application
Ensure that the Redis server is running.

All other concurrent processes are bundled using concurrently, and will all run by executing the following commands
```
npm install
npm start
```
