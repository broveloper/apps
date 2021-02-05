const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const fuzzy = require('fuzzy');


const getPassage = (BOOKS_DIR, q, options) => {
	const { headings } = options || {};
	const bregex = /^\s*(\d?\s*[a-zA-Z]+)\s+(\d+):?(\d+\s*-?\s*\d*)?\s*$/;
	if (!bregex.test(q)) return new Error('Invalid passage search provided.');
	const BOOKS_FILE = path.join(BOOKS_DIR, 'books.json');
	if (!fs.existsSync(BOOKS_FILE)) return new Error(`No books.json found for version.`);
	const books = JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'));
	const [b, c, vs] = q.replace(bregex, '$1|$2|$3').split('|');
	const book_found = fuzzy.filter(b, Object.keys(books))?.[0]?.string;
	const book = books[book_found];
	if (!book) return new Error(`No books under (${b}) found.`);
	const BOOK = book.book_id;
	const BOOK_DIR = path.join(BOOKS_DIR, BOOK);
	if (!fs.existsSync(BOOK_DIR)) return new Error(`No (${BOOK_DIR}) found.`);
	const CHAPTER_FILE = path.join(BOOK_DIR, `${c}.json`);
	if (!fs.existsSync(CHAPTER_FILE)) return new Error(`Chapter (${c}) does not exists for (${BOOK}).`);
	const chapter = JSON.parse(fs.readFileSync(CHAPTER_FILE, 'utf8'));
	const chapter_meta = {
		book_id: chapter.book_id,
		book_name: chapter.book_name,
		chapter: chapter.chapter,
	};
	const lastverse = _.chain(chapter.content).filter(content => content.hasOwnProperty('verse')).last().get('verse').value();
	const chapterRange = [1, lastverse];
	const range = [chapterRange[0], chapterRange[1]];
	if (vs.trim()) {
		const vr = vs.split('-');
		range[0] = parseInt(vr[0].trim())
		range[1] = vr[1]?.trim?.() ? parseInt(vr[1].trim()) : range[0];
		range[1] = Math.max(range[0], range[1]);
		range[1] = Math.min(range[1], chapterRange[1]);
	}
	const verses = _.chain(chapter.content)
		.reduce(({ verses, verse }, content, i) => {
			if (content.verse >= range[0] && content.verse <= range[1]) {
				if (verse !== content.verse) {
					verse = content.verse;
					const prevcontent = chapter.content[i - 1];
					if (headings && /heading/.test(prevcontent?.type)) {
						verses.push(prevcontent);
					}
				}
				verses.push(content);
			}
			return { verses, verse };
		}, { verses:[], verse: null })
		.get('verses')
		.map(verse => Object.assign({}, chapter_meta, verse ))
		.value();
	return verses;
};

module.exports = app => {
	app.get('/v1/:version/text', (req, res) => {
		const { version, ...options } = req.params;
		const BOOKS_DIR = path.join(__dirname, 'versions', version);
		if (!fs.existsSync(BOOKS_DIR)) return res.json({ msg: 'No version provided' });
		const { q } = req.query;
		const passages = q.split(',')
			.map(q => getPassage(BOOKS_DIR, q, options))
			.filter(passage => {
				if (!(passage instanceof Error)) return true;
				return console.log(passage);
			})
			.reduce((passages, passage) => passages.concat(passage), []);
		res.json(passages);
	});
};