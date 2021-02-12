import _ from 'lodash';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useApp } from '@utils/useApp';
import { usePassage } from '@utils/usePassage';
import { useProfile } from '@utils/useProfile';
import { AppContainer } from 'components/App';

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

export const Bookmarks = props => {
	const {
		setUI,
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
		setView('Passage');
		setUI('defaults');
		setPassageVersion(recent.passage, recent.version);
	};

	useEffect(() => {
		if (transitionState === 'entering') {
			getProfile();
		}
	}, [transitionState]);

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