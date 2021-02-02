import _ from 'lodash';
import axios from 'axios';

const apis = {
	esv: axios.create({
		baseURL: 'https://api.esv.org/v3/passage',
		timeout: 10000,
		transformResponse: data => {
			return JSON.parse(data);
		},
		headers: {
			'Authorization': 'Token 3e5ff41cf6fe2e56bf669b94283c372d23405482',
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

export const versesapi = {
	esv: async q => {
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
		const data = await apis.esv.get('/text', { params }).then(res => res.data);
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
						text: text.trim().replace(/\r\n|\n\r|\n|\r/g, ''),
						verse: parseInt(n.slice(1, n.length - 1)),
					});
					return rest;
				}, passage)
				.value();
			verses = [...verses, ...pverses];
		});
		return verses;
	},
	kjv: async q => {
		const params = {
			translation: 'kjv',
		};
		const data = await apis.kjv.get(`/${q}`, { params }).then(res => res.data);
		return data?.verses;
	},
}