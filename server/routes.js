const _ = require('lodash');
const axios = require('axios');

const apis = {
	esv: axios.create({
		baseURL: 'https://api.esv.org/v3/passage',
		timeout: 10000,
		transformResponse: data => {
			return JSON.parse(data);
		},
		headers: {
			'Authorization': `Token ${process.env.ESV_API_KEY}`,
		},
	}),
	kjv: axios.create({
		baseURL: 'https://bible-api.com',
		timeout: 10000,
		transformResponse: data => {
			return JSON.parse(data);
		},
	}),
};

const versesapi = {
	esv: q => {
		const params = {
			q,
			'include-copyright': false,
			'include-headings': false,
			'include-first-verse-numbers': false,
			'include-footnotes': false,
			'include-footnote-body': false,
			'include-verse-numbers': true,
			'include-selahs': true,
			'include-short-copyright': false,
			'include-passage-references': false,
		};
		return apis.esv.get('/text', { params }).then(res => {
			const data = res.data;
			let verses = [];
			_.each(data.passages, (passage, i) => {
				const meta = data.passage_meta[i];
				const [book_name, meta2] = meta.canonical.split(' ');
				const [chapter] = meta2.split(':');
				const pverses = [];
				_.chain(passage.match(/(\[\d+\])/g))
					.reverse()
					.reduce((passage, n) => {
						const [rest, text] = passage.split(n);
						pverses.unshift({
							book_name,
							chapter,
							text: text.trim(),
							verse: parseInt(n.slice(1, n.length - 1)),
						});
						return rest;
					}, passage)
					.value();
				verses = _.concat(verses, pverses);
			});
			return verses;
		});
	},
	kjv: q => {
		const params = {
			translation: 'kjv',
		};
		return apis.kjv.get(`/${q}`, { params }).then(res => {
			return _.map(res.data.verses, verse => Object.assign(verse, {
				text: verse.text.trim().replace(/\r\n|\n\r|\n|\r/g, ' '),
			}));
		});
	},
}

module.exports = app => {
	app.get('/v1/:version/text', (req, res) => {
		const { version } = req.params;
		const { q } = req.query;
		if (versesapi[version]) {
			versesapi[version](q).then(data => res.json(data));
		} else {
			res.json({ msg: 'No version provided' });
		}
	});
};