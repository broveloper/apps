const fs = require('fs');
const path = require('path');
const axios = require('axios');

const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL || null);
redisClient.on('error', error => console.error(error));

const api = axios.create({
	baseURL: 'https://api.scripture.api.bible',
	timeout: 10000,
	headers: {
		'api-key': process.env.BIBLE_API_KEY,
	},
});

module.exports = app => {
	app.get('/api/bible/:version', (req, res) => {
		const { version } = req.params;
		const filePath = path.join(__dirname, 'bibles', `${version}.json`);
		if (fs.existsSync(filePath)) {
			res.header('Content-Type','application/json');
			res.sendFile(filePath);
		} else {
			res.json({ msg: 'File not found.' });
		}
	});

	app.get('/v1/bibles/:bible/verses/:verse', async (req, res) => {
		const cached = await new Promise(resolve => redisClient.get(req.path, (err, value) => resolve(err ? null : value)));
		if (cached) return res.json(JSON.parse(cached));

		const data = await api.get(req.path).then(res => res?.data?.data);
		const verse = {
			html: data.content,
			ref: data.reference,
		};
		redisClient.set(req.path, JSON.stringify(verse));
		res.json(verse);
	});
};