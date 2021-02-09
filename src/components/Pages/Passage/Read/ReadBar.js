import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// import VisibilityIcon from '@material-ui/icons/Visibility';
import { AppBarTop, AppBarThemeProvider, useApp } from 'components/App';

export const ReadBar = props => {
	const { setUI } = props;
	const {
		passage,
		version,
	} = useApp();
	const theme = useTheme();
	return <AppBarTop style={{
			position: 'sticky',
			top: 0,
			marginLeft: -6,
			backgroundColor: theme.palette.background.paper,
			zIndex: 100,
		}}>
		<Box
			alignItems="center"
			display="flex">
			<AppBarThemeProvider>
				<Button onClick={() => setUI('search')}>
					<Box
						display="flex"
						alignItems="center">
						<span style={{ color: passage ? 'inherit' : theme.palette.text.secondary }}>{passage || 'Search Passage'}</span> <ArrowDropDownIcon fontSize="small" />
					</Box>
				</Button>
				<Button onClick={() => setUI('version')}>
					<Box
						display="flex"
						alignItems="center">
						{version} <ArrowDropDownIcon fontSize="small" />
					</Box>
				</Button>
			</AppBarThemeProvider>
			{/* <IconButton
				color="secondary"
				edge="end"
				onClick={() => console.log('here')}>
				<VisibilityIcon fontSize="small"/>
			</IconButton> */}
		</Box>
	</AppBarTop>;
};