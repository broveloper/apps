import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import { AppBarBottom } from './AppBars';
import { AppContext } from './AppContext';
import { AppPage } from './AppPage';
import { AppTheme } from './AppTheme';

export { AppBarThemeProvider, AppBarTop } from './AppBars';
export { AppContainer } from './AppContainer';
export { useApp } from './AppContext';


export const App = () => {
	return <AppContext>
		<AppTheme>
			<CssBaseline />
			<Box
				display="flex"
				flexDirection="column"
				width="100%"
				height="100%"
				position="absolute"
				top="0"
				left="0">
				<Box flex="1" position="relative">
					<Box
						style={{ overflow: 'scroll' }}
						display="flex"
						flexDirection="column"
						width="100%"
						height="100%"
						position="absolute"
						top="0"
						left="0">
						<AppPage />
					</Box>
				</Box>
				<Divider />
				<Box flex="0">
					<AppBarBottom />
				</Box>
			</Box>
		</AppTheme>
	</AppContext>;
};