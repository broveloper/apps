import _ from 'lodash';
import axios from 'axios';
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Context = createContext(null);

export const useApp = () => useContext(Context);

export const AppContext = props => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const [passage, setPassage] = useState(null);
	const [verses, setVerses] = useState(null);
	const [versions, setVersions] = useState(null);
	const [version, setVersion] = useState(null);
	const [theme, setTheme] = useState(prefersDarkMode ? 'dark' : 'light');
	const [page, setPage] = useState('Home');
	const [maxWidth, setMaxWidth] = useState('sm');

	useLayoutEffect(() => {
		if (prefersDarkMode && theme !== 'dark') {
			setTheme('dark');
		}
	}, [prefersDarkMode]);

	useEffect(() => {
		axios.get('/v1/versions').then(res => setVersions(_.mapKeys(res.data, 'id')));
	}, []);

	useEffect(() => {
		if (passage) {
			axios.get(`/v1/${version}/passage`, { params: { q: passage } }).then(res => setVerses(res.data));
		} else {
			setVerses([]);
		}
	}, [passage]);

	useEffect(() => {
		setPassage('');
		setVerses([]);
	}, [version]);

	useEffect(() => {
		if (versions) {
			setVersion('ESV');
		}
	}, [versions]);

	const bible = versions?.[version];

	const state = {
		bible,
		maxWidth,
		page,
		passage,
		setMaxWidth,
		setPage,
		setPassage,
		setTheme,
		setVersion,
		theme,
		verses,
		version,
		versions,
	};

	return <Context.Provider value={state}>
		{versions && version && props.children}
	</Context.Provider>
};