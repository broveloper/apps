import _ from 'lodash';
import { memo } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useApp } from '@utils/useApp';
import { baseProps } from './BaseTheme';

const appBarPropsDefaults = {
	overrides: {
		MuiButton: {
			root: {
				textTransform: 'none',
			}
		}
	}
};

export const appBarProps = {
	light: _.merge({}, baseProps.light, appBarPropsDefaults, {
		palette: {
			primary: { main: 'rgba(0,0,0,0.87)', contrastText: '#fff' },
		},
	}),
	dark: _.merge({}, baseProps.dark, appBarPropsDefaults, {
		palette: {
			primary: { main: '#fafafa', contrastText: '#000' },
		},
	}),
};

export const appBarThemes = {
	light: createMuiTheme(appBarProps.light),
	dark: createMuiTheme(appBarProps.dark),
};

export const AppBarTheme = memo(props => {
	const { theme } = useApp();
	return <ThemeProvider theme={appBarThemes[theme]}>
		{props.children}
	</ThemeProvider>;
});
