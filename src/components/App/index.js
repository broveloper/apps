
import 'scripture-styles/dist/css/scripture-styles.css';
import './styles.css';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { AppProvider } from '@utils/useApp';
import { AuthProvider } from '@utils/useAuth';
import { PassageProvider } from '@utils/usePassage';
import { ProfileProvider } from '@utils/useProfile';
import { AppBarBottom } from './AppBarBottom';
import { AppView } from './AppView';

export { AppBarTheme } from 'components/Themes';
export { AppBarTop } from './AppBarTop';
export { AppContainer } from './AppContainer';

export const App = () => {
	return <AppProvider>
		<AuthProvider>
			<ProfileProvider>
				<PassageProvider>
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
								style={{ overflow: 'hidden scroll' }}
								display="flex"
								flexDirection="column"
								width="100%"
								height="100%"
								position="absolute"
								top="0"
								left="0">
								<AppView />
							</Box>
						</Box>
						<Divider />
						<Box flex="0">
							<AppBarBottom />
						</Box>
					</Box>
				</PassageProvider>
			</ProfileProvider>
		</AuthProvider>
	</AppProvider>;
};