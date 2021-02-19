import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import MenuIcon from '@material-ui/icons/Menu';
// import PersonIcon from '@material-ui/icons/Person';
import { useApp } from '@utils/useApp';
import { AppBarTheme, AppContainer } from 'components/App';


const useStyles = makeStyles(theme => ({
	bar: {
		margin: '0 -6px',
		display: 'flex',
		justifyContent: 'space-between',
		// backgroundColor: 'transparent',
		'& button': {
			flex: '0',
		},
	},
}));

export const AppBarBottom = () => {
	const classes = useStyles();
	const {
		view,
		setView,
	} = useApp();
	const handleChange = (e, view) => setView(view);
	return <>
		<AppBarTheme>
			<AppContainer style={{ padding: '0 4em' }}>
				<BottomNavigation
					className={classes.bar}
					onChange={handleChange}
					showLabels
					value={view}>
					<BottomNavigationAction label="Home" value="Home" icon={<HomeIcon />} />
					<BottomNavigationAction label="Recall" value="Recall" icon={<ChromeReaderModeIcon />} />
					<BottomNavigationAction label="More" value="More" icon={<MenuIcon />} />
					{/* <BottomNavigationAction label="Profile" value="profile" icon={<PersonIcon />} /> */}
				</BottomNavigation>
			</AppContainer>
		</AppBarTheme>
	</>;
}