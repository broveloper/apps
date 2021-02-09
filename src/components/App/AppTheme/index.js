import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useApp } from 'components/App';
import * as themes from './themes';

export const AppTheme = props => {
	const { theme } = useApp();
	return <ThemeProvider theme={themes[theme]}>
		<CssBaseline />
    {props.children}
  </ThemeProvider>;
};
