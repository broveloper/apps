import _ from 'lodash';
import fuzzy from 'fuzzy';
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { AppContainer, useApp } from 'components/App';


const VALID_REGEX = /^\s*(\d?\s*[a-zA-Z]+)(?:\s+(\d+))?:?(\d+\s*-?\s*\d*)?\s*$/;
const PASSAGE_REGEX = /^\s*(\d?\s*[a-zA-Z]+)\s+(\d+):?(\d+\s*-?\s*\d*)?\s*$/;

const getQBook = q => (q.replace(PASSAGE_REGEX, '$1|$2|$3').split('|')?.[0] || '').trim();

const useStyles = makeStyles(theme => ({
	item: {
		cursor: 'pointer',
	},
	check: {
		color: theme.palette.success.main,
		transform: 'scale(1.2)'
	},
}));

export const Search = props => {
	const {
		setUI,
		transitionState,
	} = props;
	const {
		bible,
		setPassage,
		version,
	} = useApp();
	const inputRef = useRef();
	const classes = useStyles();
	const [q, setQ] = useState('');
	const bookNames = useMemo(() => Object.keys(bible?.books), [version]);
	const qBook = getQBook(q);
	const books = _.map(fuzzy.filter(qBook, bookNames), ({ original }) => bible.books[original]);
	const updateQ = (q, options) => {
		if (VALID_REGEX.test(q)) {
			const [b] = q.replace(PASSAGE_REGEX, '$1|$2|$3').split('|');
			if (options?.tab && books.length > 0)
				q = q.replace(b, books[0]?.book_name);
			setQ(q);
		} else if (!q) {
			setQ('');
		}
	};

	const isValid = VALID_REGEX.test(q);

	const handleChange = e => {
		updateQ(e.target.value);
	};

	const handleKeyDown = e => {
		if (e.key === 'Tab') {
			e.preventDefault();
			updateQ(e.target.value, { tab: true });
		} else if (e.key === 'Enter' && isValid) {
			handleSearch();
		}
	};

	const handleSelect = book_name => {
		updateQ(`${book_name} `);
		inputRef.current.focus();
	};


	const handleSearch = () => {
		const [b, c = 1, v] = q.replace(PASSAGE_REGEX, '$1|$2|$3').split('|');
		const bn = _.map(fuzzy.filter(b.trim(), bookNames), ({ original }) => bible.books[original])?.[0]?.book_name;
		if (bn) {
			const cv = _.filter([c, v]).join(':');
			const search = `${bn} ${cv}`;
			setPassage(search);
		}
		setUI('default');
	};

	useEffect(() => {
		if (!q) {
			setPassage('');
		}
	}, [q]);

	useEffect(() => {
		if (transitionState === 'entered') {
			inputRef.current.focus();
		}
	}, [transitionState]);

	return <>
		<AppContainer>
			<Box display="flex" alignItems="center" py={1}>
				<InputBase
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Search Passage"
					inputRef={inputRef}
					startAdornment={<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>}
					value={q} />
			</Box>
		</AppContainer>
		<Divider />
		<Box
			display="flex"
			flexDirection="column"
			flex="1"
			position="relative">
			<Box
				style={{ overflow: 'scroll' }}
				display="flex"
				flexDirection="column"
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%">
				<AppContainer>
					<List dense={true}>
						{_.map(books, book => {
							return <ListItem
								className={classes.item}
								key={book.book_id}>
								<ListItemText
									onClick={() => handleSelect(book.book_name)}
									primary={book.book_name}
									secondary={`${book.chapters} Chapters`} />
							</ListItem>;
						})}
					</List>
				</AppContainer>
			</Box>
			<Box
				position="absolute"
				right="4em"
				bottom="3em">
				<IconButton
					className={classes.check}
					disabled={!isValid}
					onClick={handleSearch}>
					<CheckCircleIcon fontSize="large" />
				</IconButton>
			</Box>
		</Box>
	</>;
};