import _ from 'lodash';
import { forwardRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useApp, usePassage, useProfile } from '@utils/useApp';
import { AppContainer } from 'components/App';
import { Screen } from '../Screen';

const useStyles = makeStyles({
	active: {
		'& .MuiListItemText-primary': {
			fontWeight: 'bold',
		},
	},
	item: {
		cursor: 'pointer',
	}
})

const BookmarksList = props => {
	const {
		hide,
		transitionState,
		type,
	} = props;
	const classes = useStyles();
	const { setView } = useApp();
	const {
		getProfile,
		profile,
	} = useProfile();
	const {
		setPassageVersion,
		versions,
	} = usePassage();

	const handleClick = recent => {
		setView('Recall');
		hide();
		setPassageVersion(recent.passage, recent.version);
	};

	useEffect(() => {
		if (transitionState === 'entering') {
			getProfile();
		}
	}, [transitionState]);

	if (!profile) return null;

	return <Box
		component={AppContainer}
		display="flex"
		flexDirection="column">
		<Box flex="1">
			<List dense={false}>
				{_.map(profile[type], passage => {
					return <ListItem button key={passage._id} onClick={() => handleClick(passage)}>
						<ListItemText
							className={classes.item}
							primary={passage.passage}
							secondary={versions[passage.version]?.name} />
					</ListItem>;
				})}
			</List>
		</Box>
	</Box>;
};

export const Bookmarks = forwardRef((props, ref) => {
	return <Screen ref={ref}>
		<BookmarksList {...props} />
	</Screen>;
});