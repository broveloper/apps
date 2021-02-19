import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HistoryIcon from '@material-ui/icons/History';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { useAuth, useScreen } from '@utils/useApp';
import { AppContainer } from 'components/App';

export const Menu = props => {
	const { signout } = useAuth();
	const {
		bookmarks,
		recents,
	} = useScreen();

	return <>
		<AppContainer>
			<List component="nav">
				<ListItem button onClick={() => bookmarks.show()}>
					<ListItemIcon>
						<PlaylistAddCheckIcon />
					</ListItemIcon>
					<ListItemText primary="Bookmarked Passages" />
				</ListItem>
				<ListItem button onClick={() => recents.show()} >
					<ListItemIcon>
						<HistoryIcon />
					</ListItemIcon>
					<ListItemText primary="Recent Passages" />
				</ListItem>
			</List>
		</AppContainer>
		<Divider />
		<AppContainer>
			<List component="nav">
				<ListItem button onClick={signout}>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Sign Out" />
				</ListItem>
			</List>
		</AppContainer>
	</>;
}