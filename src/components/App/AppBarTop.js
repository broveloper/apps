import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useApp } from '@utils/useApp';
import { AppBarTheme, AppContainer } from 'components/App';


export const AppBarTop = props => {
	const {
		children,
		...rest
	} = props;
	const {
		setTheme,
		theme,
	} = useApp();

	const handleBrightness = () => setTheme(theme === 'light' ? 'dark' : 'light');
	const BrightnessIcon = theme === 'light'
		? Brightness4Icon
		: Brightness7Icon;

	return <Box {...rest}>
		<AppContainer>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between">
				<Box display="flex">
					{children}
				</Box>
				{/* <AppBarTheme>
					<IconButton
						color="primary"
						onClick={handleBrightness} >
						<BrightnessIcon />
					</IconButton>
				</AppBarTheme> */}
			</Box>
		</AppContainer>
		<Divider />
	</Box>;
};