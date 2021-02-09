const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const fuzzy = require('fuzzy');

const PASSAGE_REGEX = /^\s*(\d?\s*[a-zA-Z]+)\s+(\d+):?(\d+\s*-?\s*\d*)?\s*$/;

module.exports = (app, VERSIONS_DIR) => {
	app.get('/v1/:version/passage', (req, res, next) => {
		try {
			const { version } = req.params;
			const { q, headings } = req.query;
			const BIBLE_DIR = path.join(VERSIONS_DIR, version);
			const BIBLE_FILE = path.join(VERSIONS_DIR, version, 'bible.json');
			const bible = JSON.parse(fs.readFileSync(BIBLE_FILE, 'utf8'));
			const books = bible.books;
			const getPassage = q_passage => {
				try {
					const [q_book, q_chapter, q_verses] = q_passage.replace(PASSAGE_REGEX, '$1|$2|$3').split('|');
					const book_name = fuzzy.filter(q_book, Object.keys(books))?.[0]?.string;
					const book = books[book_name];
					const CHAPTER_FILE = path.join(BIBLE_DIR, book.book_id, `${q_chapter}.json`);
					const chapter_data = JSON.parse(fs.readFileSync(CHAPTER_FILE, 'utf8'));
					const final_verse = _.chain(chapter_data.content)
						.filter(content => content.hasOwnProperty('verse'))
						.last()
						.get('verse')
						.value();
					const chapter_range = [1, final_verse];
					const range = [chapter_range[0], chapter_range[1]];
					if (q_verses.trim()) {
						const q_range = q_verses.split('-');
						range[0] = parseInt(q_range[0].trim())
						range[1] = q_range[1]?.trim?.() ? parseInt(q_range[1].trim()) : range[0];
						range[1] = Math.max(range[0], range[1]);
						range[1] = Math.min(range[1], chapter_range[1]);
					}
					const verse_meta = _.pick(chapter_data, ['book_id', 'book_name', 'chapter']);
					return _.chain(chapter_data.content)
						.filter(content => {
							if (headings && /heading/.test(content.type)) return true;
							else if (content.verse >= range[0] && content.verse <= range[1]) return true;
							return false;
						})
						.map(content => Object.assign({}, verse_meta, content))
						.value();
				} catch (err) {
					return new Error(`Error retrieving (${q_passage})`);
				}
			};
			const passages = _.chain(q)
				.split(',')
				.map(q_passage => getPassage(q_passage.trim()))
				.filter(passage => {
					if (passage instanceof Error) return console.log(passage);
					else return true;
				})
				.flatten()
				.value();
			res.json(passages);
		} catch(err) {
			next(err);
		}
	});
};