import _ from 'lodash';
import axios from 'axios';

export const getBible = async version => await axios.get(`/api/bible/${version}`).then(res => res.data);

export const api = axios.create({
	baseURL: 'https://api.scripture.api.bible',
	timeout: 10000,
	transformResponse: data => {
		return JSON.parse(data);
	},
	headers: {
		'api-key': 'c8aec1029bae26c608775b6cf8a8f747',
	},
})

export class Bible {
	constructor(bible) {
		this.__bible = bible;
		this.__bible__id = bible.id
		this.__books =
		_.mapValues(bible.books, ({ chapters }, book) =>
			_.map(chapters, ({ verses }) =>
				[null, ..._.map(verses, verse =>
					`/v1/bibles/${bible.id}/verses/${verse.id}`)]));
	}
	async get(search) {
		let vs = [];
		const [book, cvss] = search.split(' ');
		const [c,vss] = cvss.split(':');
		if (vss) {
			let [s,e] = vss.split('-'); e = e || s;
			for (let i = parseInt(s); i <= parseInt(e); i++) {
				const versePath = `${book}.${c}.${i}`;
				const verse = _.get(this.__books, versePath);
				if (verse) vs.push(verse);
				else console.warn(`(${versePath}) verse not found.`);
			}
		} else {
			const chapterPath = `${book}.${c}`;
			const chapter = _.get(this.__books, chapterPath);
			if (chapter) {
				vs = [...chapter];
				vs.shift();
			} else console.warn(`(${chapterPath}) chapter not found.`);
		}

		const verses = await Promise.all(_.map(vs, async v =>
			api.get(v).then(res => ({
				html: res.data.data.content,
				ref: res.data.data.reference,
			}))));
		return verses;
	}
}

// export const info = version => {
// 	const bible = _.chain(bibles[version].books)
// 		.mapValues(({ chapters }) =>
// 			_.map(chapters, ({ verses }) =>
// 				[null, ..._.map(verses, verse => `/v1/bibles/${bibles[version].id}/verses/${verse.id}`)]))
// 		.value();
// 	console.log(bible);
// 	return bible;
// }

// export const build = async version => {
// 	const bible = { id: versions[version] };
// 	const books = await api.get(`/v1/bibles/${bible.id}/books`).then(res => res.data.data);
// 	bible.books = _.mapKeys(books, 'id');
// 	await Promise.all(_.map(bible.books, async book => {
// 		bible.books[book.id] = bible.books[book.id] || {};
// 		bible.books[book.id].chapters = await api.get(`/v1/bibles/${bible.id}/books/${book.id}/chapters`).then(res => res.data.data);
// 		await Promise.all(_.map(bible.books[book.id].chapters, async (chapter, i) => {
// 			const verses = await api.get(`/v1/bibles/${bible.id}/chapters/${chapter.id}/verses`).then(res => res.data.data);
// 			bible.books[book.id].chapters[i].verses = verses;
// 		}));
// 	}));
// 	console.log(JSON.stringify(bible, null, 2));
// 	return bible;
// };