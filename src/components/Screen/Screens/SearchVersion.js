import _ from 'lodash';
import { forwardRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { usePassage, useScreen } from '@utils/useApp';
import { AppContainer } from 'components/App';
import { Screen } from '../Screen';

const useStyles = makeStyles({
	active: {
		'& .MuiListItemText-primary': {
			fontWeight: 'bold',
		},
	},
	inactive: {
		cursor: 'pointer',
	}
})

const VersionOptions = props => {
	const classes = useStyles();
	const {
		setVersion,
		version: currentVersion,
		versions,
	} = usePassage();
	const {
		searchPassage,
		searchVersion,
	} = useScreen();

	const selectVersion = version => {
		searchPassage.show();
		setVersion(version);
	};

	useUpdateEffect(() => {
		searchVersion.hide();
	}, [currentVersion])

	return <Box
		component={AppContainer}
		display="flex"
		flexDirection="column">
		<Box flex="1">
			<List dense={false}>
				{_.map(versions, version => {
					const isCurrent = version.id === currentVersion;
					return <ListItem key={version.id}>
						<ListItemText
							className={isCurrent ? classes.active : classes.inactive}
							onClick={() => !isCurrent && selectVersion(version.id)}
							primary={version.id}
							secondary={version.name} />
						{isCurrent && <ListItemSecondaryAction>
							<IconButton edge="end">
								<MenuBookIcon />
							</IconButton>
						</ListItemSecondaryAction>}
					</ListItem>;
				})}
			</List>
		</Box>
	</Box>;
};

export const SearchVersion = forwardRef((props, ref) => {
	return <Screen ref={ref}>
		<VersionOptions />
	</Screen>;
});