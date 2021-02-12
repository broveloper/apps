import { createContext, memo, useContext, useLayoutEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { baseThemes } from 'components/Themes';

const Context = createContext(null);

export const useApp = () => useContext(Context);

export const AppProvider = memo(props => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [theme, setTheme] = useState(prefersDarkMode ? 'dark' : 'light');
	const [maxWidth, setMaxWidth] = useState('sm');
	const [view, setView] = useState('Home');

	useLayoutEffect(() => {
		if (prefersDarkMode && theme !== 'dark') {
			setTheme('dark');
		}
	}, [prefersDarkMode]);

	const state = {
		maxWidth,
		setMaxWidth,
		setTheme,
		setView,
		theme,
		view,
	};

	return <Context.Provider value={state}>
		<ThemeProvider theme={baseThemes[theme]}>
			<CssBaseline />
			{props.children}
		</ThemeProvider>
	</Context.Provider>
});