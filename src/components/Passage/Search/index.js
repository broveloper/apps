import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { usePassage } from '@utils/usePassage';
import { AppContainer } from 'components/App';

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
		getBooksBySearch,
		getSearchBookName,
		getSearchPassageMeta,
		isSearchValid,
		passage,
		setPassage,
	} = usePassage();
	const inputRef = useRef();
	const classes = useStyles();
	const [q, setQState] = useState(passage);
	const books = getBooksBySearch(q);
	
	const setQ = (q, options) => {
		if (isSearchValid(q)) {
			const qbookname = getSearchBookName(q);
			const books = getBooksBySearch(q);
			if (options?.tab && books.length > 0) {
				q = q.replace(qbookname, books[0]?.book_name);
			}
			setQState(q);
		} else if (!q) {
			setQState('');
		}
	};

	const handleSearch = () => {
		const [, c = 1, v] = getSearchPassageMeta(q);
		const books = getBooksBySearch(q);
		const bookname = books?.[0]?.book_name;
		if (bookname) {
			const cv = _.filter([c, v]).join(':');
			setPassage(`${bookname} ${cv}`);
		}
		setUI('default');
	};

	const handleChange = e => {
		setQ(e.target.value);
	};

	const handleKeyDown = e => {
		if (e.key === 'Tab') {
			e.preventDefault();
			setQ(e.target.value, { tab: true });
		} else if (e.key === 'Enter' && isSearchValid(q)) {
			handleSearch();
		}
	};

	const handleSelect = book_name => {
		setQ(`${book_name} `);
		inputRef.current.focus();
	};

	useEffect(() => {
		if (transitionState === 'entered') {
			inputRef.current.focus();
		}
	}, [transitionState]);

	return <>
		<Box
			component={AppContainer}
			display="flex"
			alignItems="center"
			py={1}>
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
		<Divider />
		<Box
			component={AppContainer}
			display="flex"
			flexDirection="column"
			flex="1"
			position="relative">
			<Box
				style={{ overflow: 'hidden scroll' }}
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
					disabled={!isSearchValid(q)}
					onClick={handleSearch}>
					<CheckCircleIcon fontSize="large" />
				</IconButton>
			</Box>
		</Box>
	</>;
};