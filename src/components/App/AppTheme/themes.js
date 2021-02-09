import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// https://material-ui.com/customization/default-theme/?expand-path=$.palette

export const main = createMuiTheme({
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: red.A400,
		},
		background: {
			default: '#fff',
		},
	},
});

export const light = createMuiTheme({
	palette: {
		type: 'light',
		// primary: { main: '#bb86fc', contrastText: '#000' }, secondary: { main: '#6200ee', contrastText: '#000' }, // owl
		primary: { main: '#ff7597', contrastText: '#000' }, secondary: { main: '#ff0266', contrastText: '#000' }, // owl
	},
});
export const dark = createMuiTheme({
	palette: {
		type: 'dark',
		// primary: { main: '#bb86fc', contrastText: '#000' }, secondary: { main: '#6200ee', contrastText: '#000' }, // owl
		// primary: { main: '#ff7597', contrastText: '#000' }, secondary: { main: '#ff0266', contrastText: '#000' }, // owl
		primary: { main: '#fff', contrastText: '#000' }, secondary: { main: '#ff0266', contrastText: '#000' }, // owl
		error: {
			main: "#cf6679",
			contrastText: '#000',
		},
		background: {
			paper: '#121212',
			default: '#121212',
		},
	},
});


// palette: {
// 	type: 'light',
// 	primary: {
// 		main: '#556cd6',
// 		light: '',
// 		dark: '',
// 		contrastText: '',
// 	},
// 	secondary: {
// 		main: '',
// 		light: '',
// 		dark: '',
// 		contrastText: '',
// 	},
// 	error: {
// 		main: '',
// 		light: '',
// 		dark: '',
// 		contrastText: '',
// 	},
// 	warning: {
// 		main: '',
// 		light: '',
// 		dark: '',
// 		contrastText: '',
// 	},
// 	info: {
// 		main: '',
// 		light: '',
// 		dark: '',
// 		contrastText: '',
// 	},
// 	success: {
// 		main: '',
// 		light: '',
// 		dark: '',
// 		contrastText: '',
// 	},
// 	grey: {
// 		'50': '#fafafa',
// 		'100': '#f5f5f5',
// 		'200': '#eeeeee',
// 		'300': '#e0e0e0',
// 		'400': '#bdbdbd',
// 		'500': '#9e9e9e',
// 		'600': '#757575',
// 		'700': '#616161',
// 		'800': '#424242',
// 		'900': '#212121',
// 		'A100': '#d5d5d5',
// 		'A200': '#aaaaaa',
// 		'A400': '#303030',
// 		'A700': '#616161',
// 	},
// 	contrastThreshold: 3,
// 	getContrastText: f E(),
// 	augmentColor: f B(),
// 	tonalOffset: 0.2,
// 	text: {
// 		primary: 'rgba(0, 0, 0, 0.87)',
// 		secondary: 'rgba(0, 0, 0, 0.54)',
// 		disabled: 'rgba(0, 0, 0, 0.38)',
// 		hint: 'rgba(0, 0, 0, 0.38)',
// 	},
// 	divider: 'rgba(0, 0, 0, 0.12)',
// 	background: {
// 		paper: '#fff',
// 		default: '#fafafa',
// 	},
// 	action: {
// 		active: 'rgba(0, 0, 0, 0.54)',
// 		hover: 'rgba(0, 0, 0, 0.04)',
// 		hoverOpacity: 0.04,
// 		selected: 'rgba(0, 0, 0, 0.08)',
// 		selectedOpacity: 0.08,
// 		disabled: 'rgba(0, 0, 0, 0.26)',
// 		disabledBackground: 'rgba(0, 0, 0, 0.12)',
// 		disabledOpacity: 0.38,
// 		focus: 'rgba(0, 0, 0, 0.12)',
// 		focusOpacity: 0.12,
// 		activatedOpacity: 0.12,
// 	},
// }