const path = require('path');
const VERSIONS_DIR = path.join(__dirname, '..', 'versions');

module.exports = app => {
	require('./bible')(app, VERSIONS_DIR);
	require('./passage')(app, VERSIONS_DIR);
};