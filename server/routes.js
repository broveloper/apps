const fs = require('fs');
const path = require('path');
const fuzzy = require('fuzzy');


const getPassage = (BOOKS_DIR, q) => {
	const bregex = /^\s*(\d?\s*[a-zA-Z]+)\s+(\d+):?(\d+\s*-?\s*\d*)?\s*$/;
	if (!bregex.test(q)) return new Error('Invalid passage search provided.');
	const BOOKS_FILE = path.join(BOOKS_DIR, 'books.json');
	if (!fs.existsSync(BOOKS_FILE)) return new Error(`No books.json found for version.`);
	const books = JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'));
	const [b, c, vs] = q.replace(bregex, '$1|$2|$3').split('|');
	const book_found = fuzzy.filter(b, Object.keys(books))?.[0]?.string;
	const BOOK = books[book_found];
	if (!BOOK) return new Error(`No books under (${b}) found.`);
	const BOOK_DIR = path.join(BOOKS_DIR, BOOK);
	if (!fs.existsSync(BOOK_DIR)) return new Error(`No (${book_found}) found.`);
	const CHAPTER_FILE = path.join(BOOK_DIR, `${c}.json`);
	if (!fs.existsSync(CHAPTER_FILE)) return new Error(`Chapter (${c}) does not exists for (${BOOK}).`);
	const chapter = JSON.parse(fs.readFileSync(CHAPTER_FILE, 'utf8'));
	const chapter_meta = {
		book_id: chapter.book_id,
		book_name: chapter.book_name,
		chapter: chapter.chapter,
	};
	const chapterRange = [chapter.verses[0].verse, chapter.verses[chapter.verses.length - 1].verse];
	const range = [chapterRange[0], chapterRange[1]];
	if (vs.trim()) {
		const vr = vs.split('-');
		range[0] = parseInt(vr[0].trim())
		range[1] = vr[1]?.trim?.() ? parseInt(vr[1].trim()) : range[0];
		range[1] = Math.max(range[0], range[1]);
		range[1] = Math.min(range[1], chapterRange[1]);
	}
	const verses = chapter.verses
		.filter(verse => verse.verse >= range[0] && verse.verse <= range[1])
		.map(verse => Object.assign({}, chapter_meta, verse, { text: verse.texts.join('\r\n\t') }));
	return verses;
};

module.exports = app => {
	app.get('/v1/:version/text', (req, res) => {
		const { version } = req.params;
		const BOOKS_DIR = path.join(__dirname, 'versions', version);
		if (!fs.existsSync(BOOKS_DIR)) return res.json({ msg: 'No version provided' });
		const { q } = req.query;
		const passages = q.split(',')
			.map(q => getPassage(BOOKS_DIR, q))
			.filter(passage => {
				if (!(passage instanceof Error)) return true;
				return console.log(passage);
			})
			.reduce((passages, passage) => passages.concat(passage), []);
		res.json(passages);
	});
};