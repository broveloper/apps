const fs = require('fs');
const path = require('path');

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
};