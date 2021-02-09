const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const getBibleDir = (VERSIONS_DIR, version) => {
	const BIBLE_DIR = path.join(VERSIONS_DIR, version);
	return BIBLE_DIR;
};
exports.getBibleDir = getBibleDir;

const getBible = (VERSIONS_DIR, version) => {
	const BIBLE_DIR = getBibleDir(VERSIONS_DIR, version);
	const BIBLE_FILE = path.join(BIBLE_DIR, 'bible.json');
	return JSON.parse(fs.readFileSync(BIBLE_FILE, 'utf8'));
};
exports.getBible = getBible;


module.exports = function (app, VERSIONS_DIR) {
	app.get('/v1/versions', (req, res, next) => {
		try {
			const versions = fs.readdirSync(VERSIONS_DIR, { withFileTypes: true })
				.filter(dirent => dirent.isDirectory())
				.map(dirent => {
					const bible = getBible(VERSIONS_DIR, dirent.name);
					return bible;
					// return _.pick(bible, ['id', 'name', 'copyright']);
				});
			res.json(versions);
		} catch(err) {
			next(err);
		}
	});

	app.get('/v1/bible/:version', (req, res, next) => {
		try {
			const { version } = req.params;
			const BIBLE_FILE = path.join(VERSIONS_DIR, version, 'bible.json');
			const bible = JSON.parse(fs.readFileSync(BIBLE_FILE, 'utf8'));
			res.json(bible);
		} catch (err) {
			next(err);
		}
	});
};