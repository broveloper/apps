import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useApp } from 'components/App';

const themeProps = {
	typography: {
		button: {
			textTransform: 'none',
		},
	},
};
const themes = {
	light: createMuiTheme({
		...themeProps,
		palette: {
			type: 'light',
			primary: { main: '#000', contrastText: '#fff' },
			secondary: { main: '#fff', contrastText: '#000' },
		},
	}),
	dark: createMuiTheme({
		...themeProps,
		palette: {
			type: 'dark',
			primary: { main: '#fff', contrastText: '#000' },
			secondary: { main: '#000', contrastText: '#fff' },
		},
	}),
};

export const AppBarThemeProvider = props => {
	const { theme } = useApp();
	return <ThemeProvider theme={themes[theme]}>
		{props.children}
	</ThemeProvider>;
}