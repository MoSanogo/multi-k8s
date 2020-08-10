const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const keys = require('./keys');
const app = express();
app.use([helmet(), cors(), bodyParser.json()]);
const { Pool } = require('pg');
//Postgres client set up.
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort,
});
pgClient.on('connect', () => {
	pgClient.query('CREATE TABLE IF NOT EXISTS values (number int)').catch((err) => console.error(err));
});

//Redis client setup.

const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();
//Express app setup


app.get('/values/all', async (req, res) => {
	const values = await pgClient.query('SELECT * FROM values');
	res.send(values.rows);
});
app.get('/values/current', async (req, res) => {
	redisClient.hgetall('values', (err, values) => {
		res.send(values);
	});
});
app.post('/values', async (req, res) => {
	const { index } = req.body;
	if (parseInt(index) > 40) {
		return res.status(422).send('index too high');
	}
	redisClient.hset('values', index, 'Nothing yet!');
	redisPublisher.publish('insert', index);
	pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
	res.send({ working: true });
});
app.listen(5000, () => {
	console.log('Listening on 5000');
});
